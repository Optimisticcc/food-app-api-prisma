import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const addCatsForRole = async (roleId: number, cats: number[]) => {
  const data: Prisma.RoleCategoryCreateManyInput[] = cats.map((catId) => {
    return {
      categoryID: catId,
      roleID: roleId,
    };
  });
  return prisma.roleCategory.createMany({
    data,
  });
};

const getCatsOfRole = async (roleID: number) => {
  const catsRole = await prisma.roleCategory.findMany({
    where: {
      roleID,
    },
  });

  const cats = await prisma.category.findMany({
    where: {
      id: {
        in: [...catsRole.map((cats) => cats.categoryID)],
      },
    },
  });
  return cats;
};

const updateCatsOfRole = async (roleID: number, catIds: number[]) => {
  await deleteRoleCat(roleID);
  await addCatsForRole(roleID, catIds);
};

const deleteRoleCat = async (roleID: number) => {
  return prisma.roleCategory.deleteMany({
    where: {
      roleID,
    },
  });
};

const getCatsOfRoles = async (roleIDs: number[]) => {
  const catsRole = await prisma.roleCategory.findMany({
    where: {
      roleID: { in: roleIDs },
    },
  });

  const cats = await prisma.category.findMany({
    where: {
      id: {
        in: [...catsRole.map((cats) => cats.categoryID)],
      },
    },
  });
  return cats;
};

export {
  addCatsForRole,
  getCatsOfRole,
  updateCatsOfRole,
  deleteRoleCat,
  getCatsOfRoles,
};
