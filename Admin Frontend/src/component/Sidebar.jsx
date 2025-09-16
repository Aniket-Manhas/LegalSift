import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaUserCog,
  FaComments,
  FaGavel,
  FaCreditCard,
  FaCogs,
  FaBell,
  FaLifeRing,
} from "react-icons/fa";
import "../style/sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Lawyer Management", icon: <FaUserFriends />, path: "/lawyers" },
    { name: "User Accounts", icon: <FaUserCog />, path: "/users" },
    { name: "Payments & Revenue", icon: <FaCreditCard />, path: "/payments" },
    { name: "Support Panel", icon: <FaLifeRing />, path: "/support" },
  ];

  return (
    <aside className="sidebar">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={location.pathname.startsWith(item.path) ? "active" : ""}
          >
            <Link to={item.path} className="link">
              <span className="icon">{item.icon}</span>
              <span className="text">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
