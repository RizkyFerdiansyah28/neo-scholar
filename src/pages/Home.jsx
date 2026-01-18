import { useState, useEffect } from 'react'
import Carousel from '../components/Carousel'
import SearchModal from '../components/SearchModal'


function Home({ isLoggedIn }) {
    const [activeTab, setActiveTab] = useState('general')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [aiQuery, setAiQuery] = useState('')
    const [showSearchModal, setShowSearchModal] = useState(false)
    const [modalSearchType, setModalSearchType] = useState('general')
    const [modalQuery, setModalQuery] = useState('')
    const [username, setUsername] = useState('')

    // Get username if logged in
    useEffect(() => {
        if (isLoggedIn) {
            const storedUsername = localStorage.getItem('username')
            setUsername(storedUsername || 'Pengguna')
        }
    }, [isLoggedIn])


    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setModalQuery(searchQuery)
            setModalSearchType('general')
            setShowSearchModal(true)
        }
    }

    const handleAISearch = (e) => {
        e.preventDefault()
        if (aiQuery.trim()) {
            setModalQuery(aiQuery)
            setModalSearchType('ai')
            setShowSearchModal(true)
        }
    }

    const products = [
        {
            image: '/images/products/Animasi2d.jpeg',
            title: 'Video Pembelajaran Media Animasi 2D',
            description: 'Sistem pengeluaran dalam diri kita itu ada tiga.',
            price: 'Rp 1.250.000'
        },
        {
            image: '/images/products/ARstrukturbumi.jpeg',
            title: 'AR Learning',
            description: 'Belajar struktur bumi.',
            price: 'Rp 899.000'
        },
        {
            image: '/images/products/Bgameoperasihitungan.jpeg',
            title: 'Board Game Edukasi',
            description: 'Belajar operasi hitung bilangan.',
            price: 'Rp 1.750.000'
        }
    ]

    const mentors = [
        {
            name: 'Debbi Angelia Saputri',
            title: 'Tutor Bahasa Arab',
            bio: 'Mahasiswi Universitas Al-Azhar Kairo, Mesir.',
            image: '/images/mentors/debbi.jpeg',
            rating: 4.5,
            reviews: 120,
            category: 'language'
        },
        {
            name: 'Jawad At-Taqy',
            title: 'Tutor Manajemen',
            bio: 'Mahasiswa Manajemen Universitas Brawijaya, Malang.',
            image: '/images/mentors/jawad.jpeg',
            rating: 5.0,
            reviews: 98,
            category: 'manajemen'
        },
        {
            name: 'Rere Rejo',
            title: 'Tutor Pendidikan Agama Islam',
            bio: 'Mahasiswa UIN Sunan Ampel, Surabaya.',
            image: '/images/mentors/rere.jpeg',
            rating: 4.9,
            reviews: 215,
            category: 'keagamaan'
        }
    ]

    const filteredMentors = selectedCategory === 'all'
        ? mentors
        : mentors.filter(mentor => mentor.category === selectedCategory)

    return (
        <div className="home">
            {/* Search Modal */}
            <SearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
                searchType={modalSearchType}
                query={modalQuery}
            />

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">Your Gateway to Future Learning</h1>
                        <p className="hero-subtitle">
                            Temukan media pembelajaran terbaik, mentor profesional, dan teknologi edukasi inovatifmu dalam satu platform ini.
                        </p>
                        <a href="#product" className="btn btn-secondary">Explore Now</a>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="search-section">
                <div className="container">
                    <div className="search-tabs">
                        <div
                            className={`search-tab ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            Cari Materi
                        </div>
                        <div
                            className={`search-tab ${activeTab === 'ai' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ai')}
                        >
                            Konsultasi AI
                        </div>
                    </div>

                    <div className="search-content">
                        <div className={`search-panel ${activeTab === 'general' ? 'active' : ''}`}>
                            <div className="search-container">
                                <form className="search-box" onSubmit={handleSearch}>
                                    <i className="fas fa-search search-icon"></i>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Cari materi pembelajaran, kursus, atau buku..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit" className="search-button">Cari</button>
                                </form>
                            </div>
                        </div>

                        <div className={`search-panel ${activeTab === 'ai' ? 'active' : ''}`}>
                            <div className="search-container">
                                <form className="search-box" onSubmit={handleAISearch}>
                                    <i className="fas fa-robot search-icon"></i>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Tanyakan pada AI tentang pelajaran atau konsep yang sulit..."
                                        value={aiQuery}
                                        onChange={(e) => setAiQuery(e.target.value)}
                                    />
                                    <button type="submit" className="search-button ai-button">Konsultasi</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Seller Products */}
            <section className="bestseller section" id="product">
                <div className="container">
                    <h2 className="section-title">Produk Best-Seller</h2>
                    <Carousel items={products} />
                </div>
            </section>

            {/* Mentors Section */}
            <section className="mentors section" id="mentor">
                <div className="container">
                    <h2 className="section-title">Mentor Profesional Kami</h2>

                    <div className="mentor-categories">
                        <div
                            className={`mentor-category ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            Semua
                        </div>
                        <div
                            className={`mentor-category ${selectedCategory === 'kepelatihan' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('kepelatihan')}
                        >
                            Kepelatihan
                        </div>
                        <div
                            className={`mentor-category ${selectedCategory === 'keagamaan' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('keagamaan')}
                        >
                            Keagamaan
                        </div>
                        <div
                            className={`mentor-category ${selectedCategory === 'mathematics' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('mathematics')}
                        >
                            Matematika
                        </div>
                        <div
                            className={`mentor-category ${selectedCategory === 'language' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('language')}
                        >
                            Bahasa
                        </div>
                        <div
                            className={`mentor-category ${selectedCategory === 'manajemen' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('manajemen')}
                        >
                            Manajemen
                        </div>
                    </div>

                    <div className="mentors-grid">
                        {filteredMentors.map((mentor, index) => (
                            <div key={index} className="mentor-card">
                                <div className="mentor-image">
                                    <img src={mentor.image} alt={mentor.name} />
                                </div>
                                <div className="mentor-info">
                                    <h3 className="mentor-name">{mentor.name}</h3>
                                    <p className="mentor-title">{mentor.title}</p>
                                    <p className="mentor-bio">{mentor.bio}</p>
                                    <div className="mentor-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fas fa-star${i < Math.floor(mentor.rating) ? '' : '-half-alt'}`}></i>
                                        ))}
                                        <span>{mentor.rating} ({mentor.reviews} ulasan)</span>
                                    </div>
                                    <a href="#" className="btn btn-primary mentor-btn">Lihat Profil</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories section" id="categories">
                <div className="container">
                    <h2 className="section-title">Kategori Media Pembelajaran</h2>
                    <div className="categories-container">
                        <div className="category-card">
                            <div className="category-img-container">
                                <i className="fas fa-vr-cardboard category-icon"></i>
                            </div>
                            <div className="category-content">
                                <h3 className="category-title">AR/VR</h3>
                                <p>Pelajari materi dengan pengalaman imersif melalui teknologi augmented dan virtual reality.</p>
                            </div>
                        </div>
                        <div className="category-card">
                            <div className="category-img-container">
                                <i className="fas fa-robot category-icon"></i>
                            </div>
                            <div className="category-content">
                                <h3 className="category-title">Robot</h3>
                                <p>Kembangkan keterampilan coding dan engineering dengan kit robot interaktif.</p>
                            </div>
                        </div>
                        <div className="category-card">
                            <div className="category-img-container">
                                <i className="fas fa-book category-icon"></i>
                            </div>
                            <div className="category-content">
                                <h3 className="category-title">E-book</h3>
                                <p>Akses ribuan e-book premium dengan materi yang selalu diperbarui.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
