import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  ShiftAssignmentAttributes,
  ShiftAssignmentCreationAttributes,
} from '../types/shiftAssignmentTypes.js';

const initShiftAssignmentModel = (db: Sequelize) => {
  class ShiftAssignment extends Model<
    ShiftAssignmentAttributes,
    ShiftAssignmentCreationAttributes
  > {
    declare id?: number;
    declare empId: number;
    declare validFrom: Date;
    declare validTo?: Date;
  }

  ShiftAssignment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      empId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'employees',
          key: 'emp_id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      validFrom: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      validTo: {
        type: DataTypes.DATE,
        // allowNull: false,
      },
    },
    {
      sequelize: db,
      tableName: 'shift_assignments',
      modelName: 'ShiftAssignment',
      underscored: true,
    }
  );

  return ShiftAssignment;
};

export default initShiftAssignmentModel;
