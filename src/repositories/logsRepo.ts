import { RawAttendance } from '../models/index.js';

export const logsRepo = {
  getAllLogs: () => RawAttendance.findAll(),
};
