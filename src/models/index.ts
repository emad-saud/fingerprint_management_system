import initDb from '../db.js';
import initEmployeeModel from './initEmployeeModel.js';
import initDepartmentModel from './initDepartmentModel.js';
import initShiftModel from './initShiftModel.js';
import initRawAttendanceModel from './initRawAttendanceModel.js';
import initDeviceModel from './initDeviceModel.js';
import initShiftDayModel from './initShiftDayModel.js';
import initShiftAssignmentModel from './initShiftAssignment.Model.js';
import initOvertimeModel from './initOvertimeModel.js';
import initProcessedAttendance from './initProcessedAttendance.js';
import initPublicHolidayModel from './initPublicHolidayModel.js';

const db = initDb();

const Employee = initEmployeeModel(db);
const Department = initDepartmentModel(db);
const Shift = initShiftModel(db);
const RawAttendance = initRawAttendanceModel(db);
const Device = initDeviceModel(db);
const ShiftDay = initShiftDayModel(db);
const ShiftAssignment = initShiftAssignmentModel(db);
const Overtime = initOvertimeModel(db);
const ProcessedAttendance = initProcessedAttendance(db);
const PublicHoliday = initPublicHolidayModel(db);

// --- Associations ---
//  Employee : Department (Associations)
Employee.belongsTo(Department, {
  as: 'department',
  foreignKey: 'department_id',
  targetKey: 'id',
});
Department.hasMany(Employee, {
  as: 'employees',
  foreignKey: 'department_id',
  sourceKey: 'id',
});

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
// Shift.hasMany(RawAttendance, { as: 'rawAttendances', foreignKey: 'shift_id' });
// RawAttendance.belongsTo(Shift, { as: 'shift', foreignKey: 'shift_id' });

// Shift : ShiftDay (Associations)
Shift.hasMany(ShiftDay, { as: 'shiftDays', foreignKey: 'shift_id' });
ShiftDay.belongsTo(Shift, { as: 'shift', foreignKey: 'shift_id' });

// ShiftAssignments: Employee (Associations)
ShiftAssignment.belongsTo(Employee, {
  as: 'employee',
  foreignKey: 'emp_id',
  targetKey: 'empId',
});
Employee.hasMany(ShiftAssignment, {
  foreignKey: 'emp_id',
  sourceKey: 'empId',
  as: 'shiftAssignments',
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

// Overtime : Employee (Associations)
Overtime.belongsTo(Employee, { as: 'employee', foreignKey: 'emp_id' });
Employee.hasMany(Overtime, { as: 'otList', foreignKey: 'emp_id' });

// ProcessedAttendance : Employee (Associations)
ProcessedAttendance.belongsTo(Employee, {
  as: 'employee',
  foreignKey: 'emp_id',
});
Employee.hasMany(ProcessedAttendance, {
  as: 'processedAttendance',
  foreignKey: 'emp_id',
});

// ProcessedAttendance : Shift (Associations)
ProcessedAttendance.belongsTo(Shift, { as: 'shift', foreignKey: 'shift_id' });
Shift.hasMany(ProcessedAttendance, {
  as: 'processedAttendance',
  foreignKey: 'shift_id',
});

// ProcessedAttendance : ShiftDay (Associations)
ProcessedAttendance.belongsTo(ShiftDay, {
  as: 'shiftDay',
  foreignKey: 'shift_day_id',
});
ShiftDay.hasMany(ProcessedAttendance, {
  as: 'processedAttendance',
  foreignKey: 'shift_day_id',
});

// --- Scopes ---
// Employee.addScope('withShift', { include: [{ model: Shift, as: 'shift' }] });
Employee.addScope('withDepartment', { include: [{ model: Department }] });
Employee.addScope('withRawAttendance', { include: [{ model: RawAttendance }] });

Department.addScope('withEmployees', { include: [{ model: Employee }] });

RawAttendance.addScope('withEmployee', { include: [{ model: Employee }] });
RawAttendance.addScope('whithShift', { include: [{ model: Shift }] });

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
  Overtime,
  ProcessedAttendance,
  PublicHoliday,
};
