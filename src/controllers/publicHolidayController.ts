import {
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
} from './factoryHandler.js';

import { PublicHoliday } from '../models/index.js';

export const getAllHolidays = getAll(PublicHoliday);
export const getHoliday = getOne(PublicHoliday, 'params:id');
export const createHoliday = createOne(PublicHoliday, [
  'empId',
  'date',
  'name',
  'type',
]);
export const deleteHoliday = deleteOne(PublicHoliday, 'params:id');
export const updateHoliday = updateOne(PublicHoliday, 'params:id', [
  'empId',
  'date',
  'name',
  'type',
]);
