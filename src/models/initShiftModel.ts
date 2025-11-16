import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  ShiftAttributes,
  ShiftCreationAttributes,
} from '../types/shiftTypes.js';
import type { ShiftDayAttributes } from '../types/shiftDayTypes.js';

const initShiftModel = (db: Sequelize) => {
  class Shift extends Model<ShiftAttributes, ShiftCreationAttributes> {
    declare id: number;
    declare name: string;
    declare startTime: string;
    declare endTime: string;
    declare allowOvertime: boolean;
    declare isFlexible: boolean;
    declare shiftDays: ShiftDayAttributes[];
  }

  Shift.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      startTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      allowOvertime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      gracePeriodMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 60,
        },
      },
      isFlexible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize: db,
      tableName: 'shifts',
      modelName: 'Shift',
      underscored: true,
    }
  );

  return Shift;
};

export default initShiftModel;
