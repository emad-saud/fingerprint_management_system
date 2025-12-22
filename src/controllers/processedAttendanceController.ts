import {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from './factoryHandler.js';

import {
  ProcessedAttendance,
  Employee,
  RawAttendance,
  Shift,
  ShiftDay,
  ShiftAssignment,
  Department,
  Overtime,
} from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { Op } from 'sequelize';
import { logger } from '../utils/logger.js';
import { attendanceService } from '../services/attendanceService.js';

// Convert a UTC date to Libya local time (UTC+2) correctly
// export function toLibyaTime(date: Date): Date {
//   // Copy date
//   const d = new Date(date);

//   // Get current UTC time in ms
//   const utc = d.getTime() + d.getTimezoneOffset() * 60000;

//   // Libya = UTC + 2
//   return new Date(utc + 2 * 60 * 60 * 1000);
// }

export const getAllProcessedAttendance = getAll(ProcessedAttendance);
export const getProcessedAttendance = getOne(ProcessedAttendance, 'params:id');
export const createProcessedAttendance = createOne(ProcessedAttendance, [
  'empId',
  // 'checkIn',
  // 'checkOut',
  'date',
  // 'shiftId',
  // 'shiftDayId',
  // 'lastPunch',
  // 'workDurationMinutes',
]);
export const updateProcessedAttendance = updateOne(
  ProcessedAttendance,
  'params:id',
  [
    'detailsJson',
    'empId',
    'holidayMinutes',
    'overtimeMinutes',
    'date',
    'netMinutes',
    'workedMinutes',
    'requiredMinutes',
  ]
);
export const deleteProcessedAttendance = deleteOne(
  ProcessedAttendance,
  'params:id'
);

// function makeDate(baseDate: Date, timeString: string) {
//   const [h, m, s] = timeString.split(':').map(Number) as [
//     number,
//     number,
//     number
//   ];

//   const d = new Date(baseDate);
//   d.setHours(h, m, s ?? 0, 0);
//   return d;
// }

export const calcRawAttendance = catchAsync(async (req, res, next) => {
  const { fromDate, toDate } = req.query;
  const params =
    typeof fromDate === 'string' && typeof toDate === 'string'
      ? [fromDate, toDate]
      : [];

  const result = await attendanceService.processAttendance(
    ...(params as [string, string])
  );
  res.status(200).json({
    status: 'success',
    results: result.length,
    data: result.filter((r) => r.empId === 71),
  });
});
