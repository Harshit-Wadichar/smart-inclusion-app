import React from 'react'
import useFetch from '../hooks/useFetch'
import SchemeCard from '../components/SchemeCard'


export default function Schemes(){
const { data, loading } = useFetch('/schemes', [])


return (
<div>
<h2 className="text-2xl font-bold mb-4">Schemes</h2>
{loading && <div>Loading...</div>}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{(data || []).map(s => <SchemeCard key={s._id} scheme={s} />)}
</div>
</div>
)
}