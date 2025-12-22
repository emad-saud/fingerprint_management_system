import { ProcessedAttendance } from '../models/index.js';

export const processAttendanceRepo = {
  async upsert(
    empId: number,
    date: string,
    data: {
      shiftId?: number;
      shiftDayId?: string;
      firstPunch: Date;
      lastPunch: Date;
      checkIn: Date;
      checkOut: Date;
      workedMinutes: number;
      requiredMinutes: number;
      holidayMinutes: number;
      overtimeMinutes: number;
      netMinutes: number;
      detailsJson: string;
      earlyIn: number;
      earlyOut: number;
      lateIn: number;
      lateOut: number;
      dayName: 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
    }
  ) {
    const payload = {
      empId,
      date,
      shiftId: data.shiftId ?? null,
      shiftDayId: data.shiftDayId ?? null,
      firstPunch: data.firstPunch ?? null,
      lastPunch: data.lastPunch ?? null,
      checkIn: data.checkIn ?? null,
      checkOut: data.checkOut ?? null,
      workedMinutes: data.workedMinutes ?? 0,
      requiredMinutes: data.requiredMinutes ?? 0,
      holidayMinutes: data.holidayMinutes ?? 0,
      overtimeMinutes: data.overtimeMinutes ?? 0,
      netMinutes: data.netMinutes ?? 0,
      detailsJson: data.detailsJson ?? null,
      earlyIn: data.earlyIn,
      earlyOut: data.earlyOut,
      lateIn: data.lateIn,
      lateOut: data.lateOut,
      dayName: data.dayName,
    };

    await ProcessedAttendance.upsert(payload);
    return payload;
  },
};
