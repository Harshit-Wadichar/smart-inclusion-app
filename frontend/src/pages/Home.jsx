import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { schemesAPI, placesAPI } from '../services/api'
import { motion } from 'framer-motion'

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

  const container = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const hoverScale = { scale: 1.05, transition: { duration: 0.2 } }

  return (
  <div className="home-container">

      {/* Hero Section */}
      <section className="hero" style={{
        background: "url('/pwd.jpg') center bottom / cover no-repeat",
  color: "white",
  padding: "100px 0",
  position: "relative"
      }}>
        <div className="container text-center">
          <div className="hero-overlay"></div>
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Empowering Inclusion Through Technology
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-subtitle"
          >
            Smart Inclusion App bridges accessibility gaps for Persons with Disabilities 
            with real-time information, emergency support, and community connections.
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div whileHover={hoverScale}>
              <Link to="/map" className="btn btn-primary">Explore Accessible Places</Link>
            </motion.div>
            <motion.div whileHover={hoverScale}>
              <Link to="/volunteers" className="btn btn-primary">Join Us</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <motion.div 
          className="container stats-grid" 
          variants={container} 
          initial="hidden" 
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            { label: 'Accessible Places', number: stats.places },
            { label: 'Active Schemes', number: stats.schemes },
            { label: 'Admins', number: stats.volunteers },
          ].map((stat, i) => (
            <motion.div key={i} className="stat-card" variants={item} whileHover={{ scale: 1.05 }}>
              <div className="stat-number">{stat.number}+</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <motion.div 
            className="features-grid" 
            variants={container} 
            initial="hidden" 
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="feature-card" 
                variants={item} 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.link} className="feature-link">Learn More →</Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Schemes Section */}
      <section className="recent-schemes">
        <div className="container">
          <div className="recent-header">
            <h2>Recent Schemes & Events</h2>
            <Link to="/schemes" className="view-all">View All →</Link>
          </div>
          <motion.div 
            className="schemes-grid" 
            variants={container} 
            initial="hidden" 
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {recentSchemes.map((scheme) => (
              <motion.div 
                key={scheme._id} 
                className="scheme-card" 
                variants={item} 
                whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
              >
                <h3>{scheme.title}</h3>
                <p>{scheme.description}</p>
                <div className="scheme-footer">
                  <span>{scheme.organization}</span>
                  {scheme.startDate && <span>{new Date(scheme.startDate).toLocaleDateString()}</span>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Make a Difference?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Join our community today and help create a more inclusive world for everyone.
          </motion.p>
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div whileHover={hoverScale}>
              <Link to="/sos" className="btn btn-primary">Get Emergency Help</Link>
            </motion.div>
            <motion.div whileHover={hoverScale}>
              <Link to="/volunteers" className="btn btn-primary">Become a Member</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default Home