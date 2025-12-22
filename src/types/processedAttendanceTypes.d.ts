import { Optional } from 'sequelize';

interface ProcessedAttendanceAttributes {
  id: string;
  empId: number;
  date: string;
  workedMinutes: number;
  requiredMinutes: number;
  holidayMinutes: number;
  overtimeMinutes: number;
  netMinutes: number;
  detailsJson: string;
  shiftId: number | undefined | null;
  shiftDayId: string | undefined | null;
  checkIn: Date;
  checkOut: Date;
  lastPunch: Date;
  firstPunch: Date;
  earlyIn: number;
  earlyOut: number;
  lateIn: number;
  lateOut: number;
  dayName: 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
  // workDurationMinutes: number | undefined;
}

interface ProcessedAttendanceCreationAttributes
  extends Optional<ProcessedAttendanceAttributes, 'id'> {}

export { ProcessedAttendanceAttributes, ProcessedAttendanceCreationAttributes };
