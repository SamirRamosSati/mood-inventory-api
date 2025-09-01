import { Router } from "express";
import {
  createLocation,
  getLocations,
  deleteLocation,
  editLocation,
} from "../controllers/location.controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { checkPermission } from "../middleware/permission-middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("create_location"),
  createLocation
);

router.get(
  "/",
  authMiddleware,
  checkPermission("read_locations"),
  getLocations
);

router.put(
  "/:id",
  authMiddleware,
  checkPermission("update_location"),
  editLocation
);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission("delete_location"),
  deleteLocation
);

export default router;
