import { ShiftDay } from '../models/index.js';
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from './factoryHandler.js';

export const getAllShiftDays = getAll(ShiftDay);
export const getShiftDay = getOne(ShiftDay, 'params:id');
export const createShiftDay = createOne(ShiftDay, [
  'shiftId',
  'dayOfWeek',
  'startTime',
  'endTime',
  'gracePeriodIn',
  'gracePeriodOut',
  'allowOvertime',
]);
export const updateShiftDay = updateOne(ShiftDay, 'params:id', [
  'allowOvertime',
  'dayOfWeek',
  'startTime',
  'endTime',
  'gracePeriodIn',
  'gracePeriodOut',
]);
export const deleteShiftDay = deleteOne(ShiftDay, 'params:id');
