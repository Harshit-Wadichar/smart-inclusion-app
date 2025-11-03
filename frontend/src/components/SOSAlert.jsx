import React from 'react'


export default function SOSAlert({ alert }){
return (
<div className="p-3 border-l-4 border-red-600 bg-white">
<div className="font-bold">SOS</div>
<div className="text-sm">{alert.message}</div>
<div className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</div>
</div>
)
}