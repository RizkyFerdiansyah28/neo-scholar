import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CRUDModal from '../components/CRUDModal'
import ReportsModal from '../components/ReportsModal'
import '../styles/Dashboard.css'
import '../styles/AdminDashboard.css'

function AdminDashboard({ setIsLoggedIn }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // CRUD Modal States
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('create') // create, edit, delete
    const [modalType, setModalType] = useState('user') // user, course
    const [selectedData, setSelectedData] = useState(null)

    // Reports Modal State
    const [showReportsModal, setShowReportsModal] = useState(false)

    // Data States
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'client', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'mentor', status: 'active' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'client', status: 'inactive' },
        { id: 4, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' }
    ])

    const [courses, setCourses] = useState([
        {
            id: 1,
            title: 'Video Pembelajaran Animasi 2D',
            description: 'Learn 2D animation from scratch',
            price: 'Rp 1,250,000',
            category: 'animation',
            image: '/images/products/Animasi2d.jpeg',
            students: 156,
            rating: 4.8
        },
        {
            id: 2,
            title: 'AR Learning - Struktur Bumi',
            description: 'Interactive AR learning experience',
            price: 'Rp 1,500,000',
            category: 'ar-vr',
            image: '/images/products/ARstrukturbumi.jpeg',
            students: 89,
            rating: 4.9
        },
        {
            id: 3,
            title: 'Board Game Edukasi',
            description: 'Educational board game design',
            price: 'Rp 850,000',
            category: 'design',
            image: '/images/products/Bgameoperasihitungan.jpeg',
            students: 234,
            rating: 4.7
        }
    ])

    // Load data from localStorage on mount
    useEffect(() => {
        const savedUsers = localStorage.getItem('adminUsers')
        const savedCourses = localStorage.getItem('adminCourses')

        if (savedUsers) setUsers(JSON.parse(savedUsers))
        if (savedCourses) setCourses(JSON.parse(savedCourses))
    }, [])

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('adminUsers', JSON.stringify(users))
    }, [users])

    useEffect(() => {
        localStorage.setItem('adminCourses', JSON.stringify(courses))
    }, [courses])

    useEffect(() => {
        // Check if user is logged in and is admin
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        const userRole = localStorage.getItem('userRole')
        const storedUsername = localStorage.getItem('username')

        if (!userLoggedIn || userLoggedIn !== 'true') {
            navigate('/login')
        } else if (userRole !== 'admin') {
            // Redirect to appropriate dashboard based on role
            navigate(userRole === 'mentor' ? '/mentor/dashboard' : '/dashboard')
        } else {
            setUsername(storedUsername || 'Admin')
            setIsLoading(false)
        }
    }, [navigate])

    // CRUD Functions
    const handleCreateUser = () => {
        setModalMode('create')
        setModalType('user')
        setSelectedData(null)
        setShowModal(true)
    }

    const handleEditUser = (user) => {
        setModalMode('edit')
        setModalType('user')
        setSelectedData(user)
        setShowModal(true)
    }

    const handleDeleteUser = (user) => {
        setModalMode('delete')
        setModalType('user')
        setSelectedData(user)
        setShowModal(true)
    }

    const handleCreateCourse = () => {
        setModalMode('create')
        setModalType('course')
        setSelectedData(null)
        setShowModal(true)
    }

    const handleEditCourse = (course) => {
        setModalMode('edit')
        setModalType('course')
        setSelectedData(course)
        setShowModal(true)
    }

    const handleDeleteCourse = (course) => {
        setModalMode('delete')
        setModalType('course')
        setSelectedData(course)
        setShowModal(true)
    }

    const handleSave = (data) => {
        if (modalType === 'user') {
            if (modalMode === 'create') {
                // Create new user
                const newUser = {
                    ...data,
                    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
                }
                setUsers([...users, newUser])
            } else if (modalMode === 'edit') {
                // Update existing user
                setUsers(users.map(u => u.id === selectedData.id ? { ...data, id: selectedData.id } : u))
            } else if (modalMode === 'delete') {
                // Delete user
                setUsers(users.filter(u => u.id !== data.id))
            }
        } else if (modalType === 'course') {
            if (modalMode === 'create') {
                // Create new course
                const newCourse = {
                    ...data,
                    id: courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1,
                    students: 0,
                    rating: 0
                }
                setCourses([...courses, newCourse])
            } else if (modalMode === 'edit') {
                // Update existing course
                setCourses(courses.map(c => c.id === selectedData.id ? { ...data, id: selectedData.id, students: selectedData.students, rating: selectedData.rating } : c))
            } else if (modalMode === 'delete') {
                // Delete course
                setCourses(courses.filter(c => c.id !== data.id))
            }
        }
    }

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
                <p>Loading Admin Dashboard...</p>
            </div>
        )
    }

    return (
        <div className="dashboard admin-dashboard">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <div className="container">
                    <div className="dashboard-welcome">
                        <h1>Admin Dashboard 👨‍💼</h1>
                        <p>Selamat datang, {username}! Kelola platform NeoScholar dengan mudah</p>
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
                                <h3>{users.length}</h3>
                                <p>Total Users</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-chalkboard-teacher"></i>
                            </div>
                            <div className="stat-info">
                                <h3>{users.filter(u => u.role === 'mentor').length}</h3>
                                <p>Active Mentors</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-book"></i>
                            </div>
                            <div className="stat-info">
                                <h3>{courses.length}</h3>
                                <p>Total Courses</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Rp 45.2M</h3>
                                <p>Monthly Revenue</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-section full-width">
                        <div className="section-header">
                            <h2>Quick Actions</h2>
                        </div>
                        <div className="quick-actions-grid">
                            <div className="quick-action-card" onClick={handleCreateUser}>
                                <div className="quick-action-icon">
                                    <i className="fas fa-user-plus"></i>
                                </div>
                                <h3 className="quick-action-title">Add User</h3>
                                <p className="quick-action-desc">Create new user account</p>
                            </div>
                            <div className="quick-action-card" onClick={handleCreateCourse}>
                                <div className="quick-action-icon">
                                    <i className="fas fa-book-medical"></i>
                                </div>
                                <h3 className="quick-action-title">Add Course</h3>
                                <p className="quick-action-desc">Create new course</p>
                            </div>
                            <div className="quick-action-card" onClick={() => handleCreateUser()}>
                                <div className="quick-action-icon">
                                    <i className="fas fa-user-tie"></i>
                                </div>
                                <h3 className="quick-action-title">Add Mentor</h3>
                                <p className="quick-action-desc">Register new mentor</p>
                            </div>
                            <div className="quick-action-card" onClick={() => setShowReportsModal(true)}>
                                <div className="quick-action-icon">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <h3 className="quick-action-title">View Reports</h3>
                                <p className="quick-action-desc">Analytics & insights</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Dashboard Grid */}
                    <div className="dashboard-grid">
                        {/* User Management */}
                        <div className="dashboard-section">
                            <div className="admin-card">
                                <div className="admin-card-header">
                                    <div className="admin-card-title">
                                        <div className="admin-card-icon">
                                            <i className="fas fa-users"></i>
                                        </div>
                                        User Management
                                    </div>
                                    <button className="btn-sm btn-success" onClick={handleCreateUser}>
                                        <i className="fas fa-plus"></i> Add User
                                    </button>
                                </div>
                                <div className="admin-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <strong>{user.name}</strong>
                                                        <br />
                                                        <small style={{ color: '#718096' }}>{user.email}</small>
                                                    </td>
                                                    <td>
                                                        <span className={`badge badge-${user.role}`}>
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-${user.status}`}>
                                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-sm"
                                                            onClick={() => handleEditUser(user)}
                                                            style={{ marginRight: '8px' }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn-sm btn-danger"
                                                            onClick={() => handleDeleteUser(user)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Course Management */}
                        <div className="dashboard-section">
                            <div className="admin-card">
                                <div className="admin-card-header">
                                    <div className="admin-card-title">
                                        <div className="admin-card-icon">
                                            <i className="fas fa-book"></i>
                                        </div>
                                        Course Management
                                    </div>
                                    <button className="btn-sm btn-success" onClick={handleCreateCourse}>
                                        <i className="fas fa-plus"></i> Add Course
                                    </button>
                                </div>
                                <div className="courses-list">
                                    {courses.map((course) => (
                                        <div key={course.id} className="course-item">
                                            <img src={course.image} alt={course.title} />
                                            <div className="course-info">
                                                <h3>{course.title}</h3>
                                                <p className="course-stats">
                                                    <i className="fas fa-users"></i> {course.students} Students •
                                                    <i className="fas fa-star"></i> {course.rating}
                                                </p>
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                                    <button
                                                        className="btn-sm"
                                                        onClick={() => handleEditCourse(course)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-sm btn-danger"
                                                        onClick={() => handleDeleteCourse(course)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="dashboard-section full-width">
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <div className="admin-card-title">
                                    <div className="admin-card-icon">
                                        <i className="fas fa-history"></i>
                                    </div>
                                    Recent Activity
                                </div>
                            </div>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-user-plus"></i>
                                    </div>
                                    <div className="activity-info">
                                        <h4>New user registered: Ahmad Rizki</h4>
                                        <p>5 minutes ago</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-book"></i>
                                    </div>
                                    <div className="activity-info">
                                        <h4>New course published: "Python for Beginners"</h4>
                                        <p>1 hour ago</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-dollar-sign"></i>
                                    </div>
                                    <div className="activity-info">
                                        <h4>New transaction: Rp 1,250,000</h4>
                                        <p>2 hours ago</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-user-tie"></i>
                                    </div>
                                    <div className="activity-info">
                                        <h4>New mentor approved: Sarah Johnson</h4>
                                        <p>3 hours ago</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-star"></i>
                                    </div>
                                    <div className="activity-info">
                                        <h4>Course "AR Learning" received 5-star review</h4>
                                        <p>5 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CRUD Modal */}
            <CRUDModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                mode={modalMode}
                type={modalType}
                data={selectedData}
                onSave={handleSave}
            />

            {/* Reports Modal */}
            <ReportsModal
                isOpen={showReportsModal}
                onClose={() => setShowReportsModal(false)}
            />
        </div>
    )
}

export default AdminDashboard
