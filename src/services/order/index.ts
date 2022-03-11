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
      paymentDetail: true,
      discount: true,
    },
  });
};

const createOrder = async (order: OrderInput) => {
  let data: Prisma.OrderCreateInput = {
    address: order.address,
    email: order.email,
    phoneNumber: order.phoneNumber,
    note: order.note || '',
    total: order.total,
    orderStatus: order.orderStatus || false,
  };
  data.Customer = {
    connect: { id: order.customerId },
  };

  let codeDiscount;
  if (order.code) {
    codeDiscount = (await getDiscountByCode(order.code)) as Discount;
  } else {
    codeDiscount = (await getDiscountDefault()) as Discount;
  }

  data.discount = {
    connect: { id: codeDiscount.id },
  };

  if (order.userId) {
    data.user = {
      connect: { id: order.userId },
    };
  }
  return prisma.order.create({
    data,
  });
};

export { filterOrder, createOrder };
