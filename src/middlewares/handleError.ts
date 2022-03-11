import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

import ApiError from '../utils/api-error';
import env from '../configs/env';

export const errorConverter = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error['statusCode']
      ? httpStatus.BAD_REQUEST
      : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error['message'] || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (err: ApiError, req: Request, res: Response) => {
  let { statusCode, message } = err;
  if (env.isProduction && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR] as string;
  }

  const response = {
    code: statusCode,
    message,
    ...(env.isDevelopment && { stack: err.stack }),
  };

  if (env.isDevelopment) console.error(err);

  return res.status(statusCode).json(response);
};
