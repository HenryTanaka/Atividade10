// script.js
const DB = [
  {
    id: 1,
    category: 'Sedan',
    type: 'carro',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2023,
    price: 145000,
    km: 25000,
    color: 'Branco',
    imageUrl: 'https://cdn.motor1.com/images/mgl/Nrql9/575:0:3469:2604/toyota-corolla-gr-s-2022.webp'
  },
  {
    id: 2,
    category: 'Hatch',
    type: 'carro',
    brand: 'Honda',
    model: 'Civic',
    year: 2022,
    price: 138000,
    km: 30000,
    color: 'Preto',
    imageUrl: 'https://garagem360.com.br/wp-content/uploads/2022/07/62bb408e0eea98fa5b64eb90d184e144.jpg'
  },
  {
    id: 3,
    category: 'Esportivo',
    type: 'carro',
    brand: 'Chevrolet',
    model: 'Camaro',
    year: 2021,
    price: 285000,
    km: 15000,
    color: 'Amarelo',
    imageUrl: 'https://revistacarro.com.br/wp-content/uploads/2018/03/2016-chevrolet-camaro-ss-5_capa.jpg'
  },
  {
    id: 4,
    category: 'Moto',
    type: 'moto',
    brand: 'Yamaha',
    model: 'MT-07',
    year: 2023,
    price: 48000,
    km: 5000,
    color: 'Cinza',
    imageUrl: 'https://i.ytimg.com/vi/HaXpU-fEpOQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB9R1PsVKHcBAZ4hG5XfTaVxjbEcA'
  },
  {
    id: 5,
    category: 'Moto',
    type: 'moto',
    brand: 'Honda',
    model: 'CG 160',
    year: 2022,
    price: 17000,
    km: 12000,
    color: 'Vermelha',
    imageUrl: 'https://motonewsbrasil.com/wp-content/uploads/2021/06/honda-cg-160-titan-2022-6.jpeg'
  }
];


let state = {
  category: 'Todos',
  query: '',
  sort: 'default',
  minPrice: null,
  maxPrice: null,
  cart: []
};

const catList = document.getElementById('catList');
const productGrid = document.getElementById('productGrid');
const resultInfo = document.getElementById('resultInfo');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const applyPriceBtn = document.getElementById('applyPrice');
const clearBtn = document.getElementById('clearBtn');
const emptyState = document.getElementById('emptyState');

const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');

const modal = document.getElementById('modal');
const modalCard = document.getElementById('modalCard');

function init(){
  renderCategories();
  bindEvents();
  renderProducts();
  renderCart();
}

function getCategories(){
  const cats = new Set(DB.map(i=>i.category));
  return ['Todos', ...Array.from(cats)];
}

function renderCategories(){
  catList.innerHTML = '';
  getCategories().forEach(cat=>{
    const el = document.createElement('div');
    el.className = 'cat-item' + (cat===state.category? ' active':'');
    el.innerHTML = `<div>${cat}</div><div class="muted">${DB.filter(x=>x.category===cat).length}</div>`;
    el.addEventListener('click', ()=>{
      state.category = cat;
      renderCategories();
      renderProducts();
    });
    catList.appendChild(el);
  });
}

function filterProducts(){
  let res = DB.slice();
  if(state.category && state.category!=='Todos'){
    res = res.filter(p=>p.category===state.category);
  }
  if(state.query && state.query.trim()){
    const q = state.query.toLowerCase();
    res = res.filter(p=> (p.brand+' '+p.model+' '+p.year).toLowerCase().includes(q));
  }
  if(state.minPrice!=null) res = res.filter(p=>p.price>=state.minPrice);
  if(state.maxPrice!=null) res = res.filter(p=>p.price<=state.maxPrice);

  if(state.sort==='price-asc') res.sort((a,b)=>a.price-b.price);
  if(state.sort==='price-desc') res.sort((a,b)=>b.price-a.price);
  if(state.sort==='year-desc') res.sort((a,b)=>b.year-a.year);
  if(state.sort==='year-asc') res.sort((a,b)=>a.year-b.year);

  return res;
}

