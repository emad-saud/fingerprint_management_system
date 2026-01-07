import type { ErrorRequestHandler, Request } from 'express';

import { logger } from '../utils/logger.js';

import {
  // DatabaseError,
  UniqueConstraintError,
  ValidationError,
} from 'sequelize';

type ErrorProd = {
  message?: string;
  value?: string | null;
  path?: string | null;
  type?: string | null;
};

function prodErrorResponse(err: unknown) {
  let error: ErrorProd = {};

  if (err instanceof UniqueConstraintError || err instanceof ValidationError) {
    error.type = err.errors[0]!.type;
    error.message = err.errors[0]!.message;
    error.path = err.errors[0]!.path;
    error.value = err.errors[0]!.value;
  }

  return error;
}

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  logger.info('An error occured!', {
    service: err.name,
    url: req.url,
    err: {
      name: err.name,
      message: err.message,
    },
    errObj: err,
  });

  let resObj = err;

  if (process.env.NODE_ENV === 'production') {
    resObj = prodErrorResponse(err);
  }

  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    error: resObj,
  });
};
