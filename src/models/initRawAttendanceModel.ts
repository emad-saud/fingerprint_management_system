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
    declare deviceId: number;
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
      empId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'emp_id', // ✅ maps camelCase → snake_case
      },
      deviceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'device_id', // optional but recommended for consistency
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('check-in', 'check-out'),
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
