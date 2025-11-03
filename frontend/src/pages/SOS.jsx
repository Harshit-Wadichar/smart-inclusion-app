import React, { useEffect, useState } from 'react'
import useSocket from '../hooks/useSocket'
import SOSAlert from '../components/SOSAlert'
import useFetch from '../hooks/useFetch'
import api from '../utils/apiClient'

export default function SOS() {
  const socketRef = useSocket()
  const [alerts, setAlerts] = useState([])
  const { data: initial, loading } = useFetch('/sos', []) // initial fetch

  useEffect(() => {
    if (initial) setAlerts(initial.slice().reverse()) // show newest first
  }, [initial])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return
    const handler = (data) => setAlerts(prev => [data, ...prev])
    socket.on('sos', handler)
    return () => { socket.off('sos', handler) }
  }, [socketRef])

  const handleAcknowledge = async (id) => {
    try {
      await api.post('/sos/ack', { id }) // optional endpoint if backend supports
      setAlerts(prev => prev.filter(a => a._id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to acknowledge (endpoint may not exist).')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">SOS Alerts</h2>

      {loading && <div>Loading...</div>}
      {!loading && alerts.length === 0 && <div className="text-sm text-gray-500">No alerts yet.</div>}

      <div className="space-y-3">
        {alerts.map((a) => (
          <div key={a._id || a.timestamp} className="p-3 bg-white border rounded">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">{a.user || 'Anonymous'}</div>
                <div className="text-sm">{a.message}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(a.timestamp || a.createdAt).toLocaleString()}</div>
                {a.location && a.location.coordinates && (
                  <div className="text-xs text-gray-500 mt-1">
                    {`Lat: ${a.location.coordinates[1]}, Lng: ${a.location.coordinates[0]}`}
                  </div>
                )}
              </div>
              <div className="ml-4 flex flex-col gap-2">
                <button onClick={() => handleAcknowledge(a._id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Acknowledge</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
