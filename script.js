// Dados de exemplo
const DB = [
{id:1, category:'SUV', type:'carro', brand:'Toyota', model:'RAV4', year:2022, price:185000, km:42000, color:'Branco'},
{id:2, category:'Sedan', type:'carro', brand:'Honda', model:'Civic', year:2021, price:120000, km:56000, color:'Prata'},
{id:3, category:'Esportivo', type:'carro', brand:'Porsche', model:'911 Carrera', year:2019, price:780000, km:18000, color:'Vermelho'},
{id:4, category:'Hatch', type:'carro', brand:'Volkswagen', model:'Golf', year:2020, price:95000, km:30000, color:'Preto'},
{id:5, category:'Pickup', type:'carro', brand:'Ford', model:'Ranger', year:2023, price:220000, km:12000, color:'Azul'},
{id:6, category:'Motos', type:'moto', brand:'Honda', model:'CB 500X', year:2022, price:42000, km:8000, color:'Preto'},
{id:7, category:'Motos', type:'moto', brand:'Yamaha', model:'MT-07', year:2021, price:36000, km:15000, color:'Cinza'},
{id:8, category:'SUV', type:'carro', brand:'Jeep', model:'Compass', year:2020, price:145000, km:65000, color:'Verde'},
{id:9, category:'Esportivo', type:'carro', brand:'Chevrolet', model:'Camaro', year:2018, price:420000, km:42000, color:'Amarelo'},
{id:10, category:'Hatch', type:'carro', brand:'Fiat', model:'Argo', year:2024, price:85000, km:800, color:'Branco'}
];


let state = { category: 'Todos', query: '', sort: 'default', minPrice: null, maxPrice: null, cart: [] };


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


