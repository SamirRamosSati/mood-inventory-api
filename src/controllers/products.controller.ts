import { Request, Response } from "express";
import * as productService from "../services/products.service";
import { Prisma } from "@prisma/client";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { vendorId, name, sku, description, locationId } = req.body;
    if (
      !vendorId ||
      vendorId.trim() === "" ||
      !name ||
      name.trim() === "" ||
      !sku ||
      sku.trim() === "" ||
      !locationId ||
      locationId.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "Required fields are missing or empty." });
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return res
            .status(409)
            .json({ error: "A product with this sku number already exists" });
        case "P2003":
          return res.status(400).json({ error: "This vendor does not exist." });
        default:
          return res.status(500).json({ error: "Error creating the product" });
      }
    }
    return res.status(500).json({ error: "Error creating the product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch products." });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vendorId, name, sku, description, locationId } = req.body;
    const updatedData: { [key: string]: string | undefined } = {
      vendorId,
      name,
      sku,
      description,
      locationId,
    };

    const cleanedData = Object.fromEntries(
      Object.entries(updatedData).filter(
        ([_, value]) => value && value.trim() !== ""
      )
    );

    if (Object.keys(cleanedData).length === 0) {
      return res.status(400).json({
        error:
          "At least one field with a valid value must be provided for the update.",
      });
    }
    const updatedProduct = await productService.editProduct(id, cleanedData);
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Product not found." });
        case "P2002":
          return res
            .status(409)
            .json({ error: "A product with this SKU number already exists." });
        case "P2003":
          return res
            .status(400)
            .json({
              error: "The provided vendorId or locationId does not exist.",
            });
        default:
          return res
            .status(500)
            .json({ error: "Failed to update the product." });
      }
    }
    return res.status(500).json({ error: "Failed to update the product." });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({ message: "The product was successfully deleted." });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Product not found." });
        default:
          return res.status(500).json({ error: "Failed to delete product." });
      }
    }
    return res.status(500).json({ error: "Failed to delete product." });
  }
};
