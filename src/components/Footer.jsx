import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/Footer.css'

function Footer() {
    const navigate = useNavigate()
    const location = useLocation()

    const scrollToSection = (sectionId) => {
        // If we're already on home page, just scroll
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        } else {
            // Navigate to home page first, then scroll
            navigate('/')
            setTimeout(() => {
                const element = document.getElementById(sectionId)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            }, 100)
        }
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-container">
                    <div className="footer-column">
                        <h3>NeoScholar</h3>
                        <p>Platform edukasi masa depan dengan pendekatan inovatif untuk mempersiapkan generasi penerus.</p>
                        <div className="social-links">
                            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h3>Links Cepat</h3>
                        <Link to="/about" className="footer-link">Tentang Kami</Link>
                        <a
                            href="#product"
                            className="footer-link"
                            onClick={(e) => {
                                e.preventDefault()
                                scrollToSection('product')
                            }}
                        >
                            Produk
                        </a>
                        <Link to="/categories" className="footer-link">Kategori</Link>
                        <Link to="/contact" className="footer-link">Kontak</Link>
                        <a
                            href="#mentor"
                            className="footer-link"
                            onClick={(e) => {
                                e.preventDefault()
                                scrollToSection('mentor')
                            }}
                        >
                            Mentor
                        </a>
                    </div>
                    <div className="footer-column">
                        <h3>Kategori</h3>
                        <a
                            href="#categories"
                            className="footer-link"
                            onClick={(e) => {
                                e.preventDefault()
                                scrollToSection('categories')
                            }}
                        >
                            AR/VR
                        </a>
                        <a
                            href="#categories"
                            className="footer-link"
                            onClick={(e) => {
                                e.preventDefault()
                                scrollToSection('categories')
                            }}
                        >
                            Robot
                        </a>
                        <a
                            href="#categories"
                            className="footer-link"
                            onClick={(e) => {
                                e.preventDefault()
                                scrollToSection('categories')
                            }}
                        >
                            E-book
                        </a>
                        <Link to="/categories" className="footer-link">Lihat Semua</Link>
                    </div>
                    <div className="footer-column">
                        <h3>Kontak</h3>
                        <a href="#" className="footer-link"><i className="fas fa-map-marker-alt"></i> Jl. Pendidikan No. 123, Jakarta</a>
                        <a href="tel:+6281234567890" className="footer-link"><i className="fas fa-phone"></i> +62 812 3456 7890</a>
                        <a href="mailto:info@neoscholar.id" className="footer-link"><i className="fas fa-envelope"></i> info@neoscholar.id</a>
                    </div>
                </div>
                <div className="copyright">
                    <p>&copy; 2025 NeoScholar. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
