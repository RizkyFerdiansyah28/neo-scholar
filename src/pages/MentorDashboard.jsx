import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CRUDModal from '../components/CRUDModal'
import '../styles/MentorDashboard.css'

function MentorDashboard() {
    const navigate = useNavigate()
    const [mentorName, setMentorName] = useState('')
    const [mentorId, setMentorId] = useState(null)
    const [activeTab, setActiveTab] = useState('dashboard') // Ubah default tab jadi dashboard
    const [isLoading, setIsLoading] = useState(true)

    // Data State
    const [stats, setStats] = useState({
        total_courses: 0,
        total_students: 0,
        total_revenue: 0
    })
    const [courses, setCourses] = useState([])
    const [profileData, setProfileData] = useState({
        id: '', username: '', email: '', specialization: '', bio: '', avatar: '', rating: 0, created_at: ''
    })
    
    // Upload State
    const [avatarFile, setAvatarFile] = useState(null)
    const [previewAvatar, setPreviewAvatar] = useState(null)

    // Modal State
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('create')
    const [selectedCourse, setSelectedCourse] = useState(null)

    useEffect(() => {
        const checkSession = async () => {
            const userLoggedIn = localStorage.getItem('userLoggedIn')
            const userRole = localStorage.getItem('userRole')
            const storedId = localStorage.getItem('userId')

            if (!userLoggedIn) {
                navigate('/login')
            } else if (userRole !== 'mentor') {
                alert('Akses Ditolak. Halaman ini khusus Mentor.')
                navigate('/dashboard')
            } else {
                setMentorId(storedId)
                await fetchData(storedId)
            }
        }
        checkSession()
    }, [navigate])

    const fetchData = async (id) => {
        try {
            setIsLoading(true)
            
            // 1. Ambil Statistik (BARU)
            const statsRes = await fetch(`/api/mentor_stats.php?mentor_id=${id}&t=${Date.now()}`)
            const statsData = await statsRes.json()
            if (statsRes.ok) setStats(statsData)

            // 2. Ambil Profil
            const userRes = await fetch(`/api/users.php?id=${id}&t=${Date.now()}`)
            const userData = await userRes.json()
            if (userData) {
                setMentorName(userData.username)
                setProfileData({
                    id: userData.id,
                    username: userData.username,
                    email: userData.email,
                    specialization: userData.specialization || '',
                    bio: userData.bio || '',
                    avatar: userData.avatar || '',
                    rating: userData.rating || 0,
                    created_at: userData.created_at
                })
            }

            // 3. Ambil Kursus
            const coursesRes = await fetch(`/api/courses.php?mentor_id=${id}&t=${Date.now()}`)
            const coursesData = await coursesRes.json()
            setCourses(Array.isArray(coursesData) ? coursesData : [])

        } catch (error) {
            console.error("Error loading data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number)
    }

    // --- HANDLERS PROFILE & COURSE ---
    const handleProfileChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'avatar') {
            const file = files[0]
            setAvatarFile(file)
            setPreviewAvatar(URL.createObjectURL(file))
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('action', 'update_profile')
            formData.append('id', mentorId)
            formData.append('username', profileData.username)
            formData.append('email', profileData.email)
            formData.append('specialization', profileData.specialization)
            formData.append('bio', profileData.bio)
            if (avatarFile) formData.append('avatar', avatarFile)

            const res = await fetch('/api/users.php', { method: 'POST', body: formData })
            if (res.ok) {
                alert("Profil berhasil diperbarui!")
                fetchData(mentorId)
            } else { alert("Gagal update profil"); }
        } catch (error) { alert("Terjadi kesalahan koneksi"); }
    }

    const handleCreate = () => { setModalMode('create'); setSelectedCourse(null); setShowModal(true); }
    const handleEdit = (course) => { setModalMode('edit'); setSelectedCourse(course); setShowModal(true); }
    const handleDelete = (course) => { setModalMode('delete'); setSelectedCourse(course); setShowModal(true); }

    const handleSaveCourse = async (data) => {
        try {
            const formData = new FormData();
            if (data.id) formData.append('id', data.id);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('type', data.type);
            formData.append('mentor_id', mentorId);
            if (data.image instanceof File) formData.append('image', data.image);

            let options = { method: 'POST', body: formData };
            if (modalMode === 'delete') {
                await fetch(`/api/courses.php?id=${data.id}`, { method: 'DELETE' });
            } else {
                await fetch('/api/courses.php', options);
            }
            setShowModal(false);
            fetchData(mentorId);
        } catch (error) { alert("Gagal menyimpan data course."); }
    }

    const handleLogout = () => { localStorage.clear(); navigate('/login'); }

    if (isLoading) return <div className="loading-screen"><div className="spinner"></div></div>

    return (
        <div className="mentor-layout">
            {/* SIDEBAR */}
            <aside className="mentor-sidebar">
                <div className="sidebar-header">
                    <h2>NeoScholar</h2>
                    <span className="badge-mentor">MENTOR</span>
                </div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <i className="fas fa-home"></i> Dashboard
                    </button>
                    <button className={activeTab === 'courses' ? 'active' : ''} onClick={() => setActiveTab('courses')}>
                        <i className="fas fa-book-open"></i> Kelola Kursus
                    </button>
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                        <i className="fas fa-user-circle"></i> Edit Profil
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout"><i className="fas fa-sign-out-alt"></i> Logout</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="mentor-content">
                <header className="content-header">
                    <div className="welcome-text">
                        <h1>Selamat Datang, {mentorName}! 👋</h1>
                        <p>Pantau performa dan kelola kelas Anda.</p>
                    </div>
                    <div className="header-avatar">
                         <img src={profileData.avatar ? `${profileData.avatar}?t=${Date.now()}` : 'https://via.placeholder.com/40'} alt="Avatar" />
                    </div>
                </header>

                {/* --- STATISTIC CARDS (Fitur Baru) --- */}
                {activeTab === 'dashboard' && (
                    <div className="tab-section">
                        <div className="dashboard-stats-grid">
                            <div className="stat-card blue">
                                <div className="stat-icon"><i className="fas fa-book"></i></div>
                                <div className="stat-info">
                                    <h3>{stats.total_courses}</h3>
                                    <p>Total Kursus</p>
                                </div>
                            </div>
                            <div className="stat-card green">
                                <div className="stat-icon"><i className="fas fa-users"></i></div>
                                <div className="stat-info">
                                    <h3>{stats.total_students}</h3>
                                    <p>Total Siswa</p>
                                </div>
                            </div>
                            <div className="stat-card orange">
                                <div className="stat-icon"><i className="fas fa-wallet"></i></div>
                                <div className="stat-info">
                                    <h3>{formatRupiah(stats.total_revenue)}</h3>
                                    <p>Total Pendapatan</p>
                                </div>
                            </div>
                        </div>

                        {/* Ringkasan Kursus Terbaru di Dashboard */}
                        <div className="section-title" style={{ marginTop: '30px' }}>
                            <h2>Kursus Terbaru Anda</h2>
                            <button className="btn-text" onClick={() => setActiveTab('courses')}>Lihat Semua →</button>
                        </div>
                        <div className="courses-grid">
                            {courses.slice(0, 3).map(course => (
                                <div key={course.id} className="course-card">
                                    <div className="card-img">
                                        <img src={course.image} alt={course.title} />
                                    </div>
                                    <div className="card-body">
                                        <h3>{course.title}</h3>
                                        <p className="price">{formatRupiah(course.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB: COURSES --- */}
                {activeTab === 'courses' && (
                    <div className="tab-section">
                        <div className="section-title">
                            <h2>Daftar Kursus Saya</h2>
                            <button className="btn-primary" onClick={handleCreate}><i className="fas fa-plus"></i> Tambah Kursus</button>
                        </div>
                        <div className="courses-grid">
                            {courses.map(course => (
                                <div key={course.id} className="course-card">
                                    <div className="card-img">
                                        <img src={course.image} alt={course.title} />
                                        <span className="course-type">{course.type}</span>
                                    </div>
                                    <div className="card-body">
                                        <h3>{course.title}</h3>
                                        <p className="price">{formatRupiah(course.price)}</p>
                                        <div className="card-actions">
                                            <button className="btn-icon edit" onClick={() => handleEdit(course)}><i className="fas fa-edit"></i></button>
                                            <button className="btn-icon delete" onClick={() => handleDelete(course)}><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB: PROFILE --- */}
                {activeTab === 'profile' && (
                    <div className="tab-section">
                        <div className="section-title"><h2>Edit Profil Profesional</h2></div>
                        <form className="profile-form-container" onSubmit={handleSaveProfile}>
                            <div className="profile-left">
                                <div className="avatar-upload">
                                    <img src={previewAvatar || (profileData.avatar ? `${profileData.avatar}?t=${Date.now()}` : 'https://via.placeholder.com/150')} alt="Profile" />
                                    <label htmlFor="avatarInput" className="btn-upload-avatar"><i className="fas fa-camera"></i> Ganti Foto</label>
                                    <input id="avatarInput" type="file" name="avatar" onChange={handleProfileChange} accept="image/*" hidden />
                                </div>
                                <div className="mentor-stats">
                                    <div className="stat-item"><span className="stat-label">Rating</span><span className="stat-value">⭐ {profileData.rating}</span></div>
                                </div>
                            </div>
                            <div className="profile-right">
                                <div className="form-group"><label>Nama Lengkap</label><input type="text" name="username" value={profileData.username} onChange={handleProfileChange} required /></div>
                                <div className="form-group"><label>Email</label><input type="email" name="email" value={profileData.email} onChange={handleProfileChange} required /></div>
                                <div className="form-group"><label>Bidang Keahlian</label><input type="text" name="specialization" value={profileData.specialization} onChange={handleProfileChange} /></div>
                                <div className="form-group"><label>Bio</label><textarea name="bio" value={profileData.bio} onChange={handleProfileChange} rows="5"></textarea></div>
                                <div className="form-actions"><button type="submit" className="btn-save-profile">Simpan Perubahan</button></div>
                            </div>
                        </form>
                    </div>
                )}
            </main>
            <CRUDModal isOpen={showModal} onClose={() => setShowModal(false)} mode={modalMode} type="course" data={selectedCourse} onSave={handleSaveCourse} />
        </div>
    )
}

export default MentorDashboard