import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  EmployeeAttributes,
  EmployeeCreationAttributes,
} from '../types/employeeTypes.js';
import type { ShiftAssignmentAttributes } from '../types/shiftAssignmentTypes.js';

const initEmployeeModel = (db: Sequelize) => {
  class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> {
    // id!: string;
    declare empId: number;
    declare fullName: string;
    declare departmentId: number;
    declare shiftAssignments: ShiftAssignmentAttributes[];
  }

  Employee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      empId: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        field: 'department_id',
        references: {
          model: 'departments',
          key: 'id',
        },
      },
    },
    {
      sequelize: db,
      modelName: 'Employee',
      tableName: 'employees',
      underscored: true,
    }
  );

  return Employee;
};

export default initEmployeeModel;
