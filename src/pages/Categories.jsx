import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' 
import '../styles/Categories.css'

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Metadata statis
    const categoryMetadata = {
        'AR/VR': { icon: 'fa-vr-cardboard', description: 'Pelajari materi dengan pengalaman imersif melalui teknologi augmented dan virtual reality.' },
        'Robot': { icon: 'fa-robot', description: 'Kembangkan keterampilan coding dan engineering dengan kit robot interaktif.' },
        'E-book': { icon: 'fa-book', description: 'Akses ribuan e-book premium dengan materi yang selalu diperbarui.' },
        'Video Pembelajaran': { icon: 'fa-video', description: 'Tonton video pembelajaran berkualitas tinggi dari mentor profesional.' },
        'Game Edukasi': { icon: 'fa-gamepad', description: 'Belajar sambil bermain dengan game edukasi yang menyenangkan.' },
        'Les Privat': { icon: 'fa-chalkboard-teacher', description: 'Dapatkan bimbingan personal dari mentor berpengalaman.' }
    };

    useEffect(() => {
        // Ganti URL ini sesuai dengan backend Anda
        const API_URL = 'http://localhost/neo-scholar/api/courses.php';
        // const API_URL = 'http://localhost:8000/api/courses.php'; 

        setLoading(true);
        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error("Gagal mengambil data dari server");
                return res.json();
            })
            .then(data => {
                console.log("Data diterima:", data); // Cek data di console

                // Pastikan data berupa array
                if (!Array.isArray(data)) {
                    setCategories([]); // Set kosong jika error format
                    setLoading(false);
                    return;
                }

                // Hitung jumlah per tipe
                const typeCounts = {};
                data.forEach(p => {
                    const typeName = p.type || 'Lainnya';
                    typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
                });
                
                // Format data dengan pengecekan aman (Safety check)
                const formatted = Object.keys(typeCounts).map(key => {
                    // Cek apakah metadata untuk kategori ini ada?
                    const meta = categoryMetadata[key] || {}; 
                    
                    return {
                        title: key,
                        count: `${typeCounts[key]} Produk`,
                        icon: meta.icon || 'fa-layer-group', // Default icon
                        description: meta.description || 'Temukan materi menarik di kategori ini.'
                    };
                });

                setCategories(formatted);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error Categories:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Tampilan Loading
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Memuat Kategori...</p>
            </div>
        );
    }

    // Tampilan Error
    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="categories-page">
            <section className="categories-hero">
                <div className="container">
                    <h1>Kategori Pembelajaran</h1>
                    <p>Pilih kategori untuk melihat produk terkait</p>
                </div>
            </section>

            <section className="categories-content">
                <div className="container">
                    <div className="categories-grid-page">
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <div key={index} className="category-card-page">
                                    <div className="category-icon-container">
                                        <i className={`fas ${category.icon} category-icon-large`}></i>
                                    </div>
                                    <h3>{category.title}</h3>
                                    <p>{category.description}</p>
                                    <div className="category-count">{category.count}</div>
                                    
                                    {/* Link ke halaman produk dengan filter */}
                                    <Link 
                                        to={`/products?category=${encodeURIComponent(category.title)}`} 
                                        className="btn btn-secondary"
                                    >
                                        Jelajahi
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">Tidak ada kategori ditemukan.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Categories