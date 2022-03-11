import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
import ApiError from '../../utils/api-error';
import { updateBlog, createBlog, checkImageAlreadyUse } from '../../services';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const index = catchAsync(async (req: Request, res: Response) => {
  const blogs = await prisma.blog.findMany({
    include: {
      BlogCategory: true,
      User: true,
      image: true,
    },
  });
  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;

  return res.status(httpStatus.OK).json({
    data: blogs.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
    totalCount: blogs.length,
    totalPage: Math.ceil(blogs.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
    // pageNo: Math.floor(skip / perPageNum) + 1,
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  const blog = await prisma.blog.findFirst({
    where: {
      id: Number(req.params.id),
    },
    include: {
      BlogCategory: true,
      User: true,
      image: true,
    },
  });
  if (!blog) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get one blog failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'get one blog successfully',
    data: blog,
    success: true,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const blog = await createBlog({
    ...req.body,
    slug: removeVietnameseTonesStrikeThrough(req.body.title),
  });
  if (!blog) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'create blog failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'create blog successfully',
    success: true,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const blog = await updateBlog(+req.params.id, {
    ...req.body,
    slug: removeVietnameseTonesStrikeThrough(req.body.title),
  });
  if (!blog) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'update blog failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'update blog successfully',
    success: true,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const blogDisconnect = await prisma.blog.findFirst({
    where: { id: +req.params.id },
    select: {
      blogCategoryId: true,
      imageId: true,
      userId: true,
    },
  });

  if (blogDisconnect?.blogCategoryId) {
    await prisma.blog.update({
      where: { id: +req.params.id },
      data: {
        BlogCategory: { disconnect: true },
      },
    });
  }

  if (blogDisconnect?.userId) {
    await prisma.blog.update({
      where: { id: +req.params.id },
      data: {
        User: { disconnect: true },
      },
    });
  }
  const blog = await prisma.blog.delete({
    where: { id: +req.params.id },
  });
  if (!blog) {
  }
  return res.status(httpStatus.OK).json({
    message: 'delete blog category successfully',
    success: true,
  });
});

export { index, create, update, remove, show };
