import { Request, Response } from "express";
import * as locationService from "../services/location.service";

export const createLocation = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "Name is a required field and cannot be empty." });
    }
    const newLocation = await locationService.createLocation({
      name,
      description,
    });
    res.status(201).json(newLocation);
  } catch (error: any) {
    if (error && error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A location with this name already exists." });
    }
    res.status(500).json({ error: "Error creating the location" });
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await locationService.getLocations();
    res.status(200).json(locations);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch locations." });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await locationService.deleteLocation(id);
    res.status(200).json({ message: "The location was successfully deleted." });
  } catch (error: any) {
    if (error && error.code) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Location not found." });
        case "P2003":
          return res.status(400).json({
            error: "Cannot delete location with associated products.",
          });
        default:
          break;
      }
    }
    res.status(500).json({ error: "Failed to delete location." });
  }
};

export const editLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedData = { name, description };
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

    const updatedLocation = await locationService.editLocation(id, cleanedData);
    res.status(200).json(updatedLocation);
  } catch (error: any) {
    if (error && error.code) {
      switch (error.code) {
        case "P2025":
          return res.status(404).json({ error: "Location not found." });
        case "P2002":
          return res
            .status(409)
            .json({ error: "A location with this name already exists." });
        default:
          break;
      }
    }
    res.status(500).json({ error: "Failed to update location." });
  }
};
