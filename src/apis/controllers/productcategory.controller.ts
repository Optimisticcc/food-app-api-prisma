import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils';
import ApiError from '../../utils/api-error';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const index = catchAsync(async (req: Request, res: Response) => {
  const productCategories = await prisma.$queryRaw`exec getAllProductCategory`;
  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;

  return res.status(httpStatus.OK).json({
    data: productCategories.slice(
      (pageNum - 1) * perPageNum,
      pageNum * perPageNum
    ),
    totalCount: productCategories.length,
    totalPage: Math.ceil(productCategories.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
    // pageNo: Math.floor(skip / perPageNum) + 1,
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
  await prisma.$queryRaw`exec createProductCategory ${name}, ${new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')}, ${new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')}`;
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
