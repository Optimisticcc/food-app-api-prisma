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
  const productCategories = await prisma.$queryRaw`exec getAllProductCategory`;
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  // const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    message: 'get all product categories successfully',
    success: true,
    data: {
      data: productCategories.slice(
        (pageNum - 1) * perPageNum,
        pageNum * perPageNum
      ),
      length: productCategories.length,
    },
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  const productCategory =
    await prisma.$queryRaw`exec getOneProductCategory ${Number(req.params.id)}`;

  if (!productCategory) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get one product category failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'get one product category successfully',
    data: productCategory,
    success: true,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  await prisma.$queryRaw`exec createProductCategory ${name}`;
  return res.status(httpStatus.OK).json({
    message: 'create product category successfully',
    success: true,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  await prisma.$queryRaw`exec updateProductCategory ${Number(
    req.params.id
  )},${name}`;
  return res.status(httpStatus.OK).json({
    message: 'update product category successfully',
    success: true,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await prisma.$queryRaw`exec deleteProductCategory ${Number(req.params.id)}`;
  return res.status(httpStatus.OK).json({
    message: 'delete blog category successfully',
    success: true,
  });
});

export { index, create, update, remove, show };
