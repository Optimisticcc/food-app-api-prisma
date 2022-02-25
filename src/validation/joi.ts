import { ObjectSchema } from 'joi';
import ApiError from '../utils/api-error';
import httpStatus from 'http-status';

export const validate = async (schema: ObjectSchema, payload: any) => {
  try {
    await schema.validateAsync(payload, { abortEarly: false });
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};
