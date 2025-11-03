import React, { useState, useEffect } from 'react'
import { schemesAPI } from '../services/api'

const Schemes = () => {
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
      loadSchemes() // Reload schemes
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
              Schemes & Events
            </h1>
            <p className="text-gray-600">
              Discover government schemes, NGO programs, and inclusive events for Persons with Disabilities.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add New Scheme
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div key={scheme._id} className="card hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{scheme.title}</h3>
                <p className="text-gray-600 line-clamp-3">{scheme.description}</p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {scheme.organization && (
                  <div className="flex items-center">
                    <span className="font-medium w-20">Organization:</span>
                    <span>{scheme.organization}</span>
                  </div>
                )}
                {scheme.category && (
                  <div className="flex items-center">
                    <span className="font-medium w-20">Category:</span>
                    <span className="capitalize">{scheme.category}</span>
                  </div>
                )}
                {scheme.startDate && (
                  <div className="flex items-center">
                    <span className="font-medium w-20">Starts:</span>
                    <span>{new Date(scheme.startDate).toLocaleDateString()}</span>
                  </div>
                )}
                {scheme.location && (
                  <div className="flex items-center">
                    <span className="font-medium w-20">Location:</span>
                    <span>{scheme.location}</span>
                  </div>
                )}
              </div>

              {scheme.url && (
                <a
                  href={scheme.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 btn-primary text-center text-sm"
                >
                  Learn More
                </a>
              )}
            </div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No schemes found
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No schemes available yet.' 
                : `No schemes found in the ${filter} category.`
              }
            </p>
          </div>
        )}

        {/* Add Scheme Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Add New Scheme</h3>
              <form onSubmit={handleAddScheme} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={newScheme.title}
                      onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      className="input-field"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    rows="4"
                    value={newScheme.description}
                    onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newScheme.organization}
                      onChange={(e) => setNewScheme({ ...newScheme, organization: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newScheme.location}
                      onChange={(e) => setNewScheme({ ...newScheme, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={newScheme.startDate}
                      onChange={(e) => setNewScheme({ ...newScheme, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={newScheme.endDate}
                      onChange={(e) => setNewScheme({ ...newScheme, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    value={newScheme.url}
                    onChange={(e) => setNewScheme({ ...newScheme, url: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Add Scheme
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

export default Schemes