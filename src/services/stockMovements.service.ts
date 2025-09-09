import { PrismaClient, Prisma } from "@prisma/client";
import { MovementType } from "../model/movementType";

const prisma = new PrismaClient();

export const createStockMovement = async (data: {
  productId: string;
  type: MovementType;
  quantityChange: number;
  orderNumber?: string;
  staffId?: string;
  notes?: string;
}) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const newMovement = await tx.stockMovement.create({ data });

    let quantity = newMovement.quantityChange;

    if (newMovement.type === "PICKUP") {
      quantity = -quantity;
    }

    const updatedProduct = await tx.product.update({
      where: { id: newMovement.productId },
      data: {
        currentStock: {
          increment: quantity,
        },
      },
    });

    return newMovement;
  });
};

export const getStockMovements = async (filters: any) => {
  return await prisma.stockMovement.findMany({
    where: filters,
    orderBy: {
      movementDate: "desc",
    },
    include: {
      product: true,
      staff: true,
    },
  });
};

export const deleteStockMovements = async (id: string) => {
  const movement = await prisma.stockMovement.findUnique({
    where: { id },
  });

  if (!movement) {
    throw new Error("Movement id not found");
  }

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const quantityToRevert = movement.quantityChange;
    let incrementValue = 0;

    if (movement.type === "PICKUP") {
      incrementValue = quantityToRevert;
    } else if (movement.type === "ARRIVAL" || movement.type === "DELIVERY") {
      incrementValue = -quantityToRevert;
    } else {
      throw new Error(`Unknown movement type: ${movement.type}`);
    }

    await tx.product.update({
      where: { id: movement.productId },
      data: {
        currentStock: {
          increment: incrementValue,
        },
      },
    });
    const deletedMovement = await tx.stockMovement.delete({
      where: { id },
    });
    return deletedMovement;
  });
};

export const editStockMovement = async (
  id: string,
  data: {
    quantityChange?: number;
    orderNumber?: string;
    notes?: string;
    staffId?: string;
  }
) => {
  const originalMovement = await prisma.stockMovement.findUnique({
    where: { id },
  });
  if (!originalMovement) {
    throw new Error("Movement not found");
  }

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (
      data.quantityChange !== undefined &&
      data.quantityChange !== originalMovement.quantityChange
    ) {
      const stockDifference =
        data.quantityChange - originalMovement.quantityChange;

      await tx.product.update({
        where: { id: originalMovement.productId },
        data: {
          currentStock: {
            increment: stockDifference,
          },
        },
      });
    }
    const updatedMovement = await tx.stockMovement.update({
      where: { id },
      data: { ...data },
    });
    return updatedMovement;
  });
};
