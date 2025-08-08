// Static shop template for GitHub Pages
// Edit PRODUCTS array or load from external products.json
const ORDER_ENDPOINT = ""; // paste your Google Apps Script Web App URL here (optional)
const STRIPE_PAYMENT_LINK = ""; // paste your Stripe Payment Link here (optional)
const CURRENCY = "Rp";

const PRODUCTS = [
  { id: "p1", title: "Potato Chips", price: 12000, image: "https://images.unsplash.com/photo-1604908177522-9a9b1d6b1d6a?q=80&w=800&auto=format&fit=crop" },
  { id: "p2", title: "Chocolate Bar", price: 15000, image: "https://images.unsplash.com/photo-1582719478191-1659f0d7b3f1?q=80&w=800&auto=format&fit=crop" },
  { id: "p3", title: "Fruit Gummy", price: 10000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop" },
  { id: "p4", title: "Instant Noodles", price: 14000, image: "https://images.unsplash.com/photo-1604908177522-9a9b1d6b1d6a?q=80&w=800&auto=format&fit=crop" },
  { id: "p5", title: "Sachet Coffee", price: 8000, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop" },
  { id: "p6", title: "Cookies Pack", price: 18000, image: "https://images.unsplash.com/photo-1527515637465-9f1a4f9b6e2a?q=80&w=800&auto=format&fit=crop" }
];

const $ = sel => document.querySelector(sel);
const money = n => n.toLocaleString('id-ID');

let cart = JSON.parse(localStorage.getItem('shop_cart')||'[]');

const productsEl = $('#products');
const cartCount = $('#cart-count');
const cartItemsEl = $('#cartItems');
const subtotalEl = $('#subtotal');
const shippingEl = $('#shipping');
const grandEl = $('#grandTotal');
const cartPanel = $('#cartPanel');
const cartToggle = $('#cart-toggle');
const checkoutForm = $('#checkoutForm');
const orderJsonInput = $('#orderJson');
const submitResult = $('#submitResult');
const clearCartBtn = $('#clearCart');
const closeCartBtn = $('#closeCart');

function renderProducts(){
  productsEl.innerHTML = '';
  PRODUCTS.forEach(p => {
    const el = document.createElement('article');
    el.className = 'product';
    el.innerHTML = `
      <img class="thumb" src="${p.image}" alt="${p.title}" loading="lazy">
      <div class="card-body">
        <div class="title">${p.title}</div>
        <div class="meta">${CURRENCY} ${money(p.price)}</div>
        <div class="row">
          <div class="price">${CURRENCY} ${money(p.price)}</div>
          <button class="add-btn" data-id="${p.id}">Add</button>
        </div>
      </div>
    `;
    productsEl.appendChild(el);
  });
  document.querySelectorAll('.add-btn').forEach(b=>b.addEventListener('click',e=>addToCart(e.target.dataset.id)));
}

function saveCart(){ localStorage.setItem('shop_cart', JSON.stringify(cart)); updateCartUI(); }

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id:p.id,title:p.title,price:p.price,image:p.image,qty:1});
  saveCart();
  showToast('Added to cart');
}

function updateCartUI(){
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
  cartItemsEl.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className='cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div style="flex:1">
        <div style="font-weight:600">${item.title}</div>
        <div style="color:#666"> ${CURRENCY} ${money(item.price)} x ${item.qty} </div>
      </div>
      <div class="qty">
        <button data-id="${item.id}" class="dec">−</button>
        <div style="min-width:24px;text-align:center">${item.qty}</div>
        <button data-id="${item.id}" class="inc">+</button>
        <button data-id="${item.id}" class="rm" title="remove">✕</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });
  document.querySelectorAll('.inc').forEach(b=>b.addEventListener('click',e=>changeQty(e.target.dataset.id,1)));
  document.querySelectorAll('.dec').forEach(b=>b.addEventListener('click',e=>changeQty(e.target.dataset.id,-1)));
  document.querySelectorAll('.rm').forEach(b=>b.addEventListener('click',e=>removeItem(e.target.dataset.id)));
  const subtotal = cart.reduce((s,i)=>s + i.price*i.qty,0);
  const shipping = getSelectedShipping();
  subtotalEl.textContent = `${CURRENCY} ${money(subtotal)}`;
  shippingEl.textContent = `${CURRENCY} ${money(shipping)}`;
  grandEl.textContent = `${CURRENCY} ${money(subtotal + shipping)}`;
}

function changeQty(id,delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty<=0) cart = cart.filter(x=>x.id!==id);
  saveCart();
}

function removeItem(id){
  cart = cart.filter(x=>x.id!==id);
  saveCart();
}

function clearCart(){
  cart=[]; saveCart(); showToast('Cart cleared');
}

function getSelectedShipping(){
  const fm = checkoutForm;
  if(!fm) return 0;
  const courier = fm.querySelector('[name=courier]');
  if(!courier) return 0;
  const map = { 'jne':10000, 'sicepat':15000, 'gosend':20000 };
  return map[courier.value]||0;
}

function showToast(msg){
  submitResult.textContent = msg;
  setTimeout(()=>{ submitResult.textContent ='' },2000);
}

cartToggle.addEventListener('click', ()=>{
  if(cartPanel.getAttribute('aria-hidden') === 'true'){
    cartPanel.setAttribute('aria-hidden','false');
    cartPanel.scrollIntoView({behavior:'smooth',block:'center'});
  } else {
    cartPanel.setAttribute('aria-hidden','true');
  }
});
closeCartBtn.addEventListener('click', ()=> cartPanel.setAttribute('aria-hidden','true'));

checkoutForm.addEventListener('submit', async e=>{
  e.preventDefault();
  if(cart.length===0){ showToast('Cart is empty'); return; }
  const formData = new FormData(checkoutForm);
  const order = {
    customer: {
      name: formData.get('name'),
      email: formData.get('email'),
      address: formData.get('address')
    },
    courier: formData.get('courier'),
    payment: formData.get('payment'),
    items: cart,
    subtotal: cart.reduce((s,i)=>s + i.price*i.qty,0),
    shipping: getSelectedShipping(),
    total: cart.reduce((s,i)=>s + i.price*i.qty,0) + getSelectedShipping(),
    created_at: new Date().toISOString()
  };
  orderJsonInput.value = JSON.stringify(order);

  if(ORDER_ENDPOINT){
    try{
      const res = await fetch(ORDER_ENDPOINT, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(order)
      });
      if(res.ok){
        showToast('Order placed — response OK');
        clearCart();
      } else {
        showToast('Order failed: ' + res.status);
      }
    }catch(err){
      showToast('Network error: ' + err.message);
    }
  } else {
    const blob = new Blob([JSON.stringify(order,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'order-'+Date.now()+'.json';
    a.textContent = 'Download order JSON';
    submitResult.innerHTML = '';
    submitResult.appendChild(a);
    a.click();
  }

  if(STRIPE_PAYMENT_LINK){
    // redirect to stripe payment link (optional)
    window.location.href = STRIPE_PAYMENT_LINK;
  }
});

renderProducts();
updateCartUI();
