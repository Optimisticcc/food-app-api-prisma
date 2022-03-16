import { OrderInput } from '../../interfaces';
import { Prisma, PrismaClient, Discount } from '@prisma/client';
import ApiError from '../../utils/api-error';
import { getDiscountByCode, getDiscountDefault } from '../discount';
export * from './orderItem';
export * from './paymentDetail';
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

const findOrder = async (id: number) => {
  return prisma.order.findFirst({
    where: { id: +id },
    include: {
      Customer: true,
      orderItems: {
        include: {
          Product: true,
        },
      },
      user: true,
      paymentDetail: true,
      discount: true,
    },
  });
};

const findOrderByID = async (orderId: number) => {
  return prisma.order.findFirst({
    where: { id: +orderId },
    include: {
      Customer: true,
      orderItems: {
        include: {
          Product: {
            include: {
              images: true,
            },
          },
        },
      },
      user: true,
      paymentDetail: true,
      discount: true,
    },
  });
};

const createOrder = async (order: OrderInput) => {
  console.log("Order ",order)
  let dataAdd: Prisma.OrderCreateInput = {
    address: order.address,
    email: order.email,
    phoneNumber: order.phoneNumber,
    note: order.note || '',
    total: order.total,
    orderStatus: order.orderStatus || false,
  };
  // dataAdd.Customer = {
  //   connect: { id: +order.customerId },
  // };
  // console.log('AAAAAAAAAAAAAA')
  // if (order.discountId) {
  //   dataAdd.discount = {
  //     connect: { id: +order.discountId },
  //   };
  // } else {
  //   const codeDiscount = (await getDiscountDefault()) as Discount;
  //   dataAdd.discount = {
  //     connect: { id: +codeDiscount.id },
  //   };
  // }

 

  // if (order.userId) {
  //   dataAdd.user = {
  //     connect: { id: order.userId },
  //   };
  // }
  console.log('🚀 ~ file: index.ts ~ line 92 ~ createOrder ~ data', dataAdd);
  const oderCreate = await prisma.order.create({
    data: dataAdd
  });
  console.log('🚀 ~ file: index.ts ~ line 95 ~ createOrder ~ data', oderCreate);
  return oderCreate
};

export { filterOrder, createOrder, findOrderByID, findOrder };
