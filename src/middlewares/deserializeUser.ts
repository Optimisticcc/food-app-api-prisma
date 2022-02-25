import { NextFunction, Request, Response } from 'express';
import { getSession } from '../utils/session';
import { signJWT, verifyJWT } from '../utils/jwt.ultils';
import env from '../configs/env';
import { SessionInformation } from '../interfaces';

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  // For a valid access token
  if (payload) {
    console.log('payload: ', payload);
    res.locals.userInfo = payload;
    return next();
  }

  // valid access token but expired token
  const { payload: refreshPayload } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  if (!refreshPayload) {
    return next();
  }

  // @ts-ignore
  const session: SessionInformation = (await getSession(
    refreshPayload?.sessionId as string
  )) as SessionInformation;
  if (!session) {
    return next();
  }
  console.log('session ac new: ', session);
  const newAccessToken = signJWT(
    session as object,
    env.passport.jwtAccessExpired as string
  );

  res.cookie('accessToken', newAccessToken, {
    maxAge: parseInt(env.passport.jwtRefreshExpired as string),
    httpOnly: true,
    secure: !env.isDevelopment,
    sameSite: 'none',
  });

  res.locals.userInfo = verifyJWT(newAccessToken).payload;

  return next();
}
