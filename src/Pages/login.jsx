import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "user") {
      navigate("/dashboard");
    } else {
      navigate("/lawyerdashboard");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const goToSignup = () => {
    if (role === "user") {
      navigate("/signup");
    } else {
      navigate("/lawyersignup");
    }
  };

  return (
    <div className="login-background">
    <div className="login-container">
      {/* Heading */}
      <h2>Welcome </h2>
      <p className="subtitle">Please login to continue</p>

      {/* Role Switcher */}
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

      {/* Login Form */}
      <form onSubmit={handleLogin} autoComplete="off">
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Field with Toggle */}
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

        <button type="submit" className="login-btn">
          {role === "user" ? "Login as User" : "Login as Lawyer"}
        </button>
      </form>

      {/* Signup Link */}
      <div className="signup-link">
        <span>Don’t have an account? </span>
        <button type="button" onClick={goToSignup} className="signup-btn">
          Sign Up
        </button>
      </div>
    </div>
    </div>
  );
}
