import { Model, Sequelize, DataTypes } from 'sequelize';

import type {
  DeviceAttributes,
  DeviceCreationAttributes,
} from '../types/deviceTypes.js';

const initDeviceModel = (db: Sequelize) => {
  class Device
    extends Model<DeviceAttributes, DeviceCreationAttributes>
    implements DeviceAttributes
  {
    declare id: number;
    declare name: string;
    declare ip: string;
    declare port: number;
    declare commKey: number;
  }

  Device.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ip: {
        type: DataTypes.INET,
        allowNull: false,
      },
      port: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4370,
      },
      commKey: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize: db,
      tableName: 'devices',
      modelName: 'Device',
      underscored: true,
    }
  );

  return Device;
};

export default initDeviceModel;
