import React from "react";
import logo from "../assets/legal.png";
import { Link } from "react-router-dom";
import "../style/login.css";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="loginContainer">
      <div className="loginBox">
        <img src={logo} alt="Legal Sift logo" className="logo" />

        <h1 className="loginTitle">Login to LegalSift Admin Panel</h1>

        <form className="loginForm">
          <label htmlFor="email">Email</label>
          <input
            autoComplete="new-email"
            id="email"
            type="email"
            placeholder="admin@gmail.com"
          />

          <label htmlFor="password">Password</label>
          <div className="passwordWrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="togglePassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="loginFormSubmitButton" type="submit">
            Login
          </button>
        </form>

        <Link to="/forgot-password" className="forgotLink">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
