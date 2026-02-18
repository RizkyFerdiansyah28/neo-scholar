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
import Register from './pages/Register'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import './styles/App.css'
import Mentors from './pages/Mentors'
import Profile from './pages/Profile'

// --- ProtectedRoute dengan Alert & Redirection ---
function ProtectedRoute({ children, requiredRole }) {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    // 1. Jika belum login, arahkan ke login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 2. Jika Role tidak sesuai
    if (requiredRole && userRole !== requiredRole) {
        alert(`Akses Ditolak! Anda login sebagai "${userRole}", Anda tidak memiliki izin untuk mengakses halaman ${requiredRole}.`);
        
        if (userRole === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (userRole === 'mentor') {
            return <Navigate to="/mentor/dashboard" replace />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        if (userLoggedIn === 'true') {
            setIsLoggedIn(true)
        }
    }, [])

    return (
        <Router>
            <div className="app">
                {/* Header menerima props isLoggedIn dan setIsLoggedIn untuk update UI logout */}
                <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                
                <Routes>
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/mentors" element={<Mentors />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    
                    <Route path="/checkout" element={
                        <ProtectedRoute requiredRole="client">
                            <Checkout />
                        </ProtectedRoute>
                    } />

                    <Route
                        path="/login"
                        element={
                            isLoggedIn ? (
                                localStorage.getItem('userRole') === 'admin' ? <Navigate to="/admin/dashboard" /> :
                                localStorage.getItem('userRole') === 'mentor' ? <Navigate to="/mentor/dashboard" /> :
                                <Navigate to="/dashboard" />
                            ) : (
                                <Login setIsLoggedIn={setIsLoggedIn} />
                            )
                        }
                    />
                    
                    <Route path="/register" element={<Register />} />
                    
                    {/* --- DASHBOARDS --- */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute requiredRole="client">
                                <Dashboard setIsLoggedIn={setIsLoggedIn} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/mentor/dashboard"
                        element={
                            <ProtectedRoute requiredRole="mentor">
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