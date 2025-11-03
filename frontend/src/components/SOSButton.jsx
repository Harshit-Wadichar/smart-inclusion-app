import React from 'react'
import api from '../utils/apiClient'


export default function SOSButton(){
const handleSOS = async () => {
try{
// this will call backend SOS endpoint which should broadcast alert via socket
await api.post('/sos', { message: 'Emergency help needed', timestamp: Date.now() })
alert('SOS sent')
}catch(err){
console.error(err)
alert('Failed to send SOS')
}
}


return (
<button onClick={handleSOS} className="bg-red-600 text-white px-4 py-2 rounded">SOS</button>
)
}