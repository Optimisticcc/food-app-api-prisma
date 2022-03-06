import { BlogUpdate, BlogInput } from '../../interfaces';
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

export { filterOrder };
