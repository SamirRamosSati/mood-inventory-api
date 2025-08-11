import { Router } from "express";
import {
  createStockMovement,
  getStockMovements,
  deleteStockMovements,
  editStockMovement,
} from "../controllers/stockMovements.controller";

const router = Router();

router.post("/", createStockMovement);
router.get("/", getStockMovements);
router.delete("/:id", deleteStockMovements);
router.put("/:id", editStockMovement);

export default router;
