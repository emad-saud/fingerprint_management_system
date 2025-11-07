import type { Optional } from 'sequelize';

interface EmployeeAttributes {
  id: string;
  empId: number;
  fullName: string;
  departmentId?: number;
  // shift: string;
}

interface EmployeeCreationAttributes
  extends Optional<EmployeeAttributes, 'id'> {}

export { EmployeeAttributes, EmployeeCreationAttributes };
