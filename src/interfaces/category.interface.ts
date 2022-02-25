import { CategoryType } from '@prisma/client';
import Joi from 'joi';

export interface AddCategoryInput {
  name: string;
  type: CategoryType;
  level: string;
  enable?: boolean;
  description?: string;
  parentID?: string;
  code: string;
}
export interface UpdateCategoryInput {
  name: string;
  enable?: boolean;
  description?: string;
  code: string;
}


// name: Joi.string().required(),
//         index: Joi.string().required(),
//         level: Joi.string().required(),
//         isMenu: Joi.boolean().required(),
//         enable: Joi.boolean(),
//         description: Joi.string(),
//         parentID: Joi.string(),
