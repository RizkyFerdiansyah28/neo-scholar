import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatModal from '../components/ChatModal'
import '../styles/Dashboard.css'

function MentorDashboard({ setIsLoggedIn }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [showChatModal, setShowChatModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)

    const students = [
        {
            id: 1,
            name: 'Ahmad Rizki',
            course: 'Video Pembelajaran Animasi 2D',
            image: '/images/mentors/debbi.jpeg',
            progress: 75
        },
        {
            id: 2,
            name: 'Siti Nurhaliza',
            course: 'AR Learning - Struktur Bumi',
            image: '/images/mentors/jawad.jpeg',
            progress: 45
        }
    ]

    const handleChatClick = (student) => {
        setSelectedStudent(student)
        setShowChatModal(true)
    }

    useEffect(() => {
        // Check if user is logged in and is mentor
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        const userRole = localStorage.getItem('userRole')
        const storedUsername = localStorage.getItem('username')

        if (!userLoggedIn || userLoggedIn !== 'true') {
            navigate('/login')
        } else if (userRole !== 'mentor') {
            // Redirect to appropriate dashboard based on role
            navigate(userRole === 'admin' ? '/admin/dashboard' : '/dashboard')
        } else {
            setUsername(storedUsername || 'Mentor')
            setIsLoading(false)
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('userLoggedIn')
        localStorage.removeItem('username')
        localStorage.removeItem('userRole')
        if (setIsLoggedIn) {
            setIsLoggedIn(false)
        }
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
        <div className="dashboard mentor-dashboard">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <div className="container">
                    <div className="dashboard-welcome">
                        <h1>Mentor Dashboard - Selamat Datang, {username}! 👨‍🏫</h1>
                        <p>Kelola siswa dan kursus Anda</p>
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
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-info">
                                <h3>45</h3>
                                <p>Total Students</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-book-open"></i>
                            </div>
                            <div className="stat-info">
                                <h3>8</h3>
                                <p>Active Courses</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-star"></i>
                            </div>
                            <div className="stat-info">
                                <h3>4.9</h3>
                                <p>Average Rating</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Rp 12.5M</h3>
                                <p>Earnings</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Dashboard Grid */}
                    <div className="dashboard-grid">
                        {/* My Students */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2>My Students</h2>
                                <a href="#" className="view-all">Lihat Semua →</a>
                            </div>
                            <div className="mentors-list">
                                {students.map((student) => (
                                    <div key={student.id} className="mentor-item">
                                        <img src={student.image} alt={student.name} />
                                        <div className="mentor-info">
                                            <h4>{student.name}</h4>
                                            <p>{student.course}</p>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${student.progress}%` }}></div>
                                            </div>
                                            <p className="progress-text">{student.progress}% Complete</p>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleChatClick(student)}
                                            >
                                                <i className="fas fa-comment"></i> Chat
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Courses */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2>My Courses</h2>
                                <a href="#" className="view-all">Lihat Semua →</a>
                            </div>
                            <div className="courses-list">
                                <div className="course-item">
                                    <img src="/images/products/Animasi2d.jpeg" alt="Course" />
                                    <div className="course-info">
                                        <h3>Video Pembelajaran Animasi 2D</h3>
                                        <p className="course-stats">25 Students • 4.8★</p>
                                        <button className="btn btn-sm btn-primary">Manage</button>
                                    </div>
                                </div>
                                <div className="course-item">
                                    <img src="/images/products/ARstrukturbumi.jpeg" alt="Course" />
                                    <div className="course-info">
                                        <h3>AR Learning - Struktur Bumi</h3>
                                        <p className="course-stats">20 Students • 4.9★</p>
                                        <button className="btn btn-sm btn-primary">Manage</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="dashboard-section full-width">
                        <div className="section-header">
                            <h2>Recent Activity</h2>
                        </div>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-user-plus"></i>
                                </div>
                                <div className="activity-info">
                                    <h4>New student enrolled: Ahmad Rizki</h4>
                                    <p>1 hour ago</p>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-star"></i>
                                </div>
                                <div className="activity-info">
                                    <h4>New 5-star review from Siti Nurhaliza</h4>
                                    <p>3 hours ago</p>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="activity-info">
                                    <h4>Student completed course: "AR Learning Basics"</h4>
                                    <p>1 day ago</p>
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
                mentor={selectedStudent}
            />
        </div>
    )
}

export default MentorDashboard
