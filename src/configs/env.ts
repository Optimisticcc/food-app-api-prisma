import dotenv from 'dotenv';
dotenv.config();

import { normalizePort, getOsEnv } from '../libs/os';

const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  emailAdmin: process.env.EMAIL_ADMIN,
  passwordAdmin: process.env.PASSWORD_ADMIN,
  apiUrl: process.env.apiUrl,
  feUrl: process.env.feUrl,
  app: {
    port: normalizePort(process.env.PORT || (getOsEnv('APP_PORT') as string)),
  },
  passport: {
    publicKeyJWT: getOsEnv('PUBLIC_KEY_JWT'),
    secretKeyJWT: getOsEnv('SECRET_KEY_JWT'),
    jwtAccessExpired: getOsEnv('PASSPORT_JWT_ACCESS_EXPIRED'),
    jwtRefreshExpired: getOsEnv('PASSPORT_JWT_REFRESH_EXPIRED'),
    SECRET_KEY_RESET_PASSWORD: getOsEnv('SECRET_KEY_RESET_PASSWORD'),
    SECRET_KEY_VERIFY_EMAIL: getOsEnv('SECRET_KEY_VERIFY_EMAIL'),
    auth: {
      google: {
        GOOGLE_CLIENT_ID: getOsEnv('GOOGLE_CLIENT_ID'),
        GOOGLE_CLIENT_SECRET: getOsEnv('GOOGLE_CLIENT_SECRET'),
      },
      facebook: {
        FACEBOOK_CLIENT_ID: getOsEnv('FACEBOOK_APP_ID'),
        FACEBOOK_CLIENT_SECRET: getOsEnv('FACEBOOK_APP_SECRET'),
      },
    },
  },
};

export default env;
