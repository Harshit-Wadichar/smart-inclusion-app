import React from 'react'


export default function SchemeCard({ scheme }){
return (
<div className="p-4 border rounded bg-white">
<h3 className="font-bold">{scheme.title}</h3>
<p className="text-sm">{scheme.description}</p>
</div>
)
}