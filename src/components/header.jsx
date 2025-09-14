import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Handle logout
  const handleLogout = () => {
    // Clear session/auth tokens if required
    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
        ⚖️ <span>LawAssist</span>
      </div>

      {/* Center Navigation */}
      <nav className="nav-links">
        <button className="nav-btn" onClick={() => navigate("/services")}>
          Services
        </button>
        <button className="nav-btn" onClick={() => navigate("/contactlawyer")}>
          Contact Lawyer
        </button>
      </nav>

      {/* Settings / Hamburger */}
      <div className="settings" ref={dropdownRef}>
        <button
          className="settings-btn"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Menu"
        >
          ☰
        </button>
        {open && (
          <div className="dropdown" role="menu">
            <button
              className="dropdown-item"
              onClick={() => {
                navigate("/settings");
                setOpen(false); // close dropdown after click
              }}
            >
              Settings
            </button>
            <hr />
            <button className="dropdown-item logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
