import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom' // Import hook untuk baca URL
import '../styles/Products.css'

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Hook untuk membaca parameter ?category=... dari URL
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get('category'); // Ambil nilai kategori

    const [activeCategory, setActiveCategory] = useState('Semua');

    useEffect(() => {
        // Ganti URL sesuai setup Anda
        const API_URL = 'http://localhost/neo-scholar/api/courses.php';
        // const API_URL = 'http://localhost:8000/api/courses.php';

        setLoading(true);
        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error("Gagal mengambil data produk");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                    
                    // --- LOGIKA FILTER OTOMATIS DARI URL ---
                    if (categoryFromUrl) {
                        // Jika ada kategori di URL, filter langsung
                        const filtered = data.filter(item => item.type === categoryFromUrl);
                        setFilteredProducts(filtered);
                        setActiveCategory(categoryFromUrl);
                    } else {
                        // Jika tidak ada, tampilkan semua
                        setFilteredProducts(data);
                        setActiveCategory('Semua');
                    }
                } else {
                    setProducts([]); 
                    setFilteredProducts([]);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [categoryFromUrl]); // Jalankan ulang jika URL berubah

    // Fungsi manual filter (tombol filter di halaman produk)
    const handleFilter = (category) => {
        setActiveCategory(category);
        
        // Update URL agar sinkron (opsional, tapi bagus untuk UX)
        if (category === 'Semua') {
            setSearchParams({});
            setFilteredProducts(products);
        } else {
            setSearchParams({ category: category });
            const filtered = products.filter(item => item.type === category);
            setFilteredProducts(filtered);
        }
    };

    // FUNGSI BARU: Untuk menambahkan produk ke keranjang
   // FUNGSI YANG DIPERBAIKI: Untuk menambahkan produk ke keranjang
    const handleAddToCart = async (courseId) => {
        // Sesuaikan dengan key localStorage yang di-set pada Login.jsx
        const isLoggedIn = localStorage.getItem('userLoggedIn');
        const userId = localStorage.getItem('user_id');
        
        // Cek apakah status login true DAN user_id tersedia
        if (isLoggedIn !== 'true' || !userId) {
            alert("Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.");
            // Opsi: Anda bisa redirect user ke halaman login menggunakan useNavigate di sini
            return;
        }

        try {
            const response = await fetch('http://localhost/neo-scholar/api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId, // Menggunakan userId dari localStorage
                    course_id: courseId
                })
            });

            const result = await response.json();

            if (response.ok || response.status === 201) {
                alert(result.message || "Produk berhasil ditambahkan ke keranjang!");
            } else {
                alert(result.message || "Gagal menambahkan produk ke keranjang.");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Terjadi kesalahan pada server saat menambahkan ke keranjang.");
        }
    };

    // Ambil daftar kategori unik untuk tombol filter
    const categories = ['Semua', ...new Set(products.map(p => p.type || 'Lainnya'))];

    if (loading) return <div className="text-center p-5">Memuat Produk...</div>;
    if (error) return <div className="text-center p-5 text-red-500">Error: {error}</div>;

    return (
        <div className="products-page">
            <section className="products-hero">
                <div className="container">
                    <h1>Katalog Produk</h1>
                    <p>Temukan materi pembelajaran terbaik untuk Anda</p>
                </div>
            </section>

            <section className="products-content">
                <div className="container">
                    
                    {/* Filter Bar */}
                    <div className="filter-bar">
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => handleFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="products-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        <img 
                                            src={product.image || '/assets/images/products/Tamplateedukasi.jpeg'} 
                                            alt={product.title} 
                                            onError={(e) => { e.target.src = '/assets/images/products/Tamplateedukasi.jpeg'; }}
                                        />
                                        <div className="product-badge">{product.type}</div>
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.title}</h3>
                                        <p>{product.description?.substring(0, 80)}...</p>
                                        <div className="product-price">Rp {parseInt(product.price).toLocaleString('id-ID')}</div>
                                        {/* Terapkan event onClick dan panggil handleAddToCart */}
                                        <button 
                                            className="btn btn-primary w-100"
                                            onClick={() => handleAddToCart(product.id)}
                                        >
                                            Tambah ke Keranjang
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-products">
                                <p>Tidak ada produk ditemukan untuk kategori "{activeCategory}".</p>
                                <button className="btn btn-secondary mt-3" onClick={() => handleFilter('Semua')}>
                                    Lihat Semua Produk
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Products