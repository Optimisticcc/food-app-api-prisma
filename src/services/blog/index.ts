import { BlogUpdate, BlogInput } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';

const prisma = new PrismaClient();

const createBlog = async (data: BlogInput) => {
  return prisma.blog.create({
    data: {
      ...data,
    },
  });
};

const updateBlog = async (id: number, data: BlogUpdate) => {
  return prisma.blog.update({
    where: {
      id,
    },
    data: { ...data },
  });
};

export { createBlog, updateBlog };
