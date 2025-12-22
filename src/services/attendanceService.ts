import { employeeRepo } from '../repositories/employeeRepo.js';
import { logsRepo } from '../repositories/logsRepo.js';
import { shiftRepo } from '../repositories/shiftRepo.js';
import { overtimeRepo } from '../repositories/overtimeRepo.js';
import { attendanceEngine } from '../engines/attendanceEngine.js';
import { holidayRepo } from '../repositories/holidayRepo.js';

export const attendanceService = {
  async processAttendance(fromDate: string, toDate: string) {
    const employees = await employeeRepo.getAllEmployeeWithShifts();
    const shifts = await shiftRepo.getAllShiftsWithDays();
    const logs = await logsRepo.getAllLogs();
    const overtime = await overtimeRepo.getAllOvertime();
    const holidays = await holidayRepo.getAllPublicHolidays();

    return attendanceEngine.generate({
      employees,
      shifts,
      rawLogs: logs,
      overtime,
      holidays,
      fromDate,
      toDate,
    });
  },
};
