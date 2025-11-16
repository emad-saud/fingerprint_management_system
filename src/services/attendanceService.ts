import { Op } from 'sequelize';

import {
  Employee,
  ShiftAssignment,
  Shift,
  ShiftDay,
  RawAttendance,
} from '../models/index.js';
import { AttendanceEngine } from '../engines/attendanceEngine.js';

class AttendanceService {
  async calculate({
    empId,
    departmentId,
    from,
    to,
  }: {
    empId?: string;
    departmentId?: number;
    from?: string;
    to?: string;
  }) {
    const startDate = from ? new Date(from) : new Date('1970-01-01');
    const endDate = to ? new Date(to) : new Date();

    const empIds = empId?.split(',').map(Number) || [];

    const employees = await Employee.findAll({
      where: {
        [Op.or]: [{ empId: { [Op.in]: empIds } }, { departmentId }],
      },
      include: [
        {
          model: ShiftAssignment,
          required: false,
        },
      ],
    });

    const shifts = await Shift.findAll({
      include: [ShiftDay],
    });

    const rawLogs = await RawAttendance.findAll({
      where: {
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['timestamp', 'ASC']],
    });

    const processed = AttendanceEngine.process({
      employees,
      shifts,
      rawLogs,
    });

    return { employees, processed };
  }
}

export const attendanceService = new AttendanceService();
