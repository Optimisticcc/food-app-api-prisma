import { StatusPost, Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
  catchAsync,
} from '../../utils/';
import { UpdatePostInput } from '../../interfaces/post.interface';
import { validate, schemas, postSchema } from '../../validation';
import ApiError from '../../utils/api-error';
import {
  getAllPosts,
  getAllPublicPostsByCate,
  getAllPublicPostsSv,
  getCategoryByID,
  getAllPostsMostInterested,
  addPost,
  getPublicPostByID,
  getPostDetailOfPostPublic,
  getAllPostsByCate,
  getPostByID,
  getPostDetailOfPost,
  addPostDetailSv,
  addCategoriesToPost,
  updatePost,
  getPostDetailByID,
  updatePostDetailByID,
  checkCategoriesToAddPost,
  getAllPostByCode,
  getAllPublicPostByCode,
  getCatsIdOfPost,
  findOneCategory,
  getAllPublicPostsTags,
  searchByTagSv,
  searchByQuery,
  findAllPosts,
  checkPostExistByTitle,
  getPublicPostOrderByCreated,
  getPostFilter,
  getDetailPostByCodeOrder,
  updateView,
  getPostByPostDetailID,
  searchPostByQuery,
} from '../../services';
import requireRoleCat from '../../utils/checkRoleCat.utils';
import _ from 'lodash';

const getAllPostsPage = catchAsync(async (req: Request, res: Response) => {
  const posts = await findAllPosts({});
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get all posts successfully',
    data: {
      data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: posts.length,
    },
  });
});

const getPublicPostsByCategory = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.idSchema, req.params);
    const posts = await getAllPublicPostsByCate(
      req.params?.id as unknown as number
    );
    const { page, perPage } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const perPageNum = parseInt(perPage as string) || 20;
    const category = await getCategoryByID(req.params?.id as unknown as number);
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'get public posts by category successfully',
      data: {
        data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
        length: posts.length,
        category: category,
      },
    });
  }
);

const getPostsMostInterested = catchAsync(
  async (req: Request, res: Response) => {
    const { page, perPage } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const perPageNum = parseInt(perPage as string) || 20;
    const posts = await getAllPostsMostInterested();
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'get posts interested successfully',
      data: {
        data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
        length: posts.length,
      },
    });
  }
);

const createNewPost = catchAsync(async (req: Request, res: Response) => {
  await validate(postSchema.AddPostInputSchema, req.body);
  const userInfo = res.locals.userInfo;
  console.log('day la user info: ', userInfo);
  const userId = +userInfo.userId;
  await requireRoleCat(userInfo.userId, req.body.categories);
  const fileName = req?.file?.filename;
  const basePath = `/public/images/`;
  const image = `${basePath}${fileName}`;
  await checkCategoriesToAddPost(req.body.categories);
  const post = await checkPostExistByTitle(req.body.title);
  if (post) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Post already existed with title',
    });
  }
  console.log('userId', userId);
  const newPost = await addPost({
    ...req.body,
    image,
    removeVietnameseTitle: removeVietnameseTones(req.body.title),
    userId,
  });
  // const newPost = await addPost({ ...req.body, image, removeVietnameseTitle: removeVietnameseTones(req.body.title), publicAt, userId: userInfo.id })
  const addCategoryOfPost = await addCategoriesToPost(newPost.id, {
    ...req.body,
  });
  return res.status(httpStatus.CREATED).json({
    data: { post: newPost, success: true },
  });
});

const getAllPublicPosts = catchAsync(async (req: Request, res: Response) => {
  const posts = await getAllPublicPostsSv();
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get all posts public successfully',
    data: {
      data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: posts.length,
    },
  });
});

const getPublicPost = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idSchema, req.params);
  const post = await getPublicPostByID(req.params?.id as unknown as number);
  if (!post) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Post cannot found',
    });
  }
  const postDetails = await getPostDetailOfPostPublic(
    req.params?.id as unknown as number
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get post and post public details successfully',
    data: {
      post,
      postDetails,
    },
  });
});

