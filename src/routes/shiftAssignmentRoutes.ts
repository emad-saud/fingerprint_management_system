import { Router } from 'express';

import {
  getAllShiftAssignments,
  getShiftAssignment,
  createShiftAssignment,
  updateShiftAssignment,
  deleteShiftAssignment,
  assignShift,
} from '../controllers/shiftAssignmentController.js';

const shiftAssignmentRouter = Router();

shiftAssignmentRouter
  .route('/')
  .get(getAllShiftAssignments)
  .post(createShiftAssignment);

shiftAssignmentRouter.post('/assign', assignShift);

shiftAssignmentRouter
  .route('/:id')
  .get(getShiftAssignment)
  .patch(updateShiftAssignment)
  .delete(deleteShiftAssignment);

export default shiftAssignmentRouter;
