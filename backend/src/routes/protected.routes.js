import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/student",
  authenticate,
  authorize("STUDENT"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Student Dashboard",
      user: req.user,
    });
  }
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin Dashboard",
      user: req.user,
    });
  }
);

export default router;