import { Employee, ShiftAssignment } from '../models/index.js';

export const employeeRepo = {
  getAllEmployeeWithShifts: () =>
    Employee.findAll({
      include: {
        model: ShiftAssignment,
        as: 'shiftAssignments',
      },
    }),
};
