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
  const settings = await prisma.$queryRaw`exec getAllSetting`;
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  // const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    message: 'get all settings successfully',
    success: true,
    data: {
      data: settings.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: settings.length,
    },
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  const setting = await prisma.$queryRaw`exec getOneSetting ${Number(
    req.params.id
  )}`;

  if (!setting) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get one setting failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'get one setting successfully',
    data: setting,
    success: true,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const { name, value, type } = req.body;
  await prisma.$queryRaw`exec createSetting ${name},${type},${value}`;
  return res.status(httpStatus.OK).json({
    message: 'create blog category successfully',
    success: true,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { name, value, type } = req.body;
  await prisma.$queryRaw`exec updateSetting ${Number(
    req.params.id
  )},${name},${type},${value}`;
  return res.status(httpStatus.OK).json({
    message: 'update setting successfully',
    success: true,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await prisma.$queryRaw`exec deleteSetting ${Number(req.params.id)}`;
  return res.status(httpStatus.OK).json({
    message: 'delete setting successfully',
    success: true,
  });
});

export { index, create, update, remove, show };
