import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Legalsift</h3>
          <p>
            Simplifying legal services. Connect, get guidance, and manage your
            needs with ease.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul>
            <li><a href="mailto:support@legalsift.com">support@legalsift.com</a></li>
            <li>+91 9797691071</li>
            <li>Jammu, India</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} made by <span>team Innovexia</span>. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
}