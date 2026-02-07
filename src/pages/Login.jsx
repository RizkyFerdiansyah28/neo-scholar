import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('client') // Default role
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loginMessage, setLoginMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const navigate = useNavigate()

    // Tambahkan async di sini
const handleSubmit = async (e) => {
    e.preventDefault()
    
    // ... (kode validasi yang sudah ada tetap sama) ...

    if (isValid) {
        try {
            // Ganti URL ini dengan URL backend Anda nantinya
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role }), // Kirim data login
            });

            const data = await response.json();

            if (response.ok) {
                setLoginMessage('Login berhasil! Mengalihkan...')
                setMessageType('success')

                // Simpan data dari database ke localStorage
                localStorage.setItem('userLoggedIn', 'true')
                localStorage.setItem('username', data.user.name) // Nama dari DB
                localStorage.setItem('userRole', data.user.role) // Role dari DB
                localStorage.setItem('userId', data.user.id)     // ID penting untuk relasi
                
                setIsLoggedIn(true)

                setTimeout(() => {
                    // Redirect logic tetap sama
                    if (data.user.role === 'admin') navigate('/admin/dashboard')
                    else if (data.user.role === 'mentor') navigate('/mentor/dashboard')
                    else navigate('/dashboard')
                }, 1500)
            } else {
                setLoginMessage(data.message || 'Login gagal.')
                setMessageType('error')
            }
        } catch (error) {
            setLoginMessage('Terjadi kesalahan koneksi server.')
            setMessageType('error')
        }
    }
}

    const handleSocialLogin = () => {
        setLoginMessage('Login melalui sosial media diproses...')
        setMessageType('success')

        localStorage.setItem('userLoggedIn', 'true')
        localStorage.setItem('username', 'Pengguna')
        localStorage.setItem('userRole', role)
        setIsLoggedIn(true)

        setTimeout(() => {
            switch (role) {
                case 'admin':
                    navigate('/admin/dashboard')
                    break
                case 'mentor':
                    navigate('/mentor/dashboard')
                    break
                case 'client':
                default:
                    navigate('/dashboard')
                    break
            }
        }, 1500)
    }

    return (
        <section className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login ke NeoScholar</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Role Selection */}
                    <div className="form-group">
                        <label htmlFor="role" className="form-label">Login Sebagai</label>
                        <select
                            id="role"
                            className="form-input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="client">Client / Student</option>
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
                        {emailError && <div className="error-message">{emailError}</div>}
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
                        {passwordError && <div className="error-message">{passwordError}</div>}
                    </div>
                    <a href="#" className="forgot-password">Lupa Password?</a>
                    <button type="submit" className="login-button">Login</button>
                    {loginMessage && (
                        <div className={`login-message ${messageType}`}>{loginMessage}</div>
                    )}
                </form>

                <div className="login-divider">
                    <span className="login-divider-text">atau login dengan</span>
                </div>

                <div className="social-login">
                    <a href="#" className="social-login-btn" onClick={handleSocialLogin}>
                        <i className="fab fa-google social-login-icon google-icon"></i>
                        <span>Google</span>
                    </a>
                    <a href="#" className="social-login-btn" onClick={handleSocialLogin}>
                        <i className="fab fa-microsoft social-login-icon microsoft-icon"></i>
                        <span>Microsoft</span>
                    </a>
                </div>

                <div className="register-link">
                    <p>Belum punya akun? <a href="#">Daftar Pengguna Baru</a></p>
                </div>
            </div>
        </section>
    )
}

export default Login
