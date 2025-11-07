import {
  getAll,
  getOne,
  getOneByPk,
  updateOne,
  deleteOne,
  createOne,
} from './factoryHandler.js';
import { Department } from '../models/index.js';

export const getAllDepartments = getAll(Department);
export const getDepartment = getOneByPk(Department, 'params:id');
export const createDepartment = createOne(Department, ['name', 'parentId']);
export const updateDepartment = updateOne(Department, 'params:id', [
  'name',
  'parentId',
]);
export const deleteDepartment = deleteOne(Department, 'params:id');
