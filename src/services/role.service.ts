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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A role with this name already exists.");
      }
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
  if (data.permissionsIds) {
    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });
    await prisma.rolePermission.createMany({
      data: data.permissionsIds.map((permissionId) => ({
        roleId: id,
        permissionId: permissionId,
      })),
    });
  }

  return await prisma.role.update({
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
};

export const deleteRole = async (id: string) => {
  await prisma.rolePermission.deleteMany({
    where: { roleId: id },
  });
  return await prisma.role.delete({
    where: { id },
  });
};
