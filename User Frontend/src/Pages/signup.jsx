import React, { useState } from "react";
import { Lock, UserPlus, Eye, EyeOff } from "lucide-react"; // ✅ icons
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import "../styles/signup.css";

export default function Signup() {
  const navigate = useNavigate();
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");

    if (name === "password") checkPasswordStrength(value);
  };

  const checkPasswordStrength = (password) => {
    if (!password) return setPasswordStrength("");
    if (password.length < 6) return setPasswordStrength("Weak ❌");
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) {
      return setPasswordStrength("Strong ✅");
    }
    setPasswordStrength("Medium ⚡");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    alert("Signup successful!");
    navigate("/login");

    setFormData({
      name: "",
      age: "",
      contact: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setPasswordStrength("");
  };

  return (
    <div className="signup-outer">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit} autoComplete="off">
          <h2><UserPlus size={22} /> User Signup</h2>

          <div className="form-grid">
            <div className="signup-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="signup-field">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="signup-field">
              <label htmlFor="contact">Contact</label>
              <input
                id="contact"
                type="tel"
                name="contact"
                placeholder="Enter your contact number"
                value={formData.contact}
                onChange={handleChange}
                required
                pattern="[0-9]{10,15}"
                autoComplete="tel"
              />
            </div>

            <div className="signup-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password with eye toggle */}
          <div className="signup-field password-wrapper">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordStrength && (
              <small className={`password-strength ${passwordStrength.toLowerCase()}`}>
                {passwordStrength}
              </small>
            )}
          </div>

          {/* Confirm Password with eye toggle */}
          <div className="signup-field password-wrapper">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <button className="signup-btn-main" type="submit">
            <Lock size={18} /> Sign Up
          </button>
        </form>

        <div className="login-link">
          Already have an account?{" "}
          <a href="/login" className="login-btn-link">Login</a>
        </div>
      </div>
    </div>
  );
}
