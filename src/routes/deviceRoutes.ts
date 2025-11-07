import { Router } from 'express';

import {
  getAllDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceLogs,
  syncdAttendance,
} from '../controllers/deviceController.js';

const deviceRouter = Router();

deviceRouter.route('/').get(getAllDevices).post(createDevice);

const syncRouter = Router();
syncRouter.use(getDeviceLogs);
syncRouter.get('/attendance', syncdAttendance);

deviceRouter.use('/sync', syncRouter);

deviceRouter
  .route('/:id')
  .get(getDevice)
  .patch(updateDevice)
  .delete(deleteDevice);

export default deviceRouter;
