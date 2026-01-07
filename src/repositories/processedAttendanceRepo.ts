import { ProcessedAttendance } from '../models/index.js';
import type { ProcessedAttendanceCreationAttributes } from '../types/processedAttendanceTypes.js';

export const processAttendanceRepo = {
  async upsert(
    empId: number,
    date: string,
    data: {
      shiftId?: number | undefined;
      shiftDayId?: string | undefined;
      firstPunch: string | undefined;
      lastPunch: string | undefined;
      checkIn?: string | null | undefined;
      checkOut?: string | null | undefined;
      workedMinutes?: number | undefined;
      requiredMinutes?: number | undefined;
      holidayMinutes?: number | undefined;
      overtimeMinutes?: number | undefined;
      netMinutes?: number | undefined;
      detailsJson: unknown;
      earlyIn?: number | undefined;
      earlyOut?: number | undefined;
      lateIn?: number | undefined;
      lateOut?: number | undefined;
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
