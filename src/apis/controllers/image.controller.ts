import cloudinary from '../../services/cloudinary';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
import { register } from '../../services';
import ApiError from '../../utils/api-error';
import { Prisma, PrismaClient } from '@prisma/client';
import { signJWT } from '../../utils';
import env from '../../configs/env';
const prisma = new PrismaClient();
const index = catchAsync(async (req: Request, res: Response) => {
  const images = await prisma.image.findMany({});
  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;

  return res.status(httpStatus.OK).json({
    data: images.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
    totalCount: images.length,
    totalPage: Math.ceil(images.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
    // pageNo: Math.floor(skip / perPageNum) + 1,
  });
});

const uploads = catchAsync(async (req: Request, res: Response) => {
  const url = [];
  // @ts-ignore
  for (const file of req.files) {
    // @ts-ignore
    const up = await cloudinary.uploader.upload(file.path, (err, res) => {}, {
      use_filename: true,
      unique_filename: false,
      folder: 'samples',
    });
    url.push(up);
  }
  const format = url.map((p) => ({
    source: p.url,
  }));
  const images = await prisma.image.createMany({
    data: format,
  });
  if (!images) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Add images failed',
    });
  }
  return res.status(httpStatus.OK).json({
    success: true,
    message: 'Add iamges successfully',
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const image = await prisma.image.delete({
    where: { id: +req.params.id },
  });
  if (!image) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Delete image failed' });
  }
  return res.status(httpStatus.OK).json({
    message: 'delete image successfully',
    success: true,
  });
});

export { index, remove, uploads };
