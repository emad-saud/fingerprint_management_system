import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  EmployeeAttributes,
  EmployeeCreationAttributes,
} from '../types/employeeTypes.js';

const initEmployeeModel = (db: Sequelize) => {
  class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> {
    // id!: string;
    declare empId: number;
    declare fullName: string;
    declare departmentId: number;
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
