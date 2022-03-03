import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyJWT } from '../utils/jwt.ultils';
import env from '../configs/env';
import ApiError from '../utils/api-error';
import httpStatus from 'http-status';
export const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  let token;

  if (authorization && authorization.startsWith('Bearer '))
    token = authorization.split(' ')[1];

  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }

  try {
    const { payload, expired } = verifyJWT(token);
    if (payload) {
      console.log('payload: ', payload);
      res.locals.userInfo = payload;
      return next();
    }

    if (expired) throw true;

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Authentication token expired'
      );
    } else {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Not authorized to access this route'
      );
    }
  }
};
