import { Router } from "express";
import {
  createProduct,
  getProducts,
  editProduct,
  deleteProduct,
} from "../controllers/products.controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { checkPermission } from "../middleware/permission-middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  checkPermission("create_product"),
  createProduct
);

router.get("/", authMiddleware, checkPermission("read_products"), getProducts);

router.put(
  "/:id",
  authMiddleware,
  checkPermission("update_product"),
  editProduct
);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission("delete_product"),
  deleteProduct
);

export default router;
