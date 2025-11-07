import {
  getAll,
  getOne,
  getOneByPk,
  updateOne,
  deleteOne,
  createOne,
} from './factoryHandler.js';
import { Employee, Shift } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';
import { logger } from '../utils/logger.js';
import ApiFeatures from '../utils/apiFeatures.js';
import { Op } from 'sequelize';

export const getAllShifts = getAll(Shift);
export const getShift = getOneByPk(Shift, 'params:id');
export const createShift = createOne(Shift, [
  'name',
  'startTime',
  'endTime',
  'gracePeriodMinutes',
  'allowOvertime',
]);
export const updateShift = updateOne(Shift, 'params:id', [
  'name',
  'startTime',
  'endTime',
  'gracePeriodMinutes',
  'allowOvertime',
]);
export const deleteShift = deleteOne(Shift, 'params:id');

