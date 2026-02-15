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

                // PERBAIKAN 1: Gunakan '/api' (mengandalkan Proxy di vite.config.js)
                // Tambahkan timestamp untuk mencegah cache
                const [usersRes, coursesRes] = await Promise.all([
                    fetch(`/api/users.php?t=${Date.now()}`),
                    fetch(`/api/courses.php?t=${Date.now()}`)
                ]);

                const usersData = await usersRes.json();
                const coursesData = await coursesRes.json();

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

    // --- PERHITUNGAN STATISTIK ---
    const totalUsers = users.length;
    const activeMentors = users.filter(u => u.role === 'mentor').length;
    const totalCourses = courses.length;
    const totalRevenue = courses.reduce((acc, curr) => {
        return acc + (parseFloat(curr.price) || 0);
    }, 0);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    }

    // --- FUNGSI CRUD ---
    const handleCreateUser = () => { setModalMode('create'); setModalType('user'); setSelectedData(null); setShowModal(true); }
    const handleEditUser = (user) => { setModalMode('edit'); setModalType('user'); setSelectedData(user); setShowModal(true); }
    const handleDeleteUser = (user) => { setModalMode('delete'); setModalType('user'); setSelectedData(user); setShowModal(true); }

    const handleCreateCourse = () => { setModalMode('create'); setModalType('course'); setSelectedData(null); setShowModal(true); }
    const handleEditCourse = (course) => { setModalMode('edit'); setModalType('course'); setSelectedData(course); setShowModal(true); }
    const handleDeleteCourse = (course) => { setModalMode('delete'); setModalType('course'); setSelectedData(course); setShowModal(true); }

    // --- FUNGSI SIMPAN (Disamakan dengan MentorDashboard) ---
    const handleSave = async (data) => {
        try {
            let endpoint = modalType === 'user' ? 'users' : 'courses';
            let url = `/api/${endpoint}.php`; // Gunakan path relative
            let options = {};

            // A. LOGIKA UNTUK COURSE (Pakai FormData agar upload gambar jalan)
            if (modalType === 'course') {
                if (modalMode === 'delete') {
                     // Delete Course
                     options = {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: data.id })
                    };
                } else {
                    // Create / Edit Course
                    const formData = new FormData();
                    if (data.id) formData.append('id', data.id);
                    
                    formData.append('title', data.title);
                    formData.append('description', data.description);
                    formData.append('price', data.price);
                    formData.append('type', data.type); 
                    
                    // Admin perlu set mentor_id (default ke user yg login atau ID 1)
                    const currentUserId = localStorage.getItem('userId') || '1';
                    formData.append('mentor_id', currentUserId);

                    if (data.image instanceof File) {
                        formData.append('image', data.image);
                    }

                    options = {
                        method: 'POST', // Selalu POST untuk FormData
                        body: formData
                    };
                }
            } 
            // B. LOGIKA UNTUK USER (Pakai JSON biasa)
            else {
                if (modalMode === 'delete') {
                     options = {
                        method: 'POST', // Asumsi users.php pakai POST untuk delete atau sesuaikan
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: data.id, action: 'delete' }) // Sesuaikan jika backend butuh flag action
                    };
                    // Jika users.php support DELETE method murni:
                    // options.method = 'DELETE';
                    // options.body = JSON.stringify({ id: data.id });
                    
                    // Jaga-jaga pakai query param kalau method DELETE strict:
                    if (modalMode === 'delete') url += `?id=${data.id}`;
                    options = { method: 'DELETE' };

                } else {
                    // Create / Edit User
                    options = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    };
                }
            }

            const response = await fetch(url, options);

            // Parsing response aman
            const responseText = await response.text();
            try {
                const jsonRes = JSON.parse(responseText);
                if (response.ok) {
                    // Refresh data
                    const refreshRes = await fetch(`/api/${endpoint}.php?t=${Date.now()}`);
                    const refreshData = await refreshRes.json();

                    if (modalType === 'user') setUsers(refreshData);
                    else setCourses(refreshData);

                    setShowModal(false);
                } else {
                    alert('Gagal: ' + (jsonRes.message || 'Terjadi kesalahan'));
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                console.log("Response:", responseText);
                alert('Terjadi kesalahan server.');
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert('Terjadi kesalahan koneksi server.');
        }
    }

    if (isLoading) return <div className="dashboard-loading"><div className="spinner"></div><p>Memuat Data Dashboard...</p></div>;

    return (
        <div className="dashboard admin-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="container">
                    <div className="dashboard-welcome">
                        <h1>Admin Dashboard 捉窶昨汳ｼ</h1>
                        <p>Selamat datang, {username}! Kelola platform NeoScholar dengan mudah</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="dashboard-content">
                <div className="container">
                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-users"></i></div>
                            <div className="stat-info"><h3>{totalUsers}</h3><p>Total Users</p></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-chalkboard-teacher"></i></div>
                            <div className="stat-info"><h3>{activeMentors}</h3><p>Active Mentors</p></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-book"></i></div>
                            <div className="stat-info"><h3>{totalCourses}</h3><p>Total Courses</p></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
                            <div className="stat-info"><h3>{formatRupiah(totalRevenue)}</h3><p>Est. Total Nilai Kursus</p></div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-section full-width">
                        <div className="section-header"><h2>Quick Actions</h2></div>
                        <div className="quick-actions-grid">
                            <div className="quick-action-card" onClick={handleCreateUser}>
                                <div className="quick-action-icon"><i className="fas fa-user-plus"></i></div>
                                <h3 className="quick-action-title">Add User</h3>
                                <p className="quick-action-desc">Create new user account</p>
                            </div>
                            <div className="quick-action-card" onClick={handleCreateCourse}>
                                <div className="quick-action-icon"><i className="fas fa-book-medical"></i></div>
                                <h3 className="quick-action-title">Add Course</h3>
                                <p className="quick-action-desc">Create new course</p>
                            </div>
                            <div className="quick-action-card" onClick={handleCreateUser}>
                                <div className="quick-action-icon"><i className="fas fa-user-tie"></i></div>
                                <h3 className="quick-action-title">Add Mentor</h3>
                                <p className="quick-action-desc">Register new mentor</p>
                            </div>
                            <div className="quick-action-card" onClick={() => setShowReportsModal(true)}>
                                <div className="quick-action-icon"><i className="fas fa-chart-line"></i></div>
                                <h3 className="quick-action-title">View Reports</h3>
                                <p className="quick-action-desc">Analytics & insights</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="dashboard-grid">
                        {/* User Management */}
                        <div className="dashboard-section">
                            <div className="admin-card">
                                <div className="admin-card-header">
                                    <div className="admin-card-title"><i className="fas fa-users"></i> User Management</div>
                                    <button className="btn-sm btn-success" onClick={handleCreateUser}><i className="fas fa-plus"></i> Add User</button>
                                </div>
                                <div className="admin-table">
                                    <table>
                                        <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td><strong>{user.name}</strong><br /><small style={{ color: '#718096' }}>{user.email}</small></td>
                                                    <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                                                    <td><span className={`status-${user.status || 'active'}`}>{user.status || 'Active'}</span></td>
                                                    <td>
                                                        <button className="btn-sm" onClick={() => handleEditUser(user)} style={{ marginRight: '8px' }}>Edit</button>
                                                        <button className="btn-sm btn-danger" onClick={() => handleDeleteUser(user)}>Delete</button>
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
                                    <div className="admin-card-title"><i className="fas fa-book"></i> Course Management</div>
                                    <button className="btn-sm btn-success" onClick={handleCreateCourse}><i className="fas fa-plus"></i> Add Course</button>
                                </div>
                                <div className="courses-list">
                                    {courses.map((course) => (
                                        <div key={course.id} className="course-item">
                                            {/* PERBAIKAN 2: Image Source Logic disamakan dengan Mentor */}
                                            <img
                                                src={`${course.image}?t=${Date.now()}`}
                                                alt={course.title}
                                                onError={(e) => { 
                                                    e.target.onerror = null; 
                                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image'; 
                                                }}
                                                style={{ 
                                                    width: '80px', 
                                                    height: '80px', 
                                                    objectFit: 'cover', 
                                                    borderRadius: '8px', 
                                                    border: '1px solid #eee' 
                                                }}
                                            />
                                            <div className="course-info">
                                                <h3>{course.title}</h3>
                                                <p className="course-stats">
                                                    <strong>{formatRupiah(course.price)}</strong>
                                                    <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '8px' }}>({course.type})</span>
                                                </p>
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                                    <button className="btn-sm" onClick={() => handleEditCourse(course)}>Edit</button>
                                                    <button className="btn-sm btn-danger" onClick={() => handleDeleteCourse(course)}>Delete</button>
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

            <CRUDModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                mode={modalMode}
                type={modalType}
                data={selectedData}
                onSave={handleSave}
            />

            <ReportsModal
                isOpen={showReportsModal}
                onClose={() => setShowReportsModal(false)}
            />
        </div>
    )
}

export default AdminDashboard