import {
  Prisma,
  PrismaClient,
  User,
  Permision,
  PermisionRelationship,
} from '@prisma/client';
const prisma = new PrismaClient();

import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
const getPermisionOfUser = async (
  userID: number
): Promise<Permision[] | undefined> => {
  const userPer = await prisma.permisionRelationship.findMany({
    where: {
      userId: userID,
    },
  });
  const userPermision = userPer.filter((userper) => {
    if (userper.suspend === false) {
      return userper;
    }
  });
  let permisions;
  if (userPermision && userPermision.length > 0) {
    permisions = await prisma.permision.findMany({
      where: {
        id: {
          in: [...userPermision.map((per) => per.permisionId)],
        },
      },
      select: {
        name: true,
      },
    });
  }
  return permisions;
};

const getPermisionDetailOfUser = async (userID: number) => {
  const permisions = await getPermisionOfUser(userID);
  const permisionAndDetails = [];
  if (permisions && permisions.length > 0) {
    for (const per of permisions) {
      const perDetails = await prisma.permisionDetail.findMany({
        where: {
          permisionId: per.id,
        },
        select: {
          codeAction: true,
        },
      });
      for (const detail of perDetails) {
        permisionAndDetails.push(detail.codeAction);
      }
    }
  }
  return permisionAndDetails;
};

const createPermision = async (per: Prisma.PermisionCreateInput) => {
  return prisma.permision.create({
    data: per,
  });
};

const getPermisionById = async (id: number) => {
  return prisma.permision.findFirst({
    where: {
      id,
    },
  });
};

const addPermisionForUser = async (
  perUser: Prisma.PermisionRelationshipUncheckedCreateInput
) => {
  return prisma.permisionRelationship.create({
    data: {
      User: {
        connect: { id: +perUser.userId },
      },
      Permision: {
        connect: { id: +perUser.permisionId },
      },
    },
  });
};

const deletePermision = async (pers: number[]) => {
  return prisma.permision.deleteMany({
    where: {
      id: {
        in: pers,
      },
    },
  });
};

const deleteUserPermision = async (pers: number[]) => {
  return prisma.permisionRelationship.deleteMany({
    where: {
      permisionId: {
        in: pers,
      },
    },
  });
};

const deleteUserPermisionWithName = async (userId: number) => {
  const perRelation = await prisma.permisionRelationship.findFirst({
    where: {
      userId: +userId,
    },
  });
  if (perRelation) {
    console.log(
      '🚀 ~ file: userPer.ts ~ line 118 ~ deleteUserPermisionWithName ~ perRelation',
      perRelation
    );
    await prisma.permisionRelationship.delete({
      where: {
        id: perRelation.id,
      },
    });
  }
};

const findPermision = async (filter: Prisma.PermisionWhereInput) => {
  return prisma.permision.findMany({
    where: filter,
  });
};

const createPermisionDetail = async (
  data: Prisma.PermisionDetailCreateInput
) => {
  // @ts-ignore
  return prisma.permisionDetail.create({
    data,
  });
};

const updatePermisionDetail = async (
  idPermisionDetail: number,
  data: Prisma.PermisionDetailUpdateInput
) => {
  return prisma.permisionDetail.update({
    where: {
      id: +idPermisionDetail,
    },
    data,
  });
};

const findPers = async (filter: Prisma.PermisionWhereInput) => {
  return prisma.permision.findMany({
    where: filter,
  });
};

const addPerDetailForPer = async (idPer: number, idPerDetail: number) => {
  const perDetail = await prisma.permisionDetail.findFirst({
    where: {
      permisionId: +idPer,
      id: idPerDetail,
    },
  });

  if (perDetail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'permision detail already taken'
    );
  } else {
    return prisma.permision.update({
      where: {
        id: +idPer,
      },
      data: {
        permisionDetails: {
          connect: {
            id: +idPerDetail,
          },
        },
      },
    });
  }
};

const getPerDetailOfPer = async (idPer: number) => {
  return prisma.permisionDetail.findMany({
    where: {
      permisionId: +idPer,
    },
  });
};

const getAllPer = async () => {
  const pers = await prisma.permision.findMany({
    select: {
      name: true,
      id: true,
    },
  });
  return pers.map((per) => {
    return {
      name: per.name,
      id: per.id,
    };
  });
};
export {
  findPermision,
  deleteUserPermision,
  deletePermision,
  addPermisionForUser,
  getPermisionById,
  createPermision,
  getPermisionDetailOfUser,
  getPermisionOfUser,
  createPermisionDetail,
  updatePermisionDetail,
  findPers,
  getAllPer,
  addPerDetailForPer,
  getPerDetailOfPer,
  deleteUserPermisionWithName,
};
