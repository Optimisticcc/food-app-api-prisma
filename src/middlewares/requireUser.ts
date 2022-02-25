import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { getRolesOfUser } from '../services/user/userRoles';
import ApiError from '../utils/api-error';
import { getCatsOfRoles } from '../services/category/cateRole';

export default function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.userInfo) {
    return res
      .status(httpStatus.FORBIDDEN)
      .json({ message: 'Invalid session' });
  }
  res.locals.userInfo.userId = +res.locals.userInfo.userId;
  return next();
}

export async function requireAdmin0(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const user = res.locals.userInfo;
  user.userId = +user.userId;
  console.log(user);
  if (!user) throw new ApiError(httpStatus.FORBIDDEN, 'invalid session');
  // get role of user
  const roles = await getRolesOfUser(user.userId);
  const roleName: String[] = [];
  roles.forEach((role) => {
    roleName.push(role.name);
  });
  // compare role: admin-0
  if (!roleName.includes('admin-0')) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you must be a admin-0 to access this route'
    );
  }

  next();
}

export async function requireAdmin1(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = res.locals.userInfo;
  if (!user) throw new ApiError(httpStatus.FORBIDDEN, 'invalid session');
  // get role of user
  const roles = await getRolesOfUser(user.userId);
  const roleName: String[] = [];
  roles.forEach((role) => {
    roleName.push(role.name);
  });
  // compare role: admin-1
  if (!roleName.includes('admin-1')) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you must be a admin-1 to access this route'
    );
  }

  next();
}
