import { Optional } from 'sequelize';

interface ShiftAssignmentAttributes {
  id?: number;
  empId: number;
  validFrom: Date;
  validTo: Date | undefined;
}

interface ShiftAssignmentCreationAttributes
  extends Optional<ShiftAssignmentAttributes, 'id'> {}

export { ShiftAssignmentAttributes, ShiftAssignmentCreationAttributes };
