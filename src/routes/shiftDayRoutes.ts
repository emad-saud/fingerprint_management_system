import { Router } from 'express';

import {
  createShiftDay,
  getAllShiftDays,
  getShiftDay,
  updateShiftDay,
  deleteShiftDay,
} from '../controllers/shiftDayController.js';

const shiftDayRouter = Router();

shiftDayRouter.route('/').get(getAllShiftDays).post(createShiftDay);

shiftDayRouter
  .route('/:id')
  .get(getShiftDay)
  .patch(updateShiftDay)
  .delete(deleteShiftDay);

export default shiftDayRouter;
