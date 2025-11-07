import { Optional } from 'sequelize';

interface DepartmentAttributes {
  id: number;
  name: string;
  parentId: string;
}

interface DepartmentCreationAttribute
  extends Optional<DepartmentAttributes, 'id'> {}

export { DepartmentAttributes, DepartmentCreationAttribute };
