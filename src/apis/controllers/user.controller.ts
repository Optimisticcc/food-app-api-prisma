import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catch-async';
import {
  getUserByID,
  resetPassword,
  softDeleteUser,
  addUser,
  updateUser,
  getOneUser,
  findManyUsers,
  editUserProfile,
  register,
  isEmailOrPhoneNumberExists,
} from '../../services/user';

import {
  generateVerifyEmailToken,
  verifyEmailVerification,
  generateResetPasswordToken,
  checkForgotPasswordExpired,
} from '../../utils/jwt.ultils';

import { sendMail } from '../../utils/sendMail.utils';
import { signJWT } from '../../utils/jwt.ultils';
import env from '../../configs/env';
import ApiError from '../../utils/api-error';
import {
  getPermisionOfUser,
  getPermisionDetailOfUser,
} from '../../services/user/userPer';
import { isPasswordMatch } from '../../helpers';

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await isEmailOrPhoneNumberExists(req.body.email, req.body.phoneNumber);
    const userData = { ...req.body };
    const newUser = await register(userData);
    if (!newUser) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'something went wrong when create account'
      );
    }
    req.user = newUser;
    next();
  }
);

// send mail verify account after create
// const sendVerificationEmail = catchAsync(
//   async (req: Request, res: Response) => {
//     const { email, id } = req.user as User;

//     const verifyEmailToken = generateVerifyEmailToken({
//       id: id,
//       name: email,
//     });
//     const subject = 'Xác thực tài khoản';
//     let confirmationUrl = env.feUrl + `/verify-email/${verifyEmailToken}`;
//     const text = `Click vào link sau để xác thực tài khoản: ${confirmationUrl}`;
//     await sendMail(email, subject, text);
//     return res.status(httpStatus.OK).json({
//       message: 'email sent successfully',
//     });
//   }
// );

const signIn = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  if (user.status !== true) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account is not verified');
  }

  const token = signJWT(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
    },
    env.passport.jwtAccessExpired as string
  );
  return res.status(200).json({ ...user, token });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  // @ts-ignore
  const user = await getUserByID(+req.user.id);
  return res.status(httpStatus.OK).json({
    data: user,
    message: 'Get user successfully',
  });
});

const editProfile = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req.user as User;
  try {
    const updatedProfile = await editUserProfile(+userInfo.id, {
      ...req.body,
    });
    return res.status(httpStatus.OK).json({
      message: 'Edit user successfully',
      data: updatedProfile,
    });
  } catch (e: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message);
  }
});

// const verifyEmail = catchAsync(async (req: Request, res: Response) => {
//   const decoded = verifyEmailVerification(req.params?.token);
//   await updateVerifyUser(decoded.payload?.id);
//   return res.status(httpStatus.OK).json({
//     message: 'Xác thực tài khoản thành công',
//   });
// });

// const forgotPassword = catchAsync(async (req: Request, res: Response) => {
//   const user = await getUserByEmail(req.body?.email);
//   if (!user) {
//     return res.status(httpStatus.NOT_FOUND).json({
//       message: `not found account with email ${req.body?.email}`,
//     });
//   }
//   const forgotPasswordToken = generateResetPasswordToken({
//     id: user.id,
//     name: user.email,
//   });
//   const subject = 'Reset mật khẩu';
//   let currentUrl = env.feUrl;
//   let confirmationUrl = currentUrl + `/reset-password/${forgotPasswordToken}`;
//   const text = `Bạn vừa gửi yêu cầu reset mật khẩu? Click vào link sau để reset lại mật khẩu: ${confirmationUrl}
//     \n\n
//     Nếu không phải bạn đã gửi yêu cầu reset mật khẩu, xin hãy bỏ qua email này
//     `;
//   await sendMail(user.email, subject, text);
//   return res.status(httpStatus.OK).json({
//     message: 'email sent successfully',
//   });
// });

// const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
//   const decoded = checkForgotPasswordExpired(req.params?.token);
//   await resetPassword(decoded?.id, req.body?.password);
//   return res.status(httpStatus.OK).json({
//     message: 'Đổi mật khẩu thành công',
//   });
// });

const getUserPermision = catchAsync(async (req: Request, res: Response) => {
  // @ts-ignore
  const roles = await getPermisionOfUser(+req.user.id);
  return res.status(httpStatus.OK).json({
    message: 'get permision of user successfully',
    data: roles,
  });
});

const getUserPermisionDetails = catchAsync(
  async (req: Request, res: Response) => {
    // @ts-ignore
    const roles = await getPermisionDetailOfUser(+req.user.id);
    return res.status(httpStatus.OK).json({
      message: 'get permision details of user successfully',
      data: roles,
    });
  }
);

// const changePasswordHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     await validate(userSchema.changePassword, req.body);
//     const user = await getOneUser({ id: +res.locals.userInfo.userId });
//     console.log(user);
//     if (!user || !user.password)
//       throw new ApiError(httpStatus.UNAUTHORIZED, 'user must be verify');
//     // compare old password
//     const isValid = await isPasswordMatch(user.password, req.body.password);
//     if (!isValid)
//       throw new ApiError(httpStatus.BAD_REQUEST, 'password is incorrect');
//     // reset new password
//     console.log(user.id);
//     await resetPassword(user.id, req.body.newPassword);

//     return res.status(httpStatus.OK).json({
//       message: 'change password successfully',
//     });
//   }
// );

// const verifyAccountCreateByAdminHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     await validate(userSchema.verifyAccountCreateByAdmin, req.body);
//     const decoded = verifyEmailVerification(req.body.token);
//     console.log(decoded);
//     await verifyCreateUser(decoded.payload?.id, req.body.password);
//     return res.status(httpStatus.OK).json({
//       message: 'Xác thực tài khoản thành công',
//     });
//   }
// );

export {
  signUp,
  signIn,
  // logout,
  // forgotPassword,
  // resetPasswordHandler,
  getProfile,
  editProfile,
  // sendVerificationEmail,
  // verifyEmail,
  getUserPermision,
  getUserPermisionDetails,
  // changePasswordHandler,
  // getCatsOfUser,
  // verifyAccountCreateByAdminHandler,
};
