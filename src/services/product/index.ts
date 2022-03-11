import { ProductInput, ProductUpdate } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';
import httpStatus from 'http-status';

const prisma = new PrismaClient();

const createProduct = async (data: ProductInput) => {
  let dataAdd: Prisma.ProductCreateInput = {
    code: data.code,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    quantitySold: data.quantitySold,
    description: data.description || '',
  };

  dataAdd.ProductCategory = {
    connect: {
      id: data.productCategoryId,
    },
  };
  return prisma.product.create({
    data: dataAdd,
  });
};

const updateProduct = async (id: number, data: ProductUpdate) => {
  let dataAdd: Prisma.ProductUpdateInput = {
    code: data.code,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    quantitySold: data.quantitySold,
    description: data.description || '',
  };

  return prisma.product.update({
    where: {
      id,
    },
    data: dataAdd,
  });
};

const connectImageToProduct = async (imgId: number, productId: number) => {
  return prisma.image.update({
    where: {
      id: +imgId,
    },
    data: {
      Product: {
        connect: { id: productId },
      },
      isPicked: true,
    },
  });
};

const getImagesOfProduct = async (productId: number) => {
  const images = await prisma.image.findMany({
    where: {
      productId: +productId,
    },
    select: { id: true },
  });
  const result = images.map((item) => {
    return item.id;
  });
  return result;
};

const disconnectImageToProduct = async (imgId: number) => {
  return prisma.image.update({
    where: {
      id: +imgId,
    },
    data: {
      Product: {
        disconnect: true,
      },
      isPicked: false,
    },
  });
};

const checkImageAlreadyUseProduct = async (arrImg: number[]) => {
  const images = await prisma.image.findMany({
    where: {
      id: {
        in: arrImg,
      },
    },
    select: {
      isPicked: true,
    },
  });
  for (const img of images) {
    if (img.isPicked) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Image already use');
    }
  }
};

const checkImageAlreadyUseWhenUpdate = async (
  arrImg: number[],
  productId: number
) => {
  const images = await prisma.image.findMany({
    where: {
      id: {
        in: arrImg,
      },
      NOT: {
        productId: +productId,
      },
    },
    select: {
      isPicked: true,
    },
  });
  if (images && images.length > 0) {
    for (const img of images) {
      if (img.isPicked) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Image already use');
      }
    }
  }
};

export {
  createProduct,
  updateProduct,
  connectImageToProduct,
  disconnectImageToProduct,
  checkImageAlreadyUseProduct,
  checkImageAlreadyUseWhenUpdate,
  getImagesOfProduct,
};