const getPostsByCategory = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idSchema, req.params);
  const posts = await getAllPostsByCate(req.params?.id as unknown as number);
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  const category = await getCategoryByID(req.params?.id as unknown as number);
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get posts by category successfully',
    data: {
      data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: posts.length,
      category: category,
    },
  });
});

const uploadImageOfPost = catchAsync(async (req: Request, res: Response) => {
  const fileName = req?.file?.filename;
  const basePath = `/public/images/`;
  const image = `${basePath}${fileName}`;

  return res.status(httpStatus.CREATED).json({
    success: true,
    message: 'upload image successfully',
    data: {
      fileURL: image,
    },
  });
});

const getPost = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idSchema, req.params);
  const post = await getPostByID(req.params?.id as unknown as number);
  if (!post) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Cannot find post',
    });
  }
  const postDetails = await getPostDetailOfPost(
    req.params?.id as unknown as number
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get post and post details successfully',
    data: {
      post,
      postDetails,
    },
  });
});

const addPostDetail = catchAsync(async (req: Request, res: Response) => {
  await Promise.all([
    validate(postSchema.AddPostDetailSchema, req.body),
    validate(schemas.idSchema, req.params),
  ]);
  const userInfo = res.locals.userInfo;
  // get cate id of post
  const catIds = await getCatsIdOfPost(+req.params.id);
  await requireRoleCat(userInfo.userId, catIds);
  const postDetail = await addPostDetailSv({
    ...req.body,
    postId: req.params?.id as unknown as number,
    createdBy: +userInfo.userId,
  });
  return res.status(httpStatus.CREATED).json({
    success: true,
    message: 'add post details successfully',
    data: postDetail,
  });
});

const editPost = catchAsync(async (req: Request, res: Response) => {
  await Promise.all([
    validate(postSchema.UpdatePostInputSchema, req.body),
    validate(schemas.idSchema, req.params),
  ]);
  const userInfo = res.locals.userInfo;
  // get cate id of post
  const catIds = await getCatsIdOfPost(+req.params.id);
  await requireRoleCat(+userInfo.userId, catIds);

  let image = '';

  if (req.file !== undefined) {
    const fileName = req.file.filename;
    const basePath = `/public/images/`;
    image = `${basePath}${fileName}`;
  }
  if (req.body.categories) {
    await checkCategoriesToAddPost(req.body.categories);
  }
  const postCheck = await getPostByID(req.params?.id as unknown as number);
  if (!postCheck) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Post cannot found',
    });
  }
  let postData: UpdatePostInput = {
    ...req.body,
    image,
    updatedBy: userInfo.userId,
  };
  if (req.body.title) {
    const postTitle = await getPostFilter({ title: req.body.title });
    if (postTitle) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'title of post already existed',
      });
    }
    postData.removeVietnameseTitle = removeVietnameseTones(req.body.title);
  }

  const post = await updatePost(postCheck.id, postCheck.type, postData);
  await addCategoriesToPost(post.id, { ...req.body });
  return res.status(httpStatus.CREATED).json({
    success: true,
    message: 'update post successfully',
    data: post,
  });
});

const getPostDetail = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.idSchema, req.params);
  const postDetail = await getPostDetailByID(
    req.params?.id as unknown as number
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get post detail successfully',
    data: postDetail,
  });
});

const editPostDetail = catchAsync(async (req: Request, res: Response) => {
  await Promise.all([
    validate(postSchema.EditPostDetailSchema, req.body),
    validate(schemas.idSchema, req.params),
  ]);
  const userInfo = res.locals.userInfo;
  // get cate id of post
  // post detail id
  const post = await getPostByPostDetailID(req.params?.id as unknown as number);
  if (!post) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'not found',
    });
  }
  const catIds = await getCatsIdOfPost(post.id);
  await requireRoleCat(+userInfo.userId, catIds);

  const postDetail = await updatePostDetailByID(
    req.params?.id as unknown as number,
    { ...req.body, updatedBy: userInfo.userId }
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'Edit post detail successfully',
    data: postDetail,
  });
});

