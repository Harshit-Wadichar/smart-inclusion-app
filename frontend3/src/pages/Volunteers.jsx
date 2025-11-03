import React, { useState, useEffect } from 'react'
import { volunteersAPI } from '../services/api'

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
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
    loadVolunteers()
  }, [])

  const loadVolunteers = async () => {
    try {
      const response = await volunteersAPI.getAll()
      setVolunteers(response.data)
    } catch (error) {
      console.error('Error loading volunteers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await volunteersAPI.create(newVolunteer)
      setShowRegisterForm(false)
      setNewVolunteer({
        name: '',
        email: '',
        phone: '',
        city: '',
        skills: '',
        lat: '',
        lng: ''
      })
      loadVolunteers() // Reload volunteers
      alert('Thank you for registering as a volunteer!')
    } catch (error) {
      alert('Error registering: ' + error.response?.data?.msg)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewVolunteer({
            ...newVolunteer,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Volunteer Network
            </h1>
            <p className="text-gray-600">
              Connect with dedicated volunteers and NGOs committed to supporting Persons with Disabilities.
            </p>
          </div>
          <button
            onClick={() => setShowRegisterForm(true)}
            className="btn-primary"
          >
            Become a Volunteer
          </button>
        </div>

        {/* Volunteers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {volunteers.map((volunteer) => (
            <div key={volunteer._id} className="card text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-4">
                {volunteer.name.charAt(0)}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{volunteer.name}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {volunteer.city && (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {volunteer.city}
                  </div>
                )}
                
                {volunteer.email && (
                  <div className="truncate">{volunteer.email}</div>
                )}
                
                {volunteer.phone && (
                  <div>{volunteer.phone}</div>
                )}
              </div>

              {volunteer.skills && volunteer.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {volunteer.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {volunteer.skills.length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      +{volunteer.skills.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                volunteer.verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {volunteer.verified ? 'Verified' : 'Pending Verification'}
              </div>
            </div>
          ))}
        </div>

        {volunteers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No volunteers yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to join our volunteer network!
            </p>
            <button
              onClick={() => setShowRegisterForm(true)}
              className="btn-primary"
            >
              Register as Volunteer
            </button>
          </div>
        )}

        {/* Register Modal */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Register as Volunteer</h3>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={newVolunteer.name}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      value={newVolunteer.email}
                      onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      value={newVolunteer.phone}
                      onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={newVolunteer.city}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="First aid, Sign language, Counseling, Transportation"
                    value={newVolunteer.skills}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, skills: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <button
                    type="button"
                    onClick={getLocation}
                    className="btn-secondary w-full text-sm"
                  >
                    {newVolunteer.lat ? 'Location Captured' : 'Use Current Location'}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    This helps us connect you with nearby emergencies
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegisterForm(false)}
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

export default Volunteers