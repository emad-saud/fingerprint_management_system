import { Router } from 'express';

import {
  createOvertime,
  getAllOvertime,
  getOvertime,
  deleteOvertime,
  updateOvertime,
} from '../controllers/overtimeController.js';

const overtimeRouter = Router();

overtimeRouter.route('/').get(getAllOvertime).post(createOvertime);

overtimeRouter
  .route('/:id')
  .get(getOvertime)
  .patch(updateOvertime)
  .delete(deleteOvertime);

export default overtimeRouter;
