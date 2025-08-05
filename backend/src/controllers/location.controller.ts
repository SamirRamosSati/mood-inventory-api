import { Request, Response } from "express";
import * as locationService from "../services/location.service";

export const createLocation = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }
    const newLocation = await locationService.createLocation({
      name,
      description,
    });
    res.status(201).json(newLocation);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A location with this name already exist" });
    }
    res.status(500).json({ error: "Error creating the location" });
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await locationService.getLocations();
    res.status(200).json(locations);
  } catch {
    res.status(500).json({ error: "Failed to fetch locations." });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await locationService.deleteLocation(id);
    res.status(200).json({ message: "The location was successfully deleted." });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Location not found." });
    }
    if (error.code === "P2003") {
      return res
        .status(400)
        .json({ error: "Cannot delete location with associated products." });
    }
    res.status(500).json({ error: "Failed to delete location." });
  }
};

export const editLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name && !description) {
      return res
        .status(400)
        .json({ error: "At least one field must be provided for the update." });
    }
    const updatedLocation = await locationService.editLocation(id, {
      name,
      description,
    });

    res.status(200).json(updatedLocation);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Location not found." });
    }
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A location with this name already exists." });
    }
    res.status(500).json({ error: "Failed to update location." });
  }
};
