import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import AccessibilityMap from './pages/AccessibilityMap'
import SOSEmergency from './pages/SOSEmergency'
import Schemes from './pages/Schemes'
import Volunteers from './pages/Volunteers'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="layout-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/map"
            element={
              <div className="map-container">
                <AccessibilityMap />
              </div>
            }
          />
          <Route path="/sos" element={<SOSEmergency />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App