import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    mileage: {
      type: Number,
      required: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      default: "Petrol",
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      default: "Manual",
    },

    description: {
      type: String,
      default: "",
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Multiple images for car
    images: [
      {
        type: String,
      },
    ],

    // Status -> published, sold, pending
    status: {
      type: String,
      enum: ["Available", "Sold", "Pending"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

export const Car = mongoose.model("Car", carSchema);
