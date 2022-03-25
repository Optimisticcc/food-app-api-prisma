import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
  sendMail,
} from '../../utils/';
import ApiError from '../../utils/api-error';
import {
  createOrder,
  filterOrder,
  createOrderItem,
  findOrderByID,
  createPaymentDetail,
  findOrder,
  updatePayment,
  disconnectOrderItem,
  updateOrder,
  updatePaymentOfOrder,
} from '../../services';
import { Prisma, PrismaClient } from '@prisma/client';
import { getDiscountByCode } from '../../services';
import { request_momo } from '../../services/momo';
import pug from 'pug';

const prisma = new PrismaClient();
const index = catchAsync(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      Customer: true,
      orderItems: {
        include: {
          Product: {
            include: {
              images: true,
            },
          },
        },
      },
      user: true,
      PaymentDetail: true,
      discount: true,
    },
  });

  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;
  // const cats = await getAllCate()
  return res.status(httpStatus.OK).json({
    data: orders.slice((pageNum - 1) * perPageNum, pageNum * perPageNum),
    totalCount: orders.length,
    totalPage: Math.ceil(orders.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
  });
});
// const skip = (pageNum - 1) * perPageNum;
// const cats = await getAllCate()
// Total page tổng page
// Page size số data 1 page
// Page no là trang số mấy
// Limit là số data 1 trang
// Skip là bỏ qua bnh dữ liệu
const filterOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await filterOrder(req.body);
  const { pageNo, pageSize } = req.query;
  const pageNum = parseInt(pageNo as string) || 1;
  const perPageNum = parseInt(pageSize as string) || 10;
  let result = orders.slice((pageNum - 1) * perPageNum, pageNum * perPageNum);
  return res.status(httpStatus.OK).json({
    data: result,
    totalCount: orders.length,
    totalPage: Math.ceil(orders.length / perPageNum),
    pageSize: perPageNum,
    pageNo: pageNum,
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
      PaymentDetail: true,
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

const createByAdmin = catchAsync(async (req: Request, res: Response) => {
  try {
    let total = 0;

    if (req.body.items && req.body.items.length > 0) {
      console.log(
        '🚀 ~ file: order.controller.ts ~ line 109 ~ create ~ req.body.items',
        req.body.items,
        req.body.items.map((i: any) => +i.product)
      );
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: req.body.items.map((i: any) => +i.product),
          },
        },
        select: {
          code: true,
          id: true,
          quantity: true,
          price: true,
        },
      });
      if (products && products.length > 0) {
        let notice = '';

        let count = 0;

        for (const [index, item] of req.body.items.entries()) {
          const p = products.find((i) => i.id === item.product);

          if (!p) {
            count = count + 1;
            notice =
              notice + `Không tìm thấy sản phẩm có id bằng ${item.product}\n`;
          } else if (p.quantity < 1) {
            count = count + 1;
            notice = notice + `Sản phẩm có id bằng ${p.code} đã hết hàng\n`;
          } else if (p.quantity < item.quantity) {
            count = count + 1;
            notice =
              notice + `Sản phẩm có id bằng ${p.code} không đủ số lượng \n`;
          } else {
            req.body.items[index].product = p;
            total += Number(p.price) * item.quantity;
          }
        }
        if (count > 0) {
          return res.status(500).json({ message: notice });
        }
      } else {
        return res
          .status(500)
          .json({ message: 'Không tìm thấy sản phẩm nào phù hợp' });
      }
    }
    // req.body.items
    console.log(
      '🚀 ~ file: order.controller.ts ~ line 187 ~ createByAdmin ~ req.body',
      req.body.discountId
    );
    const order = await createOrder({
      ...req.body,

      total,
    });

    if (order) {
      await createPaymentDetail(order.id, {
        paymentStatus: req.body.paymentStatus,
        paymentType: req.body.paymentType,
        amount: Number(order.total),
      });
      await createOrderItem(order.id, req.body.items);
      await findOrderByID(order.id).then((ressult) => {
        return res.status(httpStatus.OK).json({ order: ressult });
      });
    }
  } catch (error: any) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      success: false,
    });
  }
});

const create = catchAsync(async (req: Request, res: Response) => {
  try {
    let total = 0;
    if (req.body.items && req.body.items.length > 0) {
      console.log(
        '🚀 ~ file: order.controller.ts ~ line 109 ~ create ~ req.body.items',
        req.body.items,
        req.body.items.map((i: any) => +i.product)
      );
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: req.body.items.map((i: any) => +i.product),
          },
        },
        select: {
          code: true,
          id: true,
          quantity: true,
          price: true,
        },
      });
      console.log(products, 'products');
      if (products && products.length > 0) {
        let notice = '';

        let count = 0;

        for (const [index, item] of req.body.items.entries()) {
          const p = products.find((i) => i.id === item.product);

          if (!p) {
            count = count + 1;
            notice =
              notice + `Không tìm thấy sản phẩm có id bằng ${item.product}\n`;
          } else if (p.quantity < 1) {
            count = count + 1;
            notice = notice + `Sản phẩm có id bằng ${p.code} đã hết hàng\n`;
          } else if (p.quantity < item.quantity) {
            count = count + 1;
            notice =
              notice + `Sản phẩm có id bằng ${p.code} không đủ số lượng \n`;
          } else {
            req.body.items[index].product = p;
            total += Number(p.price) * item.quantity;
          }
        }
        if (count > 0) {
          return res.status(500).json({ message: notice });
        }
      } else {
        return res
          .status(500)
          .json({ message: 'Không tìm thấy sản phẩm nào phù hợp' });
      }
    }
    // req.body.items
    const order = await createOrder({
      ...req.body,
      total,
    });
    const payment = await createPaymentDetail(order.id, {
      ...req.body,
      amount: Number(order.total),
    });
    await createOrderItem(order.id, req.body.items);
    await findOrderByID(order.id)
      .then(async (newData) => {
        let payUrl = '';
        if (req.body.paymentType === 'momo') {
          payUrl = await request_momo(newData);
          console.log(
            '🚀 ~ file: order.controller.ts ~ line 158 ~ .then ~ payUrl',
            payUrl
          );
        }
        return { newData, payUrl };
      })
      .then(async (result) => {
        const adminTitle = 'New order from Fast Food';
        // @ts-ignore
        await sendMail({
          to: result.newData?.email,
          subject: `New order from Vegelite [${result.newData.id}]`,
          message: pug.renderFile(`${__dirname}\\template.pug`, {
            title: adminTitle,
            order: result.newData,
            shopName: 'Vegelite',
          }),
        });
        if (result.payUrl) {
          // await updatePayment(payment.id,)
          await updatePayment(payment.id, {
            paymentStatus: true,
            paymentType: 'momo',
          });
        }

        return result;
      })
      .then((data) => {
        return res.status(httpStatus.OK).json({ data });
      })
      .catch((err: any) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (error: any) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      success: false,
    });
  }
});

