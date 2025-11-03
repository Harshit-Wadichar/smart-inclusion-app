import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { schemesAPI, placesAPI } from '../services/api'

const Home = () => {
  const [stats, setStats] = useState({
    places: 0,
    schemes: 0,
    volunteers: 0
  })
  const [recentSchemes, setRecentSchemes] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [schemesRes, placesRes] = await Promise.all([
        schemesAPI.getAll(),
        placesAPI.getAll()
      ])
      
      setStats({
        schemes: schemesRes.data.length,
        places: placesRes.data.length,
        volunteers: 0 // You might want to add a volunteers count endpoint
      })
      
      setRecentSchemes(schemesRes.data.slice(0, 3))
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const features = [
    {
      icon: '🗺️',
      title: 'Accessibility Map',
      description: 'Find accessible places with detailed information about facilities and infrastructure.',
      link: '/map'
    },
    {
      icon: '🆘',
      title: 'Emergency SOS',
      description: 'Quick access to emergency help with location sharing and volunteer coordination.',
      link: '/sos'
    },
    {
      icon: '🤝',
      title: 'Volunteer Network',
      description: 'Connect with local volunteers and NGOs for assistance and support.',
      link: '/volunteers'
    },
    {
      icon: '📋',
      title: 'Schemes & Events',
      description: 'Discover government schemes and inclusive events tailored for PwDs.',
      link: '/schemes'
    }
  ]

  return (
 <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1>Empowering Inclusion Through Technology</h1>
          <p>
            Smart Inclusion App bridges accessibility gaps for Persons with Disabilities 
            with real-time information, emergency support, and community connections.
          </p>
          <div className="hero-buttons">
            <Link to="/map" className="btn btn-primary">Explore Accessible Places</Link>
            <Link to="/volunteers" className="btn btn-secondary">Join as Volunteer</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.places}+</div>
            <div className="stat-label">Accessible Places</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.schemes}+</div>
            <div className="stat-label">Active Schemes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.volunteers}+</div>
            <div className="stat-label">Volunteers</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.link} className="feature-link">Learn More →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Schemes Section */}
      <section className="recent-schemes">
        <div className="container">
          <div className="recent-header">
            <h2>Recent Schemes & Events</h2>
            <Link to="/schemes" className="view-all">View All →</Link>
          </div>
          <div className="schemes-grid">
            {recentSchemes.map((scheme) => (
              <div key={scheme._id} className="scheme-card">
                <h3>{scheme.title}</h3>
                <p>{scheme.description}</p>
                <div className="scheme-footer">
                  <span>{scheme.organization}</span>
                  {scheme.startDate && <span>{new Date(scheme.startDate).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container text-center">
          <h2>Ready to Make a Difference?</h2>
          <p>Join our community today and help create a more inclusive world for everyone.</p>
          <div className="hero-buttons">
            <Link to="/sos" className="btn btn-primary">Get Emergency Help</Link>
            <Link to="/volunteers" className="btn btn-secondary">Become a Volunteer</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home