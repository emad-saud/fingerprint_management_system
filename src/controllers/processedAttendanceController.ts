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

// Convert a UTC date to Libya local time (UTC+2) correctly
export function toLibyaTime(date: Date): Date {
  // Copy date
  const d = new Date(date);

  // Get current UTC time in ms
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;

  // Libya = UTC + 2
  return new Date(utc + 2 * 60 * 60 * 1000);
}

export const getAllProcessedAttendance = getAll(ProcessedAttendance);
export const getProcessedAttendance = getOne(ProcessedAttendance, 'params:id');
export const createProcessedAttendance = createOne(ProcessedAttendance, [
  'empId',
  'checkIn',
  'checkOut',
  'date',
  'shiftId',
  'shiftDayId',
  'lastPunch',
  'workDurationMinutes',
]);
export const updateProcessedAttendance = updateOne(
  ProcessedAttendance,
  'params:id',
  ['checkIn', 'checkOut', 'date', 'lastPunch']
);
export const deleteProcessedAttendance = deleteOne(
  ProcessedAttendance,
  'params:id'
);

// export const calcRawAttendance = catchAsync(async (req, res, next) => {
//   const { empId, departmentId, from, to } = req.query as {
//     empId?: string;
//     departmentId?: string;
//     from?: string;
//     to?: string;
//   };

//   const startDate = from ? new Date(from) : new Date('1970-01-01 00:00:00');
//   const endDate = to ? new Date(to) : new Date();

//   if (!empId && !departmentId)
//     return next(
//       new AppError('Please provide a valid empId or valid department_id', 400)
//     );

//   const arrOfEmpIds = empId?.split(',').map(Number) || [];
//   logger.info(`Trying to calc attendance`, {
//     service: 'processed-att-service',
//     // arrOfEmpIds,
//     // departmentId,
//   });

//   const employees = await Employee.findAll({
//     where: {
//       [Op.or]: [
//         { empId: { [Op.in]: arrOfEmpIds } },
//         { departmentId: { [Op.eq]: departmentId } },
//       ],
//     },
//     include: [{ model: ShiftAssignment, as: 'shiftAssignments' }],
//   });

//   const shifts = await Shift.findAll({
//     raw: false,
//     include: { model: ShiftDay, as: 'shiftDays' },
//   });

//   const rawAtt = await RawAttendance.findAll({
//     where: {
//       [Op.and]: [
//         {
//           timestamp: {
//             [Op.between]: [startDate, endDate],
//           },
//         },
//         {
//           empId: {
//             [Op.in]: arrOfEmpIds,
//           },
//         },
//       ],
//     },
//   });

//   logger.info(
//     `Retrieved: Employees[${employees.length}] Shifts:[${shifts.length}] Raw Att[${rawAtt.length}]`,
//     {
//       service: 'processed-attendance-controller',
//       // shifts: shifts.map((shift) => shift.dataValues.id),
//       // employees,
//     }
//   );

//   // const results: {
//   //   empId: number;
//   //   date: Date;
//   //   status: 'NO_SHIFT' | 'OFF_DAY' | 'PRESENT';
//   //   shiftId?: number;
//   //   shiftDay?: InstanceType<typeof ShiftDay>[];
//   //   rawLog?: InstanceType<typeof RawAttendance>[];
//   // }[] = [];

//   const logsByDate = rawAtt.reduce((acc, log) => {
//     const empId = log.empId;
//     const dateKey = log.timestamp.toLocaleDateString('en-CA'); // "YYYY-MM-DD"

//     if (!acc[empId]) acc[empId] = {};
//     if (!acc[empId][dateKey]) acc[empId][dateKey] = [];

//     acc[empId][dateKey].push(log);

//     return acc;
//   }, {} as Record<number, Record<string, (typeof rawAtt)[number][]>>);

//   logger.info('Grouped rawAtt by empId', {
//     // logsByDate,
//   });

//   const processedRecords = [];

