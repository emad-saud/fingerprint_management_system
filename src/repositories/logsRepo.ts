import { type WhereOptions } from 'sequelize';
import { RawAttendance } from '../models/index.js';

export const logsRepo = {
  getAllLogs: (whereOptions: WhereOptions<typeof RawAttendance> = {}) =>
    RawAttendance.findAll({ where: whereOptions }),
};
