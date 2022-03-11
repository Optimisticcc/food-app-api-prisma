import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/';
import {
  addUser,
  updateUser,
  softDeleteUser,
  isEmailOrPhoneNumberExists,
  getUserByID,
  findManyUsers,
} from '../../services/';

import { generateVerifyEmailToken } from '../../utils/';
import ApiError from '../../utils/api-error';

import { sendMail } from '../../utils/';

import { UpdateUserInput } from '../../interfaces/';
import {
  findPermision,
  deleteUserPermision,
  deletePermision,
  addPermisionForUser,
  getPermisionById,
  createPermision,
  getPermisionDetailOfUser,
  getPermisionOfUser,
  createPermisionDetail,
  updatePermisionDetail,
  findPers,
  addPerDetailForPer,
  getPerDetailOfPer,
} from '../../services/user/userPer';

import env from '../../configs/env';

const getPermisionByID = catchAsync(async (req: Request, res: Response) => {
  try {
    const permision = await getPermisionById(+req.params.id);
    return res.status(httpStatus.OK).json({
      data: permision,
      message: 'get permision filter successfully',
    });
  } catch (e: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
  }
});
const getPerDetailsOfUser = catchAsync(async (req: Request, res: Response) => {
  try {
    const perDetails = await getPermisionDetailOfUser(+req.params.id);
    return res.status(httpStatus.OK).json({
      data: perDetails,
      message: 'get perDetails of user successfully',
    });
  } catch (e: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
  }
});

const createPerDetail = catchAsync(async (req: Request, res: Response) => {
  try {
    const permision = await createPermisionDetail(req.body);
    return res.status(httpStatus.OK).json({
      data: permision,
      message: 'create permision detail successfully',
    });
  } catch (e: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
  }
});

const updatePerDetail = catchAsync(async (req: Request, res: Response) => {
  try {
    const permision = await updatePermisionDetail(+req.params.id, req.body);
    return res.status(httpStatus.OK).json({
      data: permision,
      message: 'update permision detail successfully',
    });
  } catch (e: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
  }
});

const filterPermision = catchAsync(async (req: Request, res: Response) => {
  try {
    const permision = await findPermision(req.body);
    return res.status(httpStatus.OK).json({
      data: permision,
      message: 'get permision filter successfully',
    });
  } catch (e: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
  }
});

const softDeleteUserByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    try {
      await softDeleteUser(req.body.id);
      return res.status(httpStatus.OK).json({
        message: 'delete user successfully',
      });
    } catch (e: any) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
    }
  }
);

const createUserProfileByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    await isEmailOrPhoneNumberExists(req.body?.email, req.body?.phoneNumber);
    const user = await addUser(req.body);
    // return
    return res.status(httpStatus.CREATED).json({
      message: 'add user successfully, please verify email before login',
      data: user,
    });
  }
);

const updateUserProfileByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const args: UpdateUserInput = { ...req.body };
    const user = await updateUser(+req.params?.id, args);
    return res.status(httpStatus.OK).json({
      message: 'update user successfully',
      data: user,
    });
  }
);

const createPermisionHandler = catchAsync(
  async (req: Request, res: Response) => {
    const permision = await createPermision(req.body);
    return res.status(httpStatus.CREATED).json({
      message: 'create permision successfully',
      data: permision,
    });
  }
);

const addPerForUserHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.body.userId as number;
  const arrPerIds: number[] = req.body.perIds.map((i: string) => Number(i));

  const user = await getUserByID(+userId);
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `not found user with id = ${userId}`
    );
  }

  const userPer = await getPermisionOfUser(+userId);
  if (userPer && userPer.length > 0) {
    const userPerId: number[] = userPer.map((per) => per.id);
    const perAdd = arrPerIds.filter((perId) => !userPerId.includes(perId));
    const roleDelete = userPerId.filter((perId) => !arrPerIds.includes(perId));
    await deleteUserPermision(roleDelete);
    for (let i in perAdd) {
      await addPermisionForUser({ userId, permisionId: perAdd[i] });
    }
    return res.status(httpStatus.OK).json({
      message: `add role: ${perAdd} for user: ${user.email} successfully`,
    });
  } else {
    for (let i in arrPerIds) {
      await addPermisionForUser({ userId, permisionId: arrPerIds[i] });
    }
    return res.status(httpStatus.OK).json({
      message: `add role: ${arrPerIds} for user: ${user.email} successfully`,
    });
  }
});

const deletePersHandler = catchAsync(async (req: Request, res: Response) => {
  if (req.body.pers.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'you must select least 1 role to delete'
    );
  }
  const arrPers: number[] = req.body.pers.map((i: string) => Number(i));
  await deletePermision(arrPers);
  return res.status(httpStatus.OK).json({
    message: 'deleted pers successfully',
  });
});

const addPerDetailForPerHandler = catchAsync(
  async (req: Request, res: Response) => {
    if (req.body.perDetailIds.length === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'you must select least 1 permision detail'
      );
    }
    const arrPerDetails: number[] = req.body.perDetailIds.map((i: string) =>
      Number(i)
    );
    for (let i in arrPerDetails) {
      await addPerDetailForPer(+req.body.idPer, arrPerDetails[i]);
    }
    return res.status(httpStatus.CREATED).json({
      message: 'add perdetail for per successfully',
    });
  }
);

const getPerDetailOfPerHandler = catchAsync(
  async (req: Request, res: Response) => {
    const perDetails = await getPerDetailOfPer(+req.params.id);
    return res.status(httpStatus.OK).json({
      message: 'get perdetail of per successfully',
      data: perDetails,
    });
  }
);

const getUserProfileHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = await getUserByID(+req.params.id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    return res.status(httpStatus.OK).json({
      message: 'get user profile successfully',
      data: user,
    });
  }
);

const getAllUserHandler = catchAsync(async (req: Request, res: Response) => {
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 10;
  const users = await findManyUsers({});
  return res.status(httpStatus.OK).json({
    message: 'get all users successfully',
    data: {
      data: users.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: users.length,
    },
  });
});

const getPersHandler = catchAsync(async (req: Request, res: Response) => {
  const roles = await findPers({});
  return res.status(httpStatus.OK).json({
    message: 'get roles successfully',
    data: roles,
  });
});

const getPersByUserIdHandler = catchAsync(
  async (req: Request, res: Response) => {
    const roles = await getPermisionOfUser(+req.params.id);
    return res.status(httpStatus.OK).json({
      message: 'get per of user successfully',
      data: roles,
    });
  }
);

export {
  createUserProfileByAdmin,
  updateUserProfileByAdmin,
  softDeleteUserByAdmin,
  deletePersHandler,
  addPerDetailForPerHandler,
  getPerDetailOfPerHandler,
  getUserProfileHandler,
  getAllUserHandler,
  getPersHandler,
  getPersByUserIdHandler,
  filterPermision,
  updatePerDetail,
  createPerDetail,
  getPerDetailsOfUser,
  getPermisionByID,
  createPermisionHandler,
  addPerForUserHandler,
};
