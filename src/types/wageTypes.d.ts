import { Optional } from 'sequelize';

export interface WageAttributes {
  id: string;
  name: string;
  baseType: 'monthly' | 'daily' | 'hourly';
  baseAmount: number;

  overtimeRate?: number;
  latePenaltyRate?: number;

  allowNegativeNet: boolean;

  latePolicy: 'ignore' | 'penalty' | 'convert_to_overtime';
  overtimePolice: 'paid' | 'unpaid';

  roundingPolicy: 'none' | 'ceil' | 'floor';
}

export interface WageCreationAttributes
  extends Optional<WageAttributes, 'id' | 'overtimeRate' | 'latePenaltyRate'> {}
