import { Device, Employee } from '../models/index.js';
import ZKLib from 'node-zklib';
import { logger } from '../utils/logger.js';

export class DeviceEngine {
  static async connect(device: InstanceType<typeof Device>) {
    const zk = new ZKLib(
      device.ip,
      device.port, // MB20 default port
      10000 // timeout
    );

    try {
      await zk.createSocket();
      return zk;
    } catch (err: any) {
      throw new Error('ZKT device connection failed: ' + err.message);
    }
  }

  static async fetchUsers(device: InstanceType<typeof Device>) {
    logger.info(`Fetching users from device[${device.id}]`, {
      service: 'device-engine',
      ...device.dataValues,
    });

    const zk = await this.connect(device);
    const users = await zk.getUsers();
    await zk.disconnect();

    logger.info('Fetched Users Successfully and disconnected!');

    return users.data.map((u) => ({ empId: +u.userId, fullName: u.name }));
  }

  static async fetchLogs(device: InstanceType<typeof Device>) {
    logger.info(`Fetching logs from device[${device.id}]`, {
      service: 'device-engine',
    });

    const zk = await this.connect(device);
    const logs = await zk.getAttendances();
    await zk.disconnect();

    return logs.data.map((l) => ({
      empId: +l.deviceUserId,
      timestamp: l.recordTime,
      type: (l.attendanceType === 0 ? 'check-in' : 'check-out') as
        | 'check-in'
        | 'check-out',
      deviceId: device.id,
    }));
  }
}
