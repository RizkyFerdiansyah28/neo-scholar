import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import '../styles/Products.css' 

function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterType, setFilterType] = useState('All')
    
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // PERBAIKAN 1: Gunakan path relatif (sesuai proxy vite.config.js)
                // Atau ganti 'neo-skul' menjadi 'neo-scholar' jika pakai path lengkap
                const response = await fetch('/api/courses.php'); 
                
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Gagal mengambil data produk:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleBuy = async (product) => {
        const userId = localStorage.getItem('user_id');

        console.log("User ID:", userId); 
        console.log("Course ID:", product.id);

        if (!userId || userId === 'undefined') {
            alert("Silakan login terlebih dahulu.");
            // navigate('/login'); 
            return;
        }

        try {
            // PERBAIKAN 2: Gunakan path relatif agar sesuai dengan folder 'neo-scholar'
            const response = await fetch('/api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    course_id: product.id 
                }),
            });

            // Cek dulu apakah response berhasil sebelum parse JSON
            // untuk menghindari error jika server mengirim HTML (error 404/500)
            const resultText = await response.text();
            let result;
            try {
                result = JSON.parse(resultText);
            } catch (e) {
                throw new Error("Respon server bukan JSON: " + resultText);
            }
            
            if (response.ok) {
                alert("Berhasil masuk keranjang!");
                navigate('/cart');
            } else {
                alert("Gagal: " + result.message);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan koneksi ke server.");
        }
    }

    const filteredProducts = filterType === 'All' 
        ? products 
        : products.filter(p => p.type === filterType);

    const types = ['All', ...new Set(products.map(p => p.type))];

    return (
        <div className="products-page">
            <div className="products-hero">
                <div className="container">
                    <h1>Katalog Produk</h1>
                    <p>Temukan semua materi pembelajaran dan alat edukasi terbaik kami.</p>
                </div>
            </div>

            <div className="container section">
                <div className="products-filter">
                    {types.map((type, index) => (
                        <button 
                            key={index} 
                            className={`filter-btn ${filterType === type ? 'active' : ''}`}
                            onClick={() => setFilterType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-state">Memuat katalog...</div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map((item) => (
                            <div key={item.id} className="product-card-catalog">
                                <div className="product-img-wrapper">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        onError={(e) => {e.target.src = '/images/products/Tamplateedukasi.jpeg'}} 
                                    />
                                    <div className="product-tag">{item.type}</div>
                                </div>
                                <div className="product-content">
                                    <h3 className="product-title">{item.title}</h3>
                                    <p className="product-desc">{item.description}</p>
                                    <div className="product-footer">
                                        <span className="product-price">Rp {parseInt(item.price).toLocaleString('id-ID')}</span>
                                        
                                        <button 
                                            className="btn-buy"
                                            onClick={() => handleBuy(item)}
                                        >
                                            Beli
                                        </button>
                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {filteredProducts.length === 0 && !loading && (
                    <p className="empty-state">Tidak ada produk ditemukan.</p>
                )}
            </div>
        </div>
    )
}

export default Products