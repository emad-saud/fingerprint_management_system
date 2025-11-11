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

export const calcRawAttendance = catchAsync(async (req, res, next) => {
  
});
