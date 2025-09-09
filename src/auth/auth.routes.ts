import { Router } from "express";
import { registerUser, loginUser } from "./auth.controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { checkPermission } from "../middleware/permission-middleware";

const router = Router();

router.post(
  "/register",
  authMiddleware,
  checkPermission("create_user"),
  registerUser
);

router.post("/login", loginUser);

export default router;
