import { Request, Response } from "express";
import * as vendorService from "../services/vendors.service";
import { Prisma } from "@prisma/client";

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, contactInfo } = req.body;
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "Vendors name is required and cannot be empty." });
    }
    const newVendor = await vendorService.createVendor({ name, contactInfo });
    res.status(201).json(newVendor);
  } catch (error: any) {
    console.error("Error creating a vendor:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return res
            .status(409)
            .json({ error: "A vendor with this name already exists" });
        default:
          return res.status(500).json({ error: "Error creating the vendor" });
      }
    }
    res.status(500).json({ error: "Error creating the vendor" });
  }
};

export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await vendorService.getVendors();
    res.status(200).json(vendors);
  } catch (error: any) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: "Failed to fetch vendors." });
  }
};

export const editVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, contactInfo } = req.body;
    const updatedData = { name, contactInfo };
    const cleanedData = Object.fromEntries(
      Object.entries(updatedData).filter(
        ([_, value]) => value && value.trim() !== ""
      )
    );
    if (Object.keys(cleanedData).length === 0) {
      return res
        .status(400)
        .json({
          error:
            "At least one field with a valid value must be provided for the update.",
        });
    }
    const updatedVendor = await vendorService.editVendor(id, cleanedData);
    res.status(200).json(updatedVendor);
  } catch (error: any) {
    console.error("Error updating vendor:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Vendor not found." });
        case "P2002":
          return res
            .status(409)
            .json({ error: "A vendor with this name already exists." });
        default:
          return res.status(500).json({ error: "Failed to update vendor." });
      }
    }
    res.status(500).json({ error: "Failed to update vendor." });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await vendorService.deleteVendor(id);
    res.status(200).json({ message: "The vendor got deleted" });
  } catch (error: any) {
    console.error("Error deleting vendor:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Vendor not found." });
        default:
          return res.status(500).json({ error: "Failed to delete vendor." });
      }
    }
    res.status(500).json({ error: "Failed to delete vendor." });
  }
};
