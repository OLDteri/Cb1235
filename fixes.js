
/* fixes.js - Унифицированные исправления и полифиллы для SHINI-PTOP */
/* Простая реализация корзины и авторизации через localStorage,
   чтобы сайт работал, даже если оригинальные скрипты не подключены. */

(function(){
  'use strict';

  /* ---- Helpers ---- */
  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function formatPrice(n){ return n.toLocaleString('ru-RU') + ' ₽'; }

  /* ---- Cart (localStorage) ---- */
  const CART_KEY = 'shini_cart_v1';
  function readCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }catch(e){ return []; } }
  function writeCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartUI(); }
  function addToCart(item){
    const cart = readCart();
    const idx = cart.findIndex(i=>i.id===item.id);
    if(idx>=0){ cart[idx].qty += item.qty; } else { cart.push(item); }
    writeCart(cart);
  }
  function removeFromCart(id){
    const cart = readCart().filter(i=>i.id!==id);
    writeCart(cart);
  }
  function setQty(id, qty){
    const cart = readCart();
    const idx = cart.findIndex(i=>i.id===id);
    if(idx>=0){ cart[idx].qty = Math.max(1, qty); writeCart(cart); }
  }
  function cartTotal(){
    const cart=readCart();
    return cart.reduce((s,i)=>s + (i.price||0)*i.qty, 0);
  }

  function updateCartUI(){
    // cart count badges
    qsa('.cart-count').forEach(el=>{
      const total = readCart().reduce((s,i)=>s+i.qty,0);
      el.textContent = total;
    });
    // update cart page if present
    const cartItemsEl = qs('#cart-items');
    if(cartItemsEl){
      const cart = readCart();
      cartItemsEl.innerHTML = '';
      if(cart.length===0){
        cartItemsEl.innerHTML = '<div class="empty-cart"><p>Ваша корзина пуста.</p><a href="catalog.html" class="btn">Перейти в каталог</a></div>';
      } else {
        cart.forEach(item=>{
          const div = document.createElement('div');
          div.className = 'cart-item';
          div.innerHTML = `
            <div style="display:flex;gap:15px;align-items:center;">
              <img src="${item.image || 'images/placeholder.png'}" alt="${item.title}" style="width:100px;height:80px;object-fit:cover;border-radius:8px;">
              <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p class="product-specs">${item.specs || ''}</p>
                <div style="display:flex;gap:10px;align-items:center;margin-top:8px;">
                  <div class="quantity-controls">
                    <button class="btn qty-decrease" data-id="${item.id}">−</button>
                    <input class="quantity-input" data-id="${item.id}" value="${item.qty}" type="number" min="1">
                    <button class="btn qty-increase" data-id="${item.id}">+</button>
                  </div>
                  <strong class="price">${formatPrice(item.price*item.qty)}</strong>
                  <button class="btn remove-item" data-id="${item.id}" style="margin-left:10px;">Удалить</button>
                </div>
              </div>
            </div>
          `;
          cartItemsEl.appendChild(div);
        });
        // total
        const totalWrap = document.createElement('div');
        totalWrap.className = 'cart-total';
        totalWrap.innerHTML = `<strong>Итого:</strong> <span id="cart-total-price">${formatPrice(cartTotal())}</span>`;
        cartItemsEl.appendChild(totalWrap);
      }
    }
  }

  // Attach events for dynamic cart controls
  document.addEventListener('click', function(e){
    const t = e.target;
    if(t.matches('.qty-decrease')){
      const id = t.dataset.id;
      const cur = readCart().find(i=>i.id===id);
      if(cur) setQty(id, cur.qty-1);
    } else if(t.matches('.qty-increase')){
      const id = t.dataset.id;
      const cur = readCart().find(i=>i.id===id);
      if(cur) setQty(id, cur.qty+1);
    } else if(t.matches('.remove-item')){
      removeFromCart(t.dataset.id);
    } else if(t.matches('.add-to-cart')){
      // buttons in catalog may use data attributes
      const id = t.dataset.id || ('pid-' + Date.now());
      const title = t.dataset.title || t.getAttribute('data-title') || 'Товар';
      const price = Number(t.dataset.price) || Number(t.getAttribute('data-price')) || 0;
      const image = t.dataset.image || 'images/placeholder.png';
      addToCart({id, title, price, qty:1, image});
      // визуальная подсказка
      t.textContent = 'Добавлено';
      setTimeout(()=>{ t.textContent = 'В корзину'; }, 1000);
    }
  });

  document.addEventListener('input', function(e){
    const t = e.target;
    if(t.matches('.quantity-input')){
      const id = t.dataset.id;
      const v = parseInt(t.value) || 1;
      setQty(id, v);
    }
  });

  /* ---- Promo code (simple) ---- */
  document.addEventListener('click', function(e){
    const t = e.target;
    if(t.id === 'apply-promo'){
      const promo = (qs('#promo') && qs('#promo').value || '').trim();
      if(!promo){ alert('Введите промокод'); return; }
      // простой пример: PROMO10 даёт 10% скидки
      const cart = readCart();
      if(cart.length===0){ alert('Корзина пуста'); return; }
      if(promo.toUpperCase() === 'PROMO10'){
        const total = cartTotal();
        const discounted = Math.round(total * 0.9);
        if(qs('#cart-total-price')) qs('#cart-total-price').textContent = formatPrice(discounted);
        alert('Промокод применён: 10% скидки');
      } else {
        alert('Неверный промокод');
      }
    }
  });

  /* ---- Order form ---- */
  document.addEventListener('submit', function(e){
    const form = e.target;
    if(form && form.id === 'order-form'){
      e.preventDefault();
      const cart = readCart();
      if(cart.length===0){ alert('Добавьте товары в корзину перед оформлением'); return; }
      // простая отправка — очищаем корзину и показываем сообщение
      localStorage.removeItem(CART_KEY);
      updateCartUI();
      alert('Заказ принят! Мы свяжемся с вами по указанным контактам.');
      form.reset();
    } else if(form && form.id === 'feedback-form'){
      e.preventDefault();
      alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      form.reset();
    } else if(form && form.id === 'login-form'){
      e.preventDefault();
      const email = form.querySelector('[name=email]').value;
      const pass = form.querySelector('[name=password]').value;
      const users = JSON.parse(localStorage.getItem('shini_users_v1')||'{}');
      if(users[email] && users[email].password === pass){
        localStorage.setItem('shini_current_user', JSON.stringify({email: email, name: users[email].name}));
        updateAuthUI();
        alert('Вход выполнен');
        window.location.href = 'account.html';
      } else {
        alert('Неверный email или пароль');
      }
    } else if(form && form.id === 'register-form'){
      e.preventDefault();
      const name = form.querySelector('[name=name]').value;
      const email = form.querySelector('[name=email]').value;
      const phone = form.querySelector('[name=phone]').value;
      const pass = form.querySelector('[name=password]').value;
      const conf = form.querySelector('[name=confirm-password]').value || form.querySelector('[name=confirm_password]')?.value;
      if(pass !== conf){ alert('Пароли не совпадают'); return; }
      const users = JSON.parse(localStorage.getItem('shini_users_v1')||'{}');
      if(users[email]){ alert('Пользователь с таким email уже зарегистрирован'); return; }
      users[email] = {name, phone, password: pass};
      localStorage.setItem('shini_users_v1', JSON.stringify(users));
      localStorage.setItem('shini_current_user', JSON.stringify({email: email, name}));
      updateAuthUI();
      alert('Регистрация успешна');
      window.location.href = 'account.html';
    }
  });

  /* ---- Auth UI ---- */
  function updateAuthUI(){
    const cur = JSON.parse(localStorage.getItem('shini_current_user') || 'null');
    qsa('#account-btn, #account-btn, a#account-btn').forEach(el=>{
      if(cur){ el.style.display = 'inline-flex'; } else { el.style.display = 'none'; }
    });
    qsa('#login-btn, a#login-btn, .btn#login-btn').forEach(el=>{
      if(cur){ el.style.display = 'none'; } else { el.style.display = 'inline-flex'; }
    });
    qsa('#register-btn').forEach(el=>{
      if(cur){ el.style.display = 'none'; } else { el.style.display = 'inline-flex'; }
    });
    // show user info on account page
    if(qs('#user-name')) {
      if(cur){ qs('#user-name').textContent = cur.name || cur.email; }
      if(qs('#user-email')) qs('#user-email').textContent = cur.email || '';
    }
  }

  // logout button
  document.addEventListener('click', function(e){
    const t = e.target;
    if(t && (t.id === 'logout-btn' || t.matches('.logout-btn'))){
      localStorage.removeItem('shini_current_user');
      updateAuthUI();
      alert('Вы вышли из аккаунта');
      window.location.href = 'index.html';
    }
  });

  /* ---- Chat assistant ---- */
  function initChat(){
    const toggle = qs('#chat-toggle');
    const win = qs('#chat-window');
    const closeBtn = qs('#chat-close');
    const sendBtn = qs('#chat-send');
    const input = qs('#chat-input');
    const messages = qs('#chat-messages');

    if(!toggle || !win) return;
    toggle.addEventListener('click', ()=>{ win.style.display = 'flex'; });
    if(closeBtn) closeBtn.addEventListener('click', ()=>{ win.style.display = 'none'; });
    if(sendBtn && input && messages){
      sendBtn.addEventListener('click', ()=>{ sendUserMessage(); });
      input.addEventListener('keydown', (ev)=>{ if(ev.key === 'Enter') sendUserMessage(); });
    }
    function sendUserMessage(){
      const text = input.value && input.value.trim();
      if(!text) return;
      const um = document.createElement('div'); um.className = 'message user-message'; um.innerHTML = `<p>${text}</p>`;
      messages.appendChild(um);
      input.value = '';
      setTimeout(()=>{
        const bm = document.createElement('div'); bm.className = 'message bot-message'; bm.innerHTML = `<p>Извините, я пока не реальный бот. Ваше сообщение: "${text}" принято.</p>`;
        messages.appendChild(bm);
        messages.scrollTop = messages.scrollHeight;
      }, 600);
    }
  }

  /* ---- Nav active link ---- */
  function setActiveNav(){
    const links = qsa('.nav a');
    const path = location.pathname.split('/').pop() || 'index.html';
    links.forEach(a=>{
      const href = (a.getAttribute('href')||'').split('/').pop();
      if(href === path) a.classList.add('active'); else a.classList.remove('active');
    });
  }

  /* ---- Misc helpers used in templates ---- */
  window.openInMap = function(){
    try{ window.open('https://yandex.ru/maps/-/CDUyIJgs', '_blank'); }catch(e){}
  };

  /* ---- Init on DOM ready ---- */
  document.addEventListener('DOMContentLoaded', function(){
    updateCartUI();
    updateAuthUI();
    initChat();
    setActiveNav();

    // attach "add-to-cart" to product cards if they exist
    qsa('.product-card').forEach(card=>{
      if(!card.querySelector('.add-to-cart')){
        const btn = document.createElement('button');
        btn.className = 'btn add-to-cart';
        btn.textContent = 'В корзину';
        // try to infer data
        const id = card.dataset.id || card.querySelector('img')?.getAttribute('data-id') || ('p-'+Math.random().toString(36).slice(2,8));
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'Товар';
        const priceText = card.querySelector('.price') ? card.querySelector('.price').textContent.replace(/\D/g,'') : '';
        const price = Number(priceText) || Number(card.dataset.price) || 0;
        const img = card.querySelector('img') ? card.querySelector('img').getAttribute('src') : 'images/placeholder.png';
        btn.dataset.id = id; btn.dataset.title = title; btn.dataset.price = price; btn.dataset.image = img;
        const info = card.querySelector('.product-info') || card;
        info.appendChild(btn);
      }
    });
  });

  // expose cart API for debugging
  window.SHINI = {
    addToCart, readCart, removeFromCart, setQty, cartTotal
  };

})();


