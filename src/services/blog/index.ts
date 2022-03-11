import { BlogUpdate, BlogInput } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';
import httpStatus from 'http-status';
const prisma = new PrismaClient();

const createBlog = async (data: BlogInput) => {
  let dataAdd: Prisma.BlogCreateInput = {
    content: data.content,
    slug: data.slug,
    summary: data.summary,
    title: data.title,
  };

  dataAdd.User = {
    connect: { id: data.userId },
  };

  dataAdd.BlogCategory = {
    connect: { id: data.blogCategoryId },
  };

  dataAdd.image = {
    connect: { id: data.image.id },
  };
  return prisma.blog.create({
    data: dataAdd,
  });
};

const updateBlog = async (id: number, data: BlogUpdate) => {
  console.log('🚀 ~ file: index.ts ~ line 32 ~ updateBlog ~ data', data);
  const blog = await prisma.blog.findFirst({
    where: { id: +id },
    select: {
      blogCategoryId: true,
      imageId: true,
      userId: true,
    },
  });

  if (blog?.blogCategoryId) {
    await prisma.blog.update({
      where: { id: +id },
      data: {
        BlogCategory: { disconnect: true },
      },
    });
  }

  if (blog?.userId) {
    await prisma.blog.update({
      where: { id: +id },
      data: {
        User: { disconnect: true },
      },
    });
  }

  if (blog?.imageId) {
    await prisma.blog.update({
      where: { id: +id },
      data: {
        image: { disconnect: true },
      },
    });
  }

  let dataAdd: Prisma.BlogUpdateInput = {
    content: data.content,
    slug: data.slug,
    summary: data.summary,
    title: data.title,
  };

  dataAdd.User = {
    connect: { id: data.userId },
  };

  dataAdd.BlogCategory = {
    connect: { id: data.blogCategoryId },
  };

  dataAdd.image = {
    connect: { id: data.image.id },
  };
  return prisma.blog.update({
    where: {
      id: +id,
    },
    data: dataAdd,
  });
};

const checkImageAlreadyUse = async (imgId: number) => {
  const image = await prisma.image.findFirst({
    where: {
      id: imgId,
    },
    select: {
      Blog: {
        select: { id: true },
      },
    },
  });

  if (image) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Image already use');
  }
};

export { createBlog, updateBlog, checkImageAlreadyUse };
