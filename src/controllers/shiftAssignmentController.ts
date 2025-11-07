import { Op } from 'sequelize';

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  getOneByPk,
  updateOne,
} from './factoryHandler.js';
import catchAsync from '../utils/catchAsync.js';
import { Employee, Shift, ShiftAssignment } from '../models/index.js';
import AppError from '../utils/appError.js';
import type { ShiftAssignmentAttributes } from '../types/shiftAssignmentTypes.js';

export const getAllShiftAssignments = getAll(ShiftAssignment);
export const getShiftAssignment = getOne(ShiftAssignment, 'params:id');
export const createShiftAssignment = createOne(ShiftAssignment, [
  'empId',
  'validFrom',
  'validTo',
]);
export const updateShiftAssignment = updateOne(ShiftAssignment, 'params:id', [
  'validFrom',
  'validTo',
]);
export const deleteShiftAssignment = deleteOne(ShiftAssignment, 'params:id');

export const assignShift = catchAsync(async (req, res, next) => {
  const { id, department } = req.query;
  const { shiftId, validFrom, validTo } = req.body as {
    shiftId: number;
    validFrom: Date;
    validTo?: Date;
  };

  if (!shiftId || !validFrom)
    return next(
      new AppError('Please provide shift id and valid date from!', 400)
    );

  const ids = id ? (id as string).split(',').map(Number) : [];
  const departments = department
    ? (department as string).split(',').map(Number)
    : [];

  if (!ids[0] && !departments[0])
    return next(
      new AppError(
        `Please provide list of employee id's or department id!`,
        400
      )
    );

  const employees = await Employee.findAll({
    where: {
      id: { [Op.in]: ids },
      departmentId: { [Op.in]: departments },
    },
  });

  const assignmentsArray: ShiftAssignmentAttributes[] = [];
  employees.forEach((emp) => {
    assignmentsArray.push({ empId: emp.empId, validFrom, validTo });
  });

  const assigns = await ShiftAssignment.bulkCreate(assignmentsArray);

  res.status(200).json({
    status: 'success',
    // msg: 'done successfully',
    id,
    department,
    employees,
  });
});
