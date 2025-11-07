import { Optional } from 'sequelize';

interface DeviceAttributes {
  id: number;
  name: string;
  ip: string;
  port: number;
  commKey: number;
}

interface DeviceCreationAttributes extends Optional<DeviceAttributes, 'id'> {}

interface DeviceLogsAttributes {
  data: {
    recordTime: Date;
    deviceUserId: number;
    attendanceType: 0 | 1;
  }[];
}

export { DeviceAttributes, DeviceCreationAttributes, DeviceLogsAttributes };
