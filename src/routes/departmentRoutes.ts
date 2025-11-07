import { Router } from 'express';

import {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';

const departmentRouter = Router();

departmentRouter.route('/').get(getAllDepartments).post(createDepartment);

departmentRouter
  .route('/:id')
  .get(getDepartment)
  .patch(updateDepartment)
  .delete(deleteDepartment);

export default departmentRouter;
