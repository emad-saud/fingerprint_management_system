import { deviceRepo } from '../repositories/deviceRepo.js';
import AppError from '../utils/appError.js';

import { DeviceEngine } from '../engines/deviceEngine.js';
import { Employee, RawAttendance } from '../models/index.js';
import { logger } from '../utils/logger.js';

export class DeviceService {
  static async getDevice(deviceId: number) {
    const device = await deviceRepo.getDevice(deviceId);
    if (!device) throw new AppError('Device not found', 404);
    return device;
  }

  static async syncUser(deviceId: number) {
    const device = await this.getDevice(deviceId);
    const users = await DeviceEngine.fetchUsers(device);

    const employees = await Employee.findAll();

    const result = await Employee.bulkCreate(
      users.filter((u) => !employees.find((emp) => emp.empId === u.empId))
    );
    return result;
  }

  static async syncAttendance(deviceId: number) {
    const device = await this.getDevice(deviceId);
    const logs = await DeviceEngine.fetchLogs(device);
    const employees = await Employee.findAll();

    const result = logs.filter((l) =>
      employees.find((emp) => emp.empId === l.empId)
    );

    logger.info(`Filtered result where only empId already exists`, {
      service: 'device-service',
      result,
    });

    const rawLogs = await RawAttendance.bulkCreate(result, {
      ignoreDuplicates: true,
    });

    return { result, inserted: rawLogs.length, fetched: logs.length };
  }
}
