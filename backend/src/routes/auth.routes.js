import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registerValidation } from "../validations/auth.validation.js";
import { login } from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/register",
  registerValidation,
  register
);

router.post("/login", login);

export default router;