import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import { UserRegister } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const addUserRegisterSv = async (userRegisterData: UserRegister) => {
  return prisma.userRegister.create({
    data: userRegisterData,
  });
};

const getAllUserRegisterSv = async () => {
  return prisma.userRegister.findMany({});
};

const getUserRegisterByID = async (id: number) => {
  return prisma.userRegister.findFirst({
    where: {
      id: +id,
    },
  });
};

const deleteUserRegisterArr = async (arrId: string[]) => {
  const arrIdNumber = arrId.map((id) => +id);

  return prisma.userRegister.deleteMany({
    where: {
      id: {
        in: arrIdNumber,
      },
    },
  });
};

const filterUserRegister = async (filter: Prisma.UserRegisterWhereInput) => {
  return prisma.userRegister.findMany({
    where: filter,
    include: {
      UserCollaborator: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};


const getAllUserRegisterToExportExcel = async () => {
  return prisma.userRegister.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      interestedService: true,
      representer: true,
      content: true,
      dateOfBirth: true,
      address: true,
      UserCollaborator: {
        select: {
          name: true
        }
      }
    }
  });
};

export {
  addUserRegisterSv,
  getAllUserRegisterSv,
  getUserRegisterByID,
  deleteUserRegisterArr,
  filterUserRegister,
  getAllUserRegisterToExportExcel
};
