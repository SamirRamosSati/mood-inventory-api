import { Router } from "express";
import {
  createVendor,
  getVendors,
  editVendor,
  deleteVendor,
} from "../controllers/vendors.controller";

const router = Router();

router.post("/", createVendor);
router.get("/", getVendors);
router.put("/:id", editVendor);
router.delete("/:id", deleteVendor);

export default router;
