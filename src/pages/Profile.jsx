import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/Profile.css'

function Profile() {
    const { id } = useParams()
    
    const [mentor, setMentor] = useState(null)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Ganti URL sesuai setup Anda (XAMPP atau PHP Serve)
        const BASE_URL = 'http://localhost/neo-scholar/api';

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Ambil Data User (Mentor)
                const userRes = await fetch(`${BASE_URL}/users.php?id=${id}`);
                if (!userRes.ok) throw new Error("Gagal mengambil data mentor");
                const userData = await userRes.json();
                setMentor(userData);

                // 2. Ambil Kursus milik Mentor ini
                const coursesRes = await fetch(`${BASE_URL}/courses.php?mentor_id=${id}`);
                if (coursesRes.ok) {
                    const coursesData = await coursesRes.json();
                    setCourses(Array.isArray(coursesData) ? coursesData : []);
                }

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Tampilan saat Loading atau Error diperindah
    if (loading) return (
        <div className="profile-status-container">
            <div className="loader"></div>
            <p>Memuat Profil...</p>
        </div>
    );
    
    if (error || !mentor) return (
        <div className="profile-status-container error">
            <i className="fas fa-exclamation-circle" style={{fontSize: '3rem', color: '#ff6b6b', marginBottom: '15px'}}></i>
            <p>{error ? `Error: ${error}` : "Mentor tidak ditemukan."}</p>
        </div>
    );

    return (
        <div className="profile-page">
            {/* --- Bagian Header Profil --- */}
            <section className="profile-header-section">
                <div className="container">
                    <div className="profile-card-wrapper">
                        <div className="profile-avatar-large">
                             <i className="fas fa-user-tie"></i>
                        </div>
                        <div className="profile-info-main">
                            <h1>{mentor.username}</h1>
                            <p className="profile-role-badge">
                                <i className="fas fa-chalkboard-teacher" style={{marginRight: '8px'}}></i>
                                {mentor.role.toUpperCase()}
                            </p>
                            <p className="profile-bio">
                                {mentor.bio ? mentor.bio : "Halo! Saya adalah mentor di Neo Scholar. Mari belajar bersama saya."}
                            </p>
                            
                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{courses.length}</span>
                                    <span className="stat-label">Kursus</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">4.8</span>
                                    <span className="stat-label">Rating</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">150+</span>
                                    <span className="stat-label">Siswa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Bagian Daftar Kursus Mentor --- */}
            <section className="profile-courses-section">
                <div className="container">
                    <div className="courses-section-header">
                        <h2>Kursus dari {mentor.username}</h2>
                        <div className="header-line"></div>
                    </div>
                    
                    <div className="courses-grid-profile">
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <div key={course.id} className="course-card-mini">
                                    <div className="course-img-mini">
                                        <img 
                                            src={course.image || '/assets/images/products/Tamplateedukasi.jpeg'} 
                                            alt={course.title}
                                            onError={(e) => { e.target.src = '/assets/images/products/Tamplateedukasi.jpeg'; }}
                                        />
                                        <div className="course-overlay">
                                            <span>Lihat Kelas</span>
                                        </div>
                                    </div>
                                    <div className="course-info-mini">
                                        <h3 title={course.title}>{course.title}</h3>
                                        <p className="course-price">Rp {parseInt(course.price).toLocaleString('id-ID')}</p>
                                        <button className="btn btn-sm btn-primary w-100" style={{ borderRadius: '8px', padding: '8px 0' }}>
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-courses">
                                <i className="fas fa-box-open"></i>
                                <p>Mentor ini belum menerbitkan kursus untuk saat ini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Profile