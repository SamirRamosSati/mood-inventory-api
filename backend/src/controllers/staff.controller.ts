import { Request, Response } from "express";
import * as staffServices from "../services/staff.service";

export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, initials, role, email, password } = req.body;
    if (!name && !initials && !role && !email && !password) {
      return res.status(400).json({
        error: "name, initials, role, email and password are required",
      });
    }
    const newStaff = await staffServices.createStaff({
      name,
      initials,
      role,
      email,
      password,
    });
    res.status(200).json(newStaff);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A staff with this information already exists" });
    }
    res.status(500).json({ error: "Error creating the staff" });
  }
};

export const getStaff = async (req: Request, res: Response) => {
  try {
    const staff = await staffServices.getStaff();
    return res.status(200).json(staff);
  } catch {
    res.status(500).json({ error: "Failed to fetch the staff." });
  }
};

export const editStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, initials, role, email } = req.body;
    if (!name && !initials && !role && !email) {
      return res
        .status(400)
        .json({ error: "At least one field must be provided for the update." });
    }
    const updatedStaff = await staffServices.editStaff(id, {
      name,
      initials,
      role,
      email,
    });
    res.status(200).json(updatedStaff);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Staff not found." });
    } else if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A Staff with this initials or email already exists." });
    }
    res.status(500).json({ error: "Failed to update the Staff information." });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await staffServices.deleteStaff(id);
    res.status(200).json({ message: "The staff got deleted" });
  } catch (error: any) {
    console.error("Error deleting the staff:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "staff not found." });
    }
    res.status(500).json({ error: "Failed to delete the staff." });
  }
};
