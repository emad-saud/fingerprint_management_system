import { Device } from '../models/index.js';

export const deviceRepo = {
  getAllDevices: () => Device.findAll(),
  getDevice: (id: number) => Device.findByPk(id),
};
