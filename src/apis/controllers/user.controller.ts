import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catch-async';
import {
  getUserByID,
  register,
  isEmailOrPhoneNumberExists,
  getAllUser,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateUser,
} from '../../services/user';

import { sendMail } from '../../utils/sendMail.utils';
import { signJWT } from '../../utils/jwt.ultils';
import env from '../../configs/env';
import ApiError from '../../utils/api-error';
import {
  getPermisionOfUser,
  getPermisionDetailOfUser,
  getAllPer,
  addPermisionForUser,
  deleteUserPermision,
  deleteUserPermisionWithName,
} from '../../services/user/userPer';
import { isPasswordMatch } from '../../helpers';

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await isEmailOrPhoneNumberExists(req.body.email, req.body.phoneNumber);

    const newUser = await register({ ...req.body });

    const permisions = await getAllPer();

    for (const permision of permisions) {
      if (permision.name.includes(req.body.pers)) {
        await addPermisionForUser({
          userId: newUser.id,
          permisionId: permision.id,
        });
      }
    }

    if (!newUser) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'something went wrong when create account' });
    }
    return res.status(httpStatus.OK).json({
      message: 'Create user successfully',
    });
  }
);

const signIn = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  if (user.status !== true) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account is not verified');
  }

  const token = signJWT(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
    },
    env.passport.jwtAccessExpired as string
  );
  return res.status(httpStatus.OK).json({ ...user, token });
});

const editProfile = catchAsync(async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user as User;
    const updatedProfile = await updateUser(+user.id, {
      ...req.body,
    });
    if (updatedProfile) {
      const token = signJWT(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
        env.passport.jwtAccessExpired as string
      );
      return res.status(200).json({ message: 'Update success', token: token });
    }
  } catch (e: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
  }
});

const getUserPermision = catchAsync(async (req: Request, res: Response) => {
  // @ts-ignore
  const pers = await getPermisionOfUser(+req.user.id);
  return res.status(httpStatus.OK).json({
    message: 'get permision of user successfully',
    data: pers,
  });
});

const getUserPermisionDetails = catchAsync(
  async (req: Request, res: Response) => {
    // @ts-ignore
    const perDetails = await getPermisionDetailOfUser(+req.user.id);
    return res.status(httpStatus.OK).json({
      message: 'get permision details of user successfully',
      data: perDetails,
    });
  }
);

const index = catchAsync(async (req: Request, res: Response) => {
  const users = await getAllUser();
  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;
  const permisions = await getAllPer();
  return res.status(httpStatus.OK).json({
    data: users.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
    permisions: permisions,
    totalCount: users.length,
    totalPage: Math.ceil(users.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
    // pageNo: Math.floor(skip / perPageNum) + 1,
  });
});

const userInfo = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    if (user.status) {
      const permision = await getPermisionOfUser(user.id);
      return res.status(httpStatus.OK).json({ user, permision });
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User Blocked');
  }
});

const show = catchAsync(async (req: Request, res: Response) => {
  const user = await getUserByID(+req.params.id);
  if (!user) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Cannot get user' });
  }
  return res.status(httpStatus.OK).json({
    data: user,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const user = await deleteUserByAdmin(+req.params.id);
  if (!user) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Delete failed' });
  }
  return res.status(httpStatus.OK).json({
    message: 'Delete success',
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const user = await updateUserByAdmin(+req.params.id, req.body);
  const permisions = await getAllPer();
  await deleteUserPermisionWithName(user.id);
  for (const permision of permisions) {
    if (permision.name.includes(req.body.pers)) {
      await addPermisionForUser({
        userId: user.id,
        permisionId: permision.id,
      });
    }
  }
  if (!user) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'update failed' });
  }
  return res.status(httpStatus.OK).json({
    message: 'Edit user successfully',
    data: user,
  });
  // const token = signJWT(
  //   {
  //     id: user.id,
  //     email: user.email,
  //     name: user.name,
  //     phoneNumber: user.phoneNumber,
  //   },
  //   env.passport.jwtAccessExpired as string
  // );
  // return res.status(200).json({ message: 'Update success', token: token });
});

export {
  index,
  signUp,
  signIn,
  // getProfile,
  editProfile,
  getUserPermision,
  getUserPermisionDetails,
  userInfo,
  show,
  remove,
  update,
};
