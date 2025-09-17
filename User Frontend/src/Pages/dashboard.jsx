import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Header />
      
      <main className="dashboard-content">
        <div className="dashboard-grid">
          {/* AI Document Analysis Button */}
          <button
            className="dashboard-card primary-card"
            onClick={() => navigate("/services")}
            aria-label="Access AI Document Analysis"
          >
            <h2>AI Document Analysis</h2>
            <p>Analyze legal documents with AI assistance</p>
          </button>

          {/* Secondary Services */}
          <div className="secondary-cards">
            <button
              className="dashboard-card secondary-card"
              onClick={() => navigate("/contactlawyer")}
              aria-label="Connect with a lawyer"
            >
              <h3>Lawyer Connect</h3>
              <p>Get professional legal advice</p>
            </button>
            
            <button
              className="dashboard-card secondary-card"
              onClick={() => navigate("/transactions")}
              aria-label="View transaction history"
            >
              <h3>Transaction History</h3>
              <p>Track your past activities</p>
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}