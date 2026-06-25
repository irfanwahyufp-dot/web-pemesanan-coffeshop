// 1. Data Menu Lengkap (Minuman dari gambar Anda + Tambahan Snack)
const daftarMenu = [
    // --- Kategori Coffee & Non-Coffee (Sesuai aset Anda) ---
    { id: 1, nama: "Kopsi Gula Aren", harga: 15000, gambar: "assets/images/kopsu gula aren.png", kategori: "minuman" },
    { id: 2, nama: "Americano", harga: 10000, gambar: "assets/images/americano.png", kategori: "minuman" },
    { id: 3, nama: "Cappuccino", harga: 15000, gambar: "assets/images/cappuccino.png", kategori: "minuman" },
    { id: 4, nama: "Matcha Signature", harga: 20000, gambar: "assets/images/matcha signature.png", kategori: "minuman" },
    { id: 5, nama: "Caramel Macchiato", harga: 20000, gambar: "assets/images/Caramel Macchiato.png", kategori: "minuman" },
    { id: 6, nama: "Cookies & Cream", harga: 20000, gambar: "assets/images/cookies & cream.png", kategori: "minuman" },
    { id: 7, nama: "Ice Tea", harga: 5000, gambar: "assets/images/ice tea.png", kategori: "minuman" },
    { id: 8, nama: "Lemon Tea", harga: 8000, gambar: "assets/images/lemontea.png", kategori: "minuman" },
    { id: 9, nama: "Espresso", harga: 10000, gambar: "assets/images/espresso.png", kategori: "minuman" },
    { id: 10, nama: "Hazelnut Latte", harga: 15000, gambar: "assets/images/hazelnut.png", kategori: "minuman" },
    { id: 11, nama: "Latte", harga: 15000, gambar: "assets/images/latte.png", kategori: "minuman" },
    { id: 12, nama: "Red Velvet", harga: 20000, gambar: "assets/images/red velvet.png", kategori: "minuman" },

    // --- Kategori Makanan Ringan / Snack ---
    { id: 13, nama: "French Fries", harga: 15000, gambar: "assets/images/french fries.png", kategori: "snack" },
    { id: 14, nama: "Cireng Rujak", harga: 15000, gambar: "assets/images/cireng rujak.png", kategori: "snack" },
    { id: 15, nama: "Mix Platter", harga: 25000, gambar: "assets/images/mix platter.png", kategori: "snack" },
    { id: 16, nama: "Toast Chocolate", harga: 20000, gambar: "assets/images/toast chocolate.png", kategori: "snack" }
];

// Ganti baris inisialisasi keranjang di script.js Anda agar konsisten:
let keranjang = JSON.parse(localStorage.getItem('keranjang_mas_amba')) || [];

// 2. Fungsi render menu berdasarkan filter kategori
function tampilkanMenu(kategoriDipilih = 'semua') {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;
    
    menuContainer.innerHTML = '';
    
    // Filter data menu berdasarkan tab yang aktif
    const menuDifilter = kategoriDipilih === 'semua' 
        ? daftarMenu 
        : daftarMenu.filter(item => item.kategori === kategoriDipilih);

    menuDifilter.forEach(menu => {
        menuContainer.innerHTML += `
            <div class="card-menu">
                <img src="${menu.gambar}" alt="${menu.nama}" class="img-menu" onerror="this.src='assets/images/logo.jpg'">
                <div class="menu-info">
                    <h4>${menu.nama}</h4>
                    <p class="harga">Rp ${menu.harga.toLocaleString('id-ID')}</p>
                    <button class="btn-tambah" onclick="tambahKeKeranjang(${menu.id})">+ Tambah</button>
                </div>
            </div>
        `;
    });
    
    updateBadgeKeranjang();
}

// 3. Fungsi ganti tab kategori aktif (Mengubah style tombol saat diklik)
function filterKategori(kategori, elemen) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    elemen.classList.add('active');
    tampilkanMenu(kategori);
}

function tambahKeKeranjang(id) {
    const produk = daftarMenu.find(item => item.id === id);
    const itemDiKeranjang = keranjang.find(item => item.id === id);

    if (itemDiKeranjang) {
        itemDiKeranjang.qty += 1;
    } else {
        keranjang.push({ ...produk, qty: 1 });
    }

    localStorage.setItem('keranjang_mas_amba', JSON.stringify(keranjang));
    updateBadgeKeranjang();
}

function updateBadgeKeranjang() {
    const badge = document.getElementById('badge-count');
    const floatingCart = document.getElementById('floating-cart');
    const totalQty = keranjang.reduce((total, item) => total + item.qty, 0);
    
    if (badge) badge.innerText = totalQty;
    if (floatingCart) {
        floatingCart.style.display = totalQty > 0 ? 'flex' : 'none';
    }
}

window.onload = () => tampilkanMenu('semua');