import { Optional } from 'sequelize';

interface ProcessedAttendanceAttributes {
  id: string;
  empId: number;
  date: string;
  shiftId: number;
  shiftDayId: string | undefined;
  checkIn: Date;
  checkOut: Date;
  lastPunch: Date;
  declare firstPunch: Date
  workDurationMinutes: number | undefined;
}

interface ProcessedAttendanceCreationAttributes
  extends Optional<ProcessedAttendanceAttributes, 'id'> {}

export { ProcessedAttendanceAttributes, ProcessedAttendanceCreationAttributes };
