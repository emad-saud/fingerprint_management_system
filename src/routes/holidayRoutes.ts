import { Router } from 'express';
import {
  createHoliday,
  deleteHoliday,
  getAllHolidays,
  getHoliday,
  updateHoliday,
} from '../controllers/publicHolidayController.js';

const holidayRouter = Router();

holidayRouter.route('/').get(getAllHolidays).post(createHoliday);

holidayRouter
  .route('/:id')
  .get(getHoliday)
  .patch(updateHoliday)
  .delete(deleteHoliday);

export default holidayRouter;
