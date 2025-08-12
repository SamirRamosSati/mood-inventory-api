import { Request, Response } from "express";
import * as staffServices from "../services/staff.service";
import { Prisma } from "@prisma/client";

export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, initials, role, email } = req.body;

    if (
      !name ||
      name.trim() === "" ||
      !initials ||
      initials.trim() === "" ||
      !role ||
      role.trim() === "" ||
      !email ||
      email.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    const newStaff = await staffServices.createStaff({
      name,
      initials,
      role,
      email,
    });
    return res.status(201).json(newStaff);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          error: "A staff member with this information already exists.",
        });
      }
    }
    return res.status(500).json({ error: "Error creating the staff member." });
  }
};

export const getStaff = async (req: Request, res: Response) => {
  try {
    const staff = await staffServices.getStaff();
    return res.status(200).json(staff);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch staff members." });
  }
};

export const editStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, initials, role, email } = req.body;

    const updatedData = { name, initials, role, email };

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

    const updatedStaff = await staffServices.editStaff(id, cleanedData);
    return res.status(200).json(updatedStaff);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Staff member not found." });
        case "P2002":
          return res.status(409).json({
            error: "A staff member with this initials or email already exists.",
          });
        default:
          return res
            .status(500)
            .json({ error: "Failed to update the staff member." });
      }
    }
    return res
      .status(500)
      .json({ error: "Failed to update the staff member." });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await staffServices.deleteStaff(id);
    return res
      .status(200)
      .json({ message: "The staff member was successfully deleted." });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Staff not found." });
      }
    }
    return res
      .status(500)
      .json({ error: "Failed to delete the staff member." });
  }
};
