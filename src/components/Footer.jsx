import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">🩺</div>
            <span>Sehat<span>Suhul</span></span>
          </Link>
          <p>Connecting patients with certified nurses for home healthcare services across Kashmir. Available 24/7.</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="WhatsApp">💬</a>
            <a href="#" aria-label="Twitter">🐦</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>For Patients</h4>
          <Link to="/nurses">Find a Nurse</Link>
          <Link to="/services">Book Lab Test</Link>
          <Link to="/patient/dashboard">My Bookings</Link>
          <Link to="/about">How It Works</Link>
          <Link to="/register?role=patient">Sign Up Free</Link>
        </div>
        <div className="footer-col">
          <h4>For Nurses</h4>
          <Link to="/register?role=nurse">Join as Nurse</Link>
          <Link to="/nurse/dashboard">Nurse Dashboard</Link>
          <Link to="/about">Get Verified</Link>
          <Link to="/contact">Support</Link>
          <Link to="/about">FAQ</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <div className="footer-col footer-contact">
          <h4>Contact</h4>
          <span>📞 +91 7006659980</span>
          <span>✉️ </span>
          <span>📍 Budgam, Srinagar</span>
          <div className="app-btns">
            <div>📱 App Store <span>Coming Soon</span></div>
            <div>🤖 Google Play <span>Coming Soon</span></div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2025 SehatSuhul. All rights reserved. Made with ❤️ </span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