//   for (const emp of employees) {
//     const empLogs = logsByDate[emp.empId] || {};
//     let first: Date = new Date('1971-01-01'),
//       last: Date = new Date('1971-01-01');

//     for (const date of Object.keys(empLogs)) {
//       const dt: Date = new Date(date) as unknown as Date;
//       if (!first) first = date as unknown as Date;
//       if (!last) last = date as unknown as Date;

//       first = first < dt ? first : dt;
//       last = last > dt ? last : dt;
//     }

//     const empShift = shifts.find(
//       (shift) => shift.id === emp.shiftAssignments[0]?.id
//     );

//     const date = first.toLocaleDateString('en-CA');
//     const day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
//       new Date(date).getDay()
//     ];

//     logger.info(`calc the day[${day}] for emp[${emp.empId}]`, {
//       service: 'processed-attendance-controller',
//       // empLogs,
//       date,
//       shiftAssign: emp.shiftAssignments[0],
//     });

//     const shiftRules = empShift?.shiftDays.find((shift) => {
//       shift.dayOfWeek === day;
//     });

//     if (shiftRules) {
//       processedRecords.push({
//         empId: emp.empId,
//         date,
//         shiftId: shiftRules.shiftId,
//         shiftDayId: shiftRules.id,
//         checkIn: shiftRules.startTime < first ? shiftRules.startTime : first,
//         checkOut: shiftRules.endTime > last ? shiftRules.endTime : last,
//         firstPunch: first,
//         lastPUnch: last,
//       });
//     }

//     processedRecords.push({
//       empId: emp.empId,
//       date,
//     });
//   }

//   // for (const emp of employees) {
//   //   const logs = rawAtt.filter((l) => l.empId === emp.empId);
//   //   const assignments = emp.shiftAssignments || [];
//   //   logger.info(`Retrieved [${logs.length}] for Emp[${emp.empId}]`);

//   //   for (const log of logs) {
//   //     const date = log.timestamp;
//   //     const dateOnly = date.toLocaleDateString('en-CA');

//   //     const assignment = assignments.find((a) => {
//   //       const from = new Date(a.validFrom);
//   //       const to = a.validTo ? new Date(a.validTo) : null;
//   //       return from <= date && (!to || date <= to);
//   //     });

//   //     if (!assignment) {
//   //       results.push({ empId: emp.empId, date, status: 'NO_SHIFT' });
//   //       continue;
//   //     }

//   //     const shift = shifts.find((s) => s.id === assignment.shiftId);
//   //     if (!shift) {
//   //       results.push({ empId: emp.empId, date, status: 'NO_SHIFT' });
//   //       continue;
//   //     }

//   //     const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
//   //       date.getDay()
//   //     ] as 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
//   //   }
//   // }

//   res.status(200).json({
//     status: 'success',
//     // employees: employees,
//     // rawAtt: rawAtt.slice(0, 5),
//     processedRecords,
//   });
// });

// function findApplicableShift({
//   date,
//   assignments,
//   shifts,
// }: {
//   date: Date;
//   assignments: InstanceType<typeof ShiftAssignment>[];
//   shifts: InstanceType<typeof Shift>[];
// }) {}

// Convert raw UTC punch → UTC+2 (Libya)
// function toLibyaTime(date) {
//   const d = new Date(date);
//   const utc = d.getTime() + d.getTimezoneOffset() * 60000;
//   return new Date(utc + 2 * 60 * 60 * 1000);
// }

// Build a Date with time from "HH:mm:ss"

function makeDate(baseDate: Date, timeString: string) {
  const [h, m, s] = timeString.split(':').map(Number) as [
    number,
    number,
    number
  ];

  const d = new Date(baseDate);
  d.setHours(h, m, s ?? 0, 0);
  return d;
}

