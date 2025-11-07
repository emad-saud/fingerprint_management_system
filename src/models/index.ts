import initDb from '../db.js';
import initEmployeeModel from './initEmployeeModel.js';
import initDepartmentModel from './initDepartmentModel.js';
import initShiftModel from './initShiftModel.js';
import initRawAttendanceModel from './initRawAttendanceModel.js';
import initDeviceModel from './initDeviceModel.js';
import initShiftDay from './initShiftDayModel.js';
import initShiftAssignmentModel from './initShiftAssignment.Model.js';

const db = initDb();

const Employee = initEmployeeModel(db);
const Department = initDepartmentModel(db);
const Shift = initShiftModel(db);
const RawAttendance = initRawAttendanceModel(db);
const Device = initDeviceModel(db);
const ShiftDay = initShiftDay(db);
const ShiftAssignment = initShiftAssignmentModel(db);

// --- Associations ---
//  Employee : Department (Associations)
Employee.belongsTo(Department, {
  as: 'department',
  foreignKey: 'department_id',
});
Department.hasMany(Employee, { as: 'employees', foreignKey: 'department_id' });

// Employee : Shift (Associations)
// Employee.belongsTo(Shift, {
//   as: 'shift',
//   foreignKey: 'shift_id',
// });
// Shift.hasMany(Employee, { as: 'employees', foreignKey: 'shift_id' });

// Employee : RawAttendance (Associations)
Employee.hasMany(RawAttendance, {
  as: 'rawAttendance',
  foreignKey: 'emp_id',
  sourceKey: 'empId',
});
RawAttendance.belongsTo(Employee, {
  as: 'employee',
  foreignKey: 'emp_id',
  targetKey: 'empId',
});

// Shift : RawAttendance (Associations)
Shift.hasMany(RawAttendance, { as: 'rawAttendances', foreignKey: 'shift_id' });
RawAttendance.belongsTo(Shift, { as: 'shift', foreignKey: 'shift_id' });

// Shift : ShiftDay (Associations)
Shift.hasMany(ShiftDay, { as: 'shiftDays', foreignKey: 'shift_id' });
ShiftDay.belongsTo(Shift, { as: 'shift', foreignKey: 'shift_id' });

// ShiftAssignments: Employee (Associations)
ShiftAssignment.belongsTo(Employee, {
  foreignKey: 'emp_id',
  targetKey: 'empId',
});
Employee.hasMany(ShiftAssignment, {
  foreignKey: 'emp_id',
  sourceKey: 'empId',
});

// ShiftAssignments : Shift (Associations)
ShiftAssignment.belongsTo(Shift, {
  as: 'shift',
  foreignKey: 'shift_id',
  // targetKey: 'id',
});
Shift.hasMany(ShiftAssignment, {
  as: 'shiftAssignments',
  foreignKey: 'shift_id',
  // sourceKey: 'id',
});

// --- Scopes ---
// Employee.addScope('withShift', { include: [{ model: Shift, as: 'shift' }] });
Employee.addScope('withDepartment', { include: [{ model: Department }] });
Employee.addScope('withRawAttendance', { include: [{ model: RawAttendance }] });

Department.addScope('withEmployees', { include: [{ model: Employee }] });

RawAttendance.addScope('withEmployee', { include: [{ model: Employee }] });
RawAttendance.addScope('whitShift', { include: [{ model: Shift }] });

Shift.addScope(
  'defaultScope',
  { include: [{ model: ShiftDay, as: 'shiftDays' }] },
  { override: true }
);

export {
  db,
  Employee,
  Department,
  Shift,
  RawAttendance,
  Device,
  ShiftDay,
  ShiftAssignment,
};
