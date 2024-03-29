import { PaymentUpSert, PaymentInput } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';

const prisma = new PrismaClient();

const createPaymentDetail = async (orderId: number, args: PaymentInput) => {
  return prisma.paymentDetail.create({
    data: {
      amount: args.amount || 0,
      paymentType: args.paymentType || 'cod',
      paymentStatus: args.paymentStatus ? true : false,
      orderId: orderId,
    },
  });
};

const updatePaymentOfOrder = async (orderId: number, args: PaymentUpSert) => {
  const payMent = await prisma.paymentDetail.findFirst({
    where: { orderId: +orderId },
  });
  if (payMent) {
    return prisma.paymentDetail.update({
      where: { id: payMent.id },
      data: {
        amount: args.amount || payMent?.amount,
        paymentType: args.paymentType || payMent?.paymentType,
        paymentStatus: args.paymentStatus ? true : false,
      },
    });
  } else {
    return prisma.paymentDetail.create({
      data: {
        amount: args.amount || 0,
        paymentType: args.paymentType || 'code',
        paymentStatus: args.paymentStatus,
        order: {
          connect: { id: +orderId },
        },
      },
    });
  }
};

const updatePayment = async (paymentId: number, args: PaymentUpSert) => {
  const payMent = await prisma.paymentDetail.findFirst({
    where: { id: +paymentId },
  });
  return prisma.paymentDetail.update({
    where: { id: +paymentId },
    data: {
      amount: args.amount || payMent?.amount,
      paymentType: args.paymentType || payMent?.paymentType,
      paymentStatus: args.paymentStatus || payMent?.paymentStatus,
    },
  });
};

const findFirstPaymentDetail = async (id: number) => {
  return prisma.paymentDetail.findFirst({
    where: { id: +id },
  });
};

export {
  updatePayment,
  createPaymentDetail,
  findFirstPaymentDetail,
  updatePaymentOfOrder,
};
