import {
  getAll,
  getOne,
  getOneByPk,
  updateOne,
  deleteOne,
  createOne,
} from './factoryHandler.js';
import { Employee } from '../models/index.js';

export const getAllEmployee = getAll(Employee);
export const getEmployee = getOne(Employee, 'params:empId');
// export const getEmployeeByPk = getOneByPk(Employee, 'params:id');
export const createEmployee = createOne(Employee, [
  'empId',
  'fullName',
  'departmentId',
]);
export const updateEmployee = updateOne(Employee, 'params:empId', [
  'fullName',
  'departmentId',
]);
export const deleteEmployee = deleteOne(Employee, 'params:empId');
