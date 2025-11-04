import React, { useState, useEffect } from 'react'
import { authAPI, volunteersAPI } from '../services/api'
import styles from '../styles/Volunteers.module.css'

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    skills: '',
    lat: '',
    lng: ''
  })

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    try {
      const response = await authAPI.getAll()
      setVolunteers(response.data)
    } catch (error) {
      console.error('Error loading volunteers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewVolunteer(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ display: 'flex', minHeight: '70vh', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.avatar} style={{ width: 48, height: 48, borderRadius: 999, animation: 'spin 1s linear infinite', border: '4px solid rgba(2,6,23,0.08)', borderTopColor: '#0ea5e9' }} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>NGO Network</h1>
            <p className={styles.subtitle}>
              Connect with dedicated NGOs committed to supporting Persons with Disabilities.
            </p>
          </div>
        </div>

        {/* Volunteers Grid */}
        <div className={styles.grid}>
          {volunteers.map((volunteer) => {
            const skillsArray = Array.isArray(volunteer.skills)
              ? volunteer.skills
              : (typeof volunteer.skills === 'string' && volunteer.skills.length > 0)
                ? volunteer.skills.split(',').map(s => s.trim()).filter(Boolean)
                : []

            return (
              <div key={volunteer._id} className={styles.card}>
                <div className={styles.avatar}>
                  {volunteer.name ? volunteer.name.charAt(0) : 'V'}
                </div>

                <h3 className={styles.name}>{volunteer.name}</h3>

                <div className={styles.meta}>
                  {volunteer.city && (
                    <div className={styles.metaRow}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span style={{ marginLeft: 6 }}>{volunteer.city}</span>
                    </div>
                  )}

                  {volunteer.email && <div style={{ marginTop: 6 }} className="truncate">{volunteer.email}</div>}
                  {volunteer.phone && <div style={{ marginTop: 4 }}>{volunteer.phone}</div>}
                </div>

                

               
              </div>
            )
          })}
        </div>

        {volunteers.length === 0 && (
          <div className={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤝</div>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>Not Connected yet</h3>
            <p style={{ color: '#6b7280', marginBottom: 12 }}>
              Be the first to join our network!
            </p>
            <button onClick={() => setShowRegisterForm(true)} className={styles.btnPrimary}>
              Register as Volunteer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Volunteers
