import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import { AddCategoryInput, UpdateCategoryInput } from '../../interfaces';
import { Prisma, PrismaClient, StatusPost, CategoryType } from '@prisma/client';
import { removeVietnameseTones } from '../../utils/';
const prisma = new PrismaClient();

const addCategoryLevelZero = async (categoryBody: AddCategoryInput) => {
  let categoryData: Prisma.CategoryCreateInput = {
    name: categoryBody.name,
    type: categoryBody.type,
    level: categoryBody.level,
    enable: categoryBody.enable,
    description: categoryBody.description,
    code: categoryBody.code,
  };
  return prisma.category.create({
    data: categoryData,
  });
};

const addCategoryLevelOne = async (categoryBody: AddCategoryInput) => {
  let categoryData: Prisma.CategoryCreateInput = {
    name: categoryBody.name,
    type: categoryBody.type,
    level: categoryBody.level,
    enable: categoryBody.enable,
    description: categoryBody.description,
    code: categoryBody.code,
  };
  // check xem category cha co post hay k
  if (categoryBody.parentID) {
    const parentCategory = await prisma.category.findFirst({
      where: {
        level: '0',
        parentID: null,
        id: +categoryBody.parentID,
        enable: true,
      },
    });

    if (!parentCategory) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Can't add category because of parent Category level 0 not found or not enable"
      );
    }

    const post = await prisma.post.findFirst({
      where: {
        postCategory: {
          some: {
            categoryID: parentCategory.id,
          },
        },
      },
    });
    console.log(post)
    if (post) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Can't add category because of parent Category already have  post"
        );

    }

    categoryData.parent = {
      connect: { id: parentCategory.id },
    };
  }
  console.log(categoryData)

  return prisma.category.create({
    data: categoryData,
  });
};

const getAllCategoriesOfParentID = async (parentId: number) => {
  return prisma.category.findMany({
    where: {
      parentID: +parentId,
    }
  });
};

const getAllPublicCategoriesOfParentID = async (parentId: number) => {
  return prisma.category.findMany({
    where: {
      parentID: +parentId,
      enable: true,
    },
    select: {
      name: true,
      level: true,
      isBlock: true,
      isMenu: true,
      type: true,
    },
  });
};

const getCategoryChildByID = async (id: number) => {
  return prisma.category.findFirst({
    where: {
      id: +id,
      parentID: {
        not: null,
      },
    },
    select: {
      name: true,
      level: true,
      isBlock: true,
      isMenu: true,
      enable: true,
      type: true,
      parent: {
        select: {
          name: true,
          level: true,
          isBlock: true,
          isMenu: true,
          enable: true,
          type: true,
        },
      },
    },
  });
};

const getAllCategoriesFull = async () => {
  return prisma.category.findMany({
    where: {
      level: '0',
    },
    include: {
      Category: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

const updateCategoryByID = async (id: number, args: UpdateCategoryInput) => {
  const category = await prisma.category.findFirst({
    where: {
      id: +id,
      parentID: {
        not: null,
      },
    },
  });
  if (!category) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Cannot find category to updated or not category children'
    );
  }

  if (!category.parentID) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot not update category parent'
    );
  }
  return prisma.category.update({
    where: {
      id: +id,
    },
    data: args,
  });
};

const updateCategoryParentByID = async (id: number, args: UpdateCategoryInput) => {
  const category = await prisma.category.findFirst({
    where: {
      id: +id,
      parentID: null,
    },
  });
  if (!category) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Cannot find category to updated or not category children'
    );
  }

  return prisma.category.update({
    where: {
      id: +id,
    },
    data: args,
  });
};

// kiểm tra có post hay k
const deleteCategoryByID = async (id: number) => {
  const category = await prisma.category.findFirst({
    where: {
      id: +id,
      parentID: {
        not: null,
      },
    },
  });
  if (!category) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Cannot find category to delete or not category children'
    );
  }
  // check posts co khong
  const postOfCategory = await prisma.post.findFirst({
    where: {
      postCategory: {
        some: {
          categoryID: category.id,
        },
      },
    },
  });
  // dieu kien de xoa
  if (postOfCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Can't not delete category because category have posts "
    );
  }

  return prisma.category.delete({
    where: {
      id,
    },
  });
};

const getCateByType = async (type: CategoryType) => {
  return prisma.category.findMany({
    where: {
      type: type,
    },
  });
};

const getPublicCate = async () => {
  return prisma.category.findMany({
    where: {
      enable: true,
      level: '0',
    },
    include: {
      Category: {
        orderBy: {
          id: 'asc'
        }
      },

    },
    orderBy: {
      id: 'asc',
    },
  });
};
// get cac cate neu co cha thi them cha neu k co thi thoi
const getPublicCateChildParent = async () => {
  let categories =  await prisma.category.findMany({
    where: {
      enable: true,
      parentID: null
    },
  });
  let otherCategories = await prisma.category.findMany({
    where: {
      enable: true,
      parentID: {
        not: null
      }
    },
    include: {
      parent: true
    }
  })
  return [...categories,...otherCategories]
};
// 1 api tra 1 type vs full anh
// api tra full type

const getCate = async ()=>{
  return prisma.category.findMany({
    where: {
      level: '0',
    },
    include: {
      Category: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
}


const getAllCate = async () => {
  return prisma.category.findMany({
    include: {
      Category: true,
    },
  });
};

const getCategoryByID = async (id: number) => {
  return prisma.category.findFirst({
    where: {
      id: +id,
    },
    select: {
      id: true,
      name: true,
      level: true,
      isBlock: true,
      isMenu: true,
      enable: true,
      type: true,
      code: true,
      parent: {
        select: {
          id: true,
          name: true,
          level: true,
          isBlock: true,
          isMenu: true,
          enable: true,
          type: true,
          code: true,
        },
      },
      Category: {
        select: {
          id: true,
          name: true,
          level: true,
          isBlock: true,
          isMenu: true,
          enable: true,
          type: true,
          code: true,
        },
      },
    },
  });
};

const getCategoryByCode = async (code: string) => {
  return prisma.category.findFirst({
    where: {
      code: code,
    },
  });
};

const getCatsIdOfPost = async (postId: number) => {
  const postCat = await prisma.postCategory.findMany({
    where: {
      postID: postId,
    },
  });
  return postCat.map((cat) => cat.categoryID);
};

const findOneCategory = async (filter: Prisma.CategoryWhereInput) => {
  return prisma.category.findFirst({
    where: filter,

  });
};

const findParentCategory = async (filter: Prisma.CategoryWhereInput) => {
  return prisma.category.findFirst({
    where: filter,
    include: {
      Category: true
    }
  });
};
export {
  addCategoryLevelZero,
  addCategoryLevelOne,
  getCategoryChildByID,
  updateCategoryByID,
  getAllCategoriesFull,
  deleteCategoryByID,
  getAllCategoriesOfParentID,
  getCateByType,
  getCategoryByID,
  getPublicCate,
  getAllCate,
  getCategoryByCode,
  getAllPublicCategoriesOfParentID,
  getCatsIdOfPost,
  findOneCategory,
  getPublicCateChildParent,
  getCate,
  updateCategoryParentByID,
  findParentCategory
};
