import { Router } from 'express';

import {
  getAllRawAttendances,
  getRawAttendance,
  createRawAttendance,
  updateRawAttendance,
  deleteRawAttendance,
  syncdAttendance,
} from '../controllers/rawAttendanceController.js';

const rawAttendanceRouter = Router();

rawAttendanceRouter
  .route('/')
  .get(getAllRawAttendances)
  .post(createRawAttendance);

rawAttendanceRouter.get('/sync', syncdAttendance);

rawAttendanceRouter
  .route('/:id')
  .get(getRawAttendance)
  .patch(updateRawAttendance)
  .delete(deleteRawAttendance);

export default rawAttendanceRouter;
