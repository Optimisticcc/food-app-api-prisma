import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import { UserCollaborator } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const addUserCollaboratorSv = async (
  userCollaboratorData: UserCollaborator,
  length: number
) => {
  let idCTV = userCollaboratorData.idBranchWork;
  if (length === 0) {
    idCTV = idCTV + '-1';
  } else {
    idCTV = idCTV + '-' + length.toString();
  }

  return prisma.userCollaborator.create({
    data: {
      ...userCollaboratorData,
      idCollaborator: idCTV,
    },
  });
};

const   getOneCollaborator
  = async (email: string,phoneNumber: string) => {
  return prisma.userCollaborator.findFirst({
    where: {
      OR: [
        {email: email},
        {phoneNumber: phoneNumber}
      ]
    }
  })
}

const getAllUserCollaboratorSv = async () => {
  return prisma.userCollaborator.findMany({});
};

const getAllUserCollaboratorByBranchWork = async (idBranchWork: string) => {
  return prisma.userCollaborator.findMany({
    where: {
      idBranchWork: idBranchWork,
    },
  });
};

const getUserCollaboratorByID = async (id: number) => {
  return prisma.userCollaborator.findFirst({
    where: {
      id: +id,
    },
  });
};

const deleteUserCollaboratorArr = async (arrId: string[]) => {
  const arrIdNumber = arrId.map((id) => +id);
  return prisma.userCollaborator.deleteMany({
    where: {
      id: {
        in: arrIdNumber,
      },
    },
  });
};


const filterUserCollaborator = async (filter: Prisma.UserCollaboratorWhereInput)=>{
    return prisma.userCollaborator.findMany({
      where: filter,
      include:{
        users: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
}

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

const getAllUserCollaboratorToExportExcel = async () => {
  return prisma.userCollaborator.findMany({
    select: {
      id: true,
      idCollaborator: true,
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      addressWork: true,
      namePresenter: true,
      phonePresenter: true,
      idBranchWork: true,
    }
  },);
};

const getUserCollaboratorByIdCollaborator = async (id: string)=>{
  return prisma.userCollaborator.findFirst({
    where: {
      idCollaborator: id
    }
  })
}

const connectUserRegisterToUserCollaborator = async (idCollaborator: number,idUserRegister: number)=>{
  return prisma.userCollaborator.update({
    where: {
      id: +idCollaborator
    },
    data: {
      users: {
        connect: {
          id: +idUserRegister
        }
      }
    }
  })
}

export {
  addUserCollaboratorSv,
  getAllUserCollaboratorSv,
  getUserCollaboratorByID,
  deleteUserCollaboratorArr,
  getAllUserCollaboratorByBranchWork,
  getOneCollaborator,
  filterUserCollaborator,
  getAllUserCollaboratorToExportExcel,
  getUserCollaboratorByIdCollaborator,
  connectUserRegisterToUserCollaborator
};
