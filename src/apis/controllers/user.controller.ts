import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catch-async';
import {
  register,
  updateVerifyUser,
  resetPassword,
  getUserByEmail,
  editUserProfile,
  isEmailOrPhoneNumberExists,
  getUserByID,
  getOneUser,
  verifyCreateUser,
} from '../../services/user';

import {
  generateVerifyEmailToken,
  verifyEmailVerification,
  generateResetPasswordToken,
  checkForgotPasswordExpired,
} from '../../utils/jwt.ultils';

import { sendMail } from '../../utils/sendMail.utils';

import { createSession, invalidateSession } from '../../utils/session';
import { signJWT } from '../../utils/jwt.ultils';
import env from '../../configs/env';
import { validate, schemas, userSchema } from '../../validation';
import ApiError from '../../utils/api-error';
import { getRolesOfUser } from '../../services/user/userRoles';
import { isPasswordMatch } from '../../helpers';
import { getCatsOfRoles } from '../../services/category/cateRole';

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await validate(userSchema.authSignUpSchema, req.body);
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
const sendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email, id } = req.user as User;

    const verifyEmailToken = generateVerifyEmailToken({
      id: id,
      name: email,
    });
    const subject = 'Xác thực tài khoản';
    let confirmationUrl = env.feUrl + `/verify-email/${verifyEmailToken}`;
    const text = `Click vào link sau để xác thực tài khoản: ${confirmationUrl}`;
    await sendMail(email, subject, text);
    return res.status(httpStatus.OK).json({
      message: 'email sent successfully',
    });
  }
);

const signIn = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  if (user.isVerified !== true) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account is not verified');
  }

  if (user.isDeleted === true) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account was deleted');
  }

  const session = await createSession(
    user.email,
    user.name,
    user.id.toString()
  );
  // create access token
  const accessToken = signJWT(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      sessionId: session.sessionId,
    },
    env.passport.jwtAccessExpired as string
  );

  const refreshToken = signJWT(
    { sessionId: session.sessionId },
    `${env.passport.jwtRefreshExpired}`
  );

  // set access token in cookie
  res.cookie('accessToken', accessToken, {
    maxAge: parseInt(env.passport.jwtRefreshExpired as string),
    httpOnly: true,
    secure: !env.isDevelopment,
    sameSite: 'none',
  });

  res.cookie('refreshToken', refreshToken, {
    maxAge: parseInt(env.passport.jwtRefreshExpired as string),
    secure: !env.isDevelopment,
    httpOnly: true,
    sameSite: 'none',
  });

  // send user back
  return res.status(httpStatus.OK).json({
    message: 'login successfully',
    data: {
      accessToken,
      refreshToken,
    },
  });
});
//
const logout = catchAsync(async (req: Request, res: Response) => {
  res.cookie('accessToken', '', {
    maxAge: 0,
    httpOnly: true,
    secure: !env.isDevelopment,
    sameSite: 'none',
  });

  res.cookie('refreshToken', '', {
    maxAge: 0,
    httpOnly: true,
    secure: !env.isDevelopment,
    sameSite: 'none',
  });

  await invalidateSession(res.locals.userInfo.sessionId);
  return res.status(httpStatus.NO_CONTENT).json({
    message: 'Logout successfully',
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await getUserByEmail(res.locals.userInfo.email);
  return res.status(httpStatus.OK).json({
    data: user,
    message: 'Get user successfully',
  });
});

const editProfile = catchAsync(async (req: Request, res: Response) => {
  await validate(userSchema.updateUserProfile, req.body);
  const userInfo = res.locals.userInfo;
  try {
    const updatedProfile = await editUserProfile(+userInfo.userId, {
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

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const decoded = verifyEmailVerification(req.params?.token);
  await updateVerifyUser(decoded.payload?.id);
  return res.status(httpStatus.OK).json({
    message: 'Xác thực tài khoản thành công',
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const user = await getUserByEmail(req.body?.email);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: `not found account with email ${req.body?.email}`,
    });
  }
  const forgotPasswordToken = generateResetPasswordToken({
    id: user.id,
    name: user.email,
  });
  const subject = 'Reset mật khẩu';
  let currentUrl = env.feUrl;
  let confirmationUrl = currentUrl + `/reset-password/${forgotPasswordToken}`;
  const text = `Bạn vừa gửi yêu cầu reset mật khẩu? Click vào link sau để reset lại mật khẩu: ${confirmationUrl}
    \n\n
    Nếu không phải bạn đã gửi yêu cầu reset mật khẩu, xin hãy bỏ qua email này
    `;
  await sendMail(user.email, subject, text);
  return res.status(httpStatus.OK).json({
    message: 'email sent successfully',
  });
});

const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  const decoded = checkForgotPasswordExpired(req.params?.token);
  await resetPassword(decoded?.id, req.body?.password);
  return res.status(httpStatus.OK).json({
    message: 'Đổi mật khẩu thành công',
  });
});

const getUserRole = catchAsync(async (req: Request, res: Response) => {
  const roles = await getRolesOfUser(res.locals.userInfo.userID);
  return res.status(httpStatus.OK).json({
    message: 'get role of user successfully',
    data: roles,
  });
});

const changePasswordHandler = catchAsync(
  async (req: Request, res: Response) => {
    await validate(userSchema.changePassword, req.body);
    const user = await getOneUser({ id: +res.locals.userInfo.userId });
    console.log(user);
    if (!user || !user.password)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'user must be verify');
    // compare old password
    const isValid = await isPasswordMatch(user.password, req.body.password);
    if (!isValid)
      throw new ApiError(httpStatus.BAD_REQUEST, 'password is incorrect');
    // reset new password
    console.log(user.id);
    await resetPassword(user.id, req.body.newPassword);

    return res.status(httpStatus.OK).json({
      message: 'change password successfully',
    });
  }
);

const getCatsOfUser = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.userInfo;
  const rolesOfUser = await getRolesOfUser(user.userID);
  const roleIds = rolesOfUser.map((role) => role.id);
  const cats = await getCatsOfRoles(roleIds);
  return res.status(httpStatus.OK).json({
    message: 'get categories successfully',
    data: cats,
  });
});

const verifyAccountCreateByAdminHandler = catchAsync(
  async (req: Request, res: Response) => {
    await validate(userSchema.verifyAccountCreateByAdmin, req.body);
    const decoded = verifyEmailVerification(req.body.token);
    console.log(decoded);
    await verifyCreateUser(decoded.payload?.id, req.body.password);
    return res.status(httpStatus.OK).json({
      message: 'Xác thực tài khoản thành công',
    });
  }
);

export {
  signUp,
  signIn,
  logout,
  forgotPassword,
  resetPasswordHandler,
  getProfile,
  editProfile,
  sendVerificationEmail,
  verifyEmail,
  getUserRole,
  changePasswordHandler,
  getCatsOfUser,
  verifyAccountCreateByAdminHandler,
};
