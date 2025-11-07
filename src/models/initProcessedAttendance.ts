import { Model, Sequelize, DataTypes } from 'sequelize';
import type {
  ProcessedAttendanceAttributes,
  ProcessedAttendanceCreationAttributes,
} from '../types/processedAttendanceTypes.js';

export const initProcessedAttendance = (db: Sequelize) => {
  class ProcessedAttendance extends Model<
    ProcessedAttendanceAttributes,
    ProcessedAttendanceCreationAttributes
  > {
    declare id: string;
    declare empId: number;
    declare shiftId: number;
    declare shiftDayId: string | undefined;
    declare checkIn: Date;
    declare checkOut: Date;
    declare lastPunch: Date;
    declare workDurationMinutes: number | undefined;
  }

  ProcessedAttendance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      empId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'emp_id',
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      shiftId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'shifts',
          key: 'id',
        },
      },
      shiftDayId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: true,
        references: {
          model: 'shift_days',
          key: 'id',
        },
      },
      checkIn: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      checkOut: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      workDurationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      lastPunch: {
        type: DataTypes.TIME,
        allowNull: true,
      },
    },
    {
      sequelize: db,
      tableName: 'processed_attendance',
      modelName: 'ProcessedAttendance',
      underscored: true,
    }
  );

  return ProcessedAttendance;
};

export default initProcessedAttendance;
