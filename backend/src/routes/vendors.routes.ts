import { Router } from "express";
import {
  createVendor,
  getVendors,
  editVendor,
  deleteVendor,
} from "../controllers/vendors.controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { checkPermission } from "../middleware/permission-middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("create_vendor"),
  createVendor
);

router.get("/", authMiddleware, checkPermission("read_vendors"), getVendors);

router.put(
  "/:id",
  authMiddleware,
  checkPermission("update_vendor"),
  editVendor
);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission("delete_vendor"),
  deleteVendor
);

export default router;
