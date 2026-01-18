import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatModal from '../components/ChatModal'
import '../styles/Dashboard.css'

function Dashboard({ setIsLoggedIn }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [showChatModal, setShowChatModal] = useState(false)
    const [selectedMentor, setSelectedMentor] = useState(null)

    const mentors = [
        {
            id: 1,
            name: 'Debbi Angelia Saputri',
            title: 'Tutor Bahasa Arab',
            image: '/images/mentors/debbi.jpeg'
        },
        {
            id: 2,
            name: 'Jawad At-Taqy',
            title: 'Tutor Manajemen',
            image: '/images/mentors/jawad.jpeg'
        }
    ]

    const handleChatClick = (mentor) => {
        setSelectedMentor(mentor)
        setShowChatModal(true)
    }

    useEffect(() => {
        // Check if user is logged in
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        const storedUsername = localStorage.getItem('username')

        if (!userLoggedIn || userLoggedIn !== 'true') {
            // Redirect to login if not logged in
            navigate('/login')
        } else {
            setUsername(storedUsername || 'Pengguna')
            setIsLoading(false)
        }
    }, [navigate])

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('userLoggedIn')
        localStorage.removeItem('username')

        // Update App state
        if (setIsLoggedIn) {
            setIsLoggedIn(false)
        }

        // Navigate to home
        navigate('/')
    }

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="dashboard">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <div className="container">
                    <div className="dashboard-welcome">
                        <h1>Selamat Datang, {username}! 👋</h1>
                        <p>Kelola pembelajaran dan progres Anda di sini</p>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="dashboard-content">
                <div className="container">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-book-open"></i>
                            </div>
                            <div className="stat-info">
                                <h3>5</h3>
                                <p>Kursus Aktif</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-certificate"></i>
                            </div>
                            <div className="stat-info">
                                <h3>12</h3>
                                <p>Sertifikat</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="stat-info">
                                <h3>48</h3>
                                <p>Jam Belajar</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-trophy"></i>
                            </div>
                            <div className="stat-info">
                                <h3>85%</h3>
                                <p>Progress</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Dashboard Grid */}
                    <div className="dashboard-grid">
                        {/* My Courses */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2>Kursus Saya</h2>
                                <a href="#" className="view-all">Lihat Semua →</a>
                            </div>
                            <div className="courses-list">
                                <div className="course-item">
                                    <img src="/images/products/Animasi2d.jpeg" alt="Course" />
                                    <div className="course-info">
                                        <h3>Video Pembelajaran Animasi 2D</h3>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '75%' }}></div>
                                        </div>
                                        <p className="progress-text">75% Complete</p>
                                    </div>
                                </div>
                                <div className="course-item">
                                    <img src="/images/products/ARstrukturbumi.jpeg" alt="Course" />
                                    <div className="course-info">
                                        <h3>AR Learning - Struktur Bumi</h3>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '45%' }}></div>
                                        </div>
                                        <p className="progress-text">45% Complete</p>
                                    </div>
                                </div>
                                <div className="course-item">
                                    <img src="/images/products/Bgameoperasihitungan.jpeg" alt="Course" />
                                    <div className="course-info">
                                        <h3>Board Game Edukasi</h3>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '90%' }}></div>
                                        </div>
                                        <p className="progress-text">90% Complete</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* My Mentors */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2>Mentor Saya</h2>
                                <a href="#" className="view-all">Lihat Semua →</a>
                            </div>
                            <div className="mentors-list">
                                {mentors.map((mentor) => (
                                    <div key={mentor.id} className="mentor-item">
                                        <img src={mentor.image} alt={mentor.name} />
                                        <div className="mentor-info">
                                            <h4>{mentor.name}</h4>
                                            <p>{mentor.title}</p>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleChatClick(mentor)}
                                            >
                                                <i className="fas fa-comment"></i> Chat
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="dashboard-section full-width">
                        <div className="section-header">
                            <h2>Aktivitas Terbaru</h2>
                        </div>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="activity-info">
                                    <h4>Menyelesaikan Modul "Sistem Pencernaan"</h4>
                                    <p>2 jam yang lalu</p>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-certificate"></i>
                                </div>
                                <div className="activity-info">
                                    <h4>Mendapatkan Sertifikat "AR Learning Basics"</h4>
                                    <p>1 hari yang lalu</p>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-star"></i>
                                </div>
                                <div className="activity-info">
                                    <h4>Memberikan Rating untuk Mentor Debbi</h4>
                                    <p>2 hari yang lalu</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Modal */}
            <ChatModal
                isOpen={showChatModal}
                onClose={() => setShowChatModal(false)}
                mentor={selectedMentor}
            />
        </div>
    )
}

export default Dashboard
