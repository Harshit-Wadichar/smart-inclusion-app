import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export const placesAPI = {
  getAll: () => api.get('/places'),
  getNearby: (lng, lat, radius = 3000) => 
    api.get(`/places/nearby?lng=${lng}&lat=${lat}&radius=${radius}`),
  create: (data) => api.post('/places', data),
  delete: (id) => api.delete(`/places/${id}`)
}

export const sosAPI = {
  create: (data) => api.post('/sos', data),
  getAll: () => api.get('/sos'),
  updateStatus: (id, status) => api.patch(`/sos/${id}/status`, { status })
}

export const schemesAPI = {
  getAll: () => api.get('/schemes'),
  create: (data) => api.post('/schemes', data),
  delete: (id) => api.delete(`/schemes/${id}`)
}

export const volunteersAPI = {
  getAll: () => api.get('/volunteers'),
  getNearby: (lng, lat, radius = 5000) =>
    api.get(`/volunteers/nearby?lng=${lng}&lat=${lat}&radius=${radius}`),
  create: (data) => api.post('/volunteers', data)
}

export const authAPI = {
  login: (email, password) => api.post('/admin/login', { email, password }),
  register: (data) => api.post('/admin/register', data)
}

export default api