import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About */}
        <div className="footer-section about">
          <h3>Legalsift</h3>
          <p>
            Simplifying legal services. Connect, get guidance, and manage your needs with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p>Email: <a href="mailto:support@lawassist.com">support@legalsift.com</a></p>
          <p>Phone: +91 9797691071</p>
          <p>Address: Jammu, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} made by team Innovexia. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
