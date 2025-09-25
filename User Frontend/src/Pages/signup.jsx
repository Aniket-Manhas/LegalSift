import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user"); // optional if you have role toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");

    if (name === "password") checkPasswordStrength(value);
  };

  const checkPasswordStrength = (password) => {
    if (!password) return setPasswordStrength("");
    if (password.length < 6) return setPasswordStrength("Weak ❌");
    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.length >= 8
    ) {
      return setPasswordStrength("Strong ✅");
    }
    setPasswordStrength("Medium ⚡");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const endpoint =
        role === "user" ? "/auth/user/signup" : "/auth/lawyer/signup";
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        formData
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      navigate(role === "user" ? "/dashboard" : "/lawyerdashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-outer">
      <div className="signup-container">
        <form
          className="signup-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h2>User Signup</h2>

          <div className="form-grid">
            <div className="signup-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-field">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="signup-field">
              <label>Contact</label>
              <input
                type="tel"
                name="contact"
                placeholder="Enter your contact number"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="signup-field password-wrapper">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {passwordStrength && (
              <small
                className={`password-strength ${passwordStrength.toLowerCase()}`}
              >
                {passwordStrength}
              </small>
            )}
          </div>

          <div className="signup-field password-wrapper">
            <label>Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <button className="signup-btn-main" type="submit">
            Sign Up
          </button>
        </form>

        <div className="login-link">
          Already have an account?{" "}
          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
