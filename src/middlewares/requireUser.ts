import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  getPermisionOfUser,
  getPermisionDetailOfUser,
} from '../services/user/userPer';
import ApiError from '../utils/api-error';
import jwt from 'jsonwebtoken';
import { verifyJWT } from '../utils/jwt.ultils';
import env from '../configs/env';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
    const decoded = verifyJWT(token);

    // @ts-ignore
    req.user =
      (await prisma.user.findFirst({
        where: {
          // @ts-ignore
          id: decoded.id,
          // @ts-ignore
          email: decoded.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          address: true,
          avatar: true,
          status: true,
        },
      })) ||
      (await prisma.customer.findFirst({
        where: {
          // @ts-ignore
          id: decoded.id,
          // @ts-ignore
          email: decoded.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          address: true,
          dateOfBirth: true,
          status: true,
        },
      }));

    // @ts-ignore
    req.token = token;
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

export async function requireEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  if (!user) throw new ApiError(httpStatus.FORBIDDEN, 'invalid session');
  // get role of user
  // getPermisionOfUser,
  // getPermisionDetailOfUser,
  const permisions = await getPermisionOfUser(user.id);
  if (!permisions || permisions.length === 0) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you do not permision to access this route'
    );
  }
  const permisionName: String[] = [];
  permisions.forEach((role) => {
    permisionName.push(role.name);
  });
  // compare role: admin-0
  if (!permisionName.includes('staff')) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you must be a employee Blog to access this route'
    );
  }

  next();
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  if (!user) throw new ApiError(httpStatus.FORBIDDEN, 'invalid session');
  // get role of user
  const permisions = await getPermisionOfUser(user.id);
  if (!permisions || permisions.length === 0) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you do not permision to access this route'
    );
  }
  const permisionName: String[] = [];
  permisions.forEach((role) => {
    permisionName.push(role.name);
  });
  // compare role: admin-0
  if (!permisionName.includes('admin')) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you must be admin to access this route'
    );
  }

  next();
}