const getPostsByCode = catchAsync(async (req: Request, res: Response) => {
  await validate(postSchema.getPublicPostByCatCode, req.body);
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  const category = await findOneCategory({ code: req.body.code });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const posts = await getAllPostByCode(category?.id);
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get posts by category successfully',
    data: {
      data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: posts.length,
      category: category,
    },
  });
});

// code cua cat
const getPublicPostByCode = catchAsync(async (req: Request, res: Response) => {
  await validate(postSchema.getPublicPostByCatCode, req.body);
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 10;
  const category = await findOneCategory({ code: req.body.code });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const posts = await getAllPublicPostByCode(category?.id);
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get posts by category successfully',
    data: {
      data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: posts.length,
      category: category,
    },
  });
});

// search by admin ,search by tag
// search title trong cate con  id catecon , title can search

const getAllTags = catchAsync(async (req: Request, res: Response) => {
  const posts = await getAllPublicPostsTags();
  const arrTags = posts.map((post) => post.tags);
  const tags = _.union(...arrTags);
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get all tags successfully',
    data: tags,
  });
});

const searchByTag = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.searchByTag, req.body);
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  const posts = await searchByTagSv(
    removeVietnameseTonesStrikeThrough(req.body.tag)
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'get posts by tag successfully',
    data: {
      data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: posts.length,
    },
  });
});

const search = catchAsync(async (req: Request, res: Response) => {
  await validate(schemas.search, req.body);
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  const posts = await searchByQuery(
    removeVietnameseTones(req.body.q),
    +req.body.categoryId
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'search posts successfully',
    data: {
      data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: posts.length,
    },
  });
});

const getPublicPostsOrderByCreatedAt = catchAsync(
  async (req: Request, res: Response) => {
    const { page, perPage } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const perPageNum = parseInt(perPage as string) || 20;
    const posts = await getPublicPostOrderByCreated();
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'get public posts order by created successfully',
      data: {
        data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
        length: posts.length,
      },
    });
  }
);

const getPostDetailOfPostByCode = catchAsync(
  async (req: Request, res: Response) => {
    await validate(postSchema.getPostDetailByPostCode, req.body);
    // getPostFilter,
    //   getDetailPostByCodeOrder
    const post = await getPostFilter({ removeVietnameseTitle: req.body.code });
    await updateView({ removeVietnameseTitle: req.body.code });
    if (!post) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Post not found',
      });
    }
    const postDetail = await getDetailPostByCodeOrder(post.id);
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'get post detail of post successfully',
      data: {
        postDetail: postDetail,
        post: post,
      },
    });
  }
);

const getPostDetailOfPostById = catchAsync(
  async (req: Request, res: Response) => {
    await validate(postSchema.getPostDetailByPostId, req.body);
    // getPostFilter,
    //   getDetailPostByCodeOrder
    const post = await getPostFilter({ id: +req.body.id });
    await updateView({ id: +req.body.id });
    if (!post) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Post not found',
      });
    }
    const postDetail = await getDetailPostByCodeOrder(post.id);
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'get post detail of post successfully',
      data: {
        postDetail: postDetail,
        post: post,
      },
    });
  }
);

const searchPublicPostHandler = catchAsync(
  async (req: Request, res: Response) => {
    await validate(schemas.searchPublicPost, req.body);
    const { page, perPage } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const perPageNum = parseInt(perPage as string) || 20;
    const posts = await searchPostByQuery(removeVietnameseTones(req.body.q));
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'search posts successfully',
      data: {
        data: posts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
        length: posts.length,
      },
    });
  }
);

export {
  getPublicPostsByCategory,
  editPostDetail,
  editPost,
  getPostDetail,
  addPostDetail,
  getPost,
  uploadImageOfPost,
  getPostsByCategory,
  getPublicPost,
  getAllPublicPosts,
  getAllPostsPage,
  getPostsMostInterested,
  createNewPost,
  getPostsByCode,
  getPublicPostByCode,
  getAllTags,
  searchByTag,
  search,
  getPublicPostsOrderByCreatedAt,
  getPostDetailOfPostByCode,
  searchPublicPostHandler,
  getPostDetailOfPostById,
};