/* BW PRO enhancements appended */

/* ---- Enhancements for BW PRO ---- */
(function(){
  if(window.__shini_bw_pro_loaded) return;
  window.__shini_bw_pro_loaded = true;

  function createToast(msg, duration=2200){
    let t = document.createElement('div');
    t.className = 'toast';
    t.innerText = msg;
    document.body.appendChild(t);
    // force reflow
    void t.offsetWidth;
    t.classList.add('show');
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); }, duration);
  }
  // expose globally
  window.SHINI_toast = createToast;

  // Ensure cart UI update is resilient
  function safeUpdateCartUI(){
    try{ if(window.SHINI && typeof window.SHINI.readCart === 'function'){ window.SHINI.readCart(); } }catch(e){}
    // attempt to update badges
    const cart = JSON.parse(localStorage.getItem('shini_cart_v1')||'[]');
    const total = cart.reduce((s,i)=>s+(i.qty||0),0);
    document.querySelectorAll('.cart-count').forEach(el=>el.textContent = total);
    // update cart page total if present
    const totalEl = document.getElementById('cart-total-price');
    if(totalEl) {
      const sum = cart.reduce((s,i)=>s + (Number(i.price)||0)*(i.qty||1), 0);
      totalEl.textContent = (sum).toLocaleString('ru-RU') + ' ₽';
    }
  }
  // Run on load and when storage changes (sync tabs)
  safeUpdateCartUI();
  window.addEventListener('storage', safeUpdateCartUI);

  // patch add-to-cart clicks to show toast and be resilient
  document.addEventListener('click', function(e){
    const t = e.target.closest && e.target.closest('.add-to-cart, .btn.add-to-cart, [data-add-to-cart]');
    if(!t) return;
    // infer dataset
    const id = t.dataset.id || t.getAttribute('data-id') || ('p-'+Date.now());
    const title = t.dataset.title || t.getAttribute('data-title') || (t.closest('.product-card') && t.closest('.product-card').querySelector('h3')?.textContent) || 'Товар';
    const price = Number(t.dataset.price || t.getAttribute('data-price') || (t.closest('.product-card') && (t.closest('.product-card').querySelector('.price')?.textContent||'').replace(/\D/g,'')) ) || 0;
    const img = t.dataset.image || t.getAttribute('data-image') || (t.closest('.product-card') && t.closest('.product-card').querySelector('img')?.getAttribute('src')) || 'images/placeholder.png';
    // add via SHINI API if available
    try{
      if(window.SHINI && typeof window.SHINI.addToCart === 'function'){
        window.SHINI.addToCart({id:String(id), title:String(title).trim(), price:price, qty:1, image:img});
      } else {
        // fallback to localStorage
        const key = 'shini_cart_v1';
        let cart = JSON.parse(localStorage.getItem(key) || '[]');
        const idx = cart.findIndex(i=>i.id===String(id));
        if(idx>=0) cart[idx].qty = (cart[idx].qty||1)+1; else cart.push({id:String(id), title:String(title).trim(), price:price, qty:1, image:img});
        localStorage.setItem(key, JSON.stringify(cart));
      }
      createToast('Добавлено в корзину');
      safeUpdateCartUI();
    }catch(err){
      console.error('Add to cart failed', err);
      createToast('Ошибка добавления');
    }
  });

  // ensure login/register flows show toast and update UI
  document.addEventListener('submit', function(e){
    const form = e.target;
    if(!form) return;
    if(form.id === 'login-form' || form.getAttribute('data-login-form')!=null){
      // after original fixes.js handles login, we still ensure UI and toast
      setTimeout(()=>{ safeUpdateCartUI(); createToast('Вход выполнен'); }, 200);
    }
    if(form.id === 'register-form' || form.getAttribute('data-register-form')!=null){
      setTimeout(()=>{ safeUpdateCartUI(); createToast('Регистрация завершена'); }, 200);
    }
    if(form.id === 'order-form'){
      setTimeout(()=>{ createToast('Заказ оформлен'); }, 200);
    }
  });

  // make sure chat toggle works even if elements missing
  document.addEventListener('click', function(e){
    const t = e.target;
    if(t && (t.id === 'chat-toggle' || t.closest && t.closest('#chat-toggle'))){
      const win = document.getElementById('chat-window');
      if(win){
        win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
      } else {
        createToast('Окно чата недоступно на этой странице');
      }
    }
  });

  // Ensure account button visibility across selectors
  function updateAccountButtons(){
    const cur = JSON.parse(localStorage.getItem('shini_current_user') || 'null');
    document.querySelectorAll('#account-btn, a.account-btn, .account-link').forEach(el=> el.style.display = cur ? 'inline-flex' : 'none');
    document.querySelectorAll('#login-btn, .login-link').forEach(el=> el.style.display = cur ? 'none' : 'inline-flex');
    document.querySelectorAll('#register-btn, .register-link').forEach(el=> el.style.display = cur ? 'none' : 'inline-flex');
  }
  updateAccountButtons();
  window.addEventListener('storage', updateAccountButtons);

})(); /* end enhancements */ 
