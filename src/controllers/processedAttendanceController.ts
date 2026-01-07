import {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from './factoryHandler.js';

import { Op } from 'sequelize';

import { Employee, ProcessedAttendance } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
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
  const { fromDate, toDate, empId } = req.query;

  const employeeIds = empId?.toString().split(',').map(Number);

  const params =
    typeof fromDate === 'string' && typeof toDate === 'string'
      ? [fromDate, toDate, employeeIds]
      : [];

  if (!params.length)
    return next(
      new AppError(
        'Please provide from and to dates in the request query!',
        400
      )
    );

  const result = await attendanceService.processAttendance(
    ...(params as [string, string, number[] | undefined])
  );
  res.status(200).json({
    status: 'success',
    results: result.length,
    data: result.filter((r: any) => r.empId === 119),
  });
});

export const calcWageForEmployee = catchAsync(async (req, res, next) => {
  const { empId, fromDate, toDate, wage } = req.query as {
    empId?: number;
    fromDate?: string;
    toDate?: string;
    wage?: number;
  };

  if (!fromDate || !toDate || !empId || !wage)
    return next(
      new AppError('Please provide fromDate, toDate, wage, and empId', 400)
    );

  const employee = await Employee.findOne({
    where: {
      empId,
    },
  });

  const processedAtt = await ProcessedAttendance.findAll({
    where: {
      date: { [Op.between]: [fromDate, toDate] },
      empId,
    },
  });

  const totalRequiredMinutes = processedAtt.reduce(
    (sum, item) => sum + item.requiredMinutes,
    0
  );

  const totalWorkedMinutes = processedAtt.reduce(
    (sum, item) => sum + item.netMinutes,
    0
  );

  const totalLateIn = processedAtt.reduce((sum, item) => sum + item.lateIn, 0);
  const totalEarlyOut = processedAtt.reduce(
    (sum, item) => sum + item.earlyOut,
    0
  );

  res.status(200).json({
    status: 'success',
    employee: employee?.empId,
    totalRequiredMinutes,
    totalWorkedMinutes,
    totalLateIn,
    totalEarlyOut,
    resultWage: (totalWorkedMinutes / totalRequiredMinutes) * wage,
    processedAtt: processedAtt,
  });
});
