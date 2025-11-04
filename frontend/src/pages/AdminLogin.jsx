import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import styles from '../styles/AdminLogin.module.css'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { adminLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await adminLogin(formData.email, formData.password)
    if (result.success) {
      navigate('/admin/dashboard')
    } else {
      alert(result.error)
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.cardContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.logoWrapper}>
          <div className={styles.logo}>SI</div>
        </div>

        <h2 className={styles.title}>Admin Login</h2>
        <p className={styles.subtitle}>
          Access the Smart Inclusion administration dashboard
        </p>

        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={styles.inputField}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={styles.inputField}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.btnPrimary}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </motion.form>

        <div className={styles.backLink}>
          <Link to="/">← Back to Home</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
