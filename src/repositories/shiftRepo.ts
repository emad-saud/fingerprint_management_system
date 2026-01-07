import { type WhereOptions } from 'sequelize';
import { Shift } from '../models/index.js';

export const shiftRepo = {
  getAllShiftsWithDays: (whereOptions: WhereOptions<typeof Shift> = {}) =>
    Shift.findAll({ where: whereOptions }), // the default scope adds the shiftDays
};
