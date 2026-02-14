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
    const [users, setUsers] = useState([])
    const [courses, setCourses] = useState([])

    // Load data from API on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Menggunakan Promise.all agar fetch berjalan paralel (lebih cepat)
                // Pastikan port sesuai dengan backend Anda (biasanya 3000 atau 8000)
                const [usersRes, coursesRes] = await Promise.all([
                    fetch('http://localhost:3000/api/users.php'),
                    fetch('http://localhost:3000/api/courses.php')
                ]);

                const usersData = await usersRes.json();
                const coursesData = await coursesRes.json();

                // Pastikan data berupa array sebelum diset ke state
                setUsers(Array.isArray(usersData) ? usersData : []);
                setCourses(Array.isArray(coursesData) ? coursesData : []);

            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Cek login dan role admin
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        const userRole = localStorage.getItem('userRole')
        const storedUsername = localStorage.getItem('username')

        if (!userLoggedIn || userLoggedIn !== 'true') {
            navigate('/login')
        } else if (userRole !== 'admin') {
            alert('Akses Ditolak. Halaman ini hanya untuk Admin.');
            navigate(userRole === 'mentor' ? '/mentor/dashboard' : '/dashboard')
        } else {
            setUsername(storedUsername || 'Admin')
        }
    }, [navigate])

    // --- PERHITUNGAN STATISTIK DARI DATABASE ---
    const totalUsers = users.length;
    
    // Hitung mentor (Filter berdasarkan role 'mentor')
    // Jika ada kolom status, bisa ditambahkan: && u.status === 'active'
    const activeMentors = users.filter(u => u.role === 'mentor').length;
    
    const totalCourses = courses.length;
    
    // Hitung Revenue (Simulasi: Menjumlahkan harga semua course yang ada)
    // Note: Idealnya ini diambil dari tabel 'transactions' jika ada.
    const totalRevenue = courses.reduce((acc, curr) => {
        return acc + (parseFloat(curr.price) || 0);
    }, 0);

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    }

    // --- FUNGSI CRUD ---
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

    const handleSave = async (data) => {
        try {
            let endpoint = modalType === 'user' ? 'users' : 'courses';
            // Gunakan file .php
            let url = `http://localhost:3000/api/${endpoint}.php`; 
            let method = 'POST';

            if (modalMode === 'edit' || modalMode === 'delete') {
                // PHP API Anda menggunakan ?id= di query string untuk PUT/DELETE (berdasarkan users.php yg Anda upload)
                if (modalMode === 'edit') method = 'PUT';
                if (modalMode === 'delete') method = 'DELETE';
                
                // Tambahkan ID ke URL query string karena PHP menangkapnya lewat $_GET['id']
                url += `?id=${data.id}`;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: modalMode === 'delete' ? null : JSON.stringify(data)
            });

            if (response.ok) {
                // Refresh data setelah save sukses
                const refreshRes = await fetch(`http://localhost:3000/api/${endpoint}.php`);
                const refreshData = await refreshRes.json();

                if (modalType === 'user') {
                    setUsers(refreshData);
                } else {
                    setCourses(refreshData);
                }
                setShowModal(false); // Tutup modal otomatis setelah save
            } else {
                alert('Gagal menyimpan perubahan ke database.');
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert('Terjadi kesalahan koneksi server.');
        }
    }

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Memuat Data Dashboard...</p>
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
                    {/* Stats Cards - DATA DINAMIS */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-info">
                                {/* Menggunakan data totalUsers */}
                                <h3>{totalUsers}</h3>
                                <p>Total Users</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-chalkboard-teacher"></i>
                            </div>
                            <div className="stat-info">
                                {/* Menggunakan data activeMentors */}
                                <h3>{activeMentors}</h3>
                                <p>Active Mentors</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-book"></i>
                            </div>
                            <div className="stat-info">
                                {/* Menggunakan data totalCourses */}
                                <h3>{totalCourses}</h3>
                                <p>Total Courses</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="stat-info">
                                {/* Menggunakan data totalRevenue yang diformat */}
                                <h3>{formatRupiah(totalRevenue)}</h3>
                                <p>Est. Total Nilai Kursus</p>
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
                            <div className="quick-action-card" onClick={handleCreateUser}>
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
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-${user.status || 'active'}`}>
                                                            {user.status || 'Active'}
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
                                            <img
                                                src={course.image_url || '/images/default-course.jpg'}
                                                alt={course.title}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                            />
                                            <div className="course-info">
                                                <h3>{course.title}</h3>
                                                <p className="course-stats">
                                                    {/* Menampilkan harga kursus */}
                                                    <strong>{formatRupiah(course.price)}</strong>
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