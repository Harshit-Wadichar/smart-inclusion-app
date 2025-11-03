import React, { useState, useEffect } from 'react'
import useFetch from '../hooks/useFetch'
import VolunteerCard from '../components/VolunteerCard'
import api from '../utils/apiClient'

export default function Volunteers() {
  const { data, loading, error } = useFetch('/volunteers', [])
  const [volunteers, setVolunteers] = useState([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [skills, setSkills] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (data) setVolunteers(data)
  }, [data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const skillsArr = (skills || '').split(',').map(s => s.trim()).filter(Boolean)
    const payload = { name, phone, city, skills: skillsArr }

    if (lat && lng) {
      payload.lat = parseFloat(lat)
      payload.lng = parseFloat(lng)
    }

    try {
      setSubmitting(true)
      const res = await api.post('/volunteers', payload)
      // Append new volunteer to list (optimistic)
      setVolunteers(prev => [res.data, ...prev])
      setName(''); setPhone(''); setCity(''); setSkills(''); setLat(''); setLng('')
      alert('Volunteer added')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || 'Failed to add volunteer')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Volunteers</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-white p-4 border rounded">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="p-2 border rounded w-full" required />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="p-2 border rounded w-full" />
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="p-2 border rounded w-full" />
        <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Skills (comma separated)" className="p-2 border rounded w-full" />
        <div className="grid grid-cols-2 gap-2">
          <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude (optional)" className="p-2 border rounded w-full" />
          <input value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitude (optional)" className="p-2 border rounded w-full" />
        </div>
        <button disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded">
          {submitting ? 'Adding...' : 'Add Volunteer'}
        </button>
      </form>

      {loading && <div>Loading volunteers...</div>}
      {error && <div className="text-red-600">Failed to load volunteers</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(volunteers || []).map(v => <VolunteerCard key={v._id} volunteer={v} />)}
      </div>
    </div>
  )
}
