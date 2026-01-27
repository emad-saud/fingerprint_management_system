import { DataTypes, Model, Sequelize } from 'sequelize';

import type {
  WageAttributes,
  WageCreationAttributes,
} from '../types/wageTypes.js';

const initWageModel = (db: Sequelize) => {
  class Wage extends Model<WageAttributes, WageCreationAttributes> {
    declare id: number;
    declare name: string;
    declare baseType: 'monthly' | 'daily' | 'hourly';
    declare baseAmount: number;
    declare overtimeRate?: number;
    declare latePenaltyRate?: number;
    declare allowNegativeNet: boolean;
    declare latePolicy: 'ignore' | 'penalty' | 'convert_to_overtime';
    declare overtimePolice: 'paid' | 'unpaid';
    declare roundingPolicy: 'none' | 'ceil' | 'floor';
  }
};

export default initWageModel;
