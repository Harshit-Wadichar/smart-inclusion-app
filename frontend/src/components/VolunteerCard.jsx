import React from 'react'


export default function VolunteerCard({ volunteer }){
return (
<div className="p-4 border rounded shadow-sm bg-white">
<h3 className="font-bold">{volunteer.name}</h3>
<p className="text-sm">{volunteer.city} • {volunteer.phone}</p>
<p className="text-xs mt-2">Skills: {(volunteer.skills||[]).join(', ')}</p>
</div>
)
}