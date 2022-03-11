import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
import ApiError from '../../utils/api-error';
import {
  checkImageAlreadyUse,
  checkImageAlreadyUseProduct,
  checkImageAlreadyUseWhenUpdate,
  connectImageToProduct,
  createProduct,
  disconnectImageToProduct,
  getImagesOfProduct,
  updateProduct,
} from '../../services';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const index = catchAsync(async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      ProductCategory: true,
    },
  });
  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;

  return res.status(httpStatus.OK).json({
    data: products.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
    totalCount: products.length,
    totalPage: Math.ceil(products.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
    // pageNo: Math.floor(skip / perPageNum) + 1,
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
  await checkImageAlreadyUseProduct(req.body.images);
  const product = await createProduct({
    ...req.body,
    code: removeVietnameseTonesStrikeThrough(req.body.name),
  });
  for (const img of req.body.images) {
    await connectImageToProduct(img, product.id);
  }
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
  await checkImageAlreadyUseWhenUpdate(req.body.images, +req.params.id);
  const imageOfProduct = await getImagesOfProduct(+req.params.id);
  for (const img of imageOfProduct) {
    await disconnectImageToProduct(img);
  }
  const product = await updateProduct(+req.params.id, {
    ...req.body,
    code: removeVietnameseTonesStrikeThrough(req.body.name),
  });

  for (const image of req.body.images) {
    await connectImageToProduct(image, product.id);
  }

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

// User: 0,
//     title: "",
//     summary: "",
//     content: "",
//     BlogCategory: 0,
//     image: 0,
const remove = catchAsync(async (req: Request, res: Response) => {
  const imageOfProduct = await getImagesOfProduct(+req.params.id);
  for (const img of imageOfProduct) {
    await disconnectImageToProduct(img);
  }
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