function formatMoney(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function renderProducts(){
  const list = filterProducts();
  productGrid.innerHTML = '';
  resultInfo.textContent = `Mostrando ${list.length} resultado(s) — Categoria: ${state.category}`;
  
  if(list.length === 0){
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  list.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.border = '1px solid rgba(255,255,255,0.1)';
    card.style.borderRadius = '12px';
    card.style.padding = '12px';
    card.style.background = 'rgba(255,255,255,0.02)';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.gap = '8px';

    // Imagem do carro (corrigido)
    const thumb = document.createElement('div');
    thumb.style.width = '100%';
    thumb.style.height = '180px';
    thumb.style.display = 'flex';
    thumb.style.justifyContent = 'center';
    thumb.style.alignItems = 'center';
    thumb.style.overflow = 'hidden';
    thumb.style.borderRadius = '8px';
    thumb.style.background = 'rgba(255,255,255,0.03)';
    thumb.innerHTML = `<img src="${item.imageUrl}" 
                            alt="${item.brand} ${item.model}" 
                            style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;

    const info = document.createElement('div');
    info.className = 'info';
    info.style.textAlign = 'center';
    info.innerHTML = `
      <h3 class="title" style="margin:8px 0 4px;">${item.brand} ${item.model}</h3>
      <div class="meta" style="font-size:12px;opacity:0.8;">${item.category} • ${item.type.toUpperCase()} • ${item.km.toLocaleString()} km</div>
      <div class="price" style="margin-top:6px;font-weight:bold;">${formatMoney(item.price)}</div>
      <div class="card-actions" style="margin-top:8px;display:flex;gap:6px;justify-content:center;">
        <button class="btn" data-action="details" data-id="${item.id}">Detalhes</button>
        <button class="btn primary" data-action="add" data-id="${item.id}">Adicionar</button>
      </div>`;

    card.appendChild(thumb);
    card.appendChild(info);
    productGrid.appendChild(card);
  });

  // Eventos
  productGrid.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      if (action === 'details') openDetails(id);
      if (action === 'add') addToCart(id);
    });
  });
}


function openDetails(id){
  const item = DB.find(x=>x.id===id);
  modalCard.innerHTML = `
    <div style="display:flex;gap:12px">
      <div style="flex:1">
        <div style="height:200px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))">
          <img src="${item.imageUrl}" alt="${item.brand} ${item.model}" style="width:100%;height:auto;border-radius:10px;">
        </div>
      </div>
      <div style="flex:1">
        <h3 style="margin-top:0">${item.brand} ${item.model}</h3>
        <div class="muted small">Categoria: ${item.category} • Tipo: ${item.type}</div>
        <p style="margin-top:12px">Cor: ${item.color} · KM: ${item.km.toLocaleString()} · Ano: ${item.year}</p>
        <p style="margin-top:12px"><strong>${formatMoney(item.price)}</strong></p>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="btn primary" id="modalAdd">Adicionar ao carrinho</button>
          <button class="btn" id="modalClose">Fechar</button>
        </div>
      </div>
    </div>`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalAdd').addEventListener('click', ()=>{
    addToCart(id);
    closeModal();
  });
}

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}

function addToCart(id){
  const product = DB.find(x=>x.id===id);
  const existing = state.cart.find(i=>i.id===id);
  if(existing){
    existing.qty++;
  } else {
    state.cart.push({id:product.id, brand:product.brand, model:product.model, price:product.price, qty:1});
  }
  renderCart();
}

function removeFromCart(id){
  state.cart = state.cart.filter(i=>i.id!==id);
  renderCart();
}

function changeQty(id, delta){
  const it = state.cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty<1) removeFromCart(id);
  renderCart();
}

function renderCart(){
  cartList.innerHTML = '';
  if(state.cart.length===0){
    cartList.innerHTML = '<div class="muted small">Seu carrinho está vazio. Adicione um veículo.</div>';
    cartTotal.textContent = formatMoney(0);
    return;
  }
  let total = 0;
  state.cart.forEach(item=>{
    total += item.price * item.qty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `<div style="display:flex;flex-direction:column"><strong>${item.brand} ${item.model}</strong><span class="muted small">${formatMoney(item.price)} · Qt: ${item.qty}</span></div>
                    <div style="display:flex;gap:6px;align-items:center">
                      <button class="btn" data-action="minus" data-id="${item.id}">-</button>
                      <button class="btn" data-action="plus" data-id="${item.id}">+</button>
                      <button class="btn" data-action="remove" data-id="${item.id}">x</button>
                    </div>`;
    cartList.appendChild(el);
  });
  cartTotal.textContent = formatMoney(total);
  cartList.querySelectorAll('[data-action]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = Number(btn.dataset.id);
      const a = btn.dataset.action;
      if(a==='minus') changeQty(id, -1);
      if(a==='plus') changeQty(id, +1);
      if(a==='remove') removeFromCart(id);
    });
  });
}

function bindEvents(){
  searchInput.addEventListener('input', (e)=>{
    state.query = e.target.value;
    renderProducts();
  });
  sortSelect.addEventListener('change',(e)=>{
    state.sort = e.target.value;
    renderProducts();
  });
  applyPriceBtn.addEventListener('click', ()=>{
    const min = Number(minPriceInput.value);
    const max = Number(maxPriceInput.value);
    state.minPrice = isNaN(min)? null : min;
    state.maxPrice = isNaN(max)? null : max;
    renderProducts();
  });
  clearBtn.addEventListener('click', ()=>{
    state = {...state, query:'', sort:'default', minPrice:null, maxPrice:null};
    searchInput.value='';
    sortSelect.value='default';
    minPriceInput.value='';
    maxPriceInput.value='';
    renderProducts();
    renderCategories();
  });
  clearCartBtn.addEventListener('click', ()=>{
    state.cart=[];
    renderCart();
  });
  checkoutBtn.addEventListener('click', ()=>{
    if(state.cart.length===0){
      alert('Seu carrinho está vazio.');
      return;
    }
    const names = state.cart.map(i=>i.brand+' '+i.model).join(', ');
    alert('Obrigado pela preferência! Itens: '+names+' — Este é apenas um exemplo (sem integração de pagamento).');
    state.cart = [];
    renderCart();
  });
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape') closeModal();
  });
}

init();
