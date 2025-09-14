import React from "react";
import "../styles/dashboard.css";
import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="dashboard-main">
        <section className="about-section">
          <h2>AI-Driven Legal Assistant</h2>
          <p>
            Our platform leverages <strong>Natural Language Processing (NLP)</strong> 
            and <strong>Generative AI</strong> to simplify complex legal documents 
            into clear, easy-to-understand explanations. 
          </p>
          <ul className="features-list">
            <li>✅ Simplifies complex legal jargon into simple terms</li>
            <li>✅ Provides context-aware, human-like explanations</li>
            <li>✅ Highlights critical clauses & automatically flags risks</li>
            <li>✅ Acts as a first-level legal advisor for individuals & SMEs</li>
            <li>✅ Reduces dependency on costly legal consultations</li>
          </ul>
          <p>
            This is not just a tool, but a step towards making legal 
            knowledge <strong>accessible, affordable, and transparent</strong> 
            for everyone.
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
