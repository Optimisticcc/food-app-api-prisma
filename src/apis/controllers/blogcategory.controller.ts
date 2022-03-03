import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
import ApiError from '../../utils/api-error';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const index = catchAsync(async (req: Request, res: Response) => {
  const blogCategories = await prisma.$queryRaw`exec getAllBlogCategory`;
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  // const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    message: 'get all list blog categories successfully',
    success: true,
    data: {
      data: blogCategories.slice(
        (pageNum - 1) * perPageNum,
        pageNum * perPageNum
      ),
      length: blogCategories.length,
    },
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  let blogCategory;
  if (Number(req.params.id)) {
    blogCategory = await prisma.$queryRaw`exec getOneBlogCategory ${Number(
      req.params.id
    )}`;
  }
  if (!blogCategory) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get one blog category failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'get one blog category successfully',
    data: blogCategory,
    success: true,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  await prisma.$queryRaw`exec createBlogCategory ${name}`;
  return res.status(httpStatus.OK).json({
    message: 'create blog category successfully',
    success: true,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  await prisma.$queryRaw`exec updateBlogCategory ${Number(
    req.params.id
  )},${name}`;
  return res.status(httpStatus.OK).json({
    message: 'update blog category successfully',
    success: true,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await prisma.$queryRaw`exec deleteBlogCategory ${Number(req.params.id)}`;
  return res.status(httpStatus.OK).json({
    message: 'delete blog category successfully',
    success: true,
  });
});

export { index, create, update, remove, show };
