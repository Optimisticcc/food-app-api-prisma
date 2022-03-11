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
import { getPermisionOfUser } from './userPer';

const prisma = new PrismaClient();

const register = async (userBody: RegisterInput) => {
  const { password } = userBody;
  const passwordHash = await hashPassword(password as string);

  let dataAdd: Prisma.UserCreateInput = {
    address: userBody.address,
    email: userBody.email,
    name: userBody.name,
    password: passwordHash,
    status: userBody.status,
    phoneNumber: userBody.phoneNumber,
  };

  if (userBody.avatar) {
    dataAdd.avatar = {
      connectOrCreate: {
        create: {
          source: userBody.avatar.source,
        },
        where: {
          id: userBody.avatar.id,
        },
      },
    };
  }

  return prisma.user.create({
    data: {
      ...dataAdd,
      // avatar: {
      //   connectOrCreate: {
      //     create: {
      //       source: userBody.avatar.soure
      //     },

      //   }
      // }
    },
  });
};

const getAllUser = async () => {
  const res = [];

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      email: true,
      avatar: true,
      status: true,
      address: true,
      // updatedAt: true,
      // createdAt: true,
      // orders: true,
      // blogs: true,
      // PermisionRelationship: true,
    },
  });
  for (const user of users) {
    const pers = await getPermisionOfUser(user.id);
    const permisionName: String[] = [];
    pers.forEach((role) => {
      permisionName.push(role.name);
    });
    if (
      permisionName &&
      permisionName.length > 0 &&
      !permisionName.includes('admin')
    ) {
      res.push({ ...user, pers: permisionName });
    }
  }
  return res;
};

// const editUserProfile = async (id: number, userBody: EditUserProfileInput) => {
//   console.log(
//     '🚀 ~ file: index.ts ~ line 46 ~ editUserProfile ~ userBody',
//     userBody
//   );

//   return prisma.user.update({
//     where: {
//       id,
//     },
//     data: userBody,
//   });
// };

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
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      avatar: true,
      status: true,
    },
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

const addUserByAdmin = async (userBody: AddUserInput) => {
  const passwordHash = await hashPassword(userBody.password as string);
  let userData: Prisma.UserCreateInput = {
    email: userBody.email as string,
    name: userBody.name as string,
    phoneNumber: userBody.phoneNumber as string,
    address: userBody.address as string,
    password: passwordHash,
  };

  userData.avatar = {
    connect: userBody.avatar.id,
  };

  return prisma.user.create({
    data: userData,
  });
};

// update user profile by self
const updateUser = async (id: number, args: EditUserProfileInput) => {
  await prisma.user.update({
    where: {
      id: +id,
    },
    data: {
      avatar: { disconnect: true },
    },
  });
  let dataUpdate: Prisma.UserUpdateInput = {
    email: args.email,
    name: args.name,
    phoneNumber: args.phoneNumber,
    address: args.address,
  };
  if (args.password) {
    const passwordHash = await hashPassword(args.password as string);
    dataUpdate.password = passwordHash;
  }

  if (args.avatar) {
    dataUpdate.avatar = {
      connectOrCreate: {
        create: {
          source: args.avatar.source,
        },
        where: {
          id: args.avatar.id,
        },
      },
    };
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: dataUpdate,
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
                },
              },
            },
          },
        },
      },
    },
  });
};

const updateUserByAdmin = async (id: number, data: UpdateUserInput) => {
  console.log(
    '🚀 ~ file: index.ts ~ line 232 ~ updateUserByAdmin ~ data',
    data
  );
  let dataUpdate: Prisma.UserUpdateInput = {
    email: data.email,
    name: data.name,
    phoneNumber: data.phoneNumber,
    address: data.address,
    status: data.status,
  };

  if (data.password) {
    const passwordHash = await hashPassword(data.password as string);
    dataUpdate.password = passwordHash;
  }
  if (data.avatar) {
    dataUpdate.avatar = {
      connectOrCreate: {
        create: {
          source: data.avatar.source,
        },
        where: {
          id: data.avatar.id,
        },
      },
    };
  }
  return prisma.user.update({
    where: {
      id: +id,
    },
    data: { ...dataUpdate },
  });
};

const deleteUserByAdmin = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};

// const checkImageUserAlreadyUse = async (id: number) => {
//   const image = await prisma.user.findFirst({
//     where: {},
//   });

//   if (image) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Image already use');
//   }
// };

export {
  isEmailOrPhoneNumberExists,
  getUserByID,
  softDeleteUser,
  updateUser,
  getOneUser,
  findManyUsers,
  register,
  getAllUser,
  updateUserByAdmin,
  deleteUserByAdmin,
};
