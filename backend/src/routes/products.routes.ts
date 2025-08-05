import { Router } from "express";
import {
  createProduct,
  getProducts,
  editProduct,
  deleteProduct,
} from "../controllers/products.controller";

const router = Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", editProduct);
router.delete("/:id", deleteProduct);

export default router;
