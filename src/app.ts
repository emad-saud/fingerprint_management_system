import express from 'express';
import morgan from 'morgan';

// import { logger } from './utils/logger.js';
// import ApiFeatures from './utils/apiFeatures.js';

import employeeRouter from './routes/employeeRoutes.js';
import departmentRouter from './routes/departmentRoutes.js';
import shiftRouter from './routes/shiftRoutes.js';
import rawAttendanceRouter from './routes/rawAttendanceRoutes.js';
import deviceRouter from './routes/deviceRoutes.js';
import overtimeRouter from './routes/overtimeRoutes.js';
import processedAttRouter from './routes/processedAttendanceRoutes.js';
import shiftAssignmentRouter from './routes/shiftAssignmentRoutes.js';

import { globalErrorHandler } from './controllers/errorController.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/employees', employeeRouter);
app.use('/api/v1/departments', departmentRouter);
app.use('/api/v1/shifts', shiftRouter);
app.use('/api/v1/raw', rawAttendanceRouter);
app.use('/api/v1/devices', deviceRouter);
app.use('/api/v1/overtime', overtimeRouter);
app.use('/api/v1/processed-att', processedAttRouter);
app.use('/api/v1/shift-assign', shiftAssignmentRouter);

app.use(globalErrorHandler);

export default app;
