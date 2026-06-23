// script.js
let cart = JSON.parse(localStorage.getItem('coffee_cart')) || []; /* cite: 8 */
let currentTable = localStorage.getItem('table_number') || "05"; /* cite: 8 */

// Database Menu Berdasarkan Gambar di Folder Assets Anda
const menuData = [
    { id: 'm1', name: 'Americano', price: 18000, img: 'assets/images/americano.png', category: 'coffee' }, /* cite: 8 */
    { id: 'm2', name: 'Cappuccino', price: 24000, img: 'assets/images/cappuccino.png', category: 'coffee' }, /* cite: 8 */
    { id: 'm3', name: 'Caramel Macchiato', price: 28000, img: 'assets/images/Caramel%20Macchiato.png', category: 'coffee' }, /* cite: 8 */
    { id: 'm4', name: 'Espresso', price: 15000, img: 'assets/images/espresso.png', category: 'coffee' }, /* cite: 8 */
    { id: 'm5', name: 'Hazelnut Latte', price: 26000, img: 'assets/images/hazelnut.png', category: 'coffee' }, /* cite: 8 */
    { id: 'm6', name: 'Kopi Susu Gula Aren', price: 22000, img: 'assets/images/kopsu%20gula%20aren.png', category: 'coffee' }, /* cite: 8 */
    { id: 'm7', name: 'Latte', price: 24000, img: 'assets/images/latte.png', category: 'coffee' }, /* cite: 8 */
    { id: 'm8', name: 'Ice Tea', price: 10000, img: 'assets/images/ice%20tea.png', category: 'non-coffee' }, /* cite: 8 */
    { id: 'm9', name: 'Lemon Tea', price: 14000, img: 'assets/images/lemontea.png', category: 'non-coffee' }, /* cite: 8 */
    { id: 'm10', name: 'Matcha Signature', price: 26000, img: 'assets/images/matcha%20signature.png', category: 'non-coffee' }, /* cite: 8 */
    { id: 'm11', name: 'Red Velvet', price: 26000, img: 'assets/images/red%20velvet.png', category: 'non-coffee' }, /* cite: 8 */
    { id: 'm12', name: 'Cookies & Cream', price: 27000, img: 'assets/images/cookies%20&%20cream.png', category: 'non-coffee' } /* cite: 8 */
];

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge(); /* cite: 8 */
    if (document.getElementById('menu-container')) { renderMenu(); } /* cite: 8 */
    if (document.getElementById('cart-items-container')) { renderCart(); } /* cite: 8 */
    const tableDisp = document.getElementById('table-display'); /* cite: 8 */
    if (tableDisp) tableDisp.innerText = `Meja ${currentTable}`; /* cite: 8 */
});

function renderMenu() {
    const container = document.getElementById('menu-container'); /* cite: 8 */
    if (!container) return; /* cite: 8 */
    
    let html = '<div class="menu-section-title">Coffee Base</div><div class="menu-grid">'; /* cite: 8 */
    menuData.filter(m => m.category === 'coffee').forEach(item => { html += createMenuCard(item); }); /* cite: 8 */
    
    html += '</div><div class="menu-section-title">Non-Coffee & Blended</div><div class="menu-grid">'; /* cite: 8 */
    menuData.filter(m => m.category === 'non-coffee').forEach(item => { html += createMenuCard(item); }); /* cite: 8 */
    html += '</div>'; /* cite: 8 */
    container.innerHTML = html; /* cite: 8 */
}

function createMenuCard(item) {
    return `
        <div class="menu-card">
            <img src="${item.img}" class="menu-thumb" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150'" alt="${item.name}">
            <div style="flex:1;">
                <div style="font-size:15px; font-weight:600;">${item.name}</div>
                <div style="color:var(--accent-color); font-weight:700; margin-top:4px;">Rp ${item.price.toLocaleString('id-ID')}</div>
            </div>
            <button class="add-btn" onclick="addToCart('${item.id}')">+</button>
        </div>`; /* cite: 8 */
}

function addToCart(id) {
    const item = menuData.find(m => m.id === id); /* cite: 8 */
    const existing = cart.find(c => c.id === id); /* cite: 8 */
    if (existing) { existing.qty++; } else { cart.push({ ...item, qty: 1 }); } /* cite: 8 */
    saveCart(); /* cite: 8 */
    updateCartBadge(); /* cite: 8 */
}

function updateCartBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0); /* cite: 8 */
    const badge = document.getElementById('floating-badge'); /* cite: 8 */
    const amountDisp = document.getElementById('floating-amount'); /* cite: 8 */
    if (badge) badge.innerText = totalQty; /* cite: 8 */
    if (amountDisp) {
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0); /* cite: 8 */
        amountDisp.innerText = `Rp ${totalAmount.toLocaleString('id-ID')}`; /* cite: 8 */
    }
}

function saveCart() { localStorage.setItem('coffee_cart', JSON.stringify(cart)); } /* cite: 8 */

function renderCart() {
    const container = document.getElementById('cart-items-container'); /* cite: 8 */
    if (!container) return; /* cite: 8 */
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 40px 0; color:#888;">Keranjang kamu kosong.</div>'; /* cite: 8 */
        updateSummary(0); /* cite: 8 */
        return; /* cite: 8 */
    }
    let html = ''; /* cite: 8 */
    let subtotal = 0; /* cite: 8 */
    cart.forEach(item => {
        subtotal += item.price * item.qty; /* cite: 8 */
        html += `
            <div class="cart-item">
                <div>
                    <div style="font-weight:600;">${item.name}</div>
                    <div style="color:var(--accent-color); font-weight:700;">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
                </div>
                <div class="qty-counter">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                </div>
            </div>`; /* cite: 8 */
    });
    container.innerHTML = html; /* cite: 8 */
    updateSummary(subtotal); /* cite: 8 */
}

function changeQty(id, delta) {
    const item = cart.find(c => c.id === id); /* cite: 8 */
    if (!item) return; /* cite: 8 */
    item.qty += delta; /* cite: 8 */
    if (item.qty <= 0) { cart = cart.filter(c => c.id !== id); } /* cite: 8 */
    saveCart(); renderCart(); updateCartBadge(); /* cite: 8 */
}

function updateSummary(subtotal) {
    const tax = subtotal * 0.1; /* cite: 8 */
    const total = subtotal + tax; /* cite: 8 */
    if (document.getElementById('subtotal-val')) document.getElementById('subtotal-val').innerText = `Rp ${subtotal.toLocaleString('id-ID')}`; /* cite: 8 */
    if (document.getElementById('tax-val')) document.getElementById('tax-val').innerText = `Rp ${tax.toLocaleString('id-ID')}`; /* cite: 8 */
    if (document.getElementById('total-val')) document.getElementById('total-val').innerText = `Rp ${total.toLocaleString('id-ID')}`; /* cite: 8 */
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.method-card').forEach(card => card.classList.remove('selected')); /* cite: 8 */
    document.getElementById(`method-${method}`).classList.add('selected'); /* cite: 8 */
    localStorage.setItem('payment_method', method); /* cite: 8 */
}

function setTableAndProceed() {
    const input = document.getElementById('table-input').value; /* cite: 8 */
    if(input) {
        localStorage.setItem('table_number', input); /* cite: 8 */
        window.location.href = 'kasir.html'; /* cite: 8 */
    } else { alert('Silakan masukkan nomor meja Anda'); } /* cite: 8 */
}

function clearCartAndFinish() { localStorage.removeItem('coffee_cart'); } /* cite: 8 */