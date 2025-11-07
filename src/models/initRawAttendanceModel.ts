import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  RawAttendanceAttributes,
  RawAttendanceCreationAttributes,
} from '../types/rawAttendanceTypes.js';

const initRawAttendanceModel = (db: Sequelize) => {
  class RawAttendance extends Model<
    RawAttendanceAttributes,
    RawAttendanceCreationAttributes
  > {
    declare id: string;
    declare empId: number;
    declare deviceId: string;
    declare timestamp: Date;
    declare type: 'check-in' | 'check-out';
  }

  RawAttendance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('check-in', 'check-out'),
        allowNull: false,
      },
      empId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'emp_id',
        },
      },
      deviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: db,
      tableName: 'raw_attendance_logs',
      modelName: 'RawAttendance',
      underscored: true,
      timestamps: false,
      indexes: [{ unique: true, fields: ['emp_id', 'timestamp'] }],
    }
  );

  return RawAttendance;
};

export default initRawAttendanceModel;
