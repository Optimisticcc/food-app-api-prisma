// import { PrismaClient, User } from '@prisma/client';
// import { Request, Response, NextFunction } from 'express';
// import httpStatus from 'http-status';
// import catchAsync from '../../utils/catch-async';
// import { register, getUserByID } from '../../services';
// import { createSession } from '../../utils/session';
// import { signJWT } from '../../services';
// import env from '../../configs/env';
//
// const authFacebookMember = catchAsync((req: Request, res: Response) => {
//   return res.status(httpStatus.OK).json({
//     data: req.user,
//     message: 'Facebook login successfully',
//   });
//   // const token = encodedToken(req.user._id);
//   // res.setHeader('Authorization',token);
// });
//
// const authGoogleMember = catchAsync((req: Request, res: Response) => {
//   console.log(req.user);
//   return res.status(httpStatus.OK).json({
//     data: req.user,
//     message: 'Google login successfully',
//   });
// });
//
// export { authFacebookMember, authGoogleMember };
