import { Router } from "express";
import { registerUser } from "./auth.controller";

const router = Router();

router.post("/", registerUser);

export default router;
