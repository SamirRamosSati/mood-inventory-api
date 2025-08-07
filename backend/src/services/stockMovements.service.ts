import { PrismaClient, MovementType } from "@prisma/client";

const prisma = new PrismaClient();

export const createStockMovement = async (data: {
  productId: string;
  type: MovementType;
  quantityChange: number;
  orderNumber?: string;
  staffId?: string;
  notes?: string;
}) => {
  const newMovement = await prisma.stockMovement.create({ data });

  let quantity = newMovement.quantityChange;

  if (newMovement.type === "DELIVERY" || newMovement.type === "PICKUP") {
    quantity = -quantity;
  }

  const updatedProduct = await prisma.product.update({
    where: { id: newMovement.productId },
    data: {
      currentStock: {
        increment: quantity,
      },
    },
  });

  return newMovement;
};
