import React from "react";
import "../styles/setting.css";

export default function Settings() {
  return (
    <div className="settings-page">
      <h1 className="settings-title">⚙️ Settings</h1>

      <div className="settings-section">
        <h2>Edit Profile</h2>
        <p>Update your personal information like name, email, and contact details.</p>
        <button className="settings-btn">Edit Profile</button>
      </div>

      <div className="settings-section">
        <h2>Change Password</h2>
        <p>Keep your account secure by updating your password regularly.</p>
        <button className="settings-btn">Change Password</button>
      </div>

      <div className="settings-section">
        <h2>Notifications</h2>
        <p>Manage your notification preferences for emails and alerts.</p>
        <button className="settings-btn">Notification Settings</button>
      </div>
    </div>
  );
}
