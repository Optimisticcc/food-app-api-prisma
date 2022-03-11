import {
  getPermisionDetailOfUser,
  getPermisionOfUser,
} from '../services/user/userPer';
import ApiError from './api-error';
import httpStatus from 'http-status';

const checkPer = async (code: string, permisionDetails: string[]) => {
  let check = false;
  for (const item of permisionDetails) {
    if (item === code) {
      check = true;
    }
  }
  return check;
};

export default async function requirePermisionDetails(
  userID: number,
  code: string
) {
  const perDetailsOfUser = await getPermisionDetailOfUser(userID);

  if (!checkPer(code, perDetailsOfUser)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you must have permision action to access this route'
    );
  }
}
