import { Router } from "express";
import { getAllPermissions } from "../controllers/permission.controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { checkPermission } from "../middleware/permission-middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  checkPermission("read_permissions"),
  getAllPermissions
);

export default router;
