import './config/loadEnv.js';

import app from './app.js';
import { db } from './models/index.js';
import { logger } from './utils/logger.js';

// process.on('uncaughtException', (err) => {
//   console.error('UNCAUGHT EXCEPTION 🔥', err);
// });

// process.on('unhandledRejection', (err) => {
//   console.error('UNHANDLED REJECTION 💥', err);
// });

db.authenticate({ logging: false })
  .then(() => {
    console.log(`Database connected successfully!`);
  })
  .catch((err) => {
    Error.captureStackTrace(err);
    logger.info('an error occured during connecting to the Database!', {
      service: 'db-service',
      err,
    });
    console.log('exiting the process...');
    process.exit(1);
  });

db.sync({ alter: process.env.NODE_ENV !== 'production' }).then(() => {
  console.log('Database models synced successfully!');
});

const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}...`);
});
