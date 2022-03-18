import { ProductInput, ProductUpdate } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';
import httpStatus from 'http-status';
import { isEmpty } from 'lodash';
const prisma = new PrismaClient();

const createProduct = async (data: ProductInput) => {
  let dataAdd: Prisma.ProductCreateInput = {
    code: data.code,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    quantitySold: data.quantitySold,
    description: data.description || '',
    isActive: data.isActive ? true : false,
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
  const productFound = await prisma.product.update({
    where: {
      id,
    },
    data: {
      ProductCategory: {
        disconnect: true,
      },
    },
  });

  let dataAdd: Prisma.ProductUpdateInput = {
    code: data.code,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    quantitySold: data.quantitySold,
    description: data.description || '',
    isActive: data.isActive ? true : false,
  };

  return prisma.product.update({
    where: {
      id,
    },
    data: {
      ...dataAdd,
      ProductCategory: {
        connect: {
          id: data.productCategoryId || productFound.productCategoryId,
        },
      },
    },
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
//
const getAllProducts = async (query: any, cursor: any) => {
  // -id,
  // -quantitySold
  //price
  if (query && !isEmpty(query)) {
    if (query.ProductCategory && query.price) {
      return prisma.product.findMany({
        include: {
          ProductCategory: true,
          images: true,
        },
        where: {
          productCategoryId: +query.ProductCategory,
          price: {
            gte: +query.price['$gte'],
            lte: +query.price['$lte'],
          },
        },
      });
    } else if (query.ProductCategory) {
      return prisma.product.findMany({
        include: {
          ProductCategory: true,
          images: true,
        },
        where: {
          productCategoryId: +query.ProductCategory,
        },
      });
    } else {
      return prisma.product.findMany({
        include: {
          ProductCategory: true,
          images: true,
        },
        where: {
          price: {
            gte: +query.price['$gte'],
            lte: +query.price['$lte'],
          },
        },
      });
    }
  } else {
    return prisma.product.findMany({
      include: {
        ProductCategory: true,
        images: true,
      },
    });
  }
};

const getProductRelated = async (ProductCategory: number) => {
  return prisma.product.findMany({
    where: {
      ProductCategory: {
        id: +ProductCategory,
      },
    },
    include: {
      images: true,
      ProductCategory: true,
    },
  });
};
export {
  createProduct,
  updateProduct,
  connectImageToProduct,
  disconnectImageToProduct,
  checkImageAlreadyUseProduct,
  checkImageAlreadyUseWhenUpdate,
  getImagesOfProduct,
  getAllProducts,
  getProductRelated,
};
