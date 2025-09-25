import express from "express";
import {
  userSignup,
  userLogin,
  logout,
  getMe,
} from "../controllers/userController.js";
import { lawyerSignup, lawyerLogin } from "../controllers/lawyerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/signup/user", userSignup);
router.post("/login/user", userLogin);

// Lawyer routes
router.post("/signup/lawyer", lawyerSignup);
router.post("/login/lawyer", lawyerLogin);

// Protected / logout
router.post("/logout", protect(), logout);
router.get("/me", protect(), getMe);

export default router;
