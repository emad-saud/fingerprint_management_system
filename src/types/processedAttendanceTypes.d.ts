import { Optional } from 'sequelize';

import { JsonValue } from './json';

interface ProcessedAttendanceAttributes {
  id: string;
  empId: number;
  date: string;
  workedMinutes: number;
  requiredMinutes: number;
  holidayMinutes: number;
  overtimeMinutes: number;
  netMinutes: number;
  detailsJson: JsonValue;
  shiftId: number | undefined | null;
  shiftDayId: string | undefined | null;
  checkIn: Date;
  checkOut: Date;
  lastPunch: Date;
  firstPunch?: Date;
  earlyIn: number;
  earlyOut: number;
  lateIn: number;
  lateOut: number;
  dayName: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
  // workDurationMinutes: number | undefined;
}

interface ProcessedAttendanceCreationAttributes
  extends Optional<ProcessedAttendanceAttributes, 'id'> {
  detailsJson?: JsonValue;
}

export { ProcessedAttendanceAttributes, ProcessedAttendanceCreationAttributes };

export interface ProcessedAttendanceRecordAtt {
  empId: number;
  date: string;

  status?: string;
  detailsJson?: JsonValue;

  shiftId?: number;
  shiftDayId?: string | undefined;
  dayName?: string;

  firstPunch?: string | null;
  lastPunch?: string | null;

  checkIn?: string | null;
  checkOut?: string | null;

  requiredMinutes?: number;
  workedMinutes?: number;
  overtimeMinutes?: number;
  holidayMinutes?: number;
  netMinutes?: number;

  earlyIn?: number;
  earlyOut?: number;
  lateIn?: number;
  lateOut?: number;
}
