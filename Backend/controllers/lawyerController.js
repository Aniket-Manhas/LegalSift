import Lawyer from "../models/Lawyer.js";
import { generateToken } from "../utils/jwt.js";

export const lawyerSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      licenseNumber,
      specialization,
      experience,
      barCouncilAssociation,
      password,
      confirmPassword,
      language,
    } = req.body;
    if (!password || password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });
    if (await Lawyer.findOne({ email }))
      return res.status(400).json({ message: "Lawyer already exists" });

    const lawyer = await Lawyer.create({
      name,
      email,
      contact,
      licenseNumber,
      specialization,
      experience,
      barCouncilAssociation,
      password,
      language,
    });
    const token = generateToken(lawyer._id, "lawyer");
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({
        message: "Lawyer registered",
        lawyer: {
          id: lawyer._id,
          name: lawyer.name,
          email: lawyer.email,
          isVerified: lawyer.isVerified,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

export const lawyerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lawyer = await Lawyer.findOne({ email });
    if (!lawyer)
      return res.status(400).json({ message: "Invalid credentials" });
    const match = await lawyer.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(lawyer._id, "lawyer");
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful",
      lawyer: {
        id: lawyer._id,
        name: lawyer.name,
        email: lawyer.email,
        isVerified: lawyer.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
