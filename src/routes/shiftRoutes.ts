import { Router } from 'express';

import {
  getAllShifts,
  getShift,
  createShift,
  updateShift,
  deleteShift,
  // assignShift,
} from '../controllers/shiftController.js';

const shiftRouter = Router();

shiftRouter.route('/').get(getAllShifts).post(createShift);

// shiftRouter.post('/assign-shift', assignShift);

shiftRouter.route('/:id').get(getShift).patch(updateShift).delete(deleteShift);

export default shiftRouter;
