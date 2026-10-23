(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PRODUCT_KEY = 'plugcity225-products-v1';
  const CART_KEY = 'plugcity225-cart-v1';
  const SETTINGS_KEY = 'plugcity225-settings-v1';
  const seedProducts = [
    {id:'p1',name:'Sneaker Rouge 225',category:'Chaussures',price:35000,oldPrice:42000,variants:'38–44 · rouge, blanc',description:'La paire qui donne le ton.',image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',badge:'COUP DE CŒUR'},
    {id:'p2',name:'Veste Downtown',category:'Vêtements',price:28000,oldPrice:0,variants:'S–XL · noir, kaki',description:'La couche parfaite pour le soir.',image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',badge:'NOUVEAU'},
    {id:'p3',name:'Sac Crossbody',category:'Accessoires',price:18000,oldPrice:22000,variants:'Noir · beige',description:'Compact, pratique, toujours avec toi.',image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',badge:'BON PLAN'},
    {id:'p4',name:'Sneaker Street Low',category:'Chaussures',price:32000,oldPrice:0,variants:'39–45 · blanc, gris',description:'Le classique revisité pour la ville.',image:'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&q=80',badge:''},
    {id:'p5',name:'T-shirt Oversize',category:'Vêtements',price:12000,oldPrice:15000,variants:'S–XXL · crème, noir',description:'L’essentiel, avec la bonne coupe.',image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',badge:'BON PLAN'},
    {id:'p6',name:'Lunettes Soleil',category:'Accessoires',price:15000,oldPrice:0,variants:'Noir · écaille',description:'La touche finale, toute l’année.',image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',badge:'NOUVEAU'},
    {id:'p7',name:'Casquette City',category:'Accessoires',price:10000,oldPrice:0,variants:'Taille unique · noir',description:'Une attitude, sans effort.',image:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',badge:''},
    {id:'p8',name:'Pantalon Cargo',category:'Vêtements',price:24000,oldPrice:0,variants:'S–XL · olive, noir',description:'Prêt pour tes journées bien remplies.',image:'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=800&q=80',badge:''},
    {id:'p9',name:'Air Force One',category:'Chaussures',price:12000,oldPrice:0,variants:'',description:'Tailles et coloris à confirmer sur WhatsApp.',image:'air-force-one.png',badge:'NOUVEAU'}
  ];
  const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
  let products = read(PRODUCT_KEY, seedProducts);
  let cart = read(CART_KEY, []);
  let settings = read(SETTINGS_KEY, {name:'PLUG CITY 225',whatsapp:'2250508358005',tagline:'Abidjan. À ton rythme.',description:'PLUG CITY 225, c’est la sélection qui te ressemble. Des pièces tendance, des prix accessibles et un service de proximité, pensé pour la vraie vie à Abidjan.',color:'#ff6038',banner:''});
  if (!settings.whatsapp) settings.whatsapp = '2250508358005';
  const airForceSeed = seedProducts.find(product => product.id === 'p9');
  const airForceExisting = products.find(product => product.id === 'p9');
  if (!airForceExisting) products.push(airForceSeed);
  else {
    if (airForceExisting.image === 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&q=80') airForceExisting.image = airForceSeed.image;
    if ((airForceExisting.description || '').startsWith('Photo illustrative')) airForceExisting.description = airForceSeed.description;
  }
  let activeCategory = 'Tout';
  let toastTimer;

  const money = value => `${new Intl.NumberFormat('fr-FR').format(Number(value)||0)} FCFA`;
  const save = () => { localStorage.setItem(PRODUCT_KEY, JSON.stringify(products)); localStorage.setItem(CART_KEY, JSON.stringify(cart)); localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); };
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
  function renderAdminProducts() {
    $('#admin-product-list').innerHTML=products.map(p=>`<div class="admin-product-row"><img src="${escapeHTML(p.image)}" alt=""><div><strong>${escapeHTML(p.name)}</strong><small>${money(p.price)} · ${escapeHTML(p.category)}</small></div><button data-edit="${escapeHTML(p.id)}">Modifier</button><button data-delete="${escapeHTML(p.id)}" aria-label="Supprimer ${escapeHTML(p.name)}">Supprimer</button></div>`).join('')||'<p class="storage-note">Aucun article pour le moment.</p>';
  }
  function addToCart(id) { const existing=cart.find(item=>item.id===id); if(existing)existing.qty++;else cart.push({id,qty:1}); renderCart(); showToast('Article ajouté à ton panier ✳'); }
  function openCart() { $('#overlay').classList.add('open'); $('#cart-drawer').classList.add('open'); $('#cart-drawer').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeCart() { $('#overlay').classList.remove('open'); $('#cart-drawer').classList.remove('open'); $('#cart-drawer').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  function waLink(message) { const number=(settings.whatsapp||'').replace(/\D/g,''); if(!number){showToast('Ajoute ton numéro WhatsApp dans Gérer la boutique → Paramètres.');return;} window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer'); }
  function compressImage(file) { return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const scale=Math.min(1,1000/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.78));};img.src=reader.result;};reader.readAsDataURL(file);}); }
  function applySettings() { document.documentElement.style.setProperty('--orange',settings.color||'#ff6038'); document.title=`${settings.name||'PLUG CITY 225'} — Le style en mouvement`; $('.brand-name').innerHTML=`${escapeHTML(settings.name||'PLUG CITY 225').replace(/\s+225$/i,'')} <b>${escapeHTML((settings.name||'PLUG CITY 225').match(/225$/i)?'225':'')}</b>`; const tagline=(settings.tagline||'Abidjan. À ton rythme.').split(/[.!?]+/).map(part=>part.trim()).filter(Boolean); $('#hero-title').innerHTML=tagline.length>1?`${escapeHTML(tagline[0])}<br><em>${escapeHTML(tagline.slice(1).join(' '))}</em>`:escapeHTML(tagline[0]||'Abidjan'); $('#setting-name').value=settings.name||''; $('#setting-whatsapp').value=settings.whatsapp||''; $('#setting-tagline').value=settings.tagline||''; $('#setting-description').value=settings.description||'PLUG CITY 225, c’est la sélection qui te ressemble. Des pièces tendance, des prix accessibles et un service de proximité, pensé pour la vraie vie à Abidjan.'; $('#story .story-copy>p:not(.eyebrow)').textContent=settings.description||$('#setting-description').value; $('#setting-color').value=settings.color||'#ff6038'; if(settings.banner) $('.hero-photo img').src=settings.banner; }
  function animateCount(el) { const target=Number(el.dataset.count)||0, prefix=el.dataset.prefix||'', suffix=el.dataset.suffix||''; if(reducedMotion){el.textContent=`${prefix}${target}${suffix}`;return;} const start=performance.now(), duration=950; const tick=now=>{const t=Math.min(1,(now-start)/duration), eased=1-Math.pow(1-t,3);el.textContent=`${prefix}${Math.round(target*eased)}${suffix}`;if(t<1)requestAnimationFrame(tick);};requestAnimationFrame(tick); }

  // Reveal every page section and its content as it enters the viewport.
  $$('main > section').forEach(section=>section.classList.add('reveal'));
  observeReveal();
  const compactHeader=()=>$('.site-header').classList.toggle('compact',window.scrollY>28);
  window.addEventListener('scroll',compactHeader,{passive:true}); compactHeader();
  const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animateCount(entry.target);countObserver.unobserve(entry.target);}}),{threshold:.5});
  $$('[data-count]').forEach(el=>countObserver.observe(el));
  if(!reducedMotion&&matchMedia('(hover:hover) and (pointer:fine)').matches){$$('.magnetic').forEach(button=>{button.addEventListener('pointermove',event=>{const r=button.getBoundingClientRect();const x=(event.clientX-r.left-r.width/2)/r.width*12;const y=(event.clientY-r.top-r.height/2)/r.height*9;button.style.setProperty('--mx',`${x}px`);button.style.setProperty('--my',`${y}px`);});button.addEventListener('pointerleave',()=>{button.style.setProperty('--mx','0px');button.style.setProperty('--my','0px');});});}
  $('#year').textContent=new Date().getFullYear(); applySettings(); renderProducts(); renderCart();
  $$('.category-tab').forEach(tab=>tab.addEventListener('click',()=>{activeCategory=tab.dataset.category;$$('.category-tab').forEach(t=>t.classList.toggle('active',t===tab));renderProducts();}));
  $('#product-search').addEventListener('input',renderProducts); $('#sort-select').addEventListener('change',renderProducts);
  $('.search-toggle').addEventListener('click',()=>{$('#shop').scrollIntoView({behavior:reducedMotion?'instant':'smooth'});setTimeout(()=>$('#product-search').focus(),reducedMotion?0:350);});
  $('#products').addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(button)addToCart(button.dataset.add);});
  $('#open-cart').addEventListener('click',openCart); $('#overlay').addEventListener('click',closeCart); $$('[data-close]').forEach(button=>button.addEventListener('click',closeCart));
  $('#cart-items').addEventListener('click',event=>{const qty=event.target.closest('[data-qty]'),remove=event.target.closest('[data-remove]');if(qty){const item=cart.find(i=>i.id===qty.dataset.qty);if(item){item.qty+=Number(qty.dataset.step);if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id);renderCart();}}if(remove){cart=cart.filter(i=>i.id!==remove.dataset.remove);renderCart();}});
  $('#checkout').addEventListener('click',()=>{if(!cart.length)return;const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);return p?`• ${p.name} × ${item.qty} — ${money(p.price*item.qty)}`:'';}).filter(Boolean);const total=cart.reduce((sum,item)=>sum+(products.find(p=>p.id===item.id)?.price||0)*item.qty,0);waLink(`Bonjour ${settings.name||'PLUG CITY 225'} ! Je souhaite commander :\n\n${lines.join('\n')}\n\nTotal articles : ${money(total)}\n\nNom :\nCommune de livraison :`);});
  $('#footer-whatsapp').addEventListener('click',event=>{event.preventDefault();waLink(`Bonjour ${settings.name||'PLUG CITY 225'}, j’aimerais avoir des informations sur vos articles.`);});
  $('#menu-toggle').addEventListener('click',()=>$('.main-nav').classList.toggle('open')); $$('.main-nav a').forEach(a=>a.addEventListener('click',()=>$('.main-nav').classList.remove('open')));
  $('#admin-open').addEventListener('click',()=>{$('#admin-modal').showModal();renderAdminProducts();}); $('#admin-close').addEventListener('click',()=>$('#admin-modal').close());
  $$('.admin-tab').forEach(tab=>tab.addEventListener('click',()=>{$$('.admin-tab').forEach(t=>t.classList.toggle('active',t===tab));$$('.admin-panel').forEach(panel=>panel.hidden=panel.id!==tab.dataset.panel);}));
  $('#product-form').addEventListener('submit',async event=>{event.preventDefault();const id=$('#edit-id').value||`p${Date.now()}`;const previous=products.find(p=>p.id===id);const file=$('#product-image').files[0];let image=previous?.image||'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';if(file){try{image=await compressImage(file);}catch{showToast('Cette image n’a pas pu être chargée.');return;}}const product={id,name:$('#product-name').value.trim(),category:$('#product-category').value,price:Number($('#product-price').value),oldPrice:Number($('#product-old-price').value)||0,variants:$('#product-variants').value.trim(),description:$('#product-description').value.trim(),image,badge:Number($('#product-old-price').value)>Number($('#product-price').value)?'BON PLAN':''};if(previous)products=products.map(p=>p.id===id?product:p);else products.unshift(product);save();renderProducts();renderAdminProducts();event.target.reset();$('#edit-id').value='';$('#product-save').innerHTML='Ajouter l’article <span>＋</span>';showToast(previous?'Article modifié ✳':'Article ajouté ✳');});
  $('#admin-product-list').addEventListener('click',event=>{const edit=event.target.closest('[data-edit]'),del=event.target.closest('[data-delete]');if(edit){const p=products.find(item=>item.id===edit.dataset.edit);if(!p)return;$('#edit-id').value=p.id;$('#product-name').value=p.name;$('#product-price').value=p.price;$('#product-old-price').value=p.oldPrice||'';$('#product-category').value=p.category;$('#product-variants').value=p.variants||'';$('#product-description').value=p.description||'';$('#product-save').innerHTML='Enregistrer les changements <span>✓</span>';$('#products-panel').scrollTo({top:0,behavior:reducedMotion?'instant':'smooth'});}if(del){products=products.filter(p=>p.id!==del.dataset.delete);cart=cart.filter(i=>i.id!==del.dataset.delete);save();renderProducts();renderCart();renderAdminProducts();showToast('Article supprimé.');}});
  $('#reset-products').addEventListener('click',()=>{if(!window.confirm('Restaurer la sélection de démonstration ? Cela remplacera les articles enregistrés dans ce navigateur.'))return;products=seedProducts.map(p=>({...p}));save();renderProducts();renderAdminProducts();showToast('La sélection de démonstration est restaurée.');});
  $('#settings-form').addEventListener('submit',async event=>{event.preventDefault();settings.name=$('#setting-name').value.trim();settings.whatsapp=$('#setting-whatsapp').value.replace(/\D/g,'');settings.tagline=$('#setting-tagline').value.trim();settings.description=$('#setting-description').value.trim();settings.color=$('#setting-color').value;const file=$('#setting-banner').files[0];if(file){try{settings.banner=await compressImage(file);}catch{showToast('Cette bannière n’a pas pu être chargée.');return;}}applySettings();save();showToast('Paramètres enregistrés ✳');});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();$('.main-nav').classList.remove('open');}});
})();
