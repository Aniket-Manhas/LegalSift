import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // ✅ import navigate hook
import { User, Mail, Phone, Lock, Briefcase, FileText } from "lucide-react";
import "../styles/lawyersignup.css";

export default function LawyerSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    license: "",
    specialization: "",
    experience: "",
    bar: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ initialize navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ basic validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.contact ||
      !formData.license ||
      !formData.specialization ||
      !formData.experience ||
      !formData.bar ||
      !formData.password
    ) {
      setError("Please fill out all fields.");
      return;
    }

    setError("");
    console.log("Lawyer Signup Data:", formData);

    // ✅ API call simulation
    // If success → redirect
    navigate("/lawyer-login");
  };

  return (
    <div className="signup-outer">
      <div className="signup-container">
        <h2>
          <Briefcase size={26} /> Lawyer Signup
        </h2>

        {error && <div className="signup-error">{error}</div>}

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="signup-field">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email + Contact */}
          <div className="form-grid">
            <div className="signup-field">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="signup-field">
              <label>Contact Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={20} />
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>

          {/* License Number */}
          <div className="signup-field">
            <label>License Number</label>
            <div className="input-wrapper">
              <FileText className="input-icon" size={20} />
              <input
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
                placeholder="Enter license number"
              />
            </div>
          </div>

          {/* Specialization + Experience */}
          <div className="form-grid">
            <div className="signup-field">
              <label>Specialization</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" size={20} />
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Criminal, Corporate"
                />
              </div>
            </div>

            <div className="signup-field">
              <label>Experience (Years)</label>
              <div className="input-wrapper">
                <FileText className="input-icon" size={20} />
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                />
              </div>
            </div>
          </div>

          {/* Bar Association */}
          <div className="signup-field">
            <label>Bar Association</label>
            <div className="input-wrapper">
              <FileText className="input-icon" size={20} />
              <input
                type="text"
                name="bar"
                value={formData.bar}
                onChange={handleChange}
                placeholder="Enter bar association"
              />
            </div>
          </div>

          {/* Password */}
          <div className="signup-field">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="signup-btn-main">
            <Briefcase size={20} /> Register as Lawyer
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <a href="/lawyer-login" className="login-btn-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
