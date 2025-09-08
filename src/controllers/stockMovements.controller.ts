import { Request, Response } from "express";
import { PrismaClient, MovementType } from "@prisma/client";
import * as stockMovementService from "../services/stockMovements.service";

const prisma = new PrismaClient();
const validMovementTypes = Object.values(MovementType);

export const createStockMovement = async (req: Request, res: Response) => {
  try {
    const { productId, type, quantityChange, orderNumber, staffId, notes } =
      req.body;

    if (
      !productId ||
      productId.trim() === "" ||
      !type ||
      type.trim() === "" ||
      !quantityChange
    ) {
      return res.status(400).json({
        error:
          "productId, type of movement and quantity are required and cannot be empty.",
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
    if (error && error.code) {
      switch (error.code) {
        case "P2003":
          return res
            .status(400)
            .json({ error: "Invalid product or staff ID." });
        default:
          return res
            .status(500)
            .json({ error: "Failed to create stock movement." });
      }
    }
    return res.status(500).json({ error: "Failed to create stock movement." });
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
    return res.status(500).json({ error: "Failed to fetch stock movements." });
  }
};

export const deleteStockMovements = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await stockMovementService.deleteStockMovements(id);
    res.status(200).json({ message: "The movement got deleted" });
  } catch (error: any) {
    if (error && error.code) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Movement not found." });
        default:
          return res
            .status(500)
            .json({ error: "Failed to delete the movement." });
      }
    }
    return res.status(500).json({ error: "Failed to delete the movement." });
  }
};

export const editStockMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantityChange, orderNumber, notes, staffId } = req.body;

    const updatedData = { quantityChange, orderNumber, notes, staffId };

    const cleanedData = Object.fromEntries(
      Object.entries(updatedData).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    if (Object.keys(cleanedData).length === 0) {
      return res.status(400).json({
        error:
          "At least one field with a valid value must be provided for the update.",
      });
    }

    const updatedStockMovement = await stockMovementService.editStockMovement(
      id,
      cleanedData
    );
    res.status(200).json(updatedStockMovement);
  } catch (error: any) {
    if (error && error.code) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Movement not found." });
        default:
          return res
            .status(500)
            .json({ error: "Failed to update stock movement." });
      }
    }
    return res.status(500).json({ error: "Failed to update stock movement." });
  }
};
