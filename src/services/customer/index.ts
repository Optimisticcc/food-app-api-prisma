import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import {
  RegisterCustomerInput,
  UpdateCustomerInput,
  AddCustomerInput,
  EditCustomerProfileInput,
} from '../../interfaces/';
import { Prisma, PrismaClient } from '@prisma/client';
import { hashPassword } from '../../helpers';
import async from 'async';

const prisma = new PrismaClient();

const isEmailExist = async (email: string) => {
  const customer = await prisma.customer.findFirst({
    where: {
      email,
    },
  });
  if (customer) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Email or phone number already taken'
    );
  }
  return true;
};

const registerCustomer = async (customerBody: RegisterCustomerInput) => {
  const { password } = customerBody;
  const passwordHash = await hashPassword(password as string);
  let customerData: Prisma.CustomerCreateInput = {
    email: customerBody.email as string,
    name: customerBody.name as string,
    phoneNumber: customerBody.phoneNumber as string,
    password: passwordHash,
  };
  if (customerBody.dateOfBirth) {
    customerData.dateOfBirth = customerBody.dateOfBirth;
  }
  return prisma.customer.create({
    data: customerData,
  });
};
// update customer by self
const editCustomerProfile = async (
  id: number,
  args: EditCustomerProfileInput
) => {
  return prisma.customer.update({
    where: {
      id,
    },
    data: { ...args },
  });
};
// by admin
const updateCustomer = async (id: number, args: UpdateCustomerInput) => {
  return prisma.customer.update({
    where: {
      id,
    },
    data: { ...args },
  });
};
// by admin
const removeCustomer = async (id: number) => {
  return prisma.customer.delete({
    where: {
      id,
    },
  });
};
export {
  registerCustomer,
  isEmailExist,
  editCustomerProfile,
  updateCustomer,
  removeCustomer,
};
