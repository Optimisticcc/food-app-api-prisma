import Joi from 'joi';
import { BCRYPT_MAX_BYTES } from '../configs/auth';
export const userSchema = {
  email: Joi.object().keys({
    email: Joi.string()
      .regex(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required(),
  }),
  password: Joi.object().keys({
    password: Joi.string()
      .min(8)
      .max(BCRYPT_MAX_BYTES, 'utf-8')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .message('Minimum eight characters, at least one letter and one number')
      .required(),
  }),
  changePassword: Joi.object().keys({
    password: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .max(BCRYPT_MAX_BYTES, 'utf-8')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .message('Minimum eight characters, at least one letter and one number')
      .required(),
  }),
  authSignUpSchema: Joi.object().keys({
    code: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string()
      .regex(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required(),
    password: Joi.string().min(6).required(),
    phoneNumber: Joi.string()
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
      .required(),
    orgID: Joi.number(),
  }),
  authSignInSchema: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  updateUserProfile: Joi.object().keys({
    phoneNumber: Joi.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
    name: Joi.string(),
    orgID: Joi.number(),
  }),
  updateUserInput: Joi.object().keys({
    phoneNumber: Joi.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
    name: Joi.string(),
    address: Joi.string(),
    description: Joi.string(),
    isDeleted: Joi.boolean(),
    orgID: Joi.number(),
    isVerified: Joi.boolean(),
  }),
  addUserInput: Joi.object().keys({
    code: Joi.string().required(),

    email: Joi.string()
      .regex(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required(),
    phoneNumber: Joi.string()
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
      .required(),
    name: Joi.string().required(),
    orgID: Joi.number(),
  }),
  verifyAccountCreateByAdmin: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required(),
  })
};
