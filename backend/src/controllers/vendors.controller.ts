// src/controllers/vendors.controller.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, contactInfo } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Vendors name is required" });
    }
    const newVendor = await prisma.vendor.create({
      data: {
        name,
        contactInfo,
      },
    });
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
