import React, { useState, useEffect } from 'react'
import { schemesAPI } from '../services/api'
import styles from '../styles/Schemes.module.css'
import { useAuth } from "../contexts/AuthContext";

const Schemes = () => {

   const { isAuthenticated, user } = useAuth(); 
   const isAdmin = user?.role === "admin";

  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newScheme, setNewScheme] = useState({
    title: '',
    description: '',
    category: '',
    organization: '',
    url: '',
    startDate: '',
    endDate: '',
    location: ''
  })

  useEffect(() => {
    loadSchemes()
  }, [])

  const loadSchemes = async () => {
    try {
      const response = await schemesAPI.getAll()
      setSchemes(response.data)
    } catch (error) {
      console.error('Error loading schemes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddScheme = async (e) => {
    e.preventDefault()
    try {
      await schemesAPI.create(newScheme)
      setShowAddForm(false)
      setNewScheme({
        title: '',
        description: '',
        category: '',
        organization: '',
        url: '',
        startDate: '',
        endDate: '',
        location: ''
      })
      loadSchemes()
      alert('Scheme added successfully!')
    } catch (error) {
      alert('Error adding scheme: ' + error.response?.data?.msg)
    }
  }

  const filteredSchemes = schemes.filter(scheme => {
    if (filter === 'all') return true
    return scheme.category === filter
  })

  const categories = ['all', 'education', 'employment', 'healthcare', 'financial', 'housing', 'transportation']

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ display: 'flex', minHeight: '70vh', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.spinner} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Schemes & Events</h1>
            <p className={styles.subtitle}>
              Discover government schemes, NGO programs, and inclusive events for Persons with Disabilities.
            </p>
          </div>
{(isAuthenticated && isAdmin) ? (
   
          <button
            onClick={() => setShowAddForm(true)}
            className={styles.btnPrimary}
          >
            Add New Scheme
          </button>
) : null}
        </div>

        {/* Filters */}
        <div className={`${styles.card} ${styles.filters}`} aria-label="filters">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`${styles.filterBtn} ${filter === category ? styles.activeFilter : ''}`}
              type="button"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Schemes Grid */}
        <div className={styles.grid} style={{ marginTop: 18 }}>
          {filteredSchemes.map((scheme) => (
            <div key={scheme._id} className={`${styles.card} ${styles.schemeCard}`}>
              <div>
                <h3 className={styles.schemeTitle}>{scheme.title}</h3>
                <p className={styles.schemeDesc}>{scheme.description}</p>
              </div>

              <div className={styles.schemeMeta}>
                {scheme.organization && (
                  <div className={styles.metaRow}>
                    <strong style={{ width: 90 }}>Organization:</strong>
                    <span>{scheme.organization}</span>
                  </div>
                )}
                {scheme.category && (
                  <div className={styles.metaRow}>
                    <strong style={{ width: 90 }}>Category:</strong>
                    <span className="capitalize">{scheme.category}</span>
                  </div>
                )}
                {scheme.startDate && (
                  <div className={styles.metaRow}>
                    <strong style={{ width: 90 }}>Starts:</strong>
                    <span>{new Date(scheme.startDate).toLocaleDateString()}</span>
                  </div>
                )}
                {scheme.location && (
                  <div className={styles.metaRow}>
                    <strong style={{ width: 90 }}>Location:</strong>
                    <span>{scheme.location}</span>
                  </div>
                )}
              </div>

              {scheme.url && (
                <a
                  href={scheme.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.learnMore}
                >
                  Learn More
                </a>
              )}
            </div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>No schemes found</h3>
            <p style={{ color: '#6b7280' }}>
              {filter === 'all'
                ? 'No schemes available yet.'
                : `No schemes found in the ${filter} category.`}
            </p>
          </div>
        )}

        {/* Add Scheme Modal */}
        {showAddForm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <h3 style={{ marginBottom: 8 }}>Add New Scheme</h3>
              <form onSubmit={handleAddScheme} className={styles.form}>
                <div className={`${styles.formGrid} ${styles['cols2'] || ''}`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      className={styles.inputField}
                      value={newScheme.title}
                      onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className={styles.inputField}
                      value={newScheme.category}
                      onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.filter(c => c !== 'all').map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className={styles.inputField}
                    rows="4"
                    value={newScheme.description}
                    onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: 10 }} className={`${styles.formGrid} ${styles['cols2'] || ''}`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={newScheme.organization}
                      onChange={(e) => setNewScheme({ ...newScheme, organization: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={newScheme.location}
                      onChange={(e) => setNewScheme({ ...newScheme, location: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 10 }} className={`${styles.formGrid} ${styles['cols2'] || ''}`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      className={styles.inputField}
                      value={newScheme.startDate}
                      onChange={(e) => setNewScheme({ ...newScheme, startDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      className={styles.inputField}
                      value={newScheme.endDate}
                      onChange={(e) => setNewScheme({ ...newScheme, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    className={styles.inputField}
                    value={newScheme.url}
                    onChange={(e) => setNewScheme({ ...newScheme, url: e.target.value })}
                  />
                </div>

                <div className={styles.formButtons}>
                  <button type="submit" className={styles.btnPrimary} style={{ flex: 1 }}>
                    Add Scheme
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className={styles.btnSecondary}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Schemes
