import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatModal from '../components/ChatModal'
import CRUDModal from '../components/CRUDModal'
import '../styles/Dashboard.css'

function MentorDashboard({ setIsLoggedIn }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState(null) // Simpan User ID di state
    const [isLoading, setIsLoading] = useState(true)
    
    const [showChatModal, setShowChatModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)

    const [showCrudModal, setShowCrudModal] = useState(false)
    const [crudMode, setCrudMode] = useState('create')
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [myCourses, setMyCourses] = useState([])

    // Data dummy students
    const students = [
        { id: 1, name: 'Ahmad Rizki', course: 'Video Animasi', image: '/images/mentors/debbi.jpeg', progress: 75 },
        { id: 2, name: 'Siti Nurhaliza', course: 'AR Struktur Bumi', image: '/images/mentors/jawad.jpeg', progress: 45 }
    ]

    // --- FETCH COURSES BY MENTOR ID ---
    const fetchCourses = async (currentUserId) => {
        try {
            // Kirim parameter mentor_id ke API
            const response = await fetch(`http://localhost:3000/api/courses.php?mentor_id=${currentUserId}`);
            const data = await response.json();
            
            // Handle jika data kosong atau error
            if (Array.isArray(data)) {
                const formattedData = data.map(item => ({
                    ...item,
                    stats: '0 Students • New'
                }));
                setMyCourses(formattedData);
            } else {
                setMyCourses([]);
            }
        } catch (error) {
            console.error("Gagal mengambil data course:", error);
        }
    }

    useEffect(() => {
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        const userRole = localStorage.getItem('userRole')
        const storedUsername = localStorage.getItem('username')
        const storedUserId = localStorage.getItem('userId') // Ambil ID dari Login

        if (!userLoggedIn || userLoggedIn !== 'true') {
            navigate('/login')
        } else if (userRole !== 'mentor') {
            navigate(userRole === 'admin' ? '/admin/dashboard' : '/dashboard')
        } else {
            setUsername(storedUsername || 'Mentor')
            setUserId(storedUserId) // Set ID ke state
            setIsLoading(false)
            
            // Panggil fetch dengan ID yang baru diambil dari localStorage
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


    const handleSaveCourse = async (formDataState) => {
        try {
            const formData = new FormData();
            
            formData.append('title', formDataState.title);
            formData.append('description', formDataState.description);
            formData.append('price', formDataState.price);
            
            // --- GANTI DI SINI ---
            // Kirim 'type' bukan 'category'
            formData.append('type', formDataState.type); 
            
            if (userId) formData.append('mentor_id', userId);
            
            if (crudMode === 'edit' || crudMode === 'delete') {
                formData.append('id', formDataState.id);
            }

            if (formDataState.image instanceof File) {
                formData.append('image', formDataState.image);
            }

            let url = 'http://localhost:3000/api/courses.php';
            let method = 'POST';

            if (crudMode === 'delete') {
                method = 'DELETE';
                url = `http://localhost:3000/api/courses.php?id=${formDataState.id}`;
            }

            const options = {
                method: method,
                body: crudMode === 'delete' ? null : formData 
            };

            const response = await fetch(url, options);
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                fetchCourses(userId);
            } else {
                alert("Gagal: " + result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan koneksi.");
        }
    }

    // ... sisa code ...
    if (isLoading) return <div className="dashboard-loading">Loading...</div>

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
                        {/* ... Stats lainnya ... */}
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
                                            <img 
                                                src={course.image || '/images/products/Tamplateedukasi.jpeg'} 
                                                alt={course.title} 
                                                onError={(e) => e.target.src = '/images/products/Tamplateedukasi.jpeg'}
                                            />
                                            <div className="course-info">
                                                <h3>{course.title}</h3>
                                                <p className="course-stats">{course.price}</p>
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
                type="course"
                data={selectedCourse}
                onSave={handleSaveCourse}
            />
        </div>
    )
}

export default MentorDashboard