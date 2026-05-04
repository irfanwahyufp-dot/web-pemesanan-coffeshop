const menuData = [
    {name:"Espresso", price:15000, img:"assets/images/espresso.png"},
    {name:"Americano", price:18000, img:"assets/images/americano.png"},
    {name:"Cappuccino", price:20000, img:"assets/images/cappuccino.png"},
    {name:"Caramel Macchiato", price:25000, img:"assets/images/Caramel Macchiato.png"},
    {name:"Hazelnut Latte", price:26000, img:"assets/images/hazelnut.png"},
    {name:"Kopi susu Gula Aren", price:22000, img:"assets/images/kopsu gula aren.png"},
    {name:"Latte", price:22000, img:"assets/images/latte.png"},
    {name:"Matcha Signature", price:23000, img:"assets/images/matcha signature.png"},
    {name:"Red Velvet", price:25000, img:"assets/images/red velvet.png"},
    {name:"Cookies & Cream", price:24000, img:"assets/images/cookies & cream.png"},
    {name:"Ice Tea", price:10000, img:"assets/images/ice tea.png"},
    {name:"Lemon Tea", price:12000, img:"assets/images/lemontea.png"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* MENU */
if(document.getElementById("menu")){
    renderMenu(menuData);
}

function renderMenu(data){
    let html = "";
    data.forEach((item,index)=>{
        let found = cart.find(c=>c.name===item.name);
        let qty = found ? found.qty : 0;

        html += `
        <div class="menu-card">
            <img src="${item.img}">
            <h4>${item.name}</h4>
            <p>Rp ${item.price}</p>
            <div class="qty">
                <button onclick="minus(${index})">-</button>
                ${qty}
                <button onclick="plus(${index})">+</button>
            </div>
        </div>`;
    });
    document.getElementById("menu").innerHTML = html;
}

/* QTY */
function plus(i){
    let item = menuData[i];
    let found = cart.find(c=>c.name===item.name);

    if(found) found.qty++;
    else cart.push({...item, qty:1});

    save();
}

function minus(i){
    let item = menuData[i];
    let found = cart.find(c=>c.name===item.name);

    if(found){
        found.qty--;
        if(found.qty<=0) cart = cart.filter(c=>c.name!==item.name);
    }
    save();
}

function save(){
    localStorage.setItem("cart", JSON.stringify(cart));
    renderMenu(menuData);
}

/* SEARCH */
function searchMenu(){
    let key = document.getElementById("search").value.toLowerCase();
    let filtered = menuData.filter(m=>m.name.toLowerCase().includes(key));
    renderMenu(filtered);
}

/* MEJA */
if(document.getElementById("meja")){
    let meja = document.getElementById("meja");
    for(let i=1;i<=10;i++){
        let o = document.createElement("option");
        o.value="A"+i;
        o.text="Meja A"+i;
        meja.appendChild(o);
    }
}

/* CART PAGE */
if(document.getElementById("cartItems")){
    let html="", total=0;

    cart.forEach(item=>{
        total += item.price*item.qty;
        html += `<div class="item">${item.name} x${item.qty}</div>`;
    });

    document.getElementById("cartItems").innerHTML = html;
    document.getElementById("total").innerText = "Total: Rp "+total;
}

/* NAVIGASI */
function goToCart(){
    let data = {
        nama: document.getElementById("nama").value,
        email: document.getElementById("email").value,
        hp: document.getElementById("hp").value,
        meja: document.getElementById("meja").value
    };

    localStorage.setItem("customer", JSON.stringify(data));
    window.location.href="cart.html";
}

function goToPayment(){
    window.location.href="payment.html";
}

/* PAYMENT */
if(document.getElementById("customerData")){
    let c = JSON.parse(localStorage.getItem("customer"));
    document.getElementById("customerData").innerHTML =
    `<b>${c.nama}</b><br>Meja: ${c.meja}`;
}

function payCash(){
    document.getElementById("paymentDetail").innerHTML = `
    <p>Silakan bayar di kasir ☕</p>
    <button onclick="finishOrder()" class="btn">Selesai</button>
    `;
}

function payTransfer(){
    document.getElementById("paymentDetail").innerHTML = `
    <p><b>Bank BNI</b></p>
    <p>1813715179</p>
    <p>a.n Sunday Coffee</p>
    <button onclick="finishOrder()" class="btn">Saya sudah bayar</button>
    `;
}

function payQRIS(){
    document.getElementById("paymentDetail").innerHTML = `
    <p>Scan QRIS:</p>
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SundayCoffeeQRIS">
    <br>
    <button onclick="finishOrder()" class="btn">Selesai</button>
    `;
}

function finishOrder(){
    localStorage.removeItem("cart"); // reset cart
    window.location.href = "success.html";
}