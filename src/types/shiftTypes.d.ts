import { Optional } from 'sequelize';

export interface ShiftAttributes {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  allowOvertime: boolean;
  isFlexible: boolean;
  shiftDays?: ShiftAttributes[];
}

export interface ShiftCreationAttributes
  extends Optional<ShiftAttributes, 'id'> {}
