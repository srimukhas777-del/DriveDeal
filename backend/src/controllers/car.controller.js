import { Car } from "../models/car.model.js";
import { v2 as cloudinary } from "cloudinary";

// Add car
export const addCar = async (req, res) => {
  try {
    const { title, brand, model, year, price, mileage, fuelType, transmission, description } = req.body;

    // Handle images - convert to base64 or use placeholder
    const imageUrls = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
            // Use Cloudinary if configured
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                folder: 'car-marketplace/cars',
              }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
              });
              stream.end(file.buffer);
            });
            imageUrls.push(result.secure_url);
          } else {
            // Use base64 for local storage
            const base64 = file.buffer.toString('base64');
            const dataUrl = `data:${file.mimetype};base64,${base64}`;
            imageUrls.push(dataUrl);
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          // Fallback to base64
          const base64 = file.buffer.toString('base64');
          const dataUrl = `data:${file.mimetype};base64,${base64}`;
          imageUrls.push(dataUrl);
        }
      }
    } else {
      // If no files, add a single placeholder
      imageUrls.push('https://via.placeholder.com/600x400?text=' + encodeURIComponent(title || 'Car'));
    }

    const car = await Car.create({
      title,
      brand,
      model,
      year: parseInt(year),
      price: parseInt(price),
      mileage: parseInt(mileage),
      fuelType,
      transmission,
      description,
      images: imageUrls,
      seller: req.userId,
    });

    return res.json({
      message: "Car Added Successfully",
      car,
    });
  } catch (error) {
    console.error('addCar error:', error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all cars
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("seller", "name email phone");

    return res.json({
      cars,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id).populate("seller", "name email phone");

    if (!car) return res.status(404).json({ message: "Car not found" });

    return res.json({ car });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Update car
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, brand, model, year, price, mileage, fuelType, transmission, description, existingImages } = req.body;

    // Parse existing images if it's a string
    let imagesToKeep = [];
    if (existingImages) {
      imagesToKeep = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
    }

    // Handle new images
    const newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
            // Use Cloudinary if configured
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                folder: 'car-marketplace/cars',
              }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
              });
              stream.end(file.buffer);
            });
            newImageUrls.push(result.secure_url);
          } else {
            // Use base64 for local storage
            const base64 = file.buffer.toString('base64');
            const dataUrl = `data:${file.mimetype};base64,${base64}`;
            newImageUrls.push(dataUrl);
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          // Fallback to base64
          const base64 = file.buffer.toString('base64');
          const dataUrl = `data:${file.mimetype};base64,${base64}`;
          newImageUrls.push(dataUrl);
        }
      }
    }

    const allImages = [...imagesToKeep, ...newImageUrls];

    const car = await Car.findOneAndUpdate(
      { _id: id, seller: req.userId },
      {
        title,
        brand,
        model,
        year: parseInt(year),
        price: parseInt(price),
        mileage: parseInt(mileage),
        fuelType,
        transmission,
        description,
        images: allImages,
      },
      { new: true }
    );

    if (!car) return res.status(403).json({ message: "Unauthorized" });

    return res.json({
      message: "Car Updated",
      car,
    });
  } catch (error) {
    console.error('updateCar error:', error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete car
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findOneAndDelete({
      _id: id,
      seller: req.userId,
    });

    if (!car) return res.status(403).json({ message: "Unauthorized" });

    return res.json({
      message: "Car Deleted",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Cars by seller
export const getSellerCars = async (req, res) => {
  try {
    const cars = await Car.find({ seller: req.userId });

    return res.json({ cars });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
