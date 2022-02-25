import Joi from 'joi';
export const categorySchema = {
  AddCategoryInputSchema: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    level: Joi.string().required(),
    // code: Joi.string().required(),
    enable: Joi.boolean(),
    description: Joi.string(),
  }),
  AddCategoryChildrenInputSchema: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    level: Joi.string().required(),
    // code: Joi.string().required(),
    enable: Joi.boolean(),
    description: Joi.string(),
    parentID: Joi.string().required(),
  }),
  UpdateCategoryInputSchema: Joi.object().keys({
    name: Joi.string(),
    enable: Joi.boolean(),
    description: Joi.string(),
  }),
  UpdateCategoryParentInputSchema: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
  }),
};
