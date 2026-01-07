import { Op } from 'sequelize';

import { employeeRepo } from '../repositories/employeeRepo.js';
import { logsRepo } from '../repositories/logsRepo.js';
import { shiftRepo } from '../repositories/shiftRepo.js';
import { overtimeRepo } from '../repositories/overtimeRepo.js';
import { attendanceEngine } from '../engines/attendanceEngine.js';
import { holidayRepo } from '../repositories/holidayRepo.js';
import { processAttendanceRepo } from '../repositories/processedAttendanceRepo.js';
import { logger } from '../utils/logger.js';

export const attendanceService = {
  async processAttendance(
    fromDate: string,
    toDate: string,
    empId: number[] = []
  ) {
    const employeeWhereOptions = empId.length
      ? { empId: { [Op.in]: [empId] } }
      : {};
    const employees = await employeeRepo.getAllEmployeeWithShifts(
      employeeWhereOptions
    );
    const shifts = await shiftRepo.getAllShiftsWithDays();
    const logs = await logsRepo.getAllLogs(employeeWhereOptions);
    const overtime = await overtimeRepo.getAllOvertime(employeeWhereOptions);
    const holidays = await holidayRepo.getAllPublicHolidays(
      employeeWhereOptions
    );

    const results = attendanceEngine.generate({
      employees,
      shifts,
      rawLogs: logs,
      overtime,
      holidays,
      fromDate,
      toDate,
    });

    logger.info('generated results from attEngine', {
      service: 'att-service',
      results: results.length,
    });

    logger.info(`Trying to upsert ${results.length} records processedAtt`, {
      service: 'att-service',
    });

    const records = results.map(async (l) => {
      return await processAttendanceRepo.upsert(l.empId, l.date, {
        shiftId: l.shiftId,
        shiftDayId: l.shiftDayId,
        firstPunch: l.firstPunch ?? undefined,
        lastPunch: l.lastPunch ?? undefined,
        checkIn: l.checkIn,
        checkOut: l.checkOut,
        workedMinutes: l.workedMinutes ?? 0,
        requiredMinutes: l.requiredMinutes ?? 0,
        holidayMinutes: l.holidayMinutes ?? 0,
        overtimeMinutes: l.overtimeMinutes ?? 0,
        netMinutes: l.netMinutes ?? 0,
        detailsJson: l.detailsJson ?? { reason: 'NO_DETAILS_PROVIDED' },
        earlyIn: l.earlyIn ?? 0,
        earlyOut: l.earlyOut ?? 0,
        lateIn: l.lateIn ?? 0,
        lateOut: l.lateOut ?? 0,
        dayName: l.dayName as
          | 'sun'
          | 'mon'
          | 'tue'
          | 'wed'
          | 'thu'
          | 'fri'
          | 'sat',
      });
    });

    return results;
  },
};
