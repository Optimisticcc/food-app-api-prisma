import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import env from '../configs/env';
import fs from 'fs';
import ApiError from './api-error';
import httpStatus from 'http-status';
import path from 'path';

// sign jwt
export function signJWT(payload: object, expiresIn: string | number) {
  const key = fs.readFileSync(__dirname + '/../../jwtRS256.key');
  const secretKey = key as Secret;

  return jwt.sign(payload as object, secretKey, {
    algorithm: 'RS256',
    expiresIn,
  });
}

// verify jwt
export function verifyJWT(token: string) {
  try {
    const secretKey = env.passport.secretKeyJWT as Secret;

    const decoded = jwt.verify(token, secretKey);
    return { payload: decoded, expired: false };
  } catch (error: any) {
    return { payload: null, expired: error.message.includes('jwt expired') };
  }
}

export function generateResetPasswordToken({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const secretKey = env.passport.SECRET_KEY_RESET_PASSWORD as Secret;
  const expiresIn = '5m';
  const payload = {
    id,
    name,
  };
  return jwt.sign(payload, secretKey, { expiresIn });
}

export function checkForgotPasswordExpired(token: string) {
  const key = env.passport.SECRET_KEY_RESET_PASSWORD as Secret;
  const decoded = jwt.verify(token, key) as JwtPayload;

  if (!decoded) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Link đổi mật khẩu đã hết hạn. Vui lòng xác thực lại!'
    );
  }
  return decoded;
}

export function generateVerifyEmailToken({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const secretKey = env.passport.SECRET_KEY_VERIFY_EMAIL as Secret;
  const payload = {
    id,
    name,
  };
  return jwt.sign(payload, secretKey, { expiresIn: '5m' });
}
// verifyEmail
export function verifyEmailVerification(token: string) {
  try {
    const key = env.passport.SECRET_KEY_VERIFY_EMAIL as Secret;
    const decoded = jwt.verify(token, key) as JwtPayload;
    return { payload: decoded, expired: false };
  } catch (error: any) {
    return { payload: null, expired: error.message.includes('jwt expired') };
  }
}
