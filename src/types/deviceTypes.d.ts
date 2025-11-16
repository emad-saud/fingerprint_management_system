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

// types/deviceTypes.ts

export interface ZKLibResponse<T> {
  code: number;
  message: string;
  data: T[];
}

export interface ZKUser {
  uid: number;
  userId: string;
  name: string;
  privilege: number;
  password: string;
  cardno: string;
}

export interface ZKAttendance {
  uid: number;
  id: string;
  state: number;
  timestamp: Date;
}

interface DeviceUsers {}

export { DeviceAttributes, DeviceCreationAttributes, DeviceLogsAttributes };
