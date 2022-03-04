import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import { Prisma, PrismaClient } from '@prisma/client';
import { orderBy } from 'lodash';
const prisma = new PrismaClient();

const findOneConfig = async (filter: Prisma.ConfigWhereInput) => {
  return prisma.config.findFirst({
    where: filter,
    include: {
      images: true,
    },
  });
};

const findConfigs = async (filter: Prisma.ConfigWhereInput) => {
  return prisma.config.findMany({
    where: filter,
    include: {
      images: {
        orderBy: {
          id: 'asc',
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });
};

const createConfig = async (config: Prisma.ConfigCreateInput) => {
  const configs = await prisma.config.findMany({
    where: {
      page: config.page,
      section: config.section,
    }
  })
  return prisma.config.create({
    data: {
      ...config,
      index: configs.length > 0? configs.length: 1
    },
  });
};
// sua update config
const updateConfig = async (
  where: Prisma.ConfigWhereUniqueInput,
  update: Prisma.ConfigUpdateInput
) => {
  return prisma.config.update({
    where: where,
    data: update,
    include: {
      images: {
        orderBy: {
          id: 'asc'
        }
      }
    }
  });
};

const deleteConfigs = async (configIds: number[]) => {
  return prisma.config.deleteMany({
    where: {
      id: {
        in: configIds,
      },
    },
  });
};


export {
  findOneConfig,
  findConfigs,
  createConfig,
  updateConfig,
  deleteConfigs,
};
