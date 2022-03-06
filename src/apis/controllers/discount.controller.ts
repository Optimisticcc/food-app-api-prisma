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
import { createDiscount, updateDiscount } from 'src/services/discount';
const prisma = new PrismaClient();

const index = catchAsync(async (req: Request, res: Response) => {
  const discounts = await prisma.discount.findMany({
    include: {
      Order: true,
    },
  });
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  // const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    message: 'get all discounts successfully',
    success: true,
    data: {
      data: discounts.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: discounts.length,
    },
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  const discount = await prisma.discount.findFirst({
    where: {
      id: Number(req.params.id),
    },
    include: {
      Order: true,
    },
  });
  if (!discount) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get one discount failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'get one discount successfully',
    data: discount,
    success: true,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const discount = await createDiscount({
    ...req.body,
  });
  if (!discount) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'create discount failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'create discount successfully',
    success: true,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const discount = await updateDiscount(+req.params.id, {
    ...req.body,
  });
  if (!discount) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'update discount failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'update discount successfully',
    success: true,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const discount = await prisma.discount.delete({
    where: { id: +req.params.id },
  });
  if (!discount) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'delete discount failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'delete discount successfully',
    success: true,
  });
});

export { index, create, update, remove, show };
