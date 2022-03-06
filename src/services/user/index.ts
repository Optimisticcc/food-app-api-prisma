import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import {
  RegisterInput,
  UpdateUserInput,
  AddUserInput,
  EditUserProfileInput,
} from '../../interfaces/user.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { hashPassword } from '../../helpers';

const prisma = new PrismaClient();

const register = async (userBody: RegisterInput) => {
  const { password } = userBody;
  const passwordHash = await hashPassword(password as string);

  return prisma.user.create({
    data: {
      ...userBody,
      password: passwordHash,
    },
  });
};

const editUserProfile = async (id: number, userBody: EditUserProfileInput) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: userBody,
  });
};

const isEmailOrPhoneNumberExists = async (
  email: string,
  phoneNumber: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
    select: {
      name: true,
    },
  });
  if (user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Email or phone number already taken'
    );
    return true;
  }
};

const getUserByID = async (id: number) => {
  return prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      avatar: true,
      status: true,
    },
  });
};

const resetPassword = async (id: number, passwordNew: string) => {
  const passwordHash = await hashPassword(passwordNew);
  console.log(passwordNew);
  return prisma.user.update({
    where: {
      id: +id,
    },
    data: { password: passwordHash },
  });
};

const softDeleteUser = async (ids: number[]) => {
  return prisma.user.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status: false,
    },
  });
};

const addUser = async (userBody: AddUserInput) => {
  const passwordHash = await hashPassword(userBody.password as string);
  let userData: Prisma.UserCreateInput = {
    email: userBody.email as string,
    name: userBody.name as string,
    phoneNumber: userBody.phoneNumber as string,
    address: userBody.address as string,
    password: passwordHash,
    avatar: (userBody.avatar as string) || '',
  };

  return prisma.user.create({
    data: userData,
  });
};

// update user profile by admin
const updateUser = async (id: number, args: UpdateUserInput) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      ...args,
    },
  });
};

const getOneUser = async (filter: Prisma.UserWhereInput) => {
  return prisma.user.findFirst({
    where: filter,
  });
};

const findManyUsers = async (filter: Prisma.UserWhereInput) => {
  return prisma.user.findMany({
    where: filter,
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      name: true,
      address: true,
      status: true,
      PermisionRelationship: {
        include: {
          Permision: {
            include: {
              permisionDetails: {
                select: {
                  codeAction: true,
                  nameAction: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export {
  isEmailOrPhoneNumberExists,
  getUserByID,
  resetPassword,
  softDeleteUser,
  addUser,
  updateUser,
  getOneUser,
  findManyUsers,
  editUserProfile,
  register,
};
