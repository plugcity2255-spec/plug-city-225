(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CART_KEY = 'plugcity225-cart-v1';
  const seedProducts = [
    {id:'p1',name:'Sneaker Rouge 225',category:'Chaussures',price:35000,oldPrice:42000,variants:'38–44 · rouge, blanc',description:'La paire qui donne le ton.',image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',badge:'COUP DE CŒUR'},
    {id:'p2',name:'Veste Downtown',category:'Vêtements',price:28000,oldPrice:0,variants:'S–XL · noir, kaki',description:'La couche parfaite pour le soir.',image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',badge:'NOUVEAU'},
    {id:'p3',name:'Sac Crossbody',category:'Accessoires',price:18000,oldPrice:22000,variants:'Noir · beige',description:'Compact, pratique, toujours avec toi.',image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',badge:'BON PLAN'},
    {id:'p4',name:'Sneaker Street Low',category:'Chaussures',price:32000,oldPrice:0,variants:'39–45 · blanc, gris',description:'Le classique revisité pour la ville.',image:'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&q=80',badge:''},
    {id:'p5',name:'T-shirt Oversize',category:'Vêtements',price:12000,oldPrice:15000,variants:'S–XXL · crème, noir',description:'L’essentiel, avec la bonne coupe.',image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',badge:'BON PLAN'},
    {id:'p6',name:'Lunettes Soleil',category:'Accessoires',price:15000,oldPrice:0,variants:'Noir · écaille',description:'La touche finale, toute l’année.',image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',badge:'NOUVEAU'},
    {id:'p7',name:'Casquette City',category:'Accessoires',price:10000,oldPrice:0,variants:'Taille unique · noir',description:'Une attitude, sans effort.',image:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',badge:''},
    {id:'p8',name:'Pantalon Cargo',category:'Vêtements',price:24000,oldPrice:0,variants:'S–XL · olive, noir',description:'Prêt pour tes journées bien remplies.',image:'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=800&q=80',badge:''},
    {id:'p9',name:'Air Force One',category:'Chaussures',price:12000,oldPrice:0,variants:'',description:'Tailles et coloris à confirmer sur WhatsApp.',image:'air-force-one.webp',badge:'NOUVEAU'}
  ];
  const categories = ['Vêtements','Chaussures','Accessoires','Autres'];
  const MAX_QUANTITY = 20;
  const defaultSettings = {name:'PLUG CITY 225',whatsapp:'2250508358005',tagline:'Abidjan. À ton rythme.',description:'PLUG CITY 225, c’est la sélection qui te ressemble. Des pièces tendance, des prix accessibles et un service de proximité, pensé pour la vraie vie à Abidjan.',color:'#f2c94c',banner:''};
  const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
  function safeImage(value) {
    if (typeof value !== 'string' || value.length > 2600000) return '';
    if (/^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/]+=*$/i.test(value)) return value;
    if (!value || value.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(value) && !/^https:/i.test(value)) return '';
    if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
    try { return new URL(value).protocol === 'https:' ? value : ''; } catch { return ''; }
  }
  function normalizeProducts(value) {
    if (!Array.isArray(value)) return seedProducts.map(product=>({...product}));
    const seen = new Set();
    return value.filter(product=>product && typeof product==='object' && /^[\w-]{1,64}$/.test(String(product.id||'')) && !seen.has(String(product.id)) && (seen.add(String(product.id)), true))
      .map(product=>{
        const id=String(product.id), fallback=seedProducts.find(item=>item.id===id);
        const name=String(product.name||'').trim().slice(0,120), price=Number(product.price), oldPrice=Number(product.oldPrice)||0;
        if(!name||!Number.isSafeInteger(price)||price<1||price>100000000)return null;
        const image=safeImage(product.image);
        return {id,name,category:categories.includes(product.category)?product.category:(fallback?.category||'Autres'),price,oldPrice:Number.isSafeInteger(oldPrice)&&oldPrice>price&&oldPrice<=100000000?oldPrice:0,variants:String(product.variants||'').slice(0,120),description:String(product.description||'').slice(0,500),image:image||(fallback?.image||''),badge:String(product.badge||'').slice(0,32)};
      }).filter(Boolean);
  }
  // The published catalog is the source of truth; never accept product prices from a visitor's storage.
  let products = normalizeProducts(seedProducts);
  function normalizeCart(value) {
    if(!Array.isArray(value))return [];
    const validIds=new Set(products.map(product=>product.id)), quantities=new Map();
    value.slice(0,200).forEach(item=>{
      if(!item||!validIds.has(String(item.id)))return;
      const quantity=Number(item.qty);
      if(!Number.isSafeInteger(quantity)||quantity<1)return;
      quantities.set(String(item.id),Math.min(MAX_QUANTITY,(quantities.get(String(item.id))||0)+quantity));
    });
    return [...quantities].map(([id,qty])=>({id,qty}));
  }
  let cart = normalizeCart(read(CART_KEY, []));
  const settings={...defaultSettings};
  const airForceSeed = seedProducts.find(product => product.id === 'p9');
  const airForceExisting = products.find(product => product.id === 'p9');
  if (!airForceExisting) products.push(airForceSeed);
  else {
    if (airForceExisting.image === 'air-force-one.png' || airForceExisting.image === 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&q=80') airForceExisting.image = airForceSeed.image;
    if ((airForceExisting.description || '').startsWith('Photo illustrative')) airForceExisting.description = airForceSeed.description;
  }
  let activeCategory = 'Tout';
  let toastTimer;

  const money = value => `${new Intl.NumberFormat('fr-FR').format(Number(value)||0)} FCFA`;
  const save = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { showToast('Le panier ne peut pas être conservé sur cet appareil.'); } };
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function showToast(message) { const toast=$('#toast'); toast.textContent=message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2600); }
  function observeReveal(root=document) {
    const targets=$$('.reveal:not([data-reveal-ready])',root);
    targets.forEach(el=>el.dataset.revealReady='1');
    if(reducedMotion){targets.forEach(el=>el.classList.add('is-visible'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
    targets.forEach(el=>observer.observe(el));
  }
  function renderProducts() {
    const query=$('#product-search').value.trim().toLocaleLowerCase('fr');
    let shown=products.filter(p=>(activeCategory==='Tout'||p.category===activeCategory)&&(`${p.name} ${p.category} ${p.variants} ${p.description}`).toLocaleLowerCase('fr').includes(query));
    const sort=$('#sort-select').value;
    if(sort==='price-asc')shown.sort((a,b)=>a.price-b.price); if(sort==='price-desc')shown.sort((a,b)=>b.price-a.price);
    $('#products').innerHTML=shown.map((p,i)=>`<article class="product-card reveal" style="--delay:${(i%4)*65}ms"><div class="product-image-wrap"><img class="product-image" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy">${p.badge?`<span class="product-badge">${escapeHTML(p.badge)}</span>`:''}<button class="quick-add" data-add="${escapeHTML(p.id)}">Ajouter au panier&nbsp; +</button></div><div class="product-info"><span class="product-category">${escapeHTML(p.category)}</span><h3>${escapeHTML(p.name)}</h3><div class="product-price">${money(p.price)} ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div>${p.variants?`<p class="product-variants">${escapeHTML(p.variants)}</p>`:''}${p.description?`<p class="product-description">${escapeHTML(p.description)}</p>`:''}</div></article>`).join('');
    $('#empty-state').hidden=shown.length!==0;
    $$('.category-tab').forEach(tab=>{if(tab.dataset.category==='Tout')tab.innerHTML=`Tout voir <span>${products.length}</span>`;});
    observeReveal($('#products'));
  }
  function renderCart() {
    const count=cart.reduce((sum,item)=>sum+item.qty,0), total=cart.reduce((sum,item)=>{const p=products.find(product=>product.id===item.id);return sum+(p?p.price*item.qty:0);},0);
    $('#cart-count').textContent=count; $('#drawer-count').textContent=`(${count})`; $('#cart-total').textContent=money(total);
    $('#cart-empty').hidden=count>0; $('#cart-summary').hidden=count===0;
    $('#cart-items').innerHTML=cart.map(item=>{const p=products.find(product=>product.id===item.id);if(!p)return '';return `<article class="cart-item"><img src="${escapeHTML(p.image)}" alt=""><div><h3>${escapeHTML(p.name)}</h3><p>${money(p.price)}</p><div class="quantity"><button data-qty="${p.id}" data-step="-1" aria-label="Retirer un article">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-step="1" aria-label="Ajouter un article">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Supprimer ${escapeHTML(p.name)}">×</button></article>`;}).join('');
    save();
  }
  function addToCart(id) { if(!products.some(product=>product.id===id))return; const existing=cart.find(item=>item.id===id); if(existing&&existing.qty>=MAX_QUANTITY){showToast(`Maximum ${MAX_QUANTITY} articles par référence.`);return;} if(existing)existing.qty++;else cart.push({id,qty:1}); renderCart(); showToast('Article ajouté à ton panier ✳'); }
  function openCart() { $('#overlay').classList.add('open'); $('#cart-drawer').classList.add('open'); $('#cart-drawer').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeCart() { $('#overlay').classList.remove('open'); $('#cart-drawer').classList.remove('open'); $('#cart-drawer').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  function waLink(message) { const number=(settings.whatsapp||'').replace(/\D/g,''); if(!/^\d{10,15}$/.test(number)){showToast('Le numéro WhatsApp de la boutique n’est pas configuré.');return;} window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer'); }
  function applySettings() { document.documentElement.style.setProperty('--orange',settings.color||'#f2c94c'); document.title=`${settings.name||'PLUG CITY 225'} — Le style en mouvement`; $('.brand-name').innerHTML=`${escapeHTML(settings.name||'PLUG CITY 225').replace(/\s+225$/i,'')} <b>${escapeHTML((settings.name||'PLUG CITY 225').match(/225$/i)?'225':'')}</b>`; const tagline=(settings.tagline||'Abidjan. À ton rythme.').split(/[.!?]+/).map(part=>part.trim()).filter(Boolean); $('#hero-title').innerHTML=tagline.length>1?`${escapeHTML(tagline[0])}<br><em>${escapeHTML(tagline.slice(1).join(' '))}</em>`:escapeHTML(tagline[0]||'Abidjan'); $('#story .story-copy>p:not(.eyebrow)').textContent=settings.description||'PLUG CITY 225, c’est la sélection qui te ressemble. Des pièces tendance, des prix accessibles et un service de proximité, pensé pour la vraie vie à Abidjan.'; if(settings.banner) $('.hero-photo img').src=settings.banner; }
  function animateCount(el) { const target=Number(el.dataset.count)||0, prefix=el.dataset.prefix||'', suffix=el.dataset.suffix||''; if(reducedMotion){el.textContent=`${prefix}${target}${suffix}`;return;} const start=performance.now(), duration=950; const tick=now=>{const t=Math.min(1,(now-start)/duration), eased=1-Math.pow(1-t,3);el.textContent=`${prefix}${Math.round(target*eased)}${suffix}`;if(t<1)requestAnimationFrame(tick);};requestAnimationFrame(tick); }

  // Reveal every page section and its content as it enters the viewport.
  $$('main > section').forEach(section=>section.classList.add('reveal'));
  observeReveal();
  const compactHeader=()=>$('.site-header').classList.toggle('compact',window.scrollY>28);
  window.addEventListener('scroll',compactHeader,{passive:true}); compactHeader();
  $('#product-stat').dataset.count=products.length; $('#category-stat').dataset.count=new Set(products.map(product=>product.category)).size;
  const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animateCount(entry.target);countObserver.unobserve(entry.target);}}),{threshold:.5});
  $$('[data-count]').forEach(el=>countObserver.observe(el));
  if(!reducedMotion&&matchMedia('(hover:hover) and (pointer:fine)').matches){$$('.magnetic').forEach(button=>{button.addEventListener('pointermove',event=>{const r=button.getBoundingClientRect();const x=(event.clientX-r.left-r.width/2)/r.width*12;const y=(event.clientY-r.top-r.height/2)/r.height*9;button.style.setProperty('--mx',`${x}px`);button.style.setProperty('--my',`${y}px`);});button.addEventListener('pointerleave',()=>{button.style.setProperty('--mx','0px');button.style.setProperty('--my','0px');});});}
  $('#year').textContent=new Date().getFullYear(); applySettings(); renderProducts(); renderCart();
  $$('.category-tab').forEach(tab=>tab.addEventListener('click',()=>{activeCategory=tab.dataset.category;$$('.category-tab').forEach(t=>t.classList.toggle('active',t===tab));renderProducts();}));
  $('#product-search').addEventListener('input',renderProducts); $('#sort-select').addEventListener('change',renderProducts);
  $('.search-toggle').addEventListener('click',()=>{$('#shop').scrollIntoView({behavior:reducedMotion?'instant':'smooth'});setTimeout(()=>$('#product-search').focus(),reducedMotion?0:350);});
  $('#products').addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(button)addToCart(button.dataset.add);});
  $('#open-cart').addEventListener('click',openCart); $('#overlay').addEventListener('click',closeCart); $$('[data-close]').forEach(button=>button.addEventListener('click',closeCart));
  $('#cart-items').addEventListener('click',event=>{const qty=event.target.closest('[data-qty]'),remove=event.target.closest('[data-remove]');if(qty){const item=cart.find(i=>i.id===qty.dataset.qty),step=Number(qty.dataset.step);if(item&&[-1,1].includes(step)){if(step===1&&item.qty>=MAX_QUANTITY){showToast(`Maximum ${MAX_QUANTITY} articles par référence.`);return;}item.qty+=step;if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id);renderCart();}}if(remove){cart=cart.filter(i=>i.id!==remove.dataset.remove);renderCart();}});
  $('#checkout').addEventListener('click',()=>{if(!cart.length)return;const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);return p?`• ${p.name} × ${item.qty} — ${money(p.price*item.qty)}`:'';}).filter(Boolean);const total=cart.reduce((sum,item)=>sum+(products.find(p=>p.id===item.id)?.price||0)*item.qty,0);waLink(`Bonjour ${settings.name||'PLUG CITY 225'} ! Je souhaite commander :\n\n${lines.join('\n')}\n\nTotal indicatif des articles : ${money(total)}\n\nMerci de confirmer les prix, la disponibilité et les frais de livraison avant validation.\n\nNom :\nCommune de livraison :`);});
  $('#footer-whatsapp').addEventListener('click',event=>{event.preventDefault();waLink(`Bonjour ${settings.name||'PLUG CITY 225'}, j’aimerais avoir des informations sur vos articles.`);});
  const closeMenu=()=>{$('.main-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');};
  $('#menu-toggle').addEventListener('click',()=>{const open=$('.main-nav').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(open));}); $$('.main-nav a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();closeMenu();}});
})();
