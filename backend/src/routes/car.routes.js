import express from "express";
import {
  addCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  getSellerCars,
} from "../controllers/car.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Add car (seller only)
router.post("/", authMiddleware, upload.array('images', 5), addCar);

// Get seller's cars (must be before /:id route)
router.get("/user/mine", authMiddleware, getSellerCars);

// Get all cars
router.get("/", getAllCars);

// Get car by ID
router.get("/:id", getCarById);

// Update car
router.put("/:id", authMiddleware, upload.array('images', 5), updateCar);

// Delete car
router.delete("/:id", authMiddleware, deleteCar);

export default router;
