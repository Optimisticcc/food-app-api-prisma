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
  const settings = await prisma.setting.findMany({});
  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;

  return res.status(httpStatus.OK).json({
    data: settings.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
    totalCount: settings.length,
    totalPage: Math.ceil(settings.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
    // pageNo: Math.floor(skip / perPageNum) + 1,
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  const setting = await prisma.setting.findFirst({
    where: { id: +req.params.id },
  });

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
  const setting = await prisma.setting.create({
    data: {
      ...req.body,
    },
  });
  return res.status(httpStatus.OK).json({
    message: 'create setting successfully',
    success: true,
    data: setting,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { name, value, type } = req.body;
  const setting = await prisma.setting.update({
    where: { id: +req.params.id },
    data: { ...req.body },
  });
  return res.status(httpStatus.OK).json({
    message: 'update setting successfully',
    success: true,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const setting = await prisma.setting.delete({
    where: { id: +req.params.id },
  });
  return res.status(httpStatus.OK).json({
    message: 'delete setting successfully',
    success: true,
  });
});

const filterSetting = async (filter: Prisma.SettingWhereInput) => {
  return prisma.setting.findMany({
    where: filter,
  });
};

const filter = catchAsync(async (req: Request, res: Response) => {
  const setting = await filterSetting(req.body);
  return res.status(httpStatus.OK).json({
    message: 'get setting successfully',
    success: true,
    data: setting,
  });
});

export { index, create, update, remove, show, filter };
