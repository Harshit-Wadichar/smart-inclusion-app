import React from 'react'


export default function DashboardCard({ title, value }){
return (
<div className="p-4 bg-white border rounded">
<div className="text-sm text-gray-500">{title}</div>
<div className="text-2xl font-bold">{value}</div>
</div>
)
}