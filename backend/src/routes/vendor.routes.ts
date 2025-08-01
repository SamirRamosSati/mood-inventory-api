import { Router } from "express";
import { createVendor } from "../controllers/vendors.controller";

const router = Router();

router.post("/", createVendor);

export default router;
