import { Request, Response } from "express";
import { PrismaClient, MovementType } from "@prisma/client";
import * as stockMovementService from "../services/stockMovements.service";

const prisma = new PrismaClient();
const validMovementTypes = Object.values(MovementType);

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

export const getStockMovements = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let whereClause = {};

    if (type && validMovementTypes.includes(type as MovementType)) {
      whereClause = { type: type as MovementType };
    }

    const movements = await stockMovementService.getStockMovements(whereClause);
    res.status(200).json(movements);
  } catch (error: any) {
    console.error("Error fetching stock movements:", error);
    res.status(500).json({ error: "Failed to fetch stock movements." });
  }
};

export const deleteStockMovements = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await stockMovementService.deleteStockMovements(id);
    res.status(200).json({ message: "The movement got deleted" });
  } catch (error: any) {
    console.error("Error deleting the movement:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Movement not found." });
    }
    res.status(500).json({ error: "Failed to delete the movement." });
  }
};

export const editStockMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantityChange, orderNumber, notes, staffId } = req.body;

    if (!quantityChange && !orderNumber && !notes && !staffId) {
      return res
        .status(400)
        .json({ error: "At least one field must be provided for the update." });
    }
    const updatedStockMovement = await stockMovementService.editStockMovement(
      id,
      {
        quantityChange,
        orderNumber,
        notes,
        staffId,
      }
    );
    res.status(200).json(updatedStockMovement);
  } catch (error: any) {
    console.error("Error updating stock movement:", error);
    if (error.message === "Movement not found.") {
      return res.status(404).json({ error: "Movement not found." });
    }
    res.status(500).json({ error: "Failed to update stock movement." });
  }
};
