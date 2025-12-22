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
    declare firstPunch: Date;
    declare lastPunch: Date;
    declare workDurationMinutes: number | undefined;
    declare earlyIn: number;
    declare earlyOut: number;
    declare lateIn: number;
    declare lateOut: number;
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
      workedMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      requiredMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      holidayMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      overtimeMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      netMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      detailsJson: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      shiftId: {
        type: DataTypes.INTEGER,
        field: 'shift_id',
        allowNull: true,
        references: {
          model: 'shifts',
          key: 'id',
        },
      },
      shiftDayId: {
        type: DataTypes.UUID,
        field: 'shift_day_id',
        references: {
          model: 'shift_days',
          key: 'id',
        },
      },
      firstPunch: {
        type: DataTypes.TIME,
      },
      lastPunch: {
        type: DataTypes.TIME,
      },
      checkIn: {
        type: DataTypes.TIME,
      },
      checkOut: {
        type: DataTypes.TIME,
      },
      earlyIn: {
        type: DataTypes.INTEGER,
      },
      earlyOut: {
        type: DataTypes.INTEGER,
      },
      lateIn: {
        type: DataTypes.INTEGER,
      },
      lateOut: {
        type: DataTypes.INTEGER,
      },
      dayName: {
        type: DataTypes.ENUM('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'),
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
