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

    // Data States - Inisialisasi dengan array kosong
    const [users, setUsers] = useState([])
    const [courses, setCourses] = useState([])

    // Load data from API on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // 1. Ambil data Users dari Backend
                const usersResponse = await fetch('http://localhost:8000/users.php');
                const usersData = await usersResponse.json();
                setUsers(usersData);

                // 2. Ambil data Courses dari Backend
                const coursesResponse = await fetch('http://localhost:8000/courses.php');

                // 3. Di fungsi handleSave
                // Perhatikan penambahan "?id=" untuk PUT/DELETE karena PHP menangkapnya lewat $_GET['id']
                let url = modalType === 'user'
                    ? 'http://localhost:8000/users.php'
                    : 'http://localhost:8000/courses.php';

                if (modalMode === 'edit' || modalMode === 'delete') {
                    url += `?id=${data.id}`; // Ubah format URL agar sesuai dengan PHP $_GET['id']
                }
                const coursesData = await coursesResponse.json();
                setCourses(coursesData);

            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Check if user is logged in and is admin
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        const userRole = localStorage.getItem('userRole')
        const storedUsername = localStorage.getItem('username')

        if (!userLoggedIn || userLoggedIn !== 'true') {
            navigate('/login')
        } else if (userRole !== 'admin') {
            navigate(userRole === 'mentor' ? '/mentor/dashboard' : '/dashboard')
        } else {
            setUsername(storedUsername || 'Admin')
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

    // Fungsi Handle Save yang Terhubung ke API
    const handleSave = async (data) => {
        try {
            // Tentukan URL berdasarkan tipe data (users atau courses)
            // Menggunakan plural (user -> users, course -> courses)
            let endpoint = modalType === 'user' ? 'users' : 'courses';
            let url = `http://localhost:3000/api/${endpoint}`;
            let method = 'POST';

            // Jika Edit atau Delete, tambahkan ID ke URL
            if (modalMode === 'edit' || modalMode === 'delete') {
                url += `/${data.id}`;
            }

            // Tentukan HTTP Method
            if (modalMode === 'edit') method = 'PUT';
            if (modalMode === 'delete') method = 'DELETE';

            // Kirim Request ke Backend
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                // Body dikirim kecuali untuk metode DELETE
                body: modalMode === 'delete' ? null : JSON.stringify(data)
            });

            if (response.ok) {
                // Jika sukses, refresh data dari server agar tampilan update
                const refreshRes = await fetch(`http://localhost:3000/api/${endpoint}`);
                const refreshData = await refreshRes.json();

                if (modalType === 'user') {
                    setUsers(refreshData);
                } else {
                    setCourses(refreshData);
                }

                // Opsional: Tampilkan pesan sukses kecil
                // alert(`Data ${modalType} berhasil ${modalMode === 'create' ? 'dibuat' : modalMode === 'edit' ? 'diubah' : 'dihapus'}!`);
            } else {
                console.error("Server responded with error");
                alert('Gagal menyimpan perubahan ke database.');
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert('Terjadi kesalahan koneksi server.');
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
                                            {/* Handle image display if URL is not perfect */}
                                            <img
                                                src={course.image_url || course.image || '/images/default-course.jpg'}
                                                alt={course.title}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                            />
                                            <div className="course-info">
                                                <h3>{course.title}</h3>
                                                <p className="course-stats">
                                                    <i className="fas fa-users"></i> {course.students || course.total_students || 0} Students •
                                                    <i className="fas fa-star"></i> {course.rating || 0}
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
                                {/* Activity items can be fetched from API later */}
                                <div className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-user-plus"></i>
                                    </div>
                                    <div className="activity-info">
                                        <h4>New user registered: Ahmad Rizki</h4>
                                        <p>5 minutes ago</p>
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