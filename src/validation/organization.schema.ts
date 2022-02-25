import Joi from 'joi';

export const organizationSchema = {
  createOrg: Joi.object().keys({
    code: Joi.string().required(),
    name: Joi.string().required(),
    level: Joi.string().regex(/^[0-9]+$/),
    enabled: Joi.boolean(),
    description: Joi.string(),
    parentID: Joi.string().regex(/^[0-9]+$/),
  }),
  editOrg: Joi.object().keys({
    code: Joi.string(),
    name: Joi.string(),
    level: Joi.string().regex(/^[0-9]+$/),
    enabled: Joi.boolean(),
    description: Joi.string(),
    parentID: Joi.string().regex(/^[0-9]+$/),
  })
};
