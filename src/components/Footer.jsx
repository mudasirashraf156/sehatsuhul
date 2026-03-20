
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top container">

        {/* Brand */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">🩺</div>
            <span>
              Sehat<span>Sehul</span>
            </span>
          </Link>

          <p>
            Connecting patients with certified nurses for reliable home
            healthcare services across Kashmir.
          </p>

          <div className="footer-contact-info">
            <span>📞 +91 7006659980</span>
            <span>✉️ info@sehatsehul.com</span>
            <span>📍Srinagar, Jammu and Kashmir</span>
          </div>

        </div>

        {/* Patients */}
        <div className="footer-col">
          <h4>Patients</h4>
          <Link to="/nurses">Find a Nurse</Link>
          <Link to="/services">Book Lab Test</Link>
          <Link to="/patient/dashboard">My Bookings</Link>
          <Link to="/register?role=patient">Create Account</Link>
        </div>

        {/* Nurses */}
        <div className="footer-col">
          <h4>Nurses</h4>
          <Link to="/register?role=nurse">Join as Nurse</Link>
          <Link to="/nurse/dashboard">Dashboard</Link>
          <Link to="/contact">Support</Link>
        </div>

        {/* Help */}
        <div className="footer-col">
          <h4>Help</h4>
          <Link to="/about">How it Works</Link>
          <Link to="/scan">Free Prescription Help</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/about">About Us</Link>
        </div>

      </div>

      {/* Bottom bar */}

      <div className="footer-bottom">

        <div className="container footer-bottom-inner">

          <span>© 2025 sehatsehul. All rights reserved.</span>

        </div>

      </div>

    </footer>
  );
}
