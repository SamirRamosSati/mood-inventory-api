// src/controllers/products.controller.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { vendorId, name, sku, description, locationId } = req.body;
    if (!name || !sku || !vendorId) {
      return res
        .status(400)
        .json({ error: "name, SKU, and vendorId are required" });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        sku,
        vendorId,
        description,
        locationId,
      },
    });
    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error("Error creating the Product", error);

    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A product with this sku number already exists" });
    } else if (error.code === "P2003") {
      return res.status(400).json({ error: "This vendor does not exist." });
    }
    res.status(500).json({ error: "Error creating the product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        vendor: true,
        location: true,
      },
    });
    res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
};
