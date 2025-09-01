import { Router } from "express";
import {
  createRole,
  getRoles,
  getRoleById,
  editRole,
  deleteRole,
} from "../controllers/role.controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { checkPermission } from "../middleware/permission-middleware";

const router = Router();

router.post("/", authMiddleware, checkPermission("create_role"), createRole);

router.get("/", authMiddleware, checkPermission("read_roles"), getRoles);

router.get("/:id", authMiddleware, checkPermission("read_roles"), getRoleById);

router.put("/:id", authMiddleware, checkPermission("update_role"), editRole);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission("delete_role"),
  deleteRole
);

export default router;
