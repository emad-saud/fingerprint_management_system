import { DataTypes, Model, Sequelize } from 'sequelize';

import type {
  DepartmentAttributes,
  DepartmentCreationAttribute,
} from '../types/departmentTypes.js';

const initDepartmentModel = (db: Sequelize) => {
  class Department extends Model<
    DepartmentAttributes,
    DepartmentCreationAttribute
  > {
    id!: number;
    name!: string;
    parentId!: string;
  }

  Department.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_id',
        references: {
          model: 'departments',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
    },
    {
      sequelize: db,
      modelName: 'Department',
      tableName: 'departments',
      timestamps: false,
      underscored: true,
    }
  );

  Department.hasMany(Department, {
    as: 'subDepartments',
    foreignKey: 'parent_id',
  });
  Department.belongsTo(Department, {
    as: 'parent',
    foreignKey: 'parent_id',
  });

  Department.addScope('withParent', {
    include: [{ model: Department, as: 'parent' }],
  });

  return Department;
};

export default initDepartmentModel;
