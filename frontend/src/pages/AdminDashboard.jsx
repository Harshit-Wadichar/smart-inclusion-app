import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import { placesAPI, sosAPI, schemesAPI, volunteersAPI } from '../services/api'
import styles from '../styles/AdminDashboard.module.css'

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth()
  const { sosAlerts } = useSocket()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    places: 0,
    sos: 0,
    schemes: 0,
    volunteers: 0
  })
  const [places, setPlaces] = useState([])
  const [sosRequests, setSosRequests] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    loadDashboardData()
  }, [isAuthenticated, navigate])

  const loadDashboardData = async () => {
    try {
      const [placesRes, sosRes, schemesRes, volunteersRes] = await Promise.all([
        placesAPI.getAll(),
        sosAPI.getAll(),
        schemesAPI.getAll(),
        volunteersAPI.getAll()
      ])

      setStats({
        places: placesRes.data.length,
        sos: sosRes.data.length,
        schemes: schemesRes.data.length,
        volunteers: volunteersRes.data.length
      })

      setPlaces(placesRes.data.slice(0, 10))
      setSosRequests(sosRes.data.slice(0, 10))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const handleDeletePlace = async (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await placesAPI.delete(id)
        setPlaces(places.filter(p => p._id !== id))
        setStats(prev => ({ ...prev, places: prev.places - 1 }))
      } catch (error) {
        alert('Error deleting place: ' + error.response?.data?.msg)
      }
    }
  }

  const handleUpdateSosStatus = async (id, status) => {
    try {
      await sosAPI.updateStatus(id, status)
      setSosRequests(prev =>
        prev.map(sos => sos._id === id ? { ...sos, status } : sos)
      )
    } catch (error) {
      alert('Error updating SOS status: ' + error.response?.data?.msg)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.headerH1}>Admin Dashboard</h1>
          <p className={styles.headerP}>Manage Smart Inclusion platform data and monitor activities</p>
        </header>

        {/* Stats Overview */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#0ea5e9' }}>{stats.places}</div>
            <div className={styles.statLabel}>Accessible Places</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#ef4444' }}>{stats.sos}</div>
            <div className={styles.statLabel}>SOS Requests</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#16a34a' }}>{stats.schemes}</div>
            <div className={styles.statLabel}>Schemes</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#3b82f6' }}>{stats.volunteers}</div>
            <div className={styles.statLabel}>Volunteers</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsCard}>
          <div className={styles.tabNav}>
            {['overview', 'places', 'sos', 'schemes', 'volunteers'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className={styles.card}>
          {activeTab === 'overview' && (
            <div className={styles.spaceY6}>
              {/* Recent SOS Alerts */}
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Recent SOS Alerts</h3>
                {sosRequests.length > 0 ? (
                  <div>
                    {sosRequests.map(sos => (
                      <div key={sos._id} className={styles.listItem}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700 }}>
                            SOS Alert - {new Date(sos.createdAt).toLocaleString()}
                          </div>
                          <div style={{ color: '#6b7280', marginTop: 6 }}>
                            Location: {sos.location.coordinates[1].toFixed(4)}, {sos.location.coordinates[0].toFixed(4)}
                          </div>
                          {sos.message && (
                            <div className={styles.sosMessage} style={{ marginTop: 6 }}>
                              Message: {sos.message}
                            </div>
                          )}
                        </div>

                        <div style={{ marginLeft: 12 }}>
                          <select
                            value={sos.status}
                            onChange={(e) => handleUpdateSosStatus(sos._id, e.target.value)}
                            className={styles.smallSelect}
                          >
                            <option value="open">Open</option>
                            <option value="acknowledged">Acknowledged</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.statLabel} style={{ textAlign: 'center', padding: 12 }}>No SOS alerts</p>
                )}
              </div>

              {/* Recent Places */}
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Recent Places</h3>
                {places.length > 0 ? (
                  <div>
                    {places.map(place => (
                      <div key={place._id} className={styles.placeCard}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{place.name}</div>
                          <div style={{ color: '#6b7280', fontSize: 13 }}>{place.address}</div>
                          <div className={styles.tags} style={{ marginTop: 8 }}>
                            {place.tags?.map((tag, index) => (
                              <span key={index} className={styles.tag}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePlace(place._id)}
                          className={styles.actionBtn}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.statLabel} style={{ textAlign: 'center', padding: 12 }}>No places added yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'places' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Manage Places</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Tags</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tbody}>
                    {places.map(place => (
                      <tr key={place._id}>
                        <td>{place.name}</td>
                        <td className={styles.statLabel}>{place.address}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {place.tags?.slice(0, 3).map((tag, index) => (
                              <span key={index} className={styles.tag}>{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <button onClick={() => handleDeletePlace(place._id)} className={styles.actionBtn} type="button">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sos' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>SOS Requests</h3>
              <div>
                {sosRequests.map(sos => (
                  <div key={sos._id} className={styles.card} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          SOS Alert - {new Date(sos.createdAt).toLocaleString()}
                        </div>
                        <div style={{ color: '#6b7280', marginTop: 6 }}>
                          Location: {sos.location.coordinates[1].toFixed(6)}, {sos.location.coordinates[0].toFixed(6)}
                        </div>
                      </div>

                      <div>
                        <select
                          value={sos.status}
                          onChange={(e) => handleUpdateSosStatus(sos._id, e.target.value)}
                          className={styles.smallSelect}
                        >
                          <option value="open">Open</option>
                          <option value="acknowledged">Acknowledged</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {sos.message && (
                      <div style={{ marginTop: 10 }} className={styles.sosMessage}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>Message:</div>
                        <div style={{ color: '#374151' }}>{sos.message}</div>
                      </div>
                    )}

                    <div style={{ marginTop: 8, color: '#9ca3af', fontSize: 12 }}>ID: {sos._id}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* you can add schemes and volunteers tabs similarly using styles.card */}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
