import React, { useState, useEffect } from 'react'
import AccessibilityMap from '../components/map/AccessibilityMap'
import { placesAPI } from '../services/api'

const AccessibilityMapPage = () => {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPlace, setNewPlace] = useState({
    name: '',
    description: '',
    address: '',
    tags: ''
  })

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          // Default to Delhi if location access denied
          setCurrentLocation({ lat: 28.6139, lng: 77.2090 })
        }
      )
    }
  }, [])

  const handleAddPlace = async (e) => {
    e.preventDefault()
    try {
      await placesAPI.create({
        ...newPlace,
        lat: currentLocation.lat,
        lng: currentLocation.lng
      })
      setShowAddForm(false)
      setNewPlace({ name: '', description: '', address: '', tags: '' })
      alert('Place submitted for moderation!')
    } catch (error) {
      alert('Error adding place: ' + error.response?.data?.msg)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Accessibility Map
          </h1>
          <p className="text-gray-600">
            Discover accessible places near you with detailed information about facilities and infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Filter Places</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accessibility Tags
                  </label>
                  <div className="space-y-2">
                    {['ramp', 'elevator', 'braille', 'accessible-washroom', 'tactile-paths'].map(tag => (
                      <label key={tag} className="flex items-center">
                        <input type="checkbox" className="rounded text-primary-600" />
                        <span className="ml-2 text-sm text-gray-600 capitalize">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Add New Place</h3>
              <p className="text-sm text-gray-600 mb-4">
                Found an accessible place not on our map? Help others by adding it!
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary w-full"
              >
                Add Place
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
              <AccessibilityMap
                currentLocation={currentLocation}
                onPlaceSelect={setSelectedPlace}
              />
            </div>
          </div>
        </div>

        {/* Add Place Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Add Accessible Place</h3>
              <form onSubmit={handleAddPlace} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Place Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={newPlace.name}
                    onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={newPlace.description}
                    onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newPlace.address}
                    onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="ramp, elevator, braille"
                    value={newPlace.tags}
                    onChange={(e) => setNewPlace({ ...newPlace, tags: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Submit Place
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary flex-1"
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

export default AccessibilityMapPage