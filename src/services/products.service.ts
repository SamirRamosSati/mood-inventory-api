import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (data: {
  vendorId: string;
  name: string;
  sku: string;
  description: string;
  locationId: string;
}) => {
  return await prisma.product.create({
    data,
  });
};

export const getProducts = async () => {
  return await prisma.product.findMany({
    include: {
      vendor: true,
      location: true,
    },
  });
};

export const editProduct = async (
  id: string,
  data: {
    vendorId?: string;
    name?: string;
    sku?: string;
    description?: string;
    locationId?: string;
  }
) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({
    where: { id },
  });
};
