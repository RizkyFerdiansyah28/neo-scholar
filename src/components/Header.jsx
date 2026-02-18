import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/Header.css'

function Header({ isLoggedIn, setIsLoggedIn }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen)
    }

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('userLoggedIn')
        localStorage.removeItem('username')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userId') // Hapus ID juga jika disimpan

        // Update App state
        if (setIsLoggedIn) {
            setIsLoggedIn(false)
        }

        // Close menus
        setMobileMenuOpen(false)
        setProfileDropdownOpen(false)

        // Navigate to home
        navigate('/')
    }

    const getDashboardPath = () => {
        const userRole = localStorage.getItem('userRole')
        if (userRole === 'admin') {
            return '/admin/dashboard'
        } else if (userRole === 'mentor') {
            return '/mentor/dashboard'
        } else {
            return '/dashboard'
        }
    }

    const handleDashboardClick = () => {
        setProfileDropdownOpen(false)
        navigate(getDashboardPath())
    }

    const handleCartClick = () => {
        setProfileDropdownOpen(false)
        navigate('/cart') // Pastikan huruf kecil '/cart' sesuai route di App.jsx
    }

    const getUsername = () => {
        return localStorage.getItem('username') || 'User'
    }

    const getUserRole = () => {
        const role = localStorage.getItem('userRole') || 'client'
        return role.charAt(0).toUpperCase() + role.slice(1)
    }

    const getProfileIcon = () => {
        const role = localStorage.getItem('userRole')
        if (role === 'admin') {
            return 'fa-user-shield'
        } else if (role === 'mentor') {
            return 'fa-chalkboard-teacher'
        } else {
            return 'fa-user-circle'
        }
    }

    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false)

        // Jika user berada di halaman Home, scroll langsung
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        } else {
            // Jika tidak, navigasi ke Home dulu baru scroll
            navigate('/')
            setTimeout(() => {
                const element = document.getElementById(sectionId)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            }, 100)
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownOpen && !event.target.closest('.nav-profile-dropdown')) {
                setProfileDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [profileDropdownOpen])

    return (
        <header className="header">
            <div className="container">
                <nav className="navbar">
                    <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                        <img src="/images/logo/Logo NS.png" alt="NeoScholar Logo" />
                        Neo<span>Scholar</span>
                    </Link>
                    
                    <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <li>
                            <Link 
                                to="/products" 
                                className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Produk
                            </Link>
                        </li>
                       {/* GANTI BAGIAN INI */}
<li>
    <Link 
        to="/mentors" 
        className={`nav-link ${location.pathname === '/mentors' ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
    >
        Mentor
    </Link>
</li>
                        <li>
                            {/* Jika Categories adalah halaman terpisah, gunakan Link */}
                            <Link
                                to="/categories"
                                className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Kategori
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Tentang
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Kontak
                            </Link>
                        </li>
                        <li>
                            {!isLoggedIn ? (
                                <Link
                                    to="/login"
                                    className="nav-profile-link"
                                    onClick={() => setMobileMenuOpen(false)}
                                    title="Login"
                                >
                                    <i className="fas fa-user-circle"></i>
                                </Link>
                            ) : (
                                <div className="nav-profile-dropdown">
                                    <button
                                        className="nav-profile-btn"
                                        onClick={toggleProfileDropdown}
                                        title={getUsername()}
                                    >
                                        <i className={`fas ${getProfileIcon()}`}></i>
                                    </button>
                                    
                                    {profileDropdownOpen && (
                                        <div className="profile-dropdown-menu nav-dropdown">
                                            <div className="profile-dropdown-header">
                                                <div className="profile-avatar">
                                                    <i className={`fas ${getProfileIcon()}`}></i>
                                                </div>
                                                <div className="profile-info">
                                                    <div className="profile-name">{getUsername()}</div>
                                                    <div className="profile-role">{getUserRole()}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="profile-dropdown-divider"></div>
                                            
                                            <button
                                                className="profile-dropdown-item"
                                                onClick={handleDashboardClick}
                                            >
                                                <i className="fas fa-th-large"></i>
                                                Dashboard
                                            </button>

                                            {/* --- MENU KERANJANG (Hanya Client) --- */}
                                            {localStorage.getItem('userRole') === 'client' && (
                                                <button
                                                    className="profile-dropdown-item"
                                                    onClick={handleCartClick}
                                                >
                                                    <i className="fas fa-shopping-cart"></i>
                                                    Keranjang
                                                </button>
                                            )}

                                            <div className="profile-dropdown-divider"></div>
                                            
                                            <button
                                                className="profile-dropdown-item logout"
                                                onClick={handleLogout}
                                            >
                                                <i className="fas fa-sign-out-alt"></i>
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    </ul>
                    <div className="mobile-menu" onClick={toggleMobileMenu}>
                        <i className="fas fa-bars"></i>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header