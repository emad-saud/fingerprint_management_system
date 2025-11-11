import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  OvertimeAttributes,
  OvertimeCreationAttributes,
} from '../types/overtimeTypes.js';

const initOvertimeModel = (db: Sequelize) => {
  class Overtime extends Model<OvertimeAttributes, OvertimeCreationAttributes> {
    declare id: string;
    declare date: string;
    declare durationMinutes: number;
    declare empId: number;
  }

  Overtime.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      empId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'employee',
          key: 'emp_id',
        },
      },
    },
    {
      sequelize: db,
      indexes: [{ fields: ['emp_id', 'date'], unique: true }],
      underscored: true,
    }
  );

  return Overtime;
};

export default initOvertimeModel;
