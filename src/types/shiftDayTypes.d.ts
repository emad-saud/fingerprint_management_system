import type { Optional } from 'sequelize';

interface ShiftDayAttributes {
  id: string;
  dayOfWeek: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  startTime: Date;
  endTime: Date;
  allowOvertime: boolean;
  gracePeriodIn: number;
  gracePeriodOut: number;
  shiftId: number;
  isOffDuty: boolean;

}

interface ShiftDayCreationAttributes
  extends Optional<ShiftDayAttributes, 'id'> {}

export { ShiftDayAttributes, ShiftDayCreationAttributes };
