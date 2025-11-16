import { Router } from 'express';

import {
  getAllProcessedAttendance,
  getProcessedAttendance,
  createProcessedAttendance,
  deleteProcessedAttendance,
  updateProcessedAttendance,
  calcRawAttendance,
} from '../controllers/processedAttendanceController.js';

const processedAttRouter = Router();

processedAttRouter
  .route('/')
  .get(getAllProcessedAttendance)
  .post(createProcessedAttendance);

processedAttRouter.get('/calc', calcRawAttendance);

processedAttRouter
  .route('/:id')
  .get(getProcessedAttendance)
  .patch(updateProcessedAttendance)
  .delete(deleteProcessedAttendance);

export default processedAttRouter;
