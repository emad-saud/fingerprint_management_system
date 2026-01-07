import { type WhereOptions } from 'sequelize';

import { Employee, ShiftAssignment } from '../models/index.js';

export const employeeRepo = {
  getAllEmployeeWithShifts: (
    whereOptions: WhereOptions<typeof Employee> = {}
  ) =>
    Employee.findAll({
      where: whereOptions,
      include: {
        model: ShiftAssignment,
        as: 'shiftAssignments',
      },
    }),
};
