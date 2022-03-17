import { DiscountInput, DiscountUpdate } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';

const prisma = new PrismaClient();

const createDiscount = async (data: DiscountInput) => {
  let dataAdd: Prisma.DiscountCreateInput = {
    code: data.code,
    discountPercent: data.discountPercent || 0,
    expirationDate: data.expirationDate,
    isActive: data.isActive,
  };
  return prisma.discount.create({
    data: dataAdd,
  });
};

const getDiscountDefault = async () => {
  return prisma.discount.findFirst({
    where: {
      code: 'ZERO',
    },
  });
};

const getDiscountByCode = async (code: string) => {
  return prisma.discount.findFirst({ where: { code } });
};

const updateDiscount = async (id: number, data: DiscountUpdate) => {
  let dataUpdate: Prisma.DiscountUpdateInput = {
    code: data.code,
    discountPercent: data.discountPercent,
    expirationDate: data.expirationDate,
    isActive: data.isActive
  };
  return prisma.discount.update({
    where: {
      id,
    },
    data: dataUpdate,
  });
};

export {
  createDiscount,
  updateDiscount,
  getDiscountByCode,
  getDiscountDefault,
};
