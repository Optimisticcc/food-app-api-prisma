import Joi from 'joi';

export const roleSchema = {
  createRole: Joi.object().keys({
    code: Joi.string().required(),
    name: Joi.string().required(),
  }),
  addRoleForUser: Joi.object().keys({
    userId: Joi.string().required(),
    roleIds: Joi.array().items(Joi.string()).required(),
  }),
  arrayIds: Joi.object().keys({
    roles: Joi.array().items(Joi.string()).required(),
  }),
  addCatsForRole: Joi.object().keys({
    catIds: Joi.array().items(Joi.string()).required(),
    role: Joi.string().required(),
  }),
  updateCatsOfRole: Joi.object().keys({
    catIds: Joi.array().items(Joi.string()).required(),
  }),
};
