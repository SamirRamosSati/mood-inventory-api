import { Router } from "express";
import {
  createStockMovement,
  getStockMovements,
  deleteStockMovements,
  editStockMovement,
} from "../controllers/stockMovements.controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { checkPermission } from "../middleware/permission-middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("create_stock_movement"),
  createStockMovement
);

router.get(
  "/",
  authMiddleware,
  checkPermission("read_stock_movements"),
  getStockMovements
);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission("delete_stock_movement"),
  deleteStockMovements
);

router.put(
  "/:id",
  authMiddleware,
  checkPermission("update_stock_movement"),
  editStockMovement
);

export default router;
