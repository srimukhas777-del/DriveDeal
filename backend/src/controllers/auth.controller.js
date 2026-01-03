import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/token.util.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
    });

    // create JWT token
    const token = generateToken(user._id);

    return res.json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name,
        email,
        phone,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // match password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate JWT
    const token = generateToken(user._id);

    return res.json({
      message: "Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: user.toObject({ versionKey: false })
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      message: "User found",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
