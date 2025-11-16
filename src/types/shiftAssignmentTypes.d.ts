import { Optional } from 'sequelize';

interface ShiftAssignmentAttributes {
  id?: number;
  empId: number;
  validFrom: Date;
  validTo?: Date | null;
  shiftId: number;
}

interface ShiftAssignmentCreationAttributes
  extends Optional<ShiftAssignmentAttributes, 'id'> {}

export { ShiftAssignmentAttributes, ShiftAssignmentCreationAttributes };
