import { type WhereOptions } from 'sequelize';

import { PublicHoliday } from '../models/index.js';

export const holidayRepo = {
  getAllPublicHolidays: (
    WhereOptions: WhereOptions<typeof PublicHoliday> = {}
  ) => PublicHoliday.findAll(),
  getPublicHolidaysForEmp: (empId: number) =>
    PublicHoliday.findAll({ where: { empId } }),
  getPublicHolidayForDate: (date: string) =>
    PublicHoliday.findAll({ where: { date } }),
};
