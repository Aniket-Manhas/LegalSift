import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import GenAILogo from "../assets/GENAI logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Navigate & close dropdown
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
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

        {/* Right Buttons */}
        <div className="header-buttons">
          {/* Multi-Language Button */}
          <button
            className="lang-btn"
            onClick={toggleLanguage}
            aria-label="Toggle Language"
          >
            🌐 {language.toUpperCase()}
          </button>

          {/* Hamburger / Settings Dropdown */}
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
                <button
                  className="dropdown-item logout"
                  onClick={() => handleNavigate("/login")}
                >
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