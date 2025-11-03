import React, { useState, useEffect } from 'react'
import { sosAPI, volunteersAPI } from '../services/api'
import { useSocket } from '../contexts/SocketContext'

const SOSEmergency = () => {
  const [location, setLocation] = useState(null)
  const [message, setMessage] = useState('')
  const [nearbyVolunteers, setNearbyVolunteers] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const { sosAlerts } = useSocket()

  useEffect(() => {
    // Get current location
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
          accuracy: 10, // You can get this from geolocation
          timestamp: new Date().toISOString()
        }
      })
      setSent(true)
      
      // Request browser notifications
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
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-800 mb-4">Help is on the Way!</h1>
          <p className="text-green-700 mb-6">
            Your emergency alert has been sent successfully. Nearby volunteers and emergency services have been notified.
          </p>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">What to do next:</h3>
              <ul className="text-yellow-700 text-sm text-left space-y-1">
                <li>• Stay in your current location if safe</li>
                <li>• Keep your phone accessible</li>
                <li>• Look for volunteers approaching</li>
                <li>• Call emergency services if immediate danger</li>
              </ul>
            </div>
            <button
              onClick={() => setSent(false)}
              className="btn-primary w-full"
            >
              Send Another Alert
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-red-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-800 mb-4">Emergency SOS</h1>
          <p className="text-red-700 text-lg">
            Help is just a click away. Your location will be shared with nearby volunteers and emergency services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SOS Button */}
          <div className="lg:col-span-2">
            <div className="card text-center">
              <div className="mb-6">
                <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-white text-2xl font-bold">SOS</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Emergency Alert
                </h2>
                <p className="text-gray-600">
                  Press the button below to send an emergency alert with your location
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Describe your emergency or specific needs..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                
                {location && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <strong>Location found:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                )}
              </div>

              <button
                onClick={handleSOS}
                disabled={!location || isSending}
                className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-xl rounded-lg transition-colors"
              >
                {isSending ? 'Sending Alert...' : 'SEND EMERGENCY ALERT'}
              </button>
            </div>
          </div>

          {/* Nearby Help */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Nearby Volunteers</h3>
              {nearbyVolunteers.length > 0 ? (
                <div className="space-y-3">
                  {nearbyVolunteers.slice(0, 5).map((volunteer) => (
                    <div key={volunteer._id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {volunteer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{volunteer.name}</div>
                        <div className="text-sm text-gray-600">{volunteer.skills?.join(', ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No nearby volunteers found</p>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Emergency Contacts</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="font-medium">Police</div>
                  <div className="text-sm text-gray-600">100</div>
                </button>
                <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="font-medium">Ambulance</div>
                  <div className="text-sm text-gray-600">102</div>
                </button>
                <button className="w-full text-left p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <div className="font-medium">Fire Department</div>
                  <div className="text-sm text-gray-600">101</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SOSEmergency