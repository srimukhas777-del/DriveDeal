import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import carRoutes from "./routes/car.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import messageRoutes from "./routes/message.routes.js";
import "./config/cloudinary.js"; // Initialize Cloudinary

dotenv.config();

const app = express();

// Middlewaresy
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));





// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Car Marketplace Backend Running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
