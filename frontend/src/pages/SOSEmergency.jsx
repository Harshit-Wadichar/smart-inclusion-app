import React, { useState, useEffect } from 'react'
import { sosAPI, volunteersAPI } from '../services/api'
import { useSocket } from '../contexts/SocketContext'
import styles from '../styles/SOSEmergency.module.css'

const SOSEmergency = () => {
  const [location, setLocation] = useState(null)
  const [message, setMessage] = useState('')
  const [nearbyVolunteers, setNearbyVolunteers] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const { sosAlerts } = useSocket()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setLocation(coords)
          loadNearbyVolunteers(coords)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Location access is required for emergency SOS')
        }
      )
    }
  }, [])

  const loadNearbyVolunteers = async (coords) => {
    try {
      const response = await volunteersAPI.getNearby(coords.lng, coords.lat)
      setNearbyVolunteers(response.data)
    } catch (error) {
      console.error('Error loading volunteers:', error)
    }
  }

  const handleSOS = async () => {
    if (!location) {
      alert('Waiting for location...')
      return
    }

    setIsSending(true)
    try {
      await sosAPI.create({
        lat: location.lat,
        lng: location.lng,
        message,
        metadata: {
          accuracy: 10,
          timestamp: new Date().toISOString()
        }
      })
      setSent(true)

      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    } catch (error) {
      alert('Error sending SOS: ' + error.response?.data?.msg)
    } finally {
      setIsSending(false)
    }
  }

  if (sent) {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successCard}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
          <h1 style={{ fontSize: 22, marginBottom: 8, color: '#166534' }}>Help is on the Way!</h1>
          <p style={{ color: '#166534', marginBottom: 16 }}>
            Your emergency alert has been sent successfully. Nearby volunteers and emergency services have been notified.
          </p>

          <div className={styles.spaceY4}>
            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: 14, borderRadius: 10, textAlign: 'left' }}>
              <h3 style={{ margin: 0, color: '#92400e' }}>What to do next:</h3>
              <ul style={{ marginTop: 8, color: '#92400e' }}>
                <li>Stay in your current location if safe</li>
                <li>Keep your phone accessible</li>
                <li>Look for volunteers approaching</li>
                <li>Call emergency services if immediate danger</li>
              </ul>
            </div>

            <button
              onClick={() => setSent(false)}
              className={styles.btnPrimary}
            >
              Send Another Alert
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Emergency SOS</h1>
          <p className={styles.subtitle}>
            Help is just a click away. Your location will be shared with nearby volunteers and emergency services.
          </p>
        </header>

        <div className={styles.grid}>
          {/* SOS area */}
          <div>
            <div className={`${styles.card} ${styles.sosCard}`}>
              <div className={styles.sosAvatar}>
                <span className={styles.sosAvatarText}>SOS</span>
              </div>

              <h2 className={styles.cardH2}>Emergency Alert</h2>
              <p className={styles.cardP}>Press the button below to send an emergency alert with your location</p>

              <div style={{ marginTop: 18 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Additional Message (Optional)</label>
                <textarea
                  className={styles.inputField}
                  rows="3"
                  placeholder="Describe your emergency or specific needs..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {location && (
                <div className={styles.locationInfo}>
                  <strong>Location found:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              )}

              <div style={{ marginTop: 18 }}>
                <button
                  onClick={handleSOS}
                  disabled={!location || isSending}
                  className={styles.btnPrimary}
                >
                  {isSending ? 'Sending Alert...' : 'SEND EMERGENCY ALERT'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className={styles.sidebarList}>
              <div className={styles.card}>
                <h3 style={{ marginBottom: 12 }}>Nearby Users</h3>
                {nearbyVolunteers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {nearbyVolunteers.slice(0, 5).map((volunteer) => (
                      <div key={volunteer._id} className={styles.volunteerItem}>
                        <div className={styles.volAvatar}>
                          {volunteer.name?.charAt(0) ?? 'V'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{volunteer.name}</div>
                          <div style={{ color: '#6b7280', fontSize: 13 }}>{(volunteer.skills || []).join(', ')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#6b7280', padding: 12 }}>No nearby volunteers found</p>
                )}
              </div>

              <div className={styles.card}>
                <h3 style={{ marginBottom: 8 }}>Emergency Contacts</h3>
                <div className={styles.contactsList}>
                  <button className={styles.contactBtn}>
                    <div className={styles.contactTitle}>Police</div>
                    <div className={styles.contactSub}>100</div>
                  </button>

                  <button className={styles.contactBtn}>
                    <div className={styles.contactTitle}>Ambulance</div>
                    <div className={styles.contactSub}>102</div>
                  </button>

                  <button className={styles.contactBtn}>
                    <div className={styles.contactTitle}>Fire Department</div>
                    <div className={styles.contactSub}>101</div>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default SOSEmergency
