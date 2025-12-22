import {
  getAll,
  getOne,
  getOneByPk,
  updateOne,
  deleteOne,
  createOne,
} from './factoryHandler.js';
import { Shift } from '../models/index.js';

export const getAllShifts = getAll(Shift);
export const getShift = getOneByPk(Shift, 'params:id');
export const createShift = createOne(Shift, [
  'name',
  'startTime',
  'endTime',
  'gracePeriodIn',
  'gracePeriodOut',
  'allowOvertime',
]);
export const updateShift = updateOne(Shift, 'params:id', [
  'name',
  'startTime',
  'endTime',
  'gracePeriodIn',
  'gracePeriodOut',
  'allowOvertime',
]);
export const deleteShift = deleteOne(Shift, 'params:id');
