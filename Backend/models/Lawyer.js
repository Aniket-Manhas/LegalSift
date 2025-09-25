import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const lawyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String },
    licenseNumber: { type: String },
    specialization: { type: String },
    experience: { type: Number },
    barCouncilAssociation: { type: String },
    status: { type: String, default: "active" },
    isVerified: { type: Boolean, default: false },
    language: { type: String, enum: ["en", "hi"], default: "en" },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password
lawyerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
lawyerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Lawyer", lawyerSchema);
