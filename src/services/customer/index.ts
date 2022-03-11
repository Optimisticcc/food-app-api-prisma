import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import {
  RegisterCustomerInput,
  UpdateCustomerInput,
  AddCustomerInput,
  EditCustomerProfileInput,
} from '../../interfaces/';
import { Customer, Prisma, PrismaClient } from '@prisma/client';
import { hashPassword } from '../../helpers';
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
  console.log(
    '🚀 ~ file: index.ts ~ line 29 ~ registerCustomer ~ customerBody',
    customerBody
  );
  const { password } = customerBody;
  const passwordHash = await hashPassword(password as string);
  let customerData: Prisma.CustomerCreateInput = {
    email: customerBody.email as string,
    name: customerBody.name as string,
    phoneNumber: customerBody.phoneNumber as string,
    password: passwordHash,
    address: customerBody.address as string,
  };
  if (customerBody.dateOfBirth) {
    customerData.dateOfBirth = customerBody.dateOfBirth;
  }
  return prisma.customer.create({
    data: customerData,
  });
};
// update customer by self
const changePassword = async (id: number, password: string) => {
  const passwordHash = await hashPassword(password as string);
  let dataUpdate: Prisma.CustomerUpdateInput = {
    password: passwordHash,
  };
  return prisma.customer.update({
    where: { id: +id },
    data: dataUpdate,
  });
};

const editCustomerProfile = async (
  id: number,
  args: EditCustomerProfileInput,
  user: Customer
) => {
  let dataUpdate: Prisma.CustomerUpdateInput = {
    address: args.address ? args.address : user.address,
    email: args.email ? args.email : user.email,
    name: args.name ? args.name : user.name,
    phoneNumber: args.phoneNumber ? args.phoneNumber : user.phoneNumber,
    dateOfBirth: args.dateOfBirth ? args.dateOfBirth : user.dateOfBirth,
  };

  if (args.password) {
    const { password } = args;
    const passwordHash = await hashPassword(password as string);
    dataUpdate.password = passwordHash;
  }
 
  return prisma.customer.update({
    where: {
      id,
    },
    data: dataUpdate,
  });
};
// by admin

const updateCustomer = async (id: number, args: UpdateCustomerInput) => {
  const { password } = args;
  const passwordHash = await hashPassword(password as string);
  let dataUpdate: Prisma.CustomerUpdateInput = {
    address: args.address,
    email: args.email,
    dateOfBirth: args.dateOfBirth,
    name: args.name,
    password: passwordHash,
    phoneNumber: args.phoneNumber,
    status: args.status,
  };
  return prisma.customer.update({
    where: { id: +id },
    data: dataUpdate,
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

const getCustomerByEmail = async (email: string) => {
  return prisma.customer.findFirst({
    where: {
      email,
    },
  });
};
export {
  registerCustomer,
  isEmailExist,
  editCustomerProfile,
  updateCustomer,
  removeCustomer,
  getCustomerByEmail,
  changePassword,
};
