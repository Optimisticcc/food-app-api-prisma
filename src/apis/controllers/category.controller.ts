import { Category, CategoryType } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
import { validate, categorySchema, schemas } from '../../validation';
import {
  addCategoryLevelZero,
  addCategoryLevelOne,
  getCategoryChildByID,
  updateCategoryByID,
  getAllCategoriesFull,
  deleteCategoryByID,
  getAllCategoriesOfParentID,
  getCateByType,
  getPublicCate,
  getAllPublicCategoriesOfParentID,
  getPublicCateChildParent,
  getCate,
  updateCategoryParentByID,
  findParentCategory, getAllCate,
} from '../../services';
import { UpdateCategoryInput, AddCategoryInput } from '../../interfaces/';
import ApiError from '../../utils/api-error';

const createCategoryParent = catchAsync(async (req: Request, res: Response) => {
  await validate(categorySchema.AddCategoryInputSchema, req.body);
  const categoryData = { ...req.body };
  let code = removeVietnameseTonesStrikeThrough(req.body.name);
  const newCategory = await addCategoryLevelZero({ ...categoryData, code });
  return res.status(httpStatus.CREATED).json({
    data: {
      category: newCategory,
      success: true,
      message: 'create category parent successfully',
    },
  });
});

const createCategoryChildren = catchAsync(
  async (req: Request, res: Response) => {
    await validate(categorySchema.AddCategoryChildrenInputSchema, req.body);
    if (req.body.level === 0) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot add more parent');
    }
    const categoryData = { ...req.body };
    let code = removeVietnameseTonesStrikeThrough(req.body.name);
    const newCategory = await addCategoryLevelOne({ ...categoryData, code });
    return res.status(httpStatus.CREATED).json({
      data: {
        category: newCategory,
        success: true,
        message: 'create category children successfully',
      },
    });
  }
);


const updateCategoryParent = catchAsync(async (req: Request, res: Response) => {
  await Promise.all([
    validate(schemas.idSchema, req.params),
    validate(categorySchema.UpdateCategoryParentInputSchema, req.body),
  ]);
  let code = removeVietnameseTonesStrikeThrough(req.body.name);
  const args: UpdateCategoryInput = { ...req.body };
  const category = await updateCategoryParentByID(+req.params?.id, { ...args, code });
  return res.status(httpStatus.OK).json({
    message: 'update category parent successfully',
    data: category,
    success: true,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  await Promise.all([
    validate(schemas.idSchema, req.params),
    validate(categorySchema.UpdateCategoryInputSchema, req.body),
  ]);
  let code = removeVietnameseTonesStrikeThrough(req.body.name);
  const args: UpdateCategoryInput = { ...req.body };
  const user = await updateCategoryByID(+req.params?.id, { ...args, code });
  return res.status(httpStatus.OK).json({
    message: 'update category child successfully',
    data: user,
    success: true,
  });
});

// chi cho xoa category khong co cate con, hoac la k co post
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idSchema, req.params);
  await deleteCategoryByID(+req.params?.id);
  return res.status(httpStatus.OK).json({
    message: 'delete category successfully',
  });
});
// get all level of gom parentID
//               getAllCategoriesOfParentID,
// get all cate tu 0 va con cua no theo thu tu
//             getAllCategories,
// get category child by id
//getCategoryChildByID,
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await getAllCategoriesFull();
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get all categories successfully',
    data: categories,
  });
});

const getAllCategoriesChildrenOfParent = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.idSchema, req.params);
    const categories = await getAllCategoriesOfParentID(
      req.params?.id as unknown as number
    );
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'get all categories children of parent successfully',
      data: categories,
    });
  }
);

const getAllPublicCategoriesChildrenOfParent = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.idSchema, req.params);
    const categories = await getAllPublicCategoriesOfParentID(
      req.params?.id as unknown as number
    );
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'get all categories children of parent successfully',
      data: categories,
    });
  }
);

const getCategoryChildrenByID = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.idSchema, req.params);
    const categories = await getCategoryChildByID(
      req.params?.id as unknown as number
    );
    if (!categories) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category children not found');
    }
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'get category children successfully',
      data: categories,
    });
  }
);

const getCategoriesByType = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.typeSchema, req.params);
  const categories = await getCateByType(req.params?.type as CategoryType);
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get category by type successfully',
    data: categories,
  });
});

const getPublicCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await getPublicCate();
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get category by type successfully',
    data: categories,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await getCate();
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get category full successfully',
    data: categories,
  });
});

// api tra ve category con va bo no
const getPublicCategoriesChildWithParrent = catchAsync(async (req: Request, res: Response) => {
  const categories = await getPublicCateChildParent();
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get category by child and its parent successfully',
    data: categories,
  });
});

const getCategoryParentByID = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idSchema, req.params);
  const category = await findParentCategory({id: +req.params.id as unknown as number});
  if (!category){
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'cannot get category parent',
    })
  }
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get category parents successfully',
    data: category,
  });
});

const getAllListCatsHandle = catchAsync(async (req: Request, res: Response) => {
  const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    message: 'get all list categories successfully',
    data: cats
  })
})

export {
  createCategoryParent,
  createCategoryChildren,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getAllCategoriesChildrenOfParent,
  getCategoryChildrenByID,
  getCategoriesByType,
  getPublicCategories,
  getAllPublicCategoriesChildrenOfParent,
  getPublicCategoriesChildWithParrent,
  getCategories,
  updateCategoryParent,
  getCategoryParentByID,
  getAllListCatsHandle
};
