// ===== DEFAULT DATA =====
const defaultProducts = [
  { id:1, name:"Sovereign Beard Oil", price:34.99, oldPrice:null, image:"images/beard-oil.png", category:"beard", badge:"best", rating:4.9, reviews:342, desc:"Premium blend of argan, jojoba, and cedarwood oils for a softer, healthier beard." },
  { id:2, name:"Charcoal Face Cleanser", price:28.99, oldPrice:null, image:"images/face-wash.png", category:"skin", badge:"best", rating:4.8, reviews:218, desc:"Deep-cleansing activated charcoal formula that purifies without stripping moisture." },
  { id:3, name:"Matte Clay Pomade", price:24.99, oldPrice:null, image:"images/hair-pomade.png", category:"hair", badge:"new", rating:4.7, reviews:186, desc:"Strong hold, matte finish clay pomade for textured, natural-looking styles." },
  { id:4, name:"Precision Safety Razor", price:59.99, oldPrice:79.99, image:"images/razor.png", category:"shave", badge:"sale", rating:4.9, reviews:412, desc:"Weighted chrome razor for the closest, most comfortable shave of your life." },
  { id:5, name:"Noir Eau de Parfum", price:89.99, oldPrice:null, image:"images/cologne.png", category:"fragrance", badge:"best", rating:4.8, reviews:289, desc:"Sophisticated woody fragrance with notes of sandalwood, leather, and black pepper." },
  { id:6, name:"Royal Shaving Cream", price:22.99, oldPrice:29.99, image:"images/shaving-cream.png", category:"shave", badge:"sale", rating:4.6, reviews:157, desc:"Rich, cushioning lather with eucalyptus and menthol for an invigorating shave." },
  { id:7, name:"Hydra Defense Moisturizer", price:32.99, oldPrice:null, image:"images/moisturizer.png", category:"skin", badge:"new", rating:4.7, reviews:203, desc:"Lightweight, fast-absorbing moisturizer with SPF 30 and hyaluronic acid." },
  { id:8, name:"Beard Balm — Cedarwood", price:26.99, oldPrice:null, image:"images/beard-oil.png", category:"beard", badge:null, rating:4.6, reviews:144, desc:"Conditioning balm that tames flyaways and adds a subtle cedar scent." },
  { id:9, name:"Sea Salt Texture Spray", price:19.99, oldPrice:null, image:"images/hair-pomade.png", category:"hair", badge:null, rating:4.5, reviews:98, desc:"Effortless beach-texture waves with volumizing sea salt and minerals." },
  { id:10, name:"Vitamin C Serum", price:38.99, oldPrice:44.99, image:"images/face-wash.png", category:"skin", badge:"sale", rating:4.8, reviews:276, desc:"Brightening serum with 20% Vitamin C to reduce dark spots and fine lines." },
  { id:11, name:"Pre-Shave Oil", price:18.99, oldPrice:null, image:"images/beard-oil.png", category:"shave", badge:null, rating:4.5, reviews:134, desc:"Protective oil that softens stubble and reduces razor burn before shaving." },
  { id:12, name:"Oud & Amber Cologne", price:94.99, oldPrice:null, image:"images/cologne.png", category:"fragrance", badge:"new", rating:4.9, reviews:167, desc:"Luxurious oud-based fragrance with warm amber and smoky vetiver notes." },
];

const defaultCodCharges = {
  'metro': { charge: 0, label: 'Metro City — Free COD', cities: ['mumbai','delhi','bangalore','bengaluru','chennai','kolkata','hyderabad','pune'] },
  'tier1': { charge: 29, label: 'Tier-1 City — ₹29 COD', cities: ['ahmedabad','jaipur','lucknow','kanpur','nagpur','indore','bhopal','patna','vadodara','ludhiana','agra','nashik','surat','visakhapatnam','chandigarh'] },
  'tier2': { charge: 49, label: 'Tier-2 City — ₹49 COD', cities: ['dehradun','mysore','mangalore','jodhpur','udaipur','guwahati','ranchi','raipur','bhubaneswar','coimbatore','kochi','trivandrum','amritsar','allahabad','varanasi','meerut'] },
  'rural': { charge: 79, label: 'Other Location — ₹79 COD' }
};

const defaultStoreSettings = { freeShippingThreshold: 75, baseShipping: 9.99 };

// ===== DYNAMIC STORE DATA =====
let products = JSON.parse(localStorage.getItem('gv_catalog_v2'));
if (!products || products.length === 0) {
  products = defaultProducts;
  localStorage.setItem('gv_catalog_v2', JSON.stringify(products));
}

let codCharges = JSON.parse(localStorage.getItem('gv_codCharges'));
if (!codCharges) {
  codCharges = defaultCodCharges;
  localStorage.setItem('gv_codCharges', JSON.stringify(codCharges));
}

