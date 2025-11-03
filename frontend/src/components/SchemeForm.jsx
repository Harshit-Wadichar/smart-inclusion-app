import React, { useState } from 'react'
import api from '../utils/apiClient'


export default function SchemeForm(){
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')


const handleSubmit = async (e) => {
e.preventDefault()
try{
const res = await api.post('/schemes', { title, description })
alert('Scheme created')
setTitle('')
setDescription('')
}catch(err){
console.error(err)
alert('Failed')
}
}


return (
<form onSubmit={handleSubmit} className="space-y-3">
<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
<button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
</form>
)
}