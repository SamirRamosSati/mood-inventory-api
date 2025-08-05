import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createLocation = async (data: {
  name: string;
  description?: string;
}) => {
  return await prisma.location.create({
    data,
  });
};

export const getLocations = async () => {
  return await prisma.location.findMany();
};

export const editLocation = async (
  id: string,
  data: { name?: string; description?: string }
) => {
  return await prisma.location.update({
    where: { id },
    data,
  });
};

export const deleteLocation = async (id: string) => {
  return await prisma.location.delete({
    where: { id },
  });
};
