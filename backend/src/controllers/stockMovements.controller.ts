import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as stockMovementService from "../services/stockMovements.service";

const prisma = new PrismaClient();

export const createStockMovement = async (req: Request, res: Response) => {
  try {
    const { productId, type, quantityChange, orderNumber, staffId, notes } =
      req.body;
    if (!productId || !type || !quantityChange) {
      return res.status(400).json({
        error: "productId, type of movement and quantity are required",
      });
    }

    if (type === "DELIVERY" || type === "PICKUP") {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      if (product.currentStock < quantityChange) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
    }

    const newMovement = await stockMovementService.createStockMovement({
      productId,
      type,
      quantityChange,
      orderNumber,
      staffId,
      notes,
    });
    res.status(201).json(newMovement);
  } catch (error: any) {
    console.error("Error creating stock movement:", error);

    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid product or staff ID." });
    }

    res.status(500).json({ error: "Failed to create stock movement." });
  }
};
