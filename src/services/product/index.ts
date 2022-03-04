import { ProductInput, ProductUpdate } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';

const prisma = new PrismaClient();

const createProduct = async (data: ProductInput) => {
  return prisma.product.create({
    data: {
      ...data,
    },
  });
};

const updateProduct = async (id: number, data: ProductUpdate) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: { ...data },
  });
};

export { createProduct, updateProduct };
