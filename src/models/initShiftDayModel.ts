import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  ShiftDayAttributes,
  ShiftDayCreationAttributes,
} from '../types/shiftDayTypes.js';
import { Shift } from './index.js';

const initShiftDay = (db: Sequelize) => {
  class Shiftday extends Model<ShiftDayAttributes, ShiftDayCreationAttributes> {
    declare id: string;
    declare empId: number;
    declare shiftId: number;
    declare effectiveFrom: Date;
    declare effectiveTo: Date;
    declare isTemporary: boolean;
  }

  Shiftday.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        // autoIncrement: true,
      },
      shiftId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'shifts',
          key: 'id',
        },
      },
      dayOfWeek: {
        type: DataTypes.ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'),
        allowNull: false,
      },
      allowOvertime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      gracePeriodIn: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      gracePeriodOut: {
        type: DataTypes.DATE,
        defaultValue: 0,
      },
    },
    {
      sequelize: db,
      tableName: 'shift_days',
      modelName: 'ShiftDay',
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['day_of_week', 'shift_id'],
        },
      ],
    }
  );

  return Shift;
};

export default initShiftDay;
