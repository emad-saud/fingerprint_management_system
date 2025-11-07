import { Optional } from 'sequelize';

interface RawAttendanceAttributes {
  id: string;
  empId: number;
  timestamp: Date;
  deviceId: string;
  type: 'check-in' | 'check-out';
}
interface RawAttendanceCreationAttributes
  extends Optional<RawAttendanceAttributes, 'id'> {}

export { RawAttendanceAttributes, RawAttendanceCreationAttributes };
