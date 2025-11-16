import ZKLib from 'node-zklib';
import { type RequestHandler } from 'express';

import type { DeviceLogsAttributes } from '../types/deviceTypes.js';

import {
  getAll,
  getOne,
  getOneByPk,
  updateOne,
  deleteOne,
  createOne,
} from './factoryHandler.js';
import { RawAttendance, Device } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { logger } from '../utils/logger.js';

export const getAllRawAttendances = getAll(RawAttendance);
export const getRawAttendance = getOneByPk(RawAttendance, 'params:id');
export const createRawAttendance = createOne(RawAttendance, [
  'timestamp',
  'type',
  'empId',
  'deviceId',
]);
export const updateRawAttendance = updateOne(RawAttendance, 'params:id', [
  'timestamp',
  'type',
]);
export const deleteRawAttendance = deleteOne(RawAttendance, 'params:id');

// export const syncdAttendance: RequestHandler = async (req, res, next) => {
//   logger.info('trying to sync data', {
//     service: 'sync-attendance',
//   });

//   const { deviceId, from, to } = req.query as {
//     deviceId?: string;
//     from?: Date;
//     to?: Date;
//   };

//   if (!deviceId)
//     return next(
//       new AppError('Please provide device_id in the url query!', 400)
//     );

//   const fromDate = from ? new Date(from) : new Date('1970-01-01');
//   const toDate = to ? new Date(to) : new Date();

//   try {
//     const device = await Device.findByPk(deviceId);
//     if (!device)
//       return next(new AppError(`Couldn't find Device.id[${deviceId}]`, 404));

//     const zkInstance = new ZKLib(
//       device.ip,
//       device.port,
//       10000,
//       4000,
//       device.commKey
//     );
//     req.zkInstance = zkInstance;

//     await zkInstance.createSocket();
//     // await zkInstance.setCommKey(device.commKey);

//     const logs = (await zkInstance.getAttendances()) as DeviceLogsAttributes;
//     const { data } = logs || [];

//     logger.info(`Retrieved ${data.length} logs from device[${device.ip}]`, {
//       service: 'rawAttendance-controller',
//       // data,
//     });

//     const filtered = data.filter((log) => {
//       const recordTime = new Date(log.recordTime);
//       return recordTime >= fromDate && recordTime <= toDate;
//     });

//     const newRocords = filtered.map((log) => ({
//       empId: +log.deviceUserId,
//       timestamp: new Date(log.recordTime),
//       deviceId,
//       type: (log.attendanceType === 0 ? 'check-in' : 'check-out') as
//         | 'check-in'
//         | 'check-out',
//     }));

//     logger.info(`Filtered raw attendance data from Device[${deviceId}]`, {
//       service: 'sync-attendance',
//       // data: newRocords,
//       data,
//     });

//     const inserted = await RawAttendance.bulkCreate(newRocords, {
//       ignoreDuplicates: true,
//       // fields: ['deviceId', 'empId', 'timestamp', 'type'],
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Attendance sync completed successfully',
//       inserted: inserted.length,
//       totalFetched: data.length,
//     });
//   } catch (err: any) {
//     logger.info('Failed to sync attendances', {
//       service: 'rawAttendance-controller',
//       errName: err.name,
//       msg: err.message,
//     });

//     res.status(200).json({
//       status: 'fail',
//       error: err.message,
//     });
//   } finally {
//     req.zkInstance.disconnect();
//   }
// };
