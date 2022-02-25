import Joi from 'joi';
export const postSchema = {
  AddPostInputSchema: Joi.object().keys({
    title: Joi.string().required(),
    header: Joi.string(),
    summary: Joi.string(),
    image: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    type: Joi.string().valid('NORMAL', 'TIMELINE').required(),
    status: Joi.string().valid('DRAFT', 'PUBLIC', 'CLOSE'),
    author: Joi.string().required(),
    categories: Joi.array().items(Joi.string()),
    // userId: Joi.string(),
  }),
  UpdatePostInputSchema: Joi.object().keys({
    title: Joi.string(),
    removeVietnameseTitle: Joi.string(),
    header: Joi.string(),
    summary: Joi.string(),
    image: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    type: Joi.string().valid('NORMAL', 'TIMELINE'),
    status: Joi.string().valid('DRAFT', 'PUBLIC', 'CLOSE'),
    author: Joi.string().required(),
    categories: Joi.array().items(Joi.string()),
    userId: Joi.string(),
  }),
  AddPostDetailSchema: Joi.object().keys({
    content: Joi.string().required(),
    enable: Joi.boolean(),
  }),
  EditPostDetailSchema: Joi.object().keys({
    content: Joi.string(),
    enable: Joi.boolean(),
  }),
  searchPost: Joi.object().keys({
    catId: Joi.string()
      .regex(/^[0-9]+$/)
      .required(),
    q: Joi.string().required(),
  }),
  getPublicPostByCatCode: Joi.object().keys({
    code: Joi.string().required(),
  }),
  getPostDetailByPostId: Joi.object().keys({
    id: Joi.string().required(),
  }),
  getPostDetailByPostCode: Joi.object().keys({
    code: Joi.string().required(),
  }),
};
