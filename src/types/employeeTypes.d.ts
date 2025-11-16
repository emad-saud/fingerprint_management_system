import type { Optional } from 'sequelize';
import type { ShiftAssignmentAttributes } from './shiftAssignmentTypes.js';

interface EmployeeAttributes {
  id: string;
  empId: number;
  fullName: string;
  departmentId?: number;
  // shift: string;
  shiftAssignments?: ShiftAssignmentAttributes[];
}

interface EmployeeCreationAttributes
  extends Optional<EmployeeAttributes, 'id'> {}

export { EmployeeAttributes, EmployeeCreationAttributes };
