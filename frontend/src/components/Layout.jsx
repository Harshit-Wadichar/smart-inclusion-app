import React from 'react'
import { Link } from 'react-router-dom'


export default function Layout({ children }){
return (
<div className="min-h-screen bg-gray-50">
<header className="bg-white shadow">
<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
<h1 className="text-xl font-bold">Smart Inclusion App</h1>
<nav className="space-x-4">
<Link to="/" className="text-sm">Home</Link>
<Link to="/schemes" className="text-sm">Schemes</Link>
<Link to="/volunteers" className="text-sm">Volunteers</Link>
<Link to="/sos" className="text-sm">SOS</Link>
<Link to="/admin/login" className="text-sm">Admin</Link>
</nav>
</div>
</header>


<main className="max-w-6xl mx-auto p-4">
{children}
</main>


<footer className="text-center py-4 text-sm text-gray-500">
Built for Smart Inclusion
</footer>
</div>
)
}