import { PrismaClient, Staff } from "@prisma/client";

const prisma = new PrismaClient();

export const createStaff = async (data: {
  name: string;
  initials: string;
  role: string;
  email: string;
}) => {
  return await prisma.staff.create({ data });
};

export const getStaff = async () => {
  return await prisma.staff.findMany();
};

export const editStaff = async (id: string, data: Partial<Staff>) => {
  return await prisma.staff.update({
    where: { id },
    data,
  });
};

export const deleteStaff = async (id: string) => {
  return await prisma.staff.delete({
    where: { id },
  });
};
