// src/Pages/login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // "user" or "lawyer"
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint =
        role === "user" ? "/auth/login/user" : "/auth/login/lawyer";

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Pass role along with user
      login(data.user, role);

      navigate(role === "user" ? "/dashboard" : "/lawyerdashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const goToSignup = () => {
    navigate(role === "user" ? "/signup" : "/lawyersignup");
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2>Welcome</h2>
        <p className="subtitle">Please login to continue</p>

        <div className="role-switcher">
          <button
            onClick={() => setRole("user")}
            className={role === "user" ? "active-user" : ""}
          >
            User
          </button>
          <button
            onClick={() => setRole("lawyer")}
            className={role === "lawyer" ? "active-lawyer" : ""}
          >
            Lawyer
          </button>
        </div>

        <form onSubmit={handleLogin} autoComplete="off">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading
              ? "Logging in..."
              : role === "user"
              ? "Login as User"
              : "Login as Lawyer"}
          </button>
        </form>

        <div className="signup-link">
          <span>Don’t have an account? </span>
          <button type="button" onClick={goToSignup} className="signup-btn">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
