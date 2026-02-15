import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatModal from '../components/ChatModal'
import '../styles/Dashboard.css'

function Dashboard({ setIsLoggedIn }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [showChatModal, setShowChatModal] = useState(false)
    const [selectedMentor, setSelectedMentor] = useState(null)
    
    // State Pengajuan Mentor
    const [applicationStatus, setApplicationStatus] = useState('none') 

    const mentors = [
        { id: 1, name: 'Debbi Angelia Saputri', title: 'Tutor Bahasa Arab', image: '/images/mentors/debbi.jpeg' },
        { id: 2, name: 'Jawad At-Taqy', title: 'Tutor Manajemen', image: '/images/mentors/jawad.jpeg' }
    ]

    const handleChatClick = (mentor) => {
        setSelectedMentor(mentor)
        setShowChatModal(true)
    }

    useEffect(() => {
        const userLoggedIn = localStorage.getItem('userLoggedIn')
        const storedUsername = localStorage.getItem('username')
        const userId = localStorage.getItem('userId') // Ambil ID

        if (!userLoggedIn || userLoggedIn !== 'true') {
            navigate('/login')
        } else {
            setUsername(storedUsername || 'Pengguna')
            setIsLoading(false)

            // Cek status pengajuan mentor jika ada user ID
            if (userId) {
                fetch(`http://localhost:3000/api/mentor_applications.php?user_id=${userId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.status) {
                            setApplicationStatus(data.status);
                        }
                    })
                    .catch(err => console.error("Error checking application:", err));
            }
        }
    }, [navigate])

    const handleApplyMentor = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return alert("User ID tidak ditemukan. Silakan login ulang.");
        
        if (!confirm("Apakah Anda yakin ingin mengajukan diri sebagai mentor?")) return;

        try {
            const response = await fetch('http://localhost:3000/api/mentor_applications.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert("Pengajuan berhasil dikirim! Mohon tunggu persetujuan Admin.");
                setApplicationStatus('pending');
            } else {
                alert(result.message || "Gagal mengirim pengajuan.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan koneksi.");
        }
    };

    if (isLoading) return <div className="dashboard-loading"><div className="spinner"></div></div>;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="container">
                    <div className="dashboard-welcome">
                        <h1>Selamat Datang, {username}! 👋</h1>
                        <p>Kelola pembelajaran dan progres Anda di sini</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="container">
                    {/* --- FITUR BARU: PENGAJUAN MENTOR --- */}
                    <div className="dashboard-section full-width">
                        <div className="section-header">
                            <h2>Menjadi Mentor</h2>
                        </div>
                        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <p>Bagikan keahlianmu dan bantu siswa lain belajar dengan menjadi mentor di NeoScholar.</p>
                            <div style={{ marginTop: '15px' }}>
                                {applicationStatus === 'none' && (
                                    <button className="btn btn-primary" onClick={handleApplyMentor}>
                                        Ajukan Jadi Mentor
                                    </button>
                                )}
                                {applicationStatus === 'pending' && (
                                    <button className="btn" style={{backgroundColor: '#ecc94b', color: '#fff', cursor: 'default'}}>
                                        <i className="fas fa-clock"></i> Menunggu Persetujuan Admin
                                    </button>
                                )}
                                {applicationStatus === 'approved' && (
                                    <div className="alert alert-success">
                                        Selamat! Anda sudah menjadi Mentor. Silakan login ulang.
                                    </div>
                                )}
                                {applicationStatus === 'rejected' && (
                                    <div>
                                        <div className="alert alert-danger" style={{marginBottom: '10px'}}>
                                            Pengajuan ditolak.
                                        </div>
                                        <button className="btn btn-primary" onClick={handleApplyMentor}>
                                            Ajukan Kembali
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* ------------------------------------ */}

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-book-open"></i></div>
                            <div className="stat-info"><h3>5</h3><p>Kursus Aktif</p></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><i className="fas fa-certificate"></i></div>
                            <div className="stat-info"><h3>12</h3><p>Sertifikat</p></div>
                        </div>
                         {/* Stats lainnya... */}
                    </div>

                    <div className="dashboard-grid">
                        <div className="dashboard-section">
                            <div className="section-header"><h2>Kursus Saya</h2></div>
                            {/* Course List Placeholder */}
                            <p>Daftar kursus...</p>
                        </div>
                        <div className="dashboard-section">
                            <div className="section-header"><h2>Mentor Saya</h2></div>
                            <div className="mentors-list">
                                {mentors.map((mentor) => (
                                    <div key={mentor.id} className="mentor-item">
                                        <img src={mentor.image} alt={mentor.name} onError={(e) => e.target.src='https://via.placeholder.com/50'} />
                                        <div className="mentor-info">
                                            <h4>{mentor.name}</h4>
                                            <p>{mentor.title}</p>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleChatClick(mentor)}>Chat</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChatModal isOpen={showChatModal} onClose={() => setShowChatModal(false)} mentor={selectedMentor} />
        </div>
    )
}

export default Dashboard