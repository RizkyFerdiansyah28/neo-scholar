import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Login.css'

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('client') // Default role dropdown
    const [loginMessage, setLoginMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoginMessage('')

        if (!email || !password) {
            setLoginMessage('Email dan password wajib diisi!')
            setMessageType('error')
            return
        }

        try {
            const response = await fetch('http://localhost:3000/api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), 
                // Note: Role biasanya tidak dikirim untuk validasi login, 
                // tapi diambil dari hasil response database.
            });

            const data = await response.json();

            if (data.success) {
                setLoginMessage('Login berhasil! Mengalihkan...')
                setMessageType('success')

                // Simpan data penting ke LocalStorage
                localStorage.setItem('userLoggedIn', 'true')
                localStorage.setItem('username', data.user.name || data.user.username)
                localStorage.setItem('userRole', data.user.role) 
                
                // PENTING: ID User diperlukan untuk pengajuan mentor
                localStorage.setItem('userId', data.user.id)
                
                setIsLoggedIn(true)

                // Redirect sesuai Role dari Database
                setTimeout(() => {
                    const userRole = data.user.role;
                    
                    if (userRole === 'admin') {
                        navigate('/admin/dashboard');
                    } else if (userRole === 'mentor') {
                        navigate('/mentor/dashboard');
                    } else {
                        navigate('/dashboard');
                    }
                }, 1500)

            } else {
                setLoginMessage(data.message || 'Login gagal.')
                setMessageType('error')
            }
        } catch (error) {
            console.error("Login Error:", error);
            setLoginMessage('Terjadi kesalahan koneksi server.')
            setMessageType('error')
        }
    }

    return (
        <section className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login ke NeoScholar</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Dropdown role hanya visual di sini, karena role asli dari DB */}
                    <div className="form-group">
                        <label htmlFor="role" className="form-label">Login Sebagai</label>
                        <select
                            id="role"
                            className="form-input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="client">Siswa / Client</option>
                            <option value="mentor">Mentor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email / Username</label>
                        <input
                            type="text"
                            id="email"
                            className="form-input"
                            placeholder="Masukkan email atau username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-button">Login</button>
                    
                    {loginMessage && (
                        <div className={`login-message ${messageType}`} style={{marginTop: '1rem', color: messageType === 'error' ? 'red' : 'green'}}>
                            {loginMessage}
                        </div>
                    )}
                </form>

                <div className="login-divider">
                    <span className="login-divider-text">atau</span>
                </div>

                <div className="register-link">
                    <p>Belum punya akun? <Link to="/register">Daftar Pengguna Baru</Link></p>
                </div>
            </div>
        </section>
    )
}

export default Login