import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ import AuthContext
import "../styles/header.css";
import GenAILogo from "../assets/GenAI_logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ get logout function from context
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));

  // ✅ Fixed logout
  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // important to clear cookie
      });

      // Clear frontend state
      logout();

      // Redirect to login
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div
          className="logo-wrapper"
          onClick={() => handleNavigate("/dashboard")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleNavigate("/dashboard")}
        >
          <img src={GenAILogo} alt="GENAI Logo" className="logo" />
          <span className="brand-name">Legalsift</span>
        </div>

        <div className="header-buttons">
          <button
            className="lang-btn"
            onClick={toggleLanguage}
            aria-label="Toggle Language"
          >
            🌐 {language.toUpperCase()}
          </button>

          <div className="settings" ref={dropdownRef}>
            <button
              className="settings-btn"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="dropdown-menu"
              aria-label="Toggle Menu"
            >
              ☰
            </button>

            {open && (
              <div id="dropdown-menu" className="dropdown" role="menu">
                <button
                  className="dropdown-item"
                  onClick={() => handleNavigate("/settings")}
                >
                  Settings
                </button>
                <hr className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