const update = catchAsync(async (req: Request, res: Response) => {
  const order = await findOrder(+req.params.id);
  if (order) {
    let total = 0;
    if (req.body.items && req.body.items.length > 0) {
      console.log(
        '🚀 ~ file: order.controller.ts ~ line 109 ~ create ~ req.body.items',
        req.body.items,
        req.body.items.map((i: any) => +i.product)
      );
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: req.body.items.map((i: any) => +i.product),
          },
        },
        select: {
          code: true,
          id: true,
          quantity: true,
          price: true,
        },
      });
      console.log(products, 'products');
      if (products && products.length > 0) {
        let notice = '';

        let count = 0;

        for (const [index, item] of req.body.items.entries()) {
          const p = products.find((i) => i.id === item.product);

          if (!p) {
            count = count + 1;
            notice =
              notice + `Không tìm thấy sản phẩm có id bằng ${item.product}\n`;
          } else if (p.quantity < 1) {
            count = count + 1;
            notice = notice + `Sản phẩm có id bằng ${p.code} đã hết hàng\n`;
          } else if (p.quantity < item.quantity) {
            count = count + 1;
            notice =
              notice + `Sản phẩm có id bằng ${p.code} không đủ số lượng \n`;
          } else {
            req.body.items[index].product = p;
            total += Number(p.price) * item.quantity;
          }
        }
        if (count > 0) {
          return res.status(500).json({ message: notice });
        }
      } else {
        return res
          .status(500)
          .json({ message: 'Không tìm thấy sản phẩm nào phù hợp' });
      }
    }
    await disconnectOrderItem(order.id);
    await createOrderItem(order.id, req.body.items);
    const orderUpdate = await updateOrder(order.id, {
      ...req.body,
      total: total,
    });
    if (!orderUpdate) {
      return res.status(httpStatus.OK).json({
        message: 'update order failed order not found',
        success: true,
      });
    }
    const paymentDetail = await updatePaymentOfOrder(orderUpdate.id, {
      ...req.body,
      amount: Number(orderUpdate.total),
    });
    if (orderUpdate && paymentDetail) {
      return res.status(httpStatus.OK).json({
        message: 'update order successfully',
        success: true,
      });
    }
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'update order failed',
    success: false,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await prisma.orderItem.deleteMany({
    where: {
      orderId: +req.params.id,
    },
  });
  await prisma.paymentDetail.delete({
    where: {
      orderId: +req.params.id,
    },
  });
  const order = await prisma.order.delete({
    where: { id: +req.params.id },
  });
  if (!order) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'delete order failed',
      success: false,
    });
  }
  return res.status(httpStatus.OK).json({
    message: 'delete order successfully',
    success: true,
  });
});

const momo = catchAsync(async (req: Request, res: Response) => {
  try {
    console.log(
      '🚀 ~ file: order.controller.ts ~ line 239 ~ momo ~ req.body',
      req.body
    );
    const partnerCode = req.body.partnerCode;

    const orderId = req.body.orderId;
    const amount = req.body.amount;
    const orderInfo = req.body.orderInfo;
    const requestId = req.body.requestId;
    const extraData = req.body.extraData;
    const accessKey = process.env.ACCESS_KEY;
    const secretkey = process.env.SECRET_KEY;
    const message = req.body.message;
    const orderType = req.body.orderType;
    const resultCode = req.body.resultCode;
    const payType = req.body.payType;
    const transId = req.body.transId;
    const responseTime = req.body.responseTime;
    var signatureReceive = req.body.signature;
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    console.log(rawSignature, '----------');
    var signature = crypto
      .createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');
    console.log(rawSignature, signatureReceive, signature);
    if (signatureReceive !== signature) {
      return res.status(500).json({ err: 'Signature wrong' });
    }
    if (resultCode != 0) {
      return res.status(400).json({ err: 'The trans doesnt finish' });
    } else {
      await updatePayment(req.body.orderId, {
        paymentStatus: true,
        paymentType: 'momo',
      })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json(err));
    }
    return res.status(200).json({ data: req.body });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

export {
  index,
  show,
  create,
  filterOrders,
  momo,
  createByAdmin,
  remove,
  update,
};
