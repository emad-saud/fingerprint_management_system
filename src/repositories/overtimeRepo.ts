import { Op, type WhereOptions } from 'sequelize';

import { Overtime } from '../models/index.js';

export const overtimeRepo = {
  getAllOvertime: (whereOptions: WhereOptions<typeof Overtime> = {}) =>
    Overtime.findAll({ where: whereOptions }),
  getFromRange: async (from: string, to: string) => {
    const rows = await Overtime.findAll({
      where: { date: { [Op.between]: [from, to] } },
    });
    return rows.map((r) => r.get({ plain: true }));
  },
};
