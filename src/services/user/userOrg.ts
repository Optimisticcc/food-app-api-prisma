import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getOrg = async (filter: Prisma.OrganizationWhereInput) => {
  return prisma.organization.findMany({
    where: {
      ...filter,
    },
  });
};

const createOrg = async (org: Prisma.OrganizationCreateInput) => {
  return prisma.organization.create({
    data: org,
  });
};

const updateOrganization = async (
  id: number,
  orgInfo: Prisma.OrganizationUpdateInput
) => {
  return prisma.organization.update({
    where: {
      id,
    },
    data: orgInfo,
  });
};

const getUserOfOrganization = async (id: number) => {
  return prisma.organization.findFirst({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phoneNumber: true,
          name: true,
          description: true,
          address: true
        }
      }
    }
  });
};

export { getOrg, createOrg, updateOrganization, getUserOfOrganization };
