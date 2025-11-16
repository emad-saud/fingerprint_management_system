import { Employee, Shift, RawAttendance, ShiftAssignment, ShiftDay } from '../models/index.js';

type ProcessedAttendanceStatus = 'NO_SHIFT' | 'OFF_DAY' | 'PRESENT' | 'ABSENT';

interface ProcessedAttendanceRecord {
  empId: number;
  date: Date;
  status: ProcessedAttendanceStatus;
  shiftId?: number;
  shiftDay?: ShiftDay;
  rawLog?: RawAttendance;
}

interface AttendanceEngineParams {
  employees: InstanceType<typeof Employee>[];
  shifts: InstanceType<typeof Shift>[];
  rawLogs: InstanceType<typeof RawAttendance>[];
}

interface FindShiftParams {
  date: Date;
  assignments: InstanceType<typeof ShiftAssignment>[];
  shifts: InstanceType<typeof Shift>[];
}

export class AttendanceEngine {
  /**
   * Main processing function
   */
  static process({ employees, shifts, rawLogs }: AttendanceEngineParams): ProcessedAttendanceRecord[] {
    const results: ProcessedAttendanceRecord[] = [];

    for (const emp of employees) {
      const logs = rawLogs.filter(l => l.empId === emp.empId);
      const assignments = emp.shiftAssignments || [];

      for (const log of logs) {
        const date = log.timestamp;
        const shift = this.findApplicableShift({ date, assignments, shifts });

        if (!shift) {
          results.push({ empId: emp.empId, date, status: 'NO_SHIFT' });
          continue;
        }

        const dayName = this.getDayName(date);
        const shiftDayConfig = shift.ShiftDays?.find(d => d.day === dayName);

        if (!shiftDayConfig) {
          results.push({ empId: emp.empId, date, status: 'OFF_DAY', shiftId: shift.id });
          continue;
        }

        // Placeholder for IN/OUT matching, late, overtime etc
        results.push({
          empId: emp.empId,
          date,
          status: 'PRESENT', // replace with actual logic
          shiftId: shift.id,
          shiftDay: shiftDayConfig,
          rawLog: log
        });
      }
    }

    return results;
  }

  /**
   * Find the shift that applies to a specific date for an employee
   */
  static findApplicableShift({ date, assignments, shifts }: FindShiftParams): InstanceType<typeof Shift> | null {
    const d = new Date(date);

    // Find the matching ShiftAssignment
    const assignment = assignments.find(a => {
      const from = new Date(a.validFrom);
      const to = a.validTo ? new Date(a.validTo) : null;
      return from <= d && (!to || d <= to);
    });

    if (!assignment) return null;

    // The assignment contains shiftId
    return shifts.find(s => s.id === assignment.shiftId) || null;
  }

  /**
   * Get the day name (sun, mon, ...) from a date
   */
  static getDayName(date: Date): 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' {
    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()] as
      | 'sun'
      | 'mon'
      | 'tue'
      | 'wed'
      | 'thu'
      | 'fri'
      | 'sat';
  }
}
