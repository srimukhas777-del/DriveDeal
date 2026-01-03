import express from "express";
import { register, login, getProfile, updateProfile, getUserById } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get Profile (requires token)
router.get("/profile", authMiddleware, getProfile);

// Get user by ID
router.get("/user/:userId", getUserById);

// Update Profile (requires token)
router.put("/profile", authMiddleware, updateProfile);

export default router;
