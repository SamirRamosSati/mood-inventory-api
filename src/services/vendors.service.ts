import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createVendor = async (data: {
  name: string;
  contactInfo: string;
}) => {
  return await prisma.vendor.create({
    data,
  });
};

export const getVendors = async () => {
  return await prisma.vendor.findMany();
};

export const editVendor = async (
  id: string,
  data: { name?: string; contactInfo?: string }
) => {
  return await prisma.vendor.update({
    where: { id },
    data,
  });
};

export const deleteVendor = async (id: string) => {
  return await prisma.vendor.delete({
    where: { id },
  });
};