export const calcRawAttendance = catchAsync(async (req, res, next) => {
  const { empId, departmentId, from, to } = req.query as {
    empId: string;
    departmentId: string;
    from: string;
    to: string;
  };

  const startDate = from ? new Date(from) : new Date('1970-01-01T00:00:00Z');
  const endDate = to ? new Date(to) : new Date();

  if (!empId && !departmentId)
    return next(new AppError('Please provide empId or departmentId', 400));

  const arrOfEmpIds = empId ? empId.split(',').map(Number) : [];

  // Employees + shift assignments
  const employees = await Employee.findAll({
    where: {
      [Op.or]: [
        empId ? { empId: { [Op.in]: arrOfEmpIds } } : {},
        departmentId ? { departmentId } : {},
      ],
    },
    include: [{ model: ShiftAssignment, as: 'shiftAssignments' }],
  });

  // Shifts + shiftDays
  const shifts = await Shift.findAll({
    include: { model: ShiftDay, as: 'shiftDays' },
  });

  // Raw logs
  const rawAtt = await RawAttendance.findAll({
    where: {
      timestamp: { [Op.between]: [startDate, endDate] },
      ...(empId && { empId: { [Op.in]: arrOfEmpIds } }),
    },
  });

  // Group logs by emp → date
  const logsByDate = rawAtt.reduce((acc: any, log) => {
    const empId = log.empId;

    // Convert raw UTC timestamp to Libya
    const local = toLibyaTime(log.timestamp);
    const dateKey = local.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!acc[empId]) acc[empId] = {};
    if (!acc[empId][dateKey!]) acc[empId][dateKey!] = [];

    acc[empId][dateKey!].push({
      ...log.dataValues,
      localTimestamp: local,
    });

    return acc;
  }, {});

  const processedRecords = [];

  // MAIN LOOP
  for (const emp of employees) {
    const empLogsByDate = logsByDate[emp.empId] || {};

    for (const [dateKey, logsForDay] of Object.entries(empLogsByDate)) {
      (logsForDay as []).sort(
        (a, b) => a.localTimestamp.getTime() - b.localTimestamp.getTime()
      );

      const firstPunch = logsForDay[0].localTimestamp;
      const lastPunch = logsForDay[logsForDay.length - 1].localTimestamp;

      const dateObj = new Date(dateKey);

      // Find applicable shift assignment
      const assignment = emp.shiftAssignments.find((a) => {
        const fromDate = new Date(a.validFrom);
        const toDate = a.validTo ? new Date(a.validTo) : null;
        return fromDate <= dateObj && (!toDate || dateObj <= toDate);
      });

      if (!assignment) {
        processedRecords.push({
          empId: emp.empId,
          date: dateKey,
          status: 'NO_SHIFT',
          firstPunch,
          lastPunch,
        });
        continue;
      }

      // Find shift
      const shift = shifts.find((s) => s.id === assignment.shiftId);
      if (!shift) {
        processedRecords.push({
          empId: emp.empId,
          date: dateKey,
          status: 'SHIFT_NOT_FOUND',
          firstPunch,
          lastPunch,
        });
        continue;
      }

      // Determine day name
      const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
        dateObj.getDay()
      ];

      // Select shiftDay override
      const shiftDay = shift.shiftDays?.find((d) => d.dayOfWeek === dayName);

      // Final shift start/end
      const startTime = shiftDay?.startTime ?? shift.startTime;
      const endTime = shiftDay?.endTime ?? shift.endTime;

      // Convert shift times → Libya Date objects
      const shiftStart = makeDate(dateObj, startTime);
      const shiftEnd = makeDate(dateObj, endTime);

      // Rounding logic
      const checkIn = firstPunch < shiftStart ? shiftStart : firstPunch;
      const checkOut = lastPunch > shiftEnd ? shiftEnd : lastPunch;

      // Duration
      const duration = Math.max(0, Math.round((checkOut - checkIn) / 60000));

      // Save to output array
      processedRecords.push({
        empId: emp.empId,
        date: dateKey,
        shiftId: shift.id,
        shiftDayId: shiftDay?.id ?? null,
        firstPunch,
        lastPunch,
        checkIn,
        checkOut,
        workDurationMinutes: duration,
      });
    }
  }

  res.status(200).json({
    status: 'success',
    count: processedRecords.length,
    processedRecords,
  });
});
