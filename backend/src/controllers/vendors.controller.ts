// src/controllers/vendors.controller.ts

import { Request, Response } from "express";
import * as vendorService from "../services/vendors.service";

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, contactInfo } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Vendors name is required" });
    }
    const newVendor = await vendorService.createVendor({ name, contactInfo });
    res.status(201).json(newVendor);
  } catch (error: any) {
    console.error("Error creating a vendor:", error);
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A vendor with this name already exists" });
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
    if (!name && !contactInfo) {
      return res
        .status(400)
        .json({ error: "Provide a new name or contact info" });
    }
    const updatedVendor = await vendorService.editVendor(id, {
      name,
      contactInfo,
    });
    res.status(200).json(updatedVendor);
  } catch (error: any) {
    console.error("Error updating vendor:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Vendor not found." });
    }
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A vendor with this name already exists." });
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
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Vendor not found." });
    }
    res.status(500).json({ error: "Failed to delete vendor." });
  }
};
