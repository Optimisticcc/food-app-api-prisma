import { DiscountInput, DiscountUpdate } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';

const prisma = new PrismaClient();

const createDiscount = async (data: DiscountInput) => {
  return prisma.discount.create({
    data: {
      ...data,
    },
  });
};

const updateDiscount = async (id: number, data: DiscountUpdate) => {
  return prisma.discount.update({
    where: {
      id,
    },
    data: { ...data },
  });
};

export { createDiscount, updateDiscount };
