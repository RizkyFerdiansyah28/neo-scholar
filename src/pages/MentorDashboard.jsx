import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatModal from '../components/ChatModal'
import CRUDModal from '../components/CRUDModal'
import '../styles/Dashboard.css'

function MentorDashboard({ setIsLoggedIn }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const [showChatModal, setShowChatModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)

    const [showCrudModal, setShowCrudModal] = useState(false)
    const [crudMode, setCrudMode] = useState('create')
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [myCourses, setMyCourses] = useState([])

    // Data dummy students
    const students = [
        { id: 1, name: 'Ahmad Rizki', course: 'Video Animasi', image: '/assets/images/mentors/debbi.jpeg', progress: 75 },
        { id: 2, name: 'Siti Nurhaliza', course: 'AR Struktur Bumi', image: '/assets/images/mentors/jawad.jpeg', progress: 45 }
    ]

    // --- FETCH COURSES ---
    const fetchCourses = async (currentUserId) => {
        try {
            // Menggunakan /api (Vite Proxy akan mengarahkannya ke XAMPP)
            // Tambahkan timestamp untuk menghindari cache data
            const response = await fetch(`/api/courses.php?mentor_id=${currentUserId}&t=${Date.now()}`);
            const data = await response.json();
            
            if (Array.isArray(data)) {
                // Pastikan data stats ada
                const formattedData = data.map(item => ({
                    ...item,
                    stats: item.stats || '0 Students • Active'
                }));
                setMyCourses(formattedData);
            } else {
                setMyCourses([]);
            }
        } catch (error) {
            console.error("Gagal mengambil data course:", error);
            setMyCourses([]);
        }
    }

    useEffect(() => {
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        const userRole = localStorage.getItem('userRole')
        const storedUsername = localStorage.getItem('username')
        const storedUserId = localStorage.getItem('userId')

        if (!userLoggedIn || userLoggedIn !== 'true') {
            navigate('/login')
        } else if (userRole !== 'mentor') {
            navigate(userRole === 'admin' ? '/admin/dashboard' : '/dashboard')
        } else {
            setUsername(storedUsername || 'Mentor')
            setUserId(storedUserId)
            setIsLoading(false)
            
            if (storedUserId) {
                fetchCourses(storedUserId);
            }
        }
    }, [navigate])

    const handleChatClick = (student) => {
        setSelectedStudent(student)
        setShowChatModal(true)
    }

    const handleAddCourseClick = () => {
        setCrudMode('create')
        setSelectedCourse(null)
        setShowCrudModal(true)
    }

    const handleEditCourseClick = (course) => {
        setCrudMode('edit')
        setSelectedCourse(course)
        setShowCrudModal(true)
    }

    const handleDeleteCourseClick = (course) => {
        setCrudMode('delete')
        setSelectedCourse(course)
        setShowCrudModal(true)
    }

    // --- FUNGSI SAVE (UPLOAD & UPDATE) ---
    const handleSaveCourse = async (formDataState) => {
        try {
            // Gunakan FormData agar file gambar terkirim dengan benar
            const formData = new FormData();
            
            // Masukkan data teks
            formData.append('title', formDataState.title);
            formData.append('description', formDataState.description);
            formData.append('price', formDataState.price);
            formData.append('type', formDataState.type); 
            
            // Masukkan Mentor ID
            if (userId) formData.append('mentor_id', userId);
            
            // Jika Edit/Delete, butuh ID
            if (crudMode === 'edit' || crudMode === 'delete') {
                formData.append('id', formDataState.id);
            }

            // Masukkan File Gambar HANYA jika ada file baru yang dipilih
            if (formDataState.image instanceof File) {
                formData.append('image', formDataState.image);
            }

            // Tentukan Endpoint & Method
            // Kita gunakan POST untuk Create & Edit (karena PHP handle via FormData)
            let url = '/api/courses.php'; 
            let method = 'POST';
            let bodyData = formData;

            // Khusus DELETE
            if (crudMode === 'delete') {
                method = 'DELETE';
                // Jika server PHP support DELETE body JSON:
                bodyData = JSON.stringify({ id: formDataState.id }); 
                // Header JSON diperlukan jika mengirim JSON body
            }

            const options = {
                method: method,
                body: bodyData
            };
            
            // Tambahkan header JSON khusus untuk DELETE (jika pakai JSON)
            if (crudMode === 'delete') {
               options.headers = { 'Content-Type': 'application/json' };
            }

            const response = await fetch(url, options);
            
            // Cek respons text dulu untuk jaga-jaga jika bukan JSON
            const responseText = await response.text();

            try {
                const result = JSON.parse(responseText);
                if (response.ok) {
                    alert(result.message || 'Berhasil!');
                    fetchCourses(userId); // Refresh list
                    setShowCrudModal(false); // Tutup modal
                } else {
                    alert("Gagal: " + (result.message || 'Terjadi kesalahan'));
                }
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError, responseText);
                alert("Server Error (Respons tidak valid)");
            }

        } catch (error) {
            console.error("Error saving:", error);
            alert("Terjadi kesalahan koneksi.");
        }
    }

    // Fungsi Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    }

    if (isLoading) return <div className="dashboard-loading"><div className="spinner"></div>Loading...</div>

    return (
        <div className="dashboard mentor-dashboard">
            <div className="dashboard-header">
                <div className="container">
                    <div className="dashboard-welcome">
                        <h1>Mentor Dashboard - Selamat Datang, {username}! 👨‍🏫</h1>
                        <p>Kelola siswa dan kursus Anda</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="container">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-book-open"></i></div>
                            <div className="stat-info">
                                <h3>{myCourses.length}</h3>
                                <p>Active Courses</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-users"></i></div>
                            <div className="stat-info"><h3>45</h3><p>Total Students</p></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-star"></i></div>
                            <div className="stat-info"><h3>4.9</h3><p>Average Rating</p></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
                            <div className="stat-info"><h3>Rp 12.5M</h3><p>Earnings</p></div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        {/* Students Section */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h2>My Students</h2>
                                <a href="#" className="view-all">Lihat Semua →</a>
                            </div>
                            <div className="mentors-list">
                                {students.map((student) => (
                                    <div key={student.id} className="mentor-item">
                                        <img src={student.image} alt={student.name} onError={(e) => e.target.src='https://via.placeholder.com/50'} />
                                        <div className="mentor-info">
                                            <h4>{student.name}</h4>
                                            <p>{student.course}</p>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${student.progress}%` }}></div>
                                            </div>
                                            <p className="progress-text">{student.progress}% Complete</p>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleChatClick(student)}>
                                                <i className="fas fa-comment"></i> Chat
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Courses Section */}
                        <div className="dashboard-section">
                            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h2>My Courses</h2>
                                <button className="btn btn-sm btn-success" onClick={handleAddCourseClick}>
                                    <i className="fas fa-plus"></i> Tambah
                                </button>
                            </div>
                            <div className="courses-list">
                                {myCourses.length === 0 ? (
                                    <p style={{ padding: '20px', color: '#666' }}>Belum ada kursus yang Anda upload.</p>
                                ) : (
                                    myCourses.map((course) => (
                                        <div key={course.id} className="course-item">
                                            {/* PERBAIKAN GAMBAR:
                                                1. Menggunakan course.image langsung (karena Proxy /assets sudah aktif).
                                                2. Menambahkan timestamp (?t=...) agar gambar update saat diedit.
                                                3. Menambahkan onError ke path yang BENAR (/assets/...) atau placeholder.
                                            */}
                                            <img 
                                                src={`${course.image}?t=${Date.now()}`} 
                                                alt={course.title} 
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    // Gunakan path lengkap /assets/... jika path database relatif, atau placeholder online
                                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                }}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                            <div className="course-info">
                                                <h3>{course.title}</h3>
                                                <p className="course-stats">
                                                    <strong>{formatRupiah(course.price)}</strong>
                                                    <span style={{fontSize:'12px', color:'#666', marginLeft:'8px'}}>({course.type})</span>
                                                </p>
                                                <div style={{ marginTop: '10px' }}>
                                                    <button className="btn btn-sm btn-primary" onClick={() => handleEditCourseClick(course)} style={{ marginRight: '5px' }}>Edit</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCourseClick(course)}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-section full-width">
                        <div className="section-header"><h2>Recent Activity</h2></div>
                        <div className="activity-list">
                             <div className="activity-item">
                                <div className="activity-icon"><i className="fas fa-user-plus"></i></div>
                                <div className="activity-info">
                                    <h4>New student enrolled: Ahmad Rizki</h4>
                                    <p>1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChatModal isOpen={showChatModal} onClose={() => setShowChatModal(false)} mentor={selectedStudent} />
            
            <CRUDModal 
                isOpen={showCrudModal}
                onClose={() => setShowCrudModal(false)}
                mode={crudMode}
                type="course" // Pastikan type modal 'course'
                data={selectedCourse}
                onSave={handleSaveCourse}
            />
        </div>
    )
}

export default MentorDashboard