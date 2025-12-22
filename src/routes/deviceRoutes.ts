import { Router } from 'express';

import {
  getAllDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  syncUsers,
  syncAttendance,
} from '../controllers/deviceController.js';

const deviceRouter = Router();

deviceRouter.route('/').get(getAllDevices).post(createDevice);

// const syncRouter = Router();
// syncRouter.get('/attendance/:id', syncAttendance).get('/users/:id', syncUsers);

deviceRouter.get('/sync/users', syncUsers);
deviceRouter.get('/sync/attendance', syncAttendance);

// deviceRouter.use('/sync', syncRouter);

deviceRouter
  .route('/:id')
  .get(getDevice)
  .patch(updateDevice)
  .delete(deleteDevice);

export default deviceRouter;
