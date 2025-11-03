import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [sosAlerts, setSosAlerts] = useState([])

  useEffect(() => {
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to server')
    })

    newSocket.on('sosAlert', (alert) => {
      setSosAlerts(prev => [alert, ...prev])
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('SOS Alert', {
          body: `New emergency alert: ${alert.message || 'Help needed'}`,
          icon: '/vite.svg'
        })
      }
    })

    newSocket.on('sosUpdate', (update) => {
      setSosAlerts(prev => 
        prev.map(alert => 
          alert.id === update.id ? { ...alert, status: update.status } : alert
        )
      )
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    return () => newSocket.close()
  }, [])

  const acknowledgeSos = (sosId, volunteerId) => {
    if (socket) {
      socket.emit('ackSos', { sosId, volunteerId })
    }
  }

  const value = {
    socket,
    sosAlerts,
    acknowledgeSos
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}