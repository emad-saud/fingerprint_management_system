import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  ShiftDayAttributes,
  ShiftDayCreationAttributes,
} from '../types/shiftDayTypes.js';

const initShiftDayModel = (db: Sequelize) => {
  class ShiftDay extends Model<ShiftDayAttributes, ShiftDayCreationAttributes> {
    declare id: string;
    declare shiftId: number;
    // declare effectiveFrom: Date;
    // declare effectiveTo: Date;
    // declare isTemporary: boolean;
  }

  ShiftDay.init(
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
        type: DataTypes.ENUM('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'),
        allowNull: false,
      },
      allowOvertime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      gracePeriodIn: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      gracePeriodOut: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isOffDuty: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize: db,
      tableName: 'shift_days',
      modelName: 'ShiftDay',
      underscored: true,
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['day_of_week', 'shift_id'],
        },
      ],
    }
  );

  return ShiftDay;
};

export default initShiftDayModel;
