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
import { Device, Employee, RawAttendance } from '../models/index.js';
import { logger } from '../utils/logger.js';
import { DeviceService } from '../services/deviceService.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

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

export const syncUsers: RequestHandler = catchAsync(async (req, res, next) => {
  const { deviceId } = req.query;
  if (!deviceId)
    return next(new AppError('Please provide device.id in the uri query', 400));

  const result = await DeviceService.syncUser(+deviceId);
  res.status(200).json({
    status: 'success',
    results: result.length,
    data: result,
  });
});

export const syncAttendance = catchAsync(async (req, res, next) => {
  const { deviceId } = req.query;
  if (!deviceId)
    return next(
      new AppError('Please provide device.id in the uril query', 400)
    );

  const { result, inserted, fetched } = await DeviceService.syncAttendance(
    +deviceId
  );
  res.status(200).json({
    status: 'success',
    inserted,
    fetched,
    result,
  });
});
