// src/controllers/products.controller.ts

import { Request, Response } from "express";
import * as productService from "../services/products.service";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { vendorId, name, sku, description, locationId } = req.body;
    if (!name || !sku || !vendorId) {
      return res
        .status(400)
        .json({ error: "name, SKU, and vendorId are required" });
    }
    const newProduct = await productService.createProduct({
      name,
      sku,
      vendorId,
      description,
      locationId,
    });
    res.status(201).json(newProduct);
  } catch (error: any) {
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
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vendorId, name, sku, description, locationId } = req.body;
    if (!vendorId && !name && !sku && !description && !locationId) {
      return res
        .status(400)
        .json({ error: "At least one field must be provided for the update." });
    }
    const updatedProduct = await productService.editProduct(id, {
      vendorId,
      name,
      sku,
      description,
      locationId,
    });
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found." });
    } else if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A product with this SKU number already exists." });
    } else if (error.code === "P2003") {
      return res
        .status(400)
        .json({ error: "The provided vendorId or locationId does not exist." });
    }
    res.status(500).json({ error: "Failed to update the product." });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({ message: "The product was successfully deleted." });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(500).json({ error: "Failed to delete product." });
  }
};
