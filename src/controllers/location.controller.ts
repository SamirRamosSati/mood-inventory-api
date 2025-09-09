import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createRole = async (
  name: string,
  permissionsIds: string[],
  description?: string
) => {
  try {
    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create: permissionsIds.map((permissionId) => ({
            permission: {
              connect: { id: permissionId },
            },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return role;
  } catch (error: any) {
    if (error && error.code === "P2002") {
      throw new Error("A role with this name already exists.");
    }
    throw new Error("Failed to create role.");
  }
};

export const getRoles = async () => {
  return await prisma.role.findMany({
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          initials: true,
        },
      },
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
};

export const getRoleById = async (id: string) => {
  return await prisma.role.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          initials: true,
        },
      },
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
};

export const editRole = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    permissionsIds?: string[];
  }
) => {
  try {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (data.permissionsIds) {
        await tx.rolePermission.deleteMany({
          where: { roleId: id },
        });

        await tx.rolePermission.createMany({
          data: data.permissionsIds.map((permissionId) => ({
            roleId: id,
            permissionId: permissionId,
          })),
        });
      }

      return await tx.role.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    });
  } catch (error) {
    throw new Error("Failed to edit role.");
  }
};

export const deleteRole = async (id: string) => {
  try {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.rolePermission.deleteMany({
        where: { roleId: id },
      });

      return await tx.role.delete({
        where: { id },
      });
    });
  } catch (error) {
    throw new Error("Failed to delete role.");
  }
};
