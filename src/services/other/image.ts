import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createImage = async (image: Prisma.ImageCreateInput) => {
  return prisma.image.create({
    data: image,
  });
};

const updateImage = async ( id: number, updateData: Prisma.ImageUpdateInput) => {
  return prisma.image.update({
    where: {
      id
    },
    data: updateData
  })
}

export {createImage, updateImage};
