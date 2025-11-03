import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/apiClient'
import { useAdminStore } from '../store/useAdminStore'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setToken = useAdminStore(s => s.setToken)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/admin/login', { email, password })
      if (res.data && res.data.token) {
        setToken(res.data.token)
        // set token on api client for future requests (optional)
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
        navigate('/admin')
      } else {
        alert('Login failed: no token returned')
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 border rounded">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          className="w-full p-2 border rounded"
        />
        <button disabled={loading} className="w-full bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
