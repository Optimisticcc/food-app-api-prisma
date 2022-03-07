import { OrderInput } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';

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
    note: order.note,
    total: order.total,
    orderStatus: order.orderStatus,
  };
  data.Customer = {
    connect: { id: order.customerId },
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

export { filterOrder };
