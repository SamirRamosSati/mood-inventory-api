import { Router } from "express";
import {
  createLocation,
  getLocations,
  deleteLocation,
  editLocation,
} from "../controllers/location.controller";

const router = Router();

router.post("/", createLocation);
router.get("/", getLocations);
router.delete("/:id", deleteLocation);
router.put("/:id", editLocation);

export default router;
