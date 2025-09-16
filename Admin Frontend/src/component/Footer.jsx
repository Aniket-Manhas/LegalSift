import React from "react";
import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
import "../style/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Left Section */}
      <div className="footer-left">
        <a href="#quick" className="footer-link">
          Quick Links
        </a>
        <a href="#legal" className="footer-link">
          Legal
        </a>
        <a href="#contact" className="footer-link">
          Contact
        </a>
      </div>

      {/* Right Section */}
      <div className="footer-right">
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
          <FaLinkedin className="social-icon" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <FaTwitter className="social-icon" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          <FaFacebook className="social-icon" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
