import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Schemes from './pages/Schemes'
import Volunteers from './pages/Volunteers'
import SOS from './pages/SOS'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'


export default function App(){
return (
<Layout>
<Routes>
<Route path="/" element={<Home/>} />
<Route path="/schemes" element={<Schemes/>} />
<Route path="/volunteers" element={<Volunteers/>} />
<Route path="/sos" element={<SOS/>} />
<Route path="/admin/login" element={<AdminLogin/>} />
<Route path="/admin" element={<AdminDashboard/>} />
</Routes>
</Layout>
)
}