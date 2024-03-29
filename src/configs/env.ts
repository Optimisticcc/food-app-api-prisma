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
  feUrl: process.env.feUrl,
  app: {
    port: normalizePort(process.env.PORT || (getOsEnv('APP_PORT') as string)),
  },
  passport: {
    secretKeyJWT: getOsEnv('SECRET_KEY_JWT'),
    jwtAccessExpired: getOsEnv('PASSPORT_JWT_ACCESS_EXPIRED'),
    SECRET_KEY_RESET_PASSWORD: getOsEnv('SECRET_KEY_RESET_PASSWORD'),
    SECRET_KEY_VERIFY_EMAIL: getOsEnv('SECRET_KEY_VERIFY_EMAIL'),
  },
  cloudinary: {
    cloud_name: getOsEnv('CLOUD_NAME'),
    api_key: getOsEnv('API_KEY'),
    api_secret: getOsEnv('API_SECRET'),
  },
  momo: {
    api_url: getOsEnv('API_URL'),
    partner_code: getOsEnv('PARTNER_CODE'),
    access_key: getOsEnv('ACCESS_KEY'),
    secret_key: getOsEnv('SECRET_KEY'),
  },
};

export default env;
