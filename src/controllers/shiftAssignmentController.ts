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
import { logger } from '../utils/logger.js';

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
  const { empId, department } = req.query;
  const { shiftId, validFrom, validTo } = req.body;

  if (!shiftId || !validFrom)
    return next(
      new AppError('Please provide shift id and valid start date!', 400)
    );

  const ids = empId ? (empId as string).split(',').map(Number) : [];
  const departments = department
    ? (department as string).split(',').map(Number)
    : [];

  if (!ids.length && !departments.length)
    return next(new AppError('Provide employee IDs or department IDs', 400));

  // Fetch employees
  const employees = await Employee.findAll({
    where: {
      [Op.or]: [
        { empId: { [Op.in]: ids } },
        { departmentId: { [Op.in]: departments } },
      ],
    },
  });

  if (!employees.length) return next(new AppError('No employees found', 404));

  // The correct empIds to check for overlap
  const empIds = employees.map((e) => e.empId);

  // Overlap check
  const overlaps = await ShiftAssignment.findAll({
    where: {
      empId: { [Op.in]: empIds },
      [Op.and]: [
        { validFrom: { [Op.lte]: validTo || new Date() } },
        {
          [Op.or]: [
            {
              validTo: { [Op.gte]: validFrom },
            },
            {
              validTo: { [Op.is]: null },
            },
          ],
        },
      ],
    },
  });

  if (overlaps.length) {
    return next(
      new AppError(
        'Some employees already have overlapping shift assignments.',
        400
      )
    );
  }

  // Create assignments
  const assignmentsArray = employees.map((emp) => ({
    empId: emp.empId,
    validFrom,
    validTo,
    shiftId,
  }));

  const assigns = await ShiftAssignment.bulkCreate(assignmentsArray);

  res.status(200).json({
    status: 'success',
    assigns,
  });
});
