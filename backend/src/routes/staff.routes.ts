import { Router } from "express";
import {
  createStaff,
  getStaff,
  editStaff,
  deleteStaff,
} from "../controllers/staff.controller";

const router = Router();

router.post("/", createStaff);
router.get("/", getStaff);
router.put("/:id", editStaff);
router.delete("/:id", deleteStaff);

export default router;
