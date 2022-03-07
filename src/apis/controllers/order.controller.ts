import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
import ApiError from '../../utils/api-error';
import { filterOrder } from '../../services';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const index = catchAsync(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      Customer: true,
      orderItems: true,
      user: true,
      paymentDetail: true,
      discount: true,
    },
  });

  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  // const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    message: 'get all orders successfully',
    success: true,
    data: {
      data: orders.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: orders.length,
    },
  });
});

const filterOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await filterOrder(req.body);
  const { page, perPage } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const perPageNum = parseInt(perPage as string) || 20;
  // const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    message: 'get all orders successfully',
    success: true,
    data: {
      data: orders.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
      length: orders.length,
    },
  });
});

const show = catchAsync(async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: {
      id: Number(req.params.id),
    },
    include: {
      Customer: true,
      orderItems: true,
      user: true,
      paymentDetail: true,
      discount: true,
    },
  });
  if (!order) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Get one orders failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'get one orders successfully',
    data: order,
    success: true,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  if (req.body.items && req.body.items.length > 0) {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: req.body.items.map((i: any) => i.sanpham.id),
        },
      },
    });
    if (products && products.length > 0) {
      let notice = '';
      let count = 0;
      for (const [index, item] of req.body.items.entries()) {
        const p = products.find((i) => i.id === item.sanpham.id);
        if (!p) {
          count = count + 1;
          notice =
            notice +
            `Không tìm thấy sản phẩm có id bằng ${item.sanpham.code}\n`;
        } else if (p.quantity < 1) {
          count = count + 1;
          notice = notice + `Sản phẩm có id bằng ${p.code} đã hết hàng\n`;
        } else if (p.quantity < item.quantity) {
          count = count + 1;
          notice =
            notice + `Sản phẩm có id bằng ${p.code} không đủ số lượng \n`;
        } else {
          req.body.items[index].sanpham = p;
        }
      }
      if (count > 0) {
        return res.status(500).json({ message: notice });
      } else {
        return res
          .status(500)
          .json({ message: 'Không tìm thấy sản phẩm nào phù hợp' });
      }
    }
  }
  // const product = await createProduct({
  //   ...req.body,
  //   slug: removeVietnameseTonesStrikeThrough(req.body.name),
  // });
  // if (!product) {
  //   return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
  //     message: 'create product failed',
  //     success: false,
  //   });
  // }
  // return res.status(httpStatus.OK).json({
  //   message: 'create product successfully',
  //   success: true,
  // });
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
