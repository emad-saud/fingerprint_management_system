import { Router } from 'express';

import {
  createShiftDay,
  getAllShiftDays,
  getShiftDay,
  updateShiftDay,
  deleteShiftDay,
} from '../controllers/shiftDayController.js';

const router = Router();

router.route('/').get(getAllShiftDays).post(createShiftDay);

router
  .route('/:id')
  .get(getShiftDay)
  .patch(updateShiftDay)
  .delete(deleteShiftDay);

export default router;
