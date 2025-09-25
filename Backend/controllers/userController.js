import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const userSignup = async (req, res) => {
  try {
    const { name, age, contact, email, password, confirmPassword, language } =
      req.body;

    if (!password || password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      age,
      contact,
      email,
      password,
      language,
    });
    const token = generateToken(user._id, "user");

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax", // ✅ Allow cross-origin in dev
      secure: false, // ✅ false for localhost
      path: "/", // ✅ send cookie for all routes
    });

    res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, "user");
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { path: "/" }); // ✅ clear cookie properly
  res.json({ message: "Logged out" });
};

export const getMe = (req, res) => {
  res.json({ user: req.user, role: req.userRole });
};
