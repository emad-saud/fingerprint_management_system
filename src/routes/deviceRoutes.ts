import { Router } from 'express';

import {
  getAllDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  syncUsers,
  syncdAttendance,
} from '../controllers/deviceController.js';

const deviceRouter = Router();

deviceRouter.route('/').get(getAllDevices).post(createDevice);

// const syncRouter = Router();
// syncRouter.get('/attendance/:id', syncdAttendance).get('/users/:id', syncUsers);

deviceRouter.get('/sync/users', syncUsers);
deviceRouter.get('/sync/attendance', syncdAttendance);

// deviceRouter.use('/sync', syncRouter);

deviceRouter
  .route('/:id')
  .get(getDevice)
  .patch(updateDevice)
  .delete(deleteDevice);

export default deviceRouter;
