import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Mentors.css' // Kita akan buat style sederhana di bawah

function Mentors() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Sesuaikan URL dengan konfigurasi server Anda (XAMPP atau PHP Serve)
        const API_URL = 'http://localhost/neo-scholar/api/users.php?role=mentor';
        // const API_URL = 'http://localhost:8000/api/users.php?role=mentor'; 

        setLoading(true);
        fetch(API_URL)
            .then(response => {
                if (!response.ok) throw new Error("Gagal mengambil data mentor");
                return response.json();
            })
            .then(data => {
                setMentors(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching mentors:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Helper untuk memberikan deskripsi keahlian dummy (karena di database user mungkin belum ada kolom bio)
    const getMentorExpertise = (index) => {
        const expertise = ['Web Development', 'Data Science', 'Digital Marketing', 'UI/UX Design', 'Cyber Security'];
        return expertise[index % expertise.length];
    };

    return (
        <div className="mentors-page">
            <section className="mentors-hero">
                <div className="container">
                    <h1>Mentor Profesional Kami</h1>
                    <p>Belajar langsung dari para ahli di bidangnya untuk meningkatkan karir Anda.</p>
                </div>
            </section>

            <section className="mentors-content">
                <div className="container">
                    {loading && <div className="loading">Memuat data mentor...</div>}
                    {error && <div className="error-msg">Error: {error}</div>}
                    
                    {!loading && !error && mentors.length === 0 && (
                        <div className="empty-msg">Belum ada mentor yang terdaftar.</div>
                    )}

                    <div className="mentors-grid">
                        {mentors.map((mentor, index) => (
                            <div key={mentor.id} className="mentor-card">
                                <div className="mentor-img-wrapper">
                                    {/* Gunakan ikon user jika gambar tidak valid/ada */}
                                    <i className="fas fa-chalkboard-teacher mentor-avatar-icon"></i>
                                </div>
                                <div className="mentor-info">
                                    <h3>{mentor.username}</h3>
                                    <p className="mentor-role">{getMentorExpertise(index)}</p>
                                    <p className="mentor-email">{mentor.email}</p>
                                    <Link to={`/profile/${mentor.id}`} className="btn btn-sm btn-primary">
            Lihat Profil
        </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Mentors