import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="dashboard-layout">
        {/* Main Content */}
        <main className="main-content">
          {/* AI Document Analysis Button */}
          <button
            className="card large-card clickable-card"
            onClick={() => navigate("/services")}
          >
            AI Document Analysis
          </button>

          {/* Row of Buttons */}
          <div className="card-row">
            <button
              className="card clickable-card"
              onClick={() => navigate("/contactlawyer")}
            >
              Lawyer Connect
            </button>
            <button
              className="card clickable-card"
              onClick={() => navigate("/transactions")}
            >
              Transaction History
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
