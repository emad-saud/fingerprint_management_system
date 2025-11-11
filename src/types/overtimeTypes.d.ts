import { Optional } from 'sequelize';

interface OvertimeAttributes {
  id: string;
  empId: number;
  date: Date;
  durationMinutes: number;
}

interface OvertimeCreationAttributes
  extends Optional<OvertimeAttributes, 'id'> {}

export { OvertimeAttributes, OvertimeCreationAttributes };
