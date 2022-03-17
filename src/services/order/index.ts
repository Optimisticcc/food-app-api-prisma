import { OrderInput } from '../../interfaces';
import { Prisma, PrismaClient, Discount } from '@prisma/client';
import ApiError from '../../utils/api-error';
import { getDiscountByCode, getDiscountDefault } from '../discount';
export * from './orderItem';
export * from './paymentDetail';
const prisma = new PrismaClient();

const filterOrder = async (filter: Prisma.OrderWhereInput) => {
  return prisma.order.findMany({
    where: filter,
    include: {
      Customer: true,
      orderItems: true,
      user: true,
      PaymentDetail: true,
      discount: true,
    },
  });
};

const findOrder = async (id: number) => {
  return prisma.order.findFirst({
    where: { id: +id },
    include: {
      Customer: true,
      orderItems: {
        include: {
          Product: true,
        },
      },
      user: true,
      PaymentDetail: true,
      discount: true,
    },
  });
};

const findOrderByID = async (orderId: number) => {
  return prisma.order.findFirst({
    where: { id: +orderId },
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
};

const createOrder = async (order: OrderInput) => {
  console.log('🚀 ~ file: index.ts ~ line 61 ~ createOrder ~ order', order);

  let totalFUll = order.total;
  let dataAdd: Prisma.OrderCreateInput = {
    address: order.address,
    email: order.email,
    phoneNumber: order.phoneNumber,
    note: order.note || '',
    orderStatus: order.orderStatus ? true : false,
  };
  if (order.customerId) {
    dataAdd.Customer = {
      connect: { id: +order.customerId },
    };
  }

  if (order.discountId) {
    const discount = await prisma.discount.findFirst({
      where: {
        id: order.discountId,
      },
    });
    console.log("🚀 ~ file: index.ts ~ line 83 ~ createOrder ~ discount", discount)
    if (discount) {
      totalFUll =
        discount.code !== 'ZERO' &&
        Number(discount.discountPercent) > 0 &&
        discount.isActive
          ? totalFUll -
            Math.round((totalFUll * Number(discount.discountPercent)) / 100)
          : totalFUll;
      dataAdd.discount = {
        connect: {
          id: discount.id,
        },
      };
    }
  }
  console.log(
    '🚀 ~ file: index.ts ~ line 113 ~ createOrder ~ totalFUll',
    totalFUll
  );
  if (order.userId) {
    dataAdd.user = {
      connect: { id: order.userId },
    };
  }
  return prisma.order.create({
    data: {
      ...dataAdd,
      total: totalFUll,
    },
  });
};

export { filterOrder, createOrder, findOrderByID, findOrder };
