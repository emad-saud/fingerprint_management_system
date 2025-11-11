import type { RequestHandler } from 'express';
import ZKLib from 'node-zklib';

import {
  getAll,
  getOne,
  getOneByPk,
  updateOne,
  deleteOne,
  createOne,
} from './factoryHandler.js';
import { Device, RawAttendance } from '../models/index.js';
import { logger } from '../utils/logger.js';
import type { DeviceLogsAttributes } from '../types/deviceTypes.js';
import AppError from '../utils/appError.js';

export const getAllDevices = getAll(Device);
export const getDevice = getOneByPk(Device, 'params:id');
export const createDevice = createOne(Device, [
  'name',
  'ip',
  'commKey',
  'port',
]);
export const updateDevice = updateOne(Device, 'params:id', [
  'name',
  'ip',
  'commKey',
  'port',
]);
export const deleteDevice = deleteOne(Device, 'params:id');

export const syncUsers: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('shit');
    logger.info(`id: ${req.params.id}`, {
      data: req.params,
    });

    if (!id || typeof id !== 'string')
      return next(
        new AppError('Please provide valid device_id in the uri query!', 400)
      );

    const device = await Device.findByPk(id);

    if (!device)
      return next(new AppError(`Couldn't find Device.id[${id}]`, 404));

    const zkInstance = new ZKLib(
      device.ip,
      device.port,
      10000,
      4000,
      device.commKey
    );

    const users = await zkInstance.getUser();

    logger.info(`Retrieved [${users.length}] from device[${device.name}]`);
    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (err: any) {
    logger.info('Failed to sync attendances', {
      service: 'device-controller',
      errName: err.name,
      msg: err.message,
    });

    res.status(200).json({
      status: 'fail',
      error: err.message,
    });
  } finally {
    await req.zkInstance.disconnect();
  }
};

export const syncdAttendance: RequestHandler = async (req, res, next) => {
  logger.info('trying to sync data', {
    service: 'device-controller',
  });

  const { deviceId, from, to } = req.query as {
    deviceId?: string;
    from?: Date;
    to?: Date;
  };

  if (!deviceId)
    return next(
      new AppError('Please provide device_id in the uri query!', 400)
    );

  const fromDate = from ? new Date(from) : new Date('1970-01-01');
  const toDate = to ? new Date(to) : new Date();

  try {
    const device = await Device.findByPk(deviceId);
    if (!device)
      return next(new AppError(`Couldn't find Device.id[${deviceId}]`, 404));

    const zkInstance = new ZKLib(
      device.ip,
      device.port,
      10000,
      4000,
      device.commKey
    );
    req.zkInstance = zkInstance;

    await zkInstance.createSocket();
    // await zkInstance.setCommKey(device.commKey);

    const logs = (await zkInstance.getAttendances()) as DeviceLogsAttributes;
    const { data } = logs || [];

    logger.info(`Retrieved ${data.length} logs from device[${device.ip}]`, {
      service: 'device-controller',
      // data,
    });

    const filtered = data.filter((log) => {
      const recordTime = new Date(log.recordTime);
      return recordTime >= fromDate && recordTime <= toDate;
    });

    const newRocords = filtered.map((log) => ({
      empId: +log.deviceUserId,
      timestamp: new Date(log.recordTime),
      deviceId,
      type: (log.attendanceType === 0 ? 'check-in' : 'check-out') as
        | 'check-in'
        | 'check-out',
    }));

    logger.info(`Filtered raw attendance data from Device[${deviceId}]`, {
      service: 'device-controller',
      // data: newRocords,
      data,
    });

    const inserted = await RawAttendance.bulkCreate(newRocords, {
      ignoreDuplicates: true,
      fields: ['deviceId', 'empId', 'timestamp', 'type'],
    });

    res.status(200).json({
      status: 'success',
      message: 'Attendance sync completed successfully',
      inserted: inserted.length,
      totalFetched: data.length,
    });
  } catch (err: any) {
    logger.info('Failed to sync attendances', {
      service: 'device-controller',
      errName: err.name,
      msg: err.message,
    });

    res.status(200).json({
      status: 'fail',
      error: err.message,
    });
  } finally {
    await req.zkInstance.disconnect();
  }
};
