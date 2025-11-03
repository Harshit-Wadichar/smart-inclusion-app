import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/map', label: 'Accessibility Map' },
    { path: '/sos', label: 'Emergency SOS' },
    { path: '/schemes', label: 'Schemes & Events' },
    { path: '/volunteers', label: 'Volunteers' },
  ]

  const isActive = (path) => location.pathname === path

  return (
     <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <div className="logo-icon"></div>
            <span className="logo-text">Smart Inclusion</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-links desktop-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="auth-buttons">
              <Link to="/admin/dashboard" className="nav-item">Dashboard</Link>
              <button onClick={logout} className="btn-secondary">Logout</button>
            </div>
          ) : (
            <Link to="/admin/login" className="btn-primary">Admin Login</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-button">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                to="/admin/dashboard"
                className="mobile-nav-item"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="mobile-nav-item"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="mobile-nav-item"
              onClick={() => setIsOpen(false)}
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar