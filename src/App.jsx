import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Contact from './pages/Contact'
import About from './pages/About'
import Categories from './pages/Categories'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import MentorDashboard from './pages/MentorDashboard'
import './styles/App.css'
import Register from './pages/register'

// Protected Route Component
function ProtectedRoute({ children, isLoggedIn, requiredRole }) {
    const userRole = localStorage.getItem('userRole')

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && userRole !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        if (userRole === 'admin') {
            return <Navigate to="/admin/dashboard" replace />
        } else if (userRole === 'mentor') {
            return <Navigate to="/mentor/dashboard" replace />
        } else {
            return <Navigate to="/dashboard" replace />
        }
    }

    return children
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Check login status on mount
    useEffect(() => {
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        if (userLoggedIn === 'true') {
            setIsLoggedIn(true)
        }
    }, [])

    return (
        <Router>
            <div className="app">
                <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                    <Route
                        path="/login"
                        element={
                            isLoggedIn ?
                                <Navigate to="/dashboard" replace /> :
                                <Login setIsLoggedIn={setIsLoggedIn} />
                        }
                    />
                    <Route path="/register" element={<Register />} />
                    
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="client">
                                <Dashboard setIsLoggedIn={setIsLoggedIn} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
                                <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/mentor/dashboard"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="mentor">
                                <MentorDashboard setIsLoggedIn={setIsLoggedIn} />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/contact" element={<Contact isLoggedIn={isLoggedIn} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/categories" element={<Categories isLoggedIn={isLoggedIn} />} />
                    
                </Routes>
                <Footer />
            </div>
        </Router>
    )
}

export default App
