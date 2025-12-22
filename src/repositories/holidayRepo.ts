import { PublicHoliday } from '../models/index.js';

export const holidayRepo = {
  getAllPublicHolidays: () => PublicHoliday.findAll(),
  getPublicHolidaysForEmp: (empId: number) =>
    PublicHoliday.findAll({ where: { empId } }),
  getPublicHolidayForDate: (date: string) =>
    PublicHoliday.findAll({ where: { date } }),
};
