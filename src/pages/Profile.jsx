import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/Profile.css' // Style ada di langkah selanjutnya

function Profile() {
    const { id } = useParams() // Ambil ID dari URL (misal: /profile/5)
    
    const [mentor, setMentor] = useState(null)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Ganti URL sesuai setup Anda (XAMPP atau PHP Serve)
        const BASE_URL = 'http://localhost/neo-scholar/api';
        // const BASE_URL = 'http://localhost:8000/api'; 

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Ambil Data User (Mentor)
                const userRes = await fetch(`${BASE_URL}/users.php?id=${id}`);
                if (!userRes.ok) throw new Error("Gagal mengambil data mentor");
                const userData = await userRes.json();
                setMentor(userData);

                // 2. Ambil Kursus milik Mentor ini
                // Pastikan api/courses.php Anda sudah mendukung ?mentor_id=... (sudah ada di kode sebelumnya)
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

    if (loading) return <div className="profile-loading">Memuat Profil...</div>;
    if (error) return <div className="profile-error">Error: {error}</div>;
    if (!mentor) return <div className="profile-error">Mentor tidak ditemukan.</div>;

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
                            <p className="profile-role-badge">{mentor.role.toUpperCase()}</p>
                            <p className="profile-bio">{mentor.bio}</p>
                            
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
                    <h2>Kursus dari {mentor.username}</h2>
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
                                    </div>
                                    <div className="course-info-mini">
                                        <h3>{course.title}</h3>
                                        <p className="course-price">Rp {parseInt(course.price).toLocaleString('id-ID')}</p>
                                        <button className="btn btn-sm btn-outline-primary w-100">Lihat Detail</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">Mentor ini belum menerbitkan kursus.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Profile