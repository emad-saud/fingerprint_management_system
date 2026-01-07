import type {
  Employee,
  Shift,
  RawAttendance,
  Overtime,
  PublicHoliday,
} from '../models/index.js';

import { groupLogs } from '../utils/groupLogs.js';
import { logger } from '../utils/logger.js';
import { processOneDay } from './processOneDay.js';
import { dateOnlyKeyFromLibya, iterateDates } from '../utils/time.js';

export const attendanceEngine = {
  generate({
    employees,
    shifts,
    rawLogs,
    overtime,
    holidays,
    fromDate,
    toDate,
  }: {
    employees: InstanceType<typeof Employee>[];
    shifts: InstanceType<typeof Shift>[];
    rawLogs: InstanceType<typeof RawAttendance>[];
    overtime: InstanceType<typeof Overtime>[];
    holidays: InstanceType<typeof PublicHoliday>[];
    fromDate: string;
    toDate: string;
  }) {
    const result = [];
    const logsByEmp = groupLogs(rawLogs);

    const overtimeByKey = new Map();
    for (const o of overtime) overtimeByKey.set(`${o.empId}-${o.date}`, o);

    const holidayByKey = new Map();
    for (const h of holidays) {
      const key = h.empId ? `${h.empId}-${h.date}` : `global-${h.date}`;
      holidayByKey.set(key, h);
    }

    const from =
      typeof fromDate === 'string' ? new Date(fromDate) : new Date(fromDate);
    const to = typeof toDate === 'string' ? new Date(toDate) : new Date(toDate);

    const dates = iterateDates(from, to);

    for (const emp of employees) {
      const assignments = emp.shiftAssignments || [];
      // logger.info(`Calculating emp[${emp.empId}] attendance!`);

      // if (emp.empId === 119) {
      //   logger.info('emp[119] shift assignments', {
      //     assignments,
      //   });
      // }

      for (const dateObj of dates) {
        const dateKey = dateOnlyKeyFromLibya(dateObj);
        const empLogsForDay = !!logsByEmp[emp.empId]
          ? logsByEmp[emp.empId]![dateKey]
          : [];

        const assignment = assignments.find((a) => {
          const from = new Date(a.validFrom);
          const to = a.validTo ? new Date(a.validTo) : null;

          return from <= dateObj && (!to || dateObj <= to);
        });

        if (!assignment) {
          result.push({
            empId: emp.empId,
            date: dateKey,
            status: 'NO_SHIFT_ASSIGNMENT',
            detailsJson: {
              reason: 'NO_SHIFT_ASSIGNMENT',
            },
          });
          continue;
        }

        const shift = shifts.find((s) => s.id === assignment.shiftId);
        
        if (!shift) {
          result.push({
            empId: emp.empId,
            date: dateKey,
            status: 'NO_SHIFT_CONFIG',
            detailsJson: { reason: 'MISSING_SHIFT_CONFIG' },
          });
          continue;
        }

        const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
          dateObj.getDay()
        ];
        const shiftDay = (shift.shiftDays || []).find(
          (sd) => sd.dayOfWeek === dayName
        );

        const overtimeRecord = overtimeByKey.get(`${emp.empId}-${dateKey}`);
        const holidayRecord =
          holidayByKey.get(`${emp.empId}-${dateKey}`) ??
          holidayByKey.get(`global-${dateKey}`);

        const dayResult = processOneDay({
          emp,
          assignment,
          dateKey,
          logsForDay: empLogsForDay || [],
          shift,
          shiftDay,
          overtimeRecord,
          holiday: holidayRecord,
        });

        result.push(dayResult);
      }

      // for (const [dateKey, logsForDay] of Object.entries(empLogs) as [
      //   string,
      //   InstanceType<typeof RawAttendance>[]
      // ][]) {
      //   const holiday = holidays.find(
      //     (h) => h.date === dateKey && (h.empId === emp.empId || !h.empId)
      //   );
      //   if (holiday)
      //     logger.info('Found holiday', {
      //       service: 'attendance-engine',
      //       holiday,
      //     });

      //   const overtimeRecord = overtime.find(
      //     (o) => o.empId === emp.empId && o.date === dateKey
      //   );

      //   result.push(
      //     processOneDay({
      //       emp,
      //       dateKey,
      //       logsForDay,
      //       shifts,
      //       overtimeRecord,
      //       holiday,
      //     })
      //   );
      // }
    }

    return result;
  },
};
