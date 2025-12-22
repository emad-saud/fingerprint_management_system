import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  PublicHolidayAttributes,
  PublicHolidayCreationAttributes,
} from '../types/publicHolidayTypes.js';

const initPublicHolidayModel = (db: Sequelize) => {
  class PublicHoliday extends Model<
    PublicHolidayAttributes,
    PublicHolidayCreationAttributes
  > {
    declare id: string;
    declare name: string;
    declare type: 'official' | 'sick' | 'personal';
    declare empId: number | undefined;
    declare date: string;
  }

  PublicHoliday.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('official', 'sick', 'personal'),
      },
      empId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'emp_id',
        references: {
          model: 'employees',
          key: 'emp_id',
        },
      },
    },
    {
      underscored: true,
      modelName: 'publicHoliday',
      tableName: 'public_holidays',
      sequelize: db,
      indexes: [{ fields: ['emp_id', 'date'], unique: true }],
    }
  );

  return PublicHoliday;
};

export default initPublicHolidayModel;