let storeSettings = JSON.parse(localStorage.getItem('gv_settings'));
if (!storeSettings) {
  storeSettings = defaultStoreSettings;
  localStorage.setItem('gv_settings', JSON.stringify(storeSettings));
}

function getCODCharge(city) {
  if (!city) return codCharges.rural;
  const c = city.toLowerCase().trim();
  for (const tier of ['metro','tier1','tier2']) {
    if (codCharges[tier].cities.includes(c)) return codCharges[tier];
  }
  return codCharges.rural;
}

// ===== PERSISTENT STATE =====
let cart = JSON.parse(localStorage.getItem('gv_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('gv_wishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('gv_user')) || null;
let currentFilter = 'all';
let isSignUp = false;

function saveCart() { localStorage.setItem('gv_cart', JSON.stringify(cart)); }
function saveWishlist() { localStorage.setItem('gv_wishlist', JSON.stringify(wishlist)); }

// ===== PRELOADER =====
window.addEventListener('load', () => {
  const pl = document.getElementById('preloader');
  if (pl) pl.classList.add('hidden');
  if (document.getElementById('productsGrid')) renderProducts('all');
  initScrollAnimations();
  updateCart();
  updateWishlistUI();
  updateAuthUI();
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  });
}
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
}
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('active'));
  });
}

// ===== SMOOTH SCROLL =====
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== RENDER PRODUCTS =====
function renderProducts(filter) {
  currentFilter = filter;
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === filter || (filter === 'all' && btn.textContent === 'All'));
  });

  grid.innerHTML = '';
  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.08}s`;
    card.style.animation = 'fadeUp 0.5s both';

    const badgeHTML = p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'best' ? 'Bestseller' : p.badge === 'new' ? 'New' : 'Sale'}</span>` : '';
    const oldPriceHTML = p.oldPrice ? `<span class="price-old">$${p.oldPrice.toFixed(2)}</span>` : '';
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 ? '☆' : '');
    const isWished = wishlist.some(w => w.id === p.id);

    card.innerHTML = `
      ${badgeHTML}
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="product-actions">
          <button class="product-action-btn" onclick="event.stopPropagation();openQuickView(${p.id})" title="Quick View"><i class="fas fa-eye"></i></button>
          <button class="product-action-btn ${isWished ? 'wishlisted' : ''}" onclick="event.stopPropagation();toggleWishlistItem(${p.id})" title="Wishlist"><i class="${isWished ? 'fas' : 'far'} fa-heart"></i></button>
          <button class="product-action-btn" onclick="event.stopPropagation();addToCart(products.find(x=>x.id===${p.id}))" title="Add to Cart"><i class="fas fa-shopping-bag"></i></button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">$${p.price.toFixed(2)}</span>
          ${oldPriceHTML}
        </div>
      </div>
    `;
    card.addEventListener('click', () => window.location.href = `product.html?id=${p.id}`);
    grid.appendChild(card);
  });
}

function filterProducts(filter) {
  renderProducts(filter);
  if (filter !== 'all') {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===== CART (localStorage) =====
function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) { existing.qty++; } else { cart.push({ ...product, qty: 1 }); }
  saveCart();
  updateCart();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else { saveCart(); updateCart(); }
  }
}

function updateCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const cc = document.getElementById('cartCount');
  const cic = document.getElementById('cartItemCount');
  const ct = document.getElementById('cartTotal');
  if (cc) cc.textContent = count;
  if (cic) cic.textContent = count;
  if (ct) ct.textContent = `$${total.toFixed(2)}`;

  const container = document.getElementById('cartItems');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon"><i class="fas fa-shopping-bag"></i></div><p>Your cart is empty</p><button class="btn btn-outline" onclick="toggleCart();window.location.href='index.html#products'" style="margin-top:15px;font-size:0.75rem;padding:8px 16px">Browse Products</button></div>`;
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
    </div>
  `).join('');
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartDrawer').classList.toggle('open');
}

const cartBtn = document.getElementById('cartBtn');
if (cartBtn) cartBtn.addEventListener('click', toggleCart);

// ===== WISHLIST =====
function toggleWishlistItem(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('Removed from wishlist');
  } else {
    wishlist.push({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category });
    showToast('Added to wishlist!');
  }
  saveWishlist();
  updateWishlistUI();
  if (document.getElementById('productsGrid')) renderProducts(currentFilter);
}

function updateWishlistUI() {
  const wc = document.getElementById('wishlistCount');
  if (wc) wc.textContent = wishlist.length;
  const wic = document.getElementById('wishlistItemCount');
  if (wic) wic.textContent = wishlist.length;
  const container = document.getElementById('wishlistItems');
  if (!container) return;
  if (wishlist.length === 0) {
    container.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon"><i class="far fa-heart"></i></div><p>Your wishlist is empty</p><button class="btn btn-outline" onclick="toggleWishlist();window.location.href='index.html#products'" style="margin-top:15px;font-size:0.75rem;padding:8px 16px">Discover Essentials</button></div>`;
    return;
  }
  container.innerHTML = wishlist.map(item => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      </div>
      <button class="cart-item-remove" onclick="toggleWishlistItem(${item.id})"><i class="fas fa-trash-alt"></i></button>
    </div>
  `).join('');
}

function toggleWishlist() {
  document.getElementById('wishlistOverlay').classList.toggle('open');
  document.getElementById('wishlistDrawer').classList.toggle('open');
}

const wishlistBtn = document.getElementById('wishlistBtn');
if (wishlistBtn) wishlistBtn.addEventListener('click', toggleWishlist);

// ===== SEARCH =====
function openSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) { overlay.classList.add('open'); document.getElementById('searchInput').focus(); }
}
function closeSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.remove('open');
}

const searchBtn = document.getElementById('searchBtn');
if (searchBtn) searchBtn.addEventListener('click', openSearch);

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const resultsDiv = document.getElementById('searchResults');
    if (q.length < 2) {
      resultsDiv.innerHTML = `<div class="search-hint"><i class="fas fa-lightbulb"></i><span>Try searching for "beard oil", "razor", or "cologne"</span></div>`;
      return;
    }
    const matches = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    if (matches.length === 0) {
      resultsDiv.innerHTML = `<div class="search-hint"><i class="fas fa-search"></i><span>No products found for "${e.target.value}"</span></div>`;
      return;
    }
    resultsDiv.innerHTML = matches.map(p => `
      <a href="product.html?id=${p.id}" class="search-result-item">
        <img src="${p.image}" alt="${p.name}">
        <div class="search-result-info">
          <span class="search-result-name">${p.name}</span>
          <span class="search-result-price">$${p.price.toFixed(2)}</span>
        </div>
        <i class="fas fa-arrow-right"></i>
      </a>
    `).join('');
  });
}

// ===== QUICK VIEW MODAL =====
function openQuickView(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalImage').innerHTML = `<img src="${p.image}" alt="${p.name}">`;
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 ? '☆' : '');
  const oldPriceHTML = p.oldPrice ? `<span class="price-old" style="font-size:1rem">$${p.oldPrice.toFixed(2)}</span>` : '';
  document.getElementById('modalContent').innerHTML = `
    <div class="product-category" style="margin-bottom:8px">${p.category}</div>
    <h2 style="font-family:var(--font-heading);font-size:1.6rem;margin-bottom:12px">${p.name}</h2>
    <div class="product-rating" style="margin-bottom:12px">
      <span class="stars" style="font-size:0.9rem">${stars}</span>
      <span class="rating-count">${p.rating} (${p.reviews} reviews)</span>
    </div>
    <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:20px;line-height:1.7">${p.desc}</p>
    <div class="product-price" style="margin-bottom:24px">
      <span class="price-current" style="font-size:1.5rem">$${p.price.toFixed(2)}</span>
      ${oldPriceHTML}
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="addToCart(products.find(x=>x.id===${p.id}));closeModal()">Add to Cart <i class="fas fa-shopping-bag"></i></button>
      <button class="btn btn-outline" onclick="toggleWishlistItem(${p.id})"><i class="far fa-heart"></i> Wishlist</button>
      <a href="product.html?id=${p.id}" class="btn btn-dark" style="text-decoration:none">View Details <i class="fas fa-arrow-right"></i></a>
    </div>
  `;
  document.getElementById('quickViewModal').classList.add('open');
}

function closeModal() { document.getElementById('quickViewModal').classList.remove('open'); }

const qvm = document.getElementById('quickViewModal');
if (qvm) qvm.addEventListener('click', (e) => { if (e.target.id === 'quickViewModal') closeModal(); });

// ===== FIREBASE INIT =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let auth;
let db;
if (typeof firebase !== 'undefined') {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();

    auth.onAuthStateChanged(user => {
      if (user) {
        currentUser = { email: user.email, name: user.displayName || user.email.split('@')[0], uid: user.uid };
        localStorage.setItem('gv_user', JSON.stringify(currentUser));
      } else {
        currentUser = null;
        localStorage.removeItem('gv_user');
      }
      updateAuthUI();
    });
  } else {
    console.warn("Firebase config is placeholder. Using mock authentication.");
  }
}

// ===== LOGIN / AUTH =====
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) loginBtn.addEventListener('click', () => document.getElementById('loginModal').classList.add('open'));

function closeLoginModal() { document.getElementById('loginModal').classList.remove('open'); }
const loginModal = document.getElementById('loginModal');
if (loginModal) loginModal.addEventListener('click', (e) => { if (e.target.id === 'loginModal') closeLoginModal(); });

async function handleEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;
  
  if (typeof auth === 'undefined') {
    // Fallback Mock Auth
    if (isSignUp) {
      currentUser = { email, name: email.split('@')[0], uid: 'local_' + Date.now() };
      showToast('Account created successfully! (Mock)');
    } else {
      currentUser = { email, name: email.split('@')[0], uid: 'local_' + Date.now() };
      showToast('Signed in successfully! (Mock)');
    }
    localStorage.setItem('gv_user', JSON.stringify(currentUser));
    updateAuthUI();
    closeLoginModal();
    return;
  }

  try {
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    if (isSignUp) {
      await auth.createUserWithEmailAndPassword(email, pass);
      showToast('Account created successfully!');
    } else {
      await auth.signInWithEmailAndPassword(email, pass);
      showToast('Signed in successfully!');
    }
    closeLoginModal();
    btn.innerHTML = originalText;
    btn.disabled = false;
  } catch (error) {
    showToast(error.message);
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = isSignUp ? 'Sign Up <i class="fas fa-arrow-right"></i>' : 'Sign In <i class="fas fa-arrow-right"></i>';
    btn.disabled = false;
  }
}

async function handleGoogleLogin() {
  if (typeof auth === 'undefined') {
    // Fallback Mock Auth
    currentUser = { email: 'user@gmail.com', name: 'Google User', uid: 'google_' + Date.now() };
    localStorage.setItem('gv_user', JSON.stringify(currentUser));
    showToast('Signed in with Google! (Mock)');
    updateAuthUI();
    closeLoginModal();
    return;
  }

  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
    showToast('Signed in with Google!');
    closeLoginModal();
  } catch (error) {
    showToast(error.message);
  }
}

async function handleLogout() {
  if (typeof auth !== 'undefined') {
    try {
      await auth.signOut();
      showToast('Signed out successfully');
    } catch (error) {
      showToast(error.message);
    }
  } else {
    // Fallback Mock Auth
    currentUser = null;
    localStorage.removeItem('gv_user');
    showToast('Signed out successfully (Mock)');
    updateAuthUI();
  }
  closeLoginModal();
}

function toggleAuthMode(e) {
  e.preventDefault();
  isSignUp = !isSignUp;
  const t = document.getElementById('loginToggleText');
  const h = document.querySelector('.login-header h2');
  const hp = document.querySelector('.login-header p');
  if (isSignUp) {
    if (h) h.textContent = 'Create Account';
    if (hp) hp.textContent = 'Join the GROOMVAULT family';
    if (t) t.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode(event)">Sign In</a>';
  } else {
    if (h) h.textContent = 'Welcome Back';
    if (hp) hp.textContent = 'Sign in to your GROOMVAULT account';
    if (t) t.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode(event)">Sign Up</a>';
  }
}

function updateAuthUI() {
  const authUI = document.getElementById('firebaseAuthUI');
  const profile = document.getElementById('userProfile');
  if (!authUI || !profile) return;
  if (currentUser) {
    authUI.style.display = 'none';
    profile.style.display = 'block';
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    const av = document.getElementById('userAvatar');
    if (av) av.textContent = currentUser.name.substring(0, 2).toUpperCase();
    const lb = document.getElementById('loginBtn');
    if (lb) lb.innerHTML = '<i class="fas fa-user"></i>';
  } else {
    authUI.style.display = 'block';
    profile.style.display = 'none';
    const lb = document.getElementById('loginBtn');
    if (lb) lb.innerHTML = '<i class="far fa-user"></i>';
  }
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastMsg').textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(100px)'; }, 2500);
}

// ===== NEWSLETTER =====
async function handleNewsletter(e) {
  e.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  const email = emailInput ? emailInput.value : '';
  
  if (!email) return;

  try {
    const response = await fetch('https://groomvault-api.onrender.com/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      showToast('Subscribed! Welcome to the club.');
      if (emailInput) emailInput.value = '';
    } else {
      showToast('Failed to subscribe. Please try again.');
    }
  } catch (error) {
    console.error('Newsletter error:', error);
    showToast('Network error. Please try again later.');
  }
}

// ===== SCROLL REVEAL =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeSearch();
    closeLoginModal();
    const cd = document.getElementById('cartDrawer');
    if (cd && cd.classList.contains('open')) toggleCart();
    const wd = document.getElementById('wishlistDrawer');
    if (wd && wd.classList.contains('open')) toggleWishlist();
  }
  if (e.ctrlKey && e.key === 'k') { e.preventDefault(); openSearch(); }
});
