import React from "react";

export default function LawyerDashboard() {
  return (
    <div style={{ padding: "2rem", maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ color: "#2563eb", marginBottom: "1.5rem" }}>Lawyer Dashboard</h2>
      <div style={{
        background: "#fff",
        border: "1.5px solid #e0e7ef",
        borderRadius: "14px",
        boxShadow: "0 4px 24px rgba(30,41,59,0.07)",
        padding: "2rem"
      }}>
        <h3 style={{ marginBottom: "1rem", color: "#1e293b" }}>Welcome, Lawyer!</h3>
        <ul style={{ lineHeight: 2, color: "#374151", fontSize: "1.08rem" }}>
          <li>View and manage your cases</li>
          <li>Access client information</li>
          <li>Upload and review legal documents</li>
          <li>Check your Bar Council ID and Association details</li>
          <li>Update your profile and license information</li>
          <li>Communicate securely with clients</li>
        </ul>
        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f4f6fb",
          borderRadius: "8px",
          color: "#2563eb",
          fontWeight: 500
        }}>
          <span>Tip: Keep your Bar Council and license details up to date for uninterrupted access.</span>
        </div>
      </div>
    </div>
  );
}