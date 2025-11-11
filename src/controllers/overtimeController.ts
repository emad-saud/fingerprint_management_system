import { Overtime } from '../models/index.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  getOneByPk,
  updateOne,
} from './factoryHandler.js';

export const getAllOvertime = getAll(Overtime);
export const getOvertime = getOne(Overtime, 'params:empId');
export const createOvertime = createOne(Overtime, [
  'empId',
  'date',
  'durationMinutes',
]);
export const updateOvertime = updateOne(Overtime, 'params:id', [
  'durationMinutes',
]);
export const deleteOvertime = deleteOne(Overtime, 'params:id');
