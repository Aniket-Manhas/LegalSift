import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSignOutAlt, FaSearch, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const profileTimeoutRef = useRef(null);
  const avatarUrl = "https://i.pravatar.cc/40?img=15";

  // Sync active menu based on current route
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setActiveMenu("Dashboard");
    } else if (location.pathname.startsWith("/lawyers")) {
      setActiveMenu("Management");
    } else if (location.pathname.startsWith("/support")) {
      setActiveMenu("Support");
    } else {
      setActiveMenu("");
    }
  }, [location.pathname]);

  const handleMenuClick = (menu) => {
    setShowSearch(false);
    setShowNotifications(false);
    setShowProfile(false);

    switch (menu) {
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "Management":
        navigate("/lawyers");
        break;
      case "Support":
        navigate("/support");
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    console.log("Log out Successfully");
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <span className="header-logo-icon">✦</span>
        <span className="logo-text">
          <b>LegalSift</b>AdminPanel
        </span>
      </div>

      {/* Navigation */}
      <nav className="nav">
        {["Dashboard", "Management", "Support"].map((item) => (
          <span
            key={item}
            className={`nav-item ${activeMenu === item ? "active" : ""}`}
            onClick={() => handleMenuClick(item)}
          >
            {item}
          </span>
        ))}
      </nav>

      {/* Actions */}
      <div className="actions">
        {/* Search */}
        <div className="search-wrapper">
          <FaSearch
            className="icon"
            onClick={() => {
              setShowSearch((prev) => !prev);
              setShowNotifications(false);
              setShowProfile(false);
            }}
          />
          {showSearch && (
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          )}
        </div>

        {/* Notifications */}
        <div className="notification-wrapper">
          <FaBell
            className="icon"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowSearch(false);
              setShowProfile(false);
            }}
          />
          {showNotifications && (
            <div className="dropdown">
              <p>No new notifications</p>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div
          className="profile-wrapper"
          onMouseEnter={() => {
            clearTimeout(profileTimeoutRef.current);
            setShowProfile(true);
          }}
          onMouseLeave={() => {
            profileTimeoutRef.current = setTimeout(() => {
              setShowProfile(false);
            }, 300);
          }}
        >
          <img src={avatarUrl} alt="profile" className="profile-img" />
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <img
                  src={avatarUrl}
                  alt="profile"
                  className="profile-dropdown-img"
                />
                <div>
                  <p className="profile-name">John Doe</p>
                  <p className="profile-email">admin@example.com</p>
                  <span className="profile-role">Administrator</span>
                </div>
              </div>

              <hr />
              <button
                className="dropdown-btn logout"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                <FaSignOutAlt style={{ marginRight: "8px" }} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
