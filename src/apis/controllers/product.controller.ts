import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
import { orderBy } from 'lodash';
import ApiError from '../../utils/api-error';
import {
  checkImageAlreadyUse,
  checkImageAlreadyUseProduct,
  checkImageAlreadyUseWhenUpdate,
  connectImageToProduct,
  createProduct,
  disconnectImageToProduct,
  getAllProducts,
  getImagesOfProduct,
  getProductRelated,
  updateProduct,
} from '../../services';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const index = catchAsync(async (req: Request, res: Response) => {
  const products = await getAllProducts(
    req.querymen.query,
    req.querymen.cursor
  );

  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;
  let result = products.slice((pageNum - 1) * perPageNum, pageNum * perPageNum);
  let data;
  if (req.querymen.cursor.sort.hasOwnProperty('name')) {
    data = orderBy(
      result,
      ['name'],
      req.querymen.cursor.sort.name === 1 ? ['asc'] : ['desc']
    );
  } else if (req.querymen.cursor.sort.hasOwnProperty('price')) {
    data = orderBy(
      result,
      ['price'],
      req.querymen.cursor.sort.price === 1 ? ['asc'] : ['desc']
    );
  } else if (req.querymen.cursor.sort.hasOwnProperty('quantitySold')) {
    data = orderBy(result, ['quantitySold'], ['desc']);
  } else if (req.querymen.cursor.sort.hasOwnProperty('id')) {
    data = orderBy(result, ['id'], ['desc']);
  } else {
    data = orderBy(result, ['createdAt'], ['desc']);
  }
  return res.status(httpStatus.OK).json({
    data: data,
    totalCount: products.length,
    totalPage: Math.ceil(products.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
  });
});

const getAllProductByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const products = await getProductRelated(+req.body.ProductCategory);

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
  }
);

const show = catchAsync(async (req: Request, res: Response) => {
  // if (req.params.id)
  let reg = new RegExp('^[0-9]$');
  let product;
  if (reg.test(req.params.id)) {
    product = await prisma.product.findFirst({
      where: {
        id: Number(req.params.id),
      },
      include: {
        images: true,
        ProductCategory: true,
      },
    });
  } else {
    product = await prisma.product.findFirst({
      where: {
        code: req.params.id,
      },
      include: {
        images: true,
        ProductCategory: true,
      },
    });
  }

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
  const product = await prisma.product.update({
    where: { id: +req.params.id },
    data: {
      isActive: false,
    },
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

export { index, create, update, remove, show, getAllProductByCategory };
