import { Shift } from '../models/index.js';

export const shiftRepo = {
  getAllShiftsWithDays: () => Shift.findAll(), // the default scope adds the shiftDays
};
