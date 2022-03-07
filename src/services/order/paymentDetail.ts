import { OrderInput } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
import ApiError from '../../utils/api-error';

const prisma = new PrismaClient();
// Order     Order?   @relation(fields: [orderId], references: [id], onUpdate: Cascade, onDelete: Cascade)
// orderId   Int?
// Product   Product? @relation(fields: [productId], references: [id], onUpdate: Cascade, onDelete: Cascade)
// productId Int?
//  quantity  Int
// const createOrderItem = async (orderItems: )
