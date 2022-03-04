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

  let userData: Prisma.UserCreateInput = {
    code: userBody.code as string,
    email: userBody.email as string,
    name: userBody.name as string,
    password: passwordHash,
    phoneNumber: userBody.phoneNumber as string,
  };

  if (userBody.orgID) {
    userData.organization = {
      connect: {
        id: +userBody.orgID,
      },
    };
  }
  return prisma.user.create({
    data: userData,
  });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      description: true,
      organization: {
        select: {
          name: true,
        },
      },
    },
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

const getUserByPhoneNumber = async (phoneNumber: string) => {
  return prisma.user.findFirst({
    where: {
      phoneNumber,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      organization: {
        select: {
          name: true,
        },
      },
    },
  });
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
      organization: {
        select: {
          name: true,
        },
      },
    },
  });
};

const updateVerifyUser = async (id: number) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: { isVerified: true },
  });
};

const verifyCreateUser = async (id: number, password: string) => {
  const passwordHash = await hashPassword(password);
  return prisma.user.update({
    where: {
      id,
    },
    data: { password: passwordHash, isVerified: true },
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
        in: ids
      }
    },
    data: {
      isDeleted: true,
    },
  });
};

const addUser = async (userBody: AddUserInput) => {
  let userData: Prisma.UserCreateInput = {
    code: userBody.code as string,
    email: userBody.email as string,
    name: userBody.name as string,
    phoneNumber: userBody.phoneNumber as string,
  };

  if (userBody.orgID) {
    userData.organization = {
      connect: {
        id: +userBody.orgID,
      },
    };
  }
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

//  user edit self profile
const editUserProfile = async (id: number, args: EditUserProfileInput) => {
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
      code: true,
      email: true,
      phoneNumber: true,
      name: true,
      address: true,
      description: true,
      isVerified: true,
      isDeleted: true,
      organization: {
        select: {
          code: true,
          name: true,
          level: true,
          enabled: true,
          description: true,
        },
      },
      userRoles: {
        include: {
          role: {
            select: {
              code: true,
              name: true
            },
          },
        },
      },
    },
  });
};

export {
  register,
  isEmailOrPhoneNumberExists,
  getUserByEmail,
  getUserByPhoneNumber,
  getUserByID,
  updateVerifyUser,
  resetPassword,
  softDeleteUser,
  addUser,
  updateUser,
  editUserProfile,
  getOneUser,
  verifyCreateUser,
  findManyUsers,
};
