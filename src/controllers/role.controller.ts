import { Request, Response } from "express";
import * as roleService from "../services/role.service";

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissionsIds } = req.body;
    if (
      !name ||
      name.trim() === "" ||
      !permissionsIds ||
      !Array.isArray(permissionsIds)
    ) {
      return res
        .status(400)
        .json({ error: "Role name and a list of permissions are required." });
    }
    const newRole = await roleService.createRole(
      name,
      permissionsIds,
      description
    );
    res.status(201).json(newRole);
  } catch (error: any) {
    if (error && error.code) {
      switch (error.code) {
        case "P2002":
          return res
            .status(409)
            .json({ error: "A role with this name already exists" });
        default:
          return res.status(500).json({ error: "Error creating the role" });
      }
    }
    return res.status(500).json({ error: "Error creating the role" });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleService.getRoles();
    res.status(200).json(roles);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch roles." });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    if (!role) {
      return res.status(404).json({ error: "Role not found." });
    }
    res.status(200).json(role);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch role." });
  }
};

export const editRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, permissionsIds } = req.body;

    const updatedData: { [key: string]: any } = {};
    if (name && name.trim() !== "") updatedData.name = name;
    if (description && description.trim() !== "")
      updatedData.description = description;
    if (permissionsIds) updatedData.permissionsIds = permissionsIds;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        error:
          "At least one field with a valid value must be provided for the update.",
      });
    }

    const updatedRole = await roleService.editRole(id, updatedData);
    res.status(200).json(updatedRole);
  } catch (error: any) {
    if (error && error.code) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Role not found." });
        case "P2002":
          return res
            .status(409)
            .json({ error: "A role with this name already exists." });
        default:
          return res.status(500).json({ error: "Failed to update the role." });
      }
    }
    return res.status(500).json({ error: "Failed to update the role." });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await roleService.deleteRole(id);
    res.status(200).json({ message: "The role was successfully deleted." });
  } catch (error: any) {
    if (error && error.code) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Role not found." });
        case "P2003":
          return res.status(400).json({
            error: "Cannot delete role. It is being used by one or more users.",
          });
        default:
          return res.status(500).json({ error: "Failed to delete role." });
      }
    }
    return res.status(500).json({ error: "Failed to delete role." });
  }
};
