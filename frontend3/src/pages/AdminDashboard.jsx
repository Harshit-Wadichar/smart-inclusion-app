import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import { placesAPI, sosAPI, schemesAPI, volunteersAPI } from '../services/api'

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage Smart Inclusion platform data and monitor activities</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">{stats.places}</div>
            <div className="text-gray-600">Accessible Places</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">{stats.sos}</div>
            <div className="text-gray-600">SOS Requests</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{stats.schemes}</div>
            <div className="text-gray-600">Schemes</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{stats.volunteers}</div>
            <div className="text-gray-600">Volunteers</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'places', 'sos', 'schemes', 'volunteers'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent SOS Alerts */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent SOS Alerts</h3>
                {sosRequests.length > 0 ? (
                  <div className="space-y-3">
                    {sosRequests.map(sos => (
                      <div key={sos._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium">
                            SOS Alert - {new Date(sos.createdAt).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Location: {sos.location.coordinates[1].toFixed(4)}, {sos.location.coordinates[0].toFixed(4)}
                          </div>
                          {sos.message && (
                            <div className="text-sm text-gray-600">Message: {sos.message}</div>
                          )}
                        </div>
                        <select
                          value={sos.status}
                          onChange={(e) => handleUpdateSosStatus(sos._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="open">Open</option>
                          <option value="acknowledged">Acknowledged</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No SOS alerts</p>
                )}
              </div>

              {/* Recent Places */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Places</h3>
                {places.length > 0 ? (
                  <div className="space-y-3">
                    {places.map(place => (
                      <div key={place._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{place.name}</div>
                          <div className="text-sm text-gray-600">{place.address}</div>
                          <div className="flex gap-1 mt-1">
                            {place.tags?.map((tag, index) => (
                              <span key={index} className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePlace(place._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No places added yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'places' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Manage Places</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {places.map(place => (
                      <tr key={place._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{place.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {place.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {place.tags?.slice(0, 3).map((tag, index) => (
                              <span key={index} className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeletePlace(place._id)}
                            className="text-red-600 hover:text-red-900"
                          >
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
              <h3 className="text-lg font-semibold mb-4">SOS Requests</h3>
              <div className="space-y-4">
                {sosRequests.map(sos => (
                  <div key={sos._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold">
                          SOS Alert - {new Date(sos.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Location: {sos.location.coordinates[1].toFixed(6)}, {sos.location.coordinates[0].toFixed(6)}
                        </div>
                      </div>
                      <select
                        value={sos.status}
                        onChange={(e) => handleUpdateSosStatus(sos._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="open">Open</option>
                        <option value="acknowledged">Acknowledged</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    {sos.message && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700">Message:</div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{sos.message}</div>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      ID: {sos._id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard