import { Router } from "express";
import { createStockMovement } from "../controllers/stockMovements.controller";

const router = Router();

router.post("/", createStockMovement);

export default router;
