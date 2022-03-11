import { OrderInput, OrderItemITF, OrderItems } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';

const prisma = new PrismaClient();
// Order     Order?   @relation(fields: [orderId], references: [id], onUpdate: Cascade, onDelete: Cascade)
// orderId   Int?
// Product   Product? @relation(fields: [productId], references: [id], onUpdate: Cascade, onDelete: Cascade)
// productId Int?
//  quantity  Int
// const createOrderItem = async (orderItems: )

const createOrderItem = async (orderId: number, arrProduct: OrderItems[]) => {
  const arrInput = arrProduct.map((item) => {
    return {
      orderId,
      productId: item.productId,
      quantity: item.quantity,
    };
  });
  return prisma.orderItem.createMany({
    data: arrInput,
  });
};

export { createOrderItem };
