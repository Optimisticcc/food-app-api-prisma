import { Prisma, PrismaClient, User, Role, UserRole } from '@prisma/client';
const prisma = new PrismaClient();

const getRolesOfUser = async (userID: number): Promise<Role[]> => {
  const userRole = await prisma.userRole.findMany({
    where: {
      userID: userID,
    },
  });

  const roles = await prisma.role.findMany({
    where: {
      id: {
        in: [...userRole.map((role) => role.roleID)],
      },
    },
  });
  return roles;
};

const createRole = async (role: Prisma.RoleCreateInput) => {
  return prisma.role.create({
    data: role,
  });
};

const getRoleById = async (id: number) => {
  return prisma.role.findFirst({
    where: {
      id,
    },
  });
};

const addRoleForUser = async (
  roleUser: Prisma.UserRoleUncheckedCreateInput
) => {
  return prisma.userRole.create({
    data: {
      user: {
        connect: { id: +roleUser.userID },
      },
      role: {
        connect: { id: +roleUser.roleID },
      },
    },
  });
};

const deleteRoles = async (roles: number[]) => {
  return prisma.role.deleteMany({
    where: {
      id: {
        in: roles,
      },
    },
  });
};

const deleteUserRole = async (roles: number[]) => {
  return prisma.userRole.deleteMany({
    where: {
      roleID: {
        in: roles
      }
    }
  })
}

const findRoles = async (filter: Prisma.RoleWhereInput) => {
  return prisma.role.findMany({
    where: filter,
  });
};

export {
  getRolesOfUser,
  createRole,
  getRoleById,
  addRoleForUser,
  deleteRoles,
  findRoles,
  deleteUserRole
};