function init(){ renderCategories(); bindEvents(); renderProducts(); renderCart(); }
function getCategories(){ const cats = new Set(DB.map(i=>i.category)); return ['Todos', ...Array.from(cats)]; }
function renderCategories(){ catList.innerHTML=''; getCategories().forEach(cat=>{ const el = document.createElement('div'); el.className = 'cat-item' + (cat===state.category? ' active':''); el.innerHTML = `<div>${cat}</div><div class="muted">${DB.filter(x=>x.category===cat).length}</div>`; el.addEventListener('click',()=>{ state.category = cat; renderCategories(); renderProducts(); }); catList.appendChild(el); }); }
function filterProducts(){ let res = DB.slice(); if(state.category && state.category!=='Todos'){ res = res.filter(p=>p.category===state.category); } if(state.query && state.query.trim()){ const q = state.query.toLowerCase(); res = res.filter(p=> (p.brand+' '+p.model+' '+p.year).toLowerCase().includes(q)); } if(state.minPrice!=null) res = res.filter(p=>p.price>=state.minPrice); if(state.maxPrice!=null) res = res.filter(p=>p.price<=state.maxPrice); if(state.sort==='price-asc') res.sort((a,b)=>a.price-b.price); if(state.sort==='price-desc') res.sort((a,b)=>b.price-a.price); if(state.sort==='year-desc') res.sort((a,b)=>b.year-a.year); if(state.sort==='year-asc') res.sort((a,b)=>a.year-b.year); return res; }
function formatMoney(v){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function renderProducts(){ const list = filterProducts(); productGrid.innerHTML=''; resultInfo.textContent = `Mostrando ${list.length} resultado(s) — Categoria: ${state.category}`; if(list.length===0){ emptyState.style.display='block'; } else { emptyState.style.display='none'; } list.forEach(item=>{ const card = document.createElement('article'); card.className='card'; const thumb = document.createElement('div'); thumb.className='thumb'; thumb.style.background = `linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))`; thumb.innerHTML = `<div style="text-align:center"><div style="font-size:12px;opacity:.7">${item.brand}</div><div style="font-size:14px;margin-top:6px">${item.model}</div><div style="font-size:11px;margin-top:6px" class="muted">${item.year}</div></div>`; const info = document.createElement('div'); info.className='info'; info.innerHTML = `<h3 class="title">${item.brand} ${item.model}</h3>\n <div class="meta">${item.category} • ${item.type.toUpperCase()} • ${item.km.toLocaleString()} km</div>\n <div class="price">${formatMoney(item.price)}</div>\n <div class="card-actions">\n <button class="btn" data-action="details" data-id="${item.id}">Detalhes</button>\n <button class="btn primary" data-action="add" data-id="${item.id}">Adicionar</button>\n </div>`; card.appendChild(thumb); card.appendChild(info); productGrid.appendChild(card); }); productGrid.querySelectorAll('[data-action]').forEach(btn=>{ btn.addEventListener('click',(e)=>{ const id = Number(btn.dataset.id); const action = btn.dataset.action; if(action==='details') openDetails(id); if(action==='add') addToCart(id); }); }); }
function openDetails(id){ const item = DB.find(x=>x.id===id); modalCard.innerHTML = `\n <div style="display:flex;gap:12px">\n <div style="flex:1">\n <div style="height:200px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))">\n <div style="text-align:center"><strong style="font-size:18px">${item.brand} ${item.model}</strong><div class="muted small">${item.year}</div></div>\n </div>\n </div>\n <div style="flex:1">\n <h3 style="margin-top:0">${item.brand} ${item.model}</h3>\n <div class="muted small">Categoria: ${item.category} • Tipo: ${item.type}</div>\n <p style="margin-top:12px">Cor: ${item.color} · KM: ${item.km.toLocaleString()} · Ano: ${item.year}</p>\n <p style="margin-top:12px"><strong>${formatMoney(item.price)}</strong></p>\n <div style="display:flex;gap:8px;margin-top:12px">\n <button class="btn primary" id="modalAdd">Adicionar ao carrinho</button>\n <button class="btn" id="modalClose">Fechar</button>\n </div>\n </div>\n </div>`; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.getElementById('modalClose').addEventListener('click', closeModal); document.getElementById('modalAdd').addEventListener('click', ()=>{ addToCart(id); closeModal(); }); }
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
modal.addEventListener('click',(e)=>{ if(e.target===modal) closeModal(); });
function addToCart(id){ const product = DB.find(x=>x.id===id); const existing = state.cart.find(i=>i.id===id); if(existing){ existing.qty++; } else state.cart.push({id:product.id, brand:product.brand, model:product.model, price:product.price, qty:1}); renderCart(); }
function removeFromCart(id){ state.cart = state.cart.filter(i=>i.id!==id); renderCart(); }
function changeQty(id, delta){ const it = state.cart.find(i=>i.id===id); if(!it) return; it.qty += delta; if(it.qty<1) removeFromCart(id); renderCart(); }
function renderCart(){ cartList.innerHTML=''; if(state.cart.length===0){ cartList.innerHTML = '<div class="muted small">Seu carrinho está vazio. Adicione um veículo.</div>'; cartTotal.textContent = formatMoney(0); return; } let total = 0; state.cart.forEach(item=>{ total += item.price * item.qty; const el = document.createElement('div'); el.className='cart-item'; el.innerHTML = `<div style="display:flex;flex-direction:column"><strong>${item.brand} ${item.model}</strong><span class="muted small">${formatMoney(item.price)} · Qt: ${item.qty}</span></div>\n <div style="display:flex;gap:6px;align-items:center">\n <button class="btn" data-action="minus" data-id="${item.id}">-</button>\n <button class="btn" data-action="plus" data-id="${item.id}">+</button>\n <button class="btn" data-action="remove" data-id="${item.id}">x</button>\n </div>`; cartList.appendChild(el); }); cartTotal.textContent = formatMoney(total); cartList.querySelectorAll('[data-action]').forEach(btn=>{ btn.addEventListener('click',()=>{ const id = Number(btn.dataset.id); const a = btn.dataset.action; if(a==='minus') changeQty(id, -1); if(a==='plus') changeQty(id, +1); if(a==='remove') removeFromCart(id); }); }); }
function bindEvents(){ searchInput.addEventListener('input', (e)=>{ state.query = e.target.value; renderProducts(); }); sortSelect.addEventListener('change',(e)=>{ state.sort = e.target.value; renderProducts(); }); applyPriceBtn.addEventListener('click', ()=>{ const min = Number(minPriceInput.value); const max = Number(maxPriceInput.value); state.minPrice = isNaN(min)? null : min; state.maxPrice = isNaN(max)? null : max; renderProducts(); }); clearBtn.addEventListener('click', ()=>{ state = {...state, query:'', sort:'default', minPrice:null, maxPrice:null}; searchInput.value=''; sortSelect.value='default'; minPriceInput.value=''; maxPriceInput.value=''; renderProducts(); renderCategories(); }); clearCartBtn.addEventListener('click', ()=>{ state.cart=[]; renderCart(); }); checkoutBtn.addEventListener('click', ()=>{ if(state.cart.length===0){ alert('Seu carrinho está vazio.'); return; } const names = state.cart.map(i=>i.brand+' '+i.model).join(', '); alert('Obrigado pela preferência! Itens: '+names+' — Este é apenas um exemplo (sem integração de pagamento).'); state.cart = []; renderCart(); }); document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModal(); }); }
init();