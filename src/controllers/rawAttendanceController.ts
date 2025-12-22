import xlsx from 'xlsx';

import {
  getAll,
  // getOne,
  getOneByPk,
  updateOne,
  deleteOne,
  createOne,
} from './factoryHandler.js';
import { RawAttendance, Device } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { logger } from '../utils/logger.js';

export const getAllRawAttendances = getAll(RawAttendance);
export const getRawAttendance = getOneByPk(RawAttendance, 'params:id');
export const createRawAttendance = createOne(RawAttendance, [
  'timestamp',
  'type',
  'empId',
  'deviceId',
]);
export const updateRawAttendance = updateOne(RawAttendance, 'params:id', [
  'timestamp',
  'type',
]);
export const deleteRawAttendance = deleteOne(RawAttendance, 'params:id');

export const importAttFromExcel = catchAsync(async (req, res, next) => {
  const workBook = xlsx.readFile(
    `C:/Users/DELL/Desktop/excel_files/fixed_final_version.xlsx`
  );

  const sheetName = workBook.SheetNames[0];
  if (!sheetName) {
    return next(new AppError('Cant get sheet name', 400));
  }

  const sheet = workBook.Sheets[sheetName];
  if (!sheet) return next(new AppError('Cant find Sheet', 400));

  const rows = xlsx.utils.sheet_to_json(sheet);

  const logs = (
    rows as { EmpCode: number; recordTime: number | null; Serial: number }[]
  ).map((row) => {
    if (row.EmpCode === 71) {
      logger.info('importing emad log', {
        service: 'excel-import',
        row: {
          empId: row.EmpCode,
          recordTime: row.recordTime
            ? excelSerialToLibyaDate(row.recordTime)
            : null,
          serial: row.Serial,
        },
      });
    }
    return {
      empId: Number(row.EmpCode),
      timestamp: row.recordTime ? excelSerialToLibyaDate(row.recordTime) : null,
      type: 'check-out' as 'check-in' | 'check-out',
      deviceId: 1,
      // serial: row.Serial,
    };
  });

  // fs.writeFileSync('rawLogs.json', JSON.stringify(logs, null, 2));
  // logger.info('logs are here', {
  //   logs: logs.filter((l) => l.empId && l.timestamp),
  // });

  const records = await RawAttendance.bulkCreate(
    logs.filter((l) => l.empId && l.timestamp) as {
      empId: number;
      timestamp: Date;
      type: 'check-in' | 'check-out';
      deviceId: number;
    }[],
    { ignoreDuplicates: true }
  );
  logger.info('created the RawAttendance Logs successfully', {
    service: 'excel-import',
    records: records.length,
  });

  res.status(200).json({
    status: 'success',
    // logs,
    records: records.length,
  });
});

function excelSerialToLibyaDate(serial: number): Date {
  // Excel epoch starts at 1899-12-30
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  const ms = serial * 24 * 60 * 60 * 1000;
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  const utcDate = new Date(excelEpoch.getTime() + ms + offset);

  // Libya = UTC+2
  // return new Date(utcDate.getTime() + 2 * 60 * 60 * 1000);
  // return toLibya(new Date(utcDate));
  return utcDate;
}
