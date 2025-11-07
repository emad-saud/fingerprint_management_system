import { Router } from 'express';

import {
  getAllEmployee,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';

const employeeRouter = Router();

employeeRouter.route('/').get(getAllEmployee).post(createEmployee);

employeeRouter
  .route('/:empId')
  .get(getEmployee)
  .patch(updateEmployee)
  .delete(deleteEmployee);

export default employeeRouter;
