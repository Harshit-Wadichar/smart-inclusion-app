import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'


export default function useSocket(path = ''){
const socketRef = useRef(null)


useEffect(() => {
const socket = io(import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000')
socketRef.current = socket


return () => socket.disconnect()
}, [path])


return socketRef
}