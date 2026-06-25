// ====== NAVIGASI SPA DASHBOARD ======
function switchTab(event, tabId) {
    if(event) event.preventDefault();

    // 1. Nonaktifkan semua link menu sidebar
    document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('active'));
    // 2. Sembunyikan semua section konten tab
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // 3. Aktifkan link menu yang sedang diklik
    if (event) event.currentTarget.classList.add('active');
    // 4. Munculkan container konten yang sesuai id tujuan
    document.getElementById(`content-${tabId}`).classList.add('active');

    // 5. Ubah teks Header Judul sesuai halaman yang dibuka
    const judul = document.getElementById('page-title');
    const sub = document.getElementById('page-subtitle');
    
    if (tabId === 'live-orders') {
        judul.innerText = "Ringkasan Toko";
        sub.innerText = "Pantau antrean pesanan aktif kedai hari ini.";
        muatAntreanKasir();
    } else if (tabId === 'riwayat') {
        judul.innerText = "Riwayat Transaksi";
        sub.innerText = "Catatan seluruh pesanan yang telah diarsipkan/selesai.";
        muatRiwayatTransaksi();
    } else if (tabId === 'manajemen-menu') {
        judul.innerText = "Manajemen Produk";
        sub.innerText = "Atur harga produk, ketersediaan stok, dan varian menu.";
    } else if (tabId === 'pengaturan') {
        judul.innerText = "Pengaturan Sistem";
        sub.innerText = "Kelola data outlet kedai dan sinkronisasi printer struk.";
    }
}

// ====== PENGELOLA DATA LIVE ORDERS ======
function muatAntreanKasir() {
    const container = document.getElementById('live-order-container');
    if (!container) return;

    const antrean = JSON.parse(localStorage.getItem('antrean_kasir_amba')) || [];
    const pesananAktif = antrean.filter(p => p.status !== 'arsip');
    
    // Update Ringkasan Angka Statistik Atas
    const statAktif = document.getElementById('stat-aktif');
    if (statAktif) statAktif.innerText = `${pesananAktif.length} Antrean`;

    // Hitung akumulasi omzet pendapatan dari transaksi yang sudah diarsip (sukses)
    const totalOmzet = antrean.filter(p => p.status === 'arsip').reduce((sum, item) => sum + item.total, 0);
    const statPendapatan = document.getElementById('stat-pendapatan');
    if (statPendapatan) statPendapatan.innerText = `Rp ${totalOmzet.toLocaleString('id-ID')}`;

    if (pesananAktif.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #94a3b8; background: white; border-radius: 24px; border: 1px dashed #cbd5e1;">
                <span style="font-size: 40px; display: block; margin-bottom: 12px;">☕</span>
                Belum ada antrean pesanan masuk saat ini.
            </div>`;
        return;
    }

    container.innerHTML = '';
    pesananAktif.forEach((order) => {
        let itemRows = '';
        order.items.forEach(item => {
            itemRows += `<li><span>${item.qty}x ${item.nama}</span><strong>Rp ${(item.harga * item.qty).toLocaleString('id-ID')}</strong></li>`;
        });

        let badgeClass = 'status-proses', badgeText = 'Sedang Dibuat';
        let btnClass = 'btn-serve', btnText = 'Selesai & Hidangkan →', nextAction = `updateStatus('${order.id}')`;

        if (order.status === 'siap') {
            badgeClass = 'status-siap'; badgeText = 'Siap Diambil';
            btnClass = 'btn-done'; btnText = 'Arsipkan Transaksi ✓';
            nextAction = `clearOrder('${order.id}')`;
        }

        container.innerHTML += `
            <div class="order-card priority" id="card-${order.id}">
                <div>
                    <div class="order-header">
                        <span class="table-badge">MEJA ${order.meja}</span>
                        <span class="status-badge ${badgeClass}" id="status-text-${order.id}">${badgeText}</span>
                    </div>
                    <p style="font-size: 11px; color: #94a3b8; margin-top: -10px; margin-bottom: 14px;">Waktu masuk: ${order.waktu}</p>
                    <ul class="item-list">${itemRows}</ul>
                </div>
                <div>
                    <div class="total-row">
                        <span>Total (Inc. Pajak):</span>
                        <span class="price">Rp ${order.total.toLocaleString('id-ID')}</span>
                    </div>
                    <button class="btn-action ${btnClass}" id="btn-${order.id}" onclick="${nextAction}">${btnText}</button>
                </div>
            </div>`;
    });
}

function updateStatus(idPesanan) {
    let antrean = JSON.parse(localStorage.getItem('antrean_kasir_amba')) || [];
    let index = antrean.findIndex(p => p.id === idPesanan);
    if (index !== -1) {
        antrean[index].status = 'siap';
        localStorage.setItem('antrean_kasir_amba', JSON.stringify(antrean));
        muatAntreanKasir();
    }
}

// Ubah fungsi arsir agar memindahkan data status ke 'arsip' (bukan dihapus permanen)
function clearOrder(idPesanan) {
    const card = document.getElementById(`card-${idPesanan}`);
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            let antrean = JSON.parse(localStorage.getItem('antrean_kasir_amba')) || [];
            let index = antrean.findIndex(p => p.id === idPesanan);
            if (index !== -1) {
                antrean[index].status = 'arsip';
                localStorage.setItem('antrean_kasir_amba', JSON.stringify(antrean));
            }
            muatAntreanKasir();
        }, 300);
    }
}

// ====== LOG FILTER RIWAYAT TRANSAKSI ======
function muatRiwayatTransaksi() {
    const tbody = document.getElementById('riwayat-table-body');
    if (!tbody) return;

    const antrean = JSON.parse(localStorage.getItem('antrean_kasir_amba')) || [];
    const dataArsip = antrean.filter(p => p.status === 'arsip');

    if (dataArsip.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:30px;">Belum ada riwayat closing transaksi hari ini.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    dataArsip.forEach(order => {
        const rincianMenu = order.items.map(i => `${i.qty}x ${i.nama}`).join(', ');
        tbody.innerHTML += `
            <tr>
                <td><code>#${order.id.substring(5, 12)}...</code></td>
                <td>${order.waktu}</td>
                <td>Meja ${order.meja}</td>
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${rincianMenu}</td>
                <td><strong>Rp ${order.total.toLocaleString('id-ID')}</strong></td>
                <td><span class="status-badge" style="background:#d1fae5; color:#065f46;">Selesai / Paid</span></td>
            </tr>`;
    });
}

// ====== RUNNING CLOCK DI HEADER ======
function jalankanJamRealtime() {
    const clockElement = document.getElementById('live-clock');
    if (clockElement) {
        const now = new Date();
        clockElement.innerText = now.toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }) + " - " + now.toLocaleTimeString('id-ID');
    }
}

// Trigger inisialisasi awal saat dokumen siap dibuka
document.addEventListener('DOMContentLoaded', () => {
    muatAntreanKasir();
    setInterval(jalankanJamRealtime, 1000);
    jalankanJamRealtime();

    // Loop polling otomatis data baru dari pembeli tiap 3 detik
    setInterval(() => {
        // Hanya reload otomatis jika admin sedang membuka tab Live Orders
        const liveTabActive = document.getElementById('content-live-orders').classList.contains('active');
        if (liveTabActive) muatAntreanKasir();
    }, 3000);
});