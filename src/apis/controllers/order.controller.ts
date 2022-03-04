import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
import ApiError from '../../utils/api-error';
import { createProduct, updateProduct } from '../../services';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const index = catchAsync(async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      ProductCategory: true,
    },
  });
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  // const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    message: 'get all products successfully',
    success: true,
    data: {
      data: products.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: products.length,
    },
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  const product = await prisma.product.findFirst({
    where: {
      id: Number(req.params.id),
    },
    include: {
      images: true,
      ProductCategory: true,
    },
  });
  if (!product) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get one product failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'get one product successfully',
    data: product,
    success: true,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const product = await createProduct({
    ...req.body,
    slug: removeVietnameseTonesStrikeThrough(req.body.name),
  });
  if (!product) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'create product failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'create product successfully',
    success: true,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const product = await updateProduct(+req.params.id, {
    ...req.body,
    slug: removeVietnameseTonesStrikeThrough(req.body.name),
  });
  if (!product) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'update product failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'update product successfully',
    success: true,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const product = await prisma.product.delete({
    where: { id: +req.params.id },
  });
  if (!product) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'delete product failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'delete product category successfully',
    success: true,
  });
});

export { index, create, update, remove, show };
