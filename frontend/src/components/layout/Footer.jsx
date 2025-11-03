import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
     <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo & Description */}
          <div className="footer-logo-section">
            <div className="footer-logo">
              <div className="logo-icon"></div>
              <span className="logo-text">Smart Inclusion</span>
            </div>
            <p className="footer-description">
              Empowering Persons with Disabilities through accessible technology, 
              real-time support, and inclusive community connections.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/map">Accessibility Map</Link></li>
              <li><Link to="/sos">Emergency SOS</Link></li>
              <li><Link to="/schemes">Schemes & Events</Link></li>
              <li><Link to="/volunteers">Volunteers</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-links">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p>&copy; 2024 Smart Inclusion App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer