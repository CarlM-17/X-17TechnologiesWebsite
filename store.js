// =====================================================================
//  X-17 STORE + ADMIN  (Phase 1)
//  Dynamic product catalog backed by Supabase, product detail pages,
//  and a password-protected /admin panel (add / edit / delete / photos).
//  Added as a module so the existing landing page (index.js) is untouched.
//
//  CONFIG  — set these in Railway → Variables (and in launch.json for local):
//    SUPABASE_URL              (defaults to the project below)
//    SUPABASE_PUBLISHABLE_KEY  (client-safe anon key; default below)
//    SUPABASE_SECRET_KEY       (SECRET — required for admin writes + orders inbox)
//    ADMIN_PASSWORD            (SECRET — your admin login password)
//    CLOUDINARY_UPLOAD_PRESET  (unsigned preset name, for admin photo uploads)
// =====================================================================
const crypto = require('crypto');
const express = require('express');

const CFG = {
  SB_URL: (process.env.SUPABASE_URL || 'https://sprqjdbqfruzvisifhbe.supabase.co').replace(/\/+$/, '').replace(/\/rest\/v1$/, ''),
  SB_PUB: process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_iDal087myTZvQ9PsiisGXw_QDRPuo0-',
  SB_SECRET: process.env.SUPABASE_SECRET_KEY || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  SESSION_SECRET: process.env.SESSION_SECRET || (process.env.ADMIN_PASSWORD || 'x17-dev') + '::x17-session-salt',
  CLOUD: process.env.CLOUDINARY_CLOUD || 'kcfsnfnx',
  PRESET: process.env.CLOUDINARY_UPLOAD_PRESET || '',
  FB_PAGE: 'X17Technologies', // m.me/<this>
  SHOPEE_URL: process.env.SHOPEE_URL || 'https://ph.shp.ee/6vCNeBNU',
  LAZADA_URL: process.env.LAZADA_URL || 'https://s.lazada.com.ph/s.ZB8ccv',
};

// ---------------------------------------------------------------------
//  Small helpers
// ---------------------------------------------------------------------
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// Safe JSON to embed inside a <script> that also sits in a server template literal
function jsonForScript(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
    .replace(/`/g, '\\u0060').replace(/\$\{/g, '\\u0024{');
}
function money(n) {
  if (n == null || n === '') return '';
  const num = Number(n);
  if (isNaN(num)) return esc(n);
  const whole = Math.round(num);
  return '\u20B1' + whole.toLocaleString('en-US');
}
function slugify(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || ('item-' + Date.now());
}

// ---------------------------------------------------------------------
//  Supabase REST access (server-side only)
// ---------------------------------------------------------------------
async function sb(path, { method = 'GET', key, body, prefer } = {}) {
  const useKey = key || CFG.SB_PUB;
  const headers = {
    apikey: useKey,
    Authorization: 'Bearer ' + useKey,
    'Content-Type': 'application/json',
  };
  if (prefer) headers['Prefer'] = prefer;
  const res = await fetch(CFG.SB_URL + '/rest/v1/' + path, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!res.ok) {
    const err = new Error('Supabase ' + res.status + ': ' + (text || '').slice(0, 300));
    err.status = res.status; err.data = data; throw err;
  }
  return data;
}
const adminKey = () => {
  if (!CFG.SB_SECRET) { const e = new Error('SUPABASE_SECRET_KEY not set'); e.code = 'NO_SECRET'; throw e; }
  return CFG.SB_SECRET;
};

const SELECT = '*,images:x17_product_images(id,url,alt,sort,is_primary),category:x17_categories(id,name,slug)';
function normalizeProduct(p) {
  if (p && Array.isArray(p.images)) p.images.sort((a, b) => (a.sort - b.sort) || (b.is_primary - a.is_primary));
  return p;
}

// Public reads (active only, via RLS)
async function getProducts() {
  const rows = await sb('x17_products?select=' + encodeURIComponent(SELECT) + '&active=eq.true&order=sort.asc,created_at.desc');
  return (rows || []).map(normalizeProduct);
}
async function getProductBySlug(slug) {
  const rows = await sb('x17_products?select=' + encodeURIComponent(SELECT) + '&slug=eq.' + encodeURIComponent(slug) + '&active=eq.true&limit=1');
  return rows && rows[0] ? normalizeProduct(rows[0]) : null;
}
async function getCategories() {
  return (await sb('x17_categories?select=*&order=sort.asc,name.asc')) || [];
}

// Admin reads/writes (secret key, bypasses RLS)
async function adminGetProducts() {
  const rows = await sb('x17_products?select=' + encodeURIComponent(SELECT) + '&order=sort.asc,created_at.desc', { key: adminKey() });
  return (rows || []).map(normalizeProduct);
}
async function adminGetProduct(id) {
  const rows = await sb('x17_products?select=' + encodeURIComponent(SELECT) + '&id=eq.' + encodeURIComponent(id) + '&limit=1', { key: adminKey() });
  return rows && rows[0] ? normalizeProduct(rows[0]) : null;
}
async function adminCreateProduct(fields) {
  const rows = await sb('x17_products', { method: 'POST', key: adminKey(), body: [fields], prefer: 'return=representation' });
  return rows[0];
}
async function adminUpdateProduct(id, fields) {
  const rows = await sb('x17_products?id=eq.' + encodeURIComponent(id), { method: 'PATCH', key: adminKey(), body: fields, prefer: 'return=representation' });
  return rows[0];
}
async function adminDeleteProduct(id) {
  await sb('x17_products?id=eq.' + encodeURIComponent(id), { method: 'DELETE', key: adminKey() });
}
async function adminAddImage(productId, url, isPrimary, sort) {
  const rows = await sb('x17_product_images', { method: 'POST', key: adminKey(), body: [{ product_id: productId, url, is_primary: !!isPrimary, sort: sort || 0 }], prefer: 'return=representation' });
  return rows[0];
}
async function adminDeleteImage(id) {
  await sb('x17_product_images?id=eq.' + encodeURIComponent(id), { method: 'DELETE', key: adminKey() });
}
async function adminGetOrders() {
  return (await sb('x17_orders?select=*&order=created_at.desc&limit=200', { key: adminKey() })) || [];
}
async function adminUpdateOrder(id, fields) {
  await sb('x17_orders?id=eq.' + encodeURIComponent(id), { method: 'PATCH', key: adminKey(), body: fields });
}
async function createOrder(order) {
  // public insert allowed by RLS; use secret if available else publishable
  const key = CFG.SB_SECRET || CFG.SB_PUB;
  const rows = await sb('x17_orders', { method: 'POST', key, body: [order], prefer: 'return=representation' });
  return rows[0];
}

// ---------------------------------------------------------------------
//  Auth (signed cookie, no extra deps)
// ---------------------------------------------------------------------
function signSession() {
  const exp = Date.now() + 1000 * 60 * 60 * 12; // 12h
  const sig = crypto.createHmac('sha256', CFG.SESSION_SECRET).update('admin.' + exp).digest('hex').slice(0, 32);
  return exp + '.' + sig;
}
function verifySession(token) {
  if (!token) return false;
  const i = token.indexOf('.');
  if (i < 0) return false;
  const exp = token.slice(0, i), sig = token.slice(i + 1);
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const good = crypto.createHmac('sha256', CFG.SESSION_SECRET).update('admin.' + exp).digest('hex').slice(0, 32);
  try { return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good)); } catch (e) { return false; }
}
function parseCookies(req) {
  const out = {}; const raw = req.headers.cookie || '';
  raw.split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return out;
}
function isAdmin(req) { return verifySession(parseCookies(req).x17_admin); }
function setAdminCookie(res, req) {
  const secure = (req.headers['x-forwarded-proto'] === 'https') ? '; Secure' : '';
  res.setHeader('Set-Cookie', 'x17_admin=' + signSession() + '; HttpOnly; Path=/; Max-Age=' + (12 * 3600) + '; SameSite=Lax' + secure);
}
function clearAdminCookie(res) {
  res.setHeader('Set-Cookie', 'x17_admin=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
}

// ---------------------------------------------------------------------
//  Shared CSS / layout
// ---------------------------------------------------------------------
const BRAND_CSS = `
:root{--navy:#050d1a;--navy2:#0a1628;--card:#0e1d33;--line:#1c3253;--cyan:#22d3ee;--cyan2:#38bdf8;--gold:#f5b301;--text:#e8f0ff;--mut:#8aa2c4;--red:#ef4444;--green:#22c55e;--radius:16px}
*{box-sizing:border-box}
body{margin:0;font-family:'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif;background:var(--navy);color:var(--text);line-height:1.5}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.wrap{max-width:1180px;margin:0 auto;padding:0 18px}
.topbar{position:sticky;top:0;z-index:50;background:rgba(5,13,26,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.topbar .wrap{display:flex;align-items:center;gap:16px;height:62px}
.logo{font-weight:800;font-size:1.15rem;letter-spacing:.5px;display:flex;align-items:center;gap:8px;white-space:nowrap}
.logo b{color:var(--cyan)}
.search{flex:1;display:flex;max-width:560px}
.search input{flex:1;background:var(--navy2);border:1px solid var(--line);color:var(--text);padding:10px 14px;border-radius:10px 0 0 10px;outline:none;font-size:.95rem}
.search button{background:var(--cyan);color:#042;border:none;padding:0 18px;border-radius:0 10px 10px 0;font-weight:700;cursor:pointer}
.navlinks{display:flex;gap:14px;align-items:center;font-size:.9rem;color:var(--mut)}
.navlinks a:hover{color:var(--cyan)}
.hero-strip{background:linear-gradient(120deg,#07142a,#0c2444);border-bottom:1px solid var(--line)}
.hero-strip .wrap{padding:26px 18px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
.hero-strip h1{margin:0;font-size:1.5rem}
.hero-strip p{margin:4px 0 0;color:var(--mut)}
.badge-cod{background:var(--gold);color:#3a2a00;font-weight:800;padding:8px 14px;border-radius:999px;font-size:.85rem}
.cats{display:flex;gap:10px;flex-wrap:wrap;padding:18px 0}
.chip{background:var(--card);border:1px solid var(--line);color:var(--text);padding:7px 15px;border-radius:999px;font-size:.88rem;cursor:pointer}
.chip.active,.chip:hover{border-color:var(--cyan);color:var(--cyan)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px;padding:6px 0 50px}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;transition:transform .15s,border-color .15s}
.card:hover{transform:translateY(-4px);border-color:var(--cyan)}
.card .thumb{aspect-ratio:1/1;background:#06101f;position:relative;overflow:hidden}
.card .thumb img{width:100%;height:100%;object-fit:cover}
.card .disc{position:absolute;top:8px;left:8px;background:var(--red);color:#fff;font-weight:800;font-size:.75rem;padding:3px 8px;border-radius:7px}
.card .oos{position:absolute;inset:0;background:rgba(5,13,26,.6);display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;letter-spacing:1px}
.card .body{padding:12px 13px 14px;display:flex;flex-direction:column;gap:6px;flex:1}
.card .name{font-weight:600;font-size:.96rem;min-height:2.6em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.price{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.price .now{color:var(--gold);font-weight:800;font-size:1.22rem}
.price .was{color:var(--mut);text-decoration:line-through;font-size:.85rem}
.card .meta{margin-top:auto;font-size:.78rem;color:var(--mut)}
.empty{padding:60px 0;text-align:center;color:var(--mut)}
.footer{border-top:1px solid var(--line);padding:26px 0;color:var(--mut);font-size:.85rem;text-align:center}
/* product detail */
.pd{display:grid;grid-template-columns:1fr 1fr;gap:34px;padding:28px 0}
.gallery .main{aspect-ratio:1/1;background:#06101f;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;position:relative}
.gallery .main img{width:100%;height:100%;object-fit:contain}
.gal-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.5);border:none;color:#fff;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:1.3rem}
.gal-nav.prev{left:10px}.gal-nav.next{right:10px}
.thumbs{display:flex;gap:9px;margin-top:10px;flex-wrap:wrap}
.thumbs img{width:62px;height:62px;object-fit:cover;border:2px solid var(--line);border-radius:9px;cursor:pointer}
.thumbs img.active{border-color:var(--cyan)}
.pd h1{margin:0 0 6px;font-size:1.6rem}
.pd .model{color:var(--cyan);font-size:.92rem;margin-bottom:10px}
.pd .pricebox{background:var(--navy2);border:1px solid var(--line);border-radius:12px;padding:16px;margin:14px 0}
.pd .pricebox .now{color:var(--gold);font-weight:800;font-size:2rem}
.pd .pricebox .was{color:var(--mut);text-decoration:line-through;margin-left:10px}
.pd .pricebox .save{display:inline-block;margin-left:10px;background:var(--red);color:#fff;font-weight:700;font-size:.8rem;padding:3px 9px;border-radius:7px}
.feat{list-style:none;padding:0;margin:14px 0;display:grid;gap:8px}
.feat li{padding-left:26px;position:relative}
.feat li:before{content:'\\2714';position:absolute;left:0;color:var(--green);font-weight:700}
.stock{font-size:.9rem;margin:10px 0}
.stock.in{color:var(--green)}.stock.out{color:var(--red)}
.btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
.btn{border:none;border-radius:11px;padding:13px 20px;font-weight:700;font-size:.98rem;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
.btn.gold{background:var(--gold);color:#3a2a00}
.btn.cyan{background:var(--cyan);color:#042}
.btn.ghost{background:transparent;border:1px solid var(--line);color:var(--text)}
.btn.shopee{background:#ee4d2d;color:#fff}.btn.lazada{background:#0f146d;color:#fff}
.btn:hover{filter:brightness(1.07)}
.desc{margin-top:22px;color:#c9d8f0;white-space:pre-wrap}
/* modal */
.overlay{position:fixed;inset:0;background:rgba(2,6,15,.78);display:none;align-items:center;justify-content:center;z-index:100;padding:16px}
.overlay.show{display:flex}
.modal{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);max-width:460px;width:100%;max-height:92vh;overflow:auto;padding:22px}
.modal h3{margin:0 0 4px}
.modal label{display:block;font-size:.82rem;color:var(--mut);margin:12px 0 4px}
.modal input,.modal textarea,.modal select{width:100%;background:var(--navy2);border:1px solid var(--line);color:var(--text);padding:10px 12px;border-radius:9px;outline:none;font-size:.95rem;font-family:inherit}
.modal .close{float:right;background:none;border:none;color:var(--mut);font-size:1.4rem;cursor:pointer;line-height:1}
.note{font-size:.8rem;color:var(--mut);margin-top:8px}
@media(max-width:820px){.pd{grid-template-columns:1fr;gap:20px}.hero-strip h1{font-size:1.25rem}.navlinks .hideM{display:none}}
`;

function layout({ title, body, head = '', bodyClass = '' }) {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + esc(title) + '</title>' +
    '<style>' + BRAND_CSS + '</style>' + head +
    '</head><body class="' + bodyClass + '">' + body + '</body></html>';
}

function storeHeader(query) {
  return `<header class="topbar"><div class="wrap">
    <a class="logo" href="/shop">X-<b>17</b> Technologies</a>
    <form class="search" action="/shop" method="get">
      <input type="text" name="q" placeholder="Search products..." value="${esc(query || '')}">
      <button type="submit">Search</button>
    </form>
    <nav class="navlinks">
      <a class="hideM" href="/">Home</a>
      <a href="/shop">Shop</a>
      <a href="https://m.me/${CFG.FB_PAGE}" target="_blank" rel="noopener">Chat</a>
    </nav>
  </div></header>`;
}
function storeFooter() {
  return `<footer class="footer"><div class="wrap">
    X-17 Technologies &middot; DTI BN No. 5975962 &middot; \u260E 0922 460 5116 &middot; COD via LBC nationwide<br>
    &copy; 2026 X-17 Technologies. All rights reserved.
  </div></footer>`;
}

// ---------------------------------------------------------------------
//  Public pages
// ---------------------------------------------------------------------
function primaryImg(p) {
  if (p.images && p.images.length) {
    const pr = p.images.find(i => i.is_primary) || p.images[0];
    return pr.url;
  }
  return 'https://res.cloudinary.com/' + CFG.CLOUD + '/image/upload/f_auto,q_auto/shot-front.jpg';
}
function cloud(url, t) {
  // apply f_auto,q_auto (+ optional transform t) to Cloudinary urls
  if (!url || url.indexOf('res.cloudinary.com') < 0) return url;
  const tr = 'f_auto,q_auto' + (t ? ',' + t : '');
  return url.replace(/\/image\/upload\/(?:[^\/]*\/)?/, '/image/upload/' + tr + '/');
}
function discountPct(p) {
  const was = Number(p.price_was), now = Number(p.price_now);
  if (was > 0 && now > 0 && was > now) return Math.round((1 - now / was) * 100);
  return 0;
}
function productCard(p) {
  const pct = discountPct(p);
  const oos = (p.stock != null && Number(p.stock) <= 0);
  return `<a class="card" href="/product/${esc(p.slug)}">
    <div class="thumb">
      ${pct ? `<span class="disc">-${pct}%</span>` : ''}
      <img src="${esc(cloud(primaryImg(p), 'w_460,h_460,c_fill'))}" alt="${esc(p.name)}" loading="lazy">
      ${oos ? '<div class="oos">SOLD OUT</div>' : ''}
    </div>
    <div class="body">
      <div class="name">${esc(p.name)}</div>
      <div class="price"><span class="now">${money(p.price_now)}</span>${p.price_was ? `<span class="was">${money(p.price_was)}</span>` : ''}</div>
      <div class="meta">${p.category ? esc(p.category.name) : 'WiFi Vending'}</div>
    </div>
  </a>`;
}

function homePage(products, categories, query, activeCat) {
  const q = (query || '').toLowerCase();
  let list = products;
  if (q) list = list.filter(p => (p.name + ' ' + (p.description || '') + ' ' + (p.router_model || '')).toLowerCase().includes(q));
  if (activeCat) list = list.filter(p => p.category && p.category.slug === activeCat);
  const chips = ['<a class="chip' + (!activeCat ? ' active' : '') + '" href="/shop">All</a>']
    .concat(categories.map(c => '<a class="chip' + (activeCat === c.slug ? ' active' : '') + '" href="/shop?cat=' + encodeURIComponent(c.slug) + '">' + esc(c.name) + '</a>')).join('');
  const body = storeHeader(query) +
    `<section class="hero-strip"><div class="wrap">
      <div><h1>WiFi Vending Machines \u2014 Raspberry Pi Series</h1>
      <p>Direct C.O.D. prices via LBC. Also on Shopee &amp; Lazada.</p></div>
      <span class="badge-cod">\uD83D\uDCB0 Cash on Delivery</span>
    </div></section>
    <div class="wrap">
      ${categories.length ? `<div class="cats">${chips}</div>` : '<div style="height:14px"></div>'}
      ${query ? `<p style="color:var(--mut)">Results for \u201C${esc(query)}\u201D (${list.length})</p>` : ''}
      ${list.length ? `<div class="grid">${list.map(productCard).join('')}</div>`
        : `<div class="empty">No products found.${query ? ' <a style="color:var(--cyan)" href="/shop">Clear search</a>' : ''}</div>`}
    </div>` + storeFooter();
  return layout({ title: 'X-17 Technologies \u2014 Shop', body });
}

function productPage(p) {
  const imgs = (p.images && p.images.length) ? p.images : [{ url: primaryImg(p), alt: p.name }];
  const pct = discountPct(p);
  const oos = (p.stock != null && Number(p.stock) <= 0);
  let feats = [];
  try { feats = Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]'); } catch (e) { feats = []; }
  const shopee = p.shopee_url || CFG.SHOPEE_URL;
  const lazada = p.lazada_url || CFG.LAZADA_URL;
  const storeBtns = [
    shopee ? `<a class="btn shopee" href="${esc(shopee)}" target="_blank" rel="noopener">Shopee</a>` : '',
    lazada ? `<a class="btn lazada" href="${esc(lazada)}" target="_blank" rel="noopener">Lazada</a>` : '',
  ].join('');
  const galData = jsonForScript(imgs.map(i => cloud(i.url, 'w_900,h_900,c_pad,b_auto')));
  const orderData = jsonForScript({ id: p.id, name: p.name, price: p.price_now, slug: p.slug });
  const body = storeHeader('') +
    `<div class="wrap"><div class="pd">
      <div class="gallery">
        <div class="main">
          <button class="gal-nav prev" onclick="galMove(-1)" aria-label="Previous">\u2039</button>
          <img id="galMain" src="${esc(cloud(imgs[0].url, 'w_900,h_900,c_pad,b_auto'))}" alt="${esc(p.name)}">
          <button class="gal-nav next" onclick="galMove(1)" aria-label="Next">\u203A</button>
        </div>
        <div class="thumbs" id="galThumbs">
          ${imgs.map((i, idx) => `<img src="${esc(cloud(i.url, 'w_120,h_120,c_fill'))}" onclick="galSet(${idx})" class="${idx === 0 ? 'active' : ''}" alt="">`).join('')}
        </div>
      </div>
      <div class="info">
        <h1>${esc(p.name)}</h1>
        ${p.router_model ? `<div class="model">${esc(p.router_model)}</div>` : ''}
        <div class="pricebox">
          <span class="now">${money(p.price_now)}</span>
          ${p.price_was ? `<span class="was">${money(p.price_was)}</span>` : ''}
          ${pct ? `<span class="save">-${pct}%</span>` : ''}
          <div class="note">C.O.D. direct price via LBC \u2014 may vary on Shopee/Lazada.</div>
        </div>
        <div class="stock ${oos ? 'out' : 'in'}">${oos ? '\u2716 Currently sold out' : '\u2714 In stock' + (p.stock ? ' (' + p.stock + ' available)' : '')}</div>
        ${p.short_desc ? `<p>${esc(p.short_desc)}</p>` : ''}
        ${feats.length ? `<ul class="feat">${feats.map(f => '<li>' + esc(f) + '</li>').join('')}</ul>` : ''}
        <div class="btns">
          <button class="btn gold" ${oos ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''} onclick="openOrder()">\uD83D\uDED2 Order (COD)</button>
          <a class="btn ghost" href="https://m.me/${CFG.FB_PAGE}" target="_blank" rel="noopener">\uD83D\uDCAC Message us on FB</a>
          ${storeBtns}
        </div>
        ${p.description ? `<div class="desc">${esc(p.description)}</div>` : ''}
      </div>
    </div></div>` +
    orderModal() + storeFooter() +
    `<script>var GAL=${galData},GI=0;var ORD=${orderData};</script>` +
    productScript();
  return layout({ title: esc(p.name) + ' \u2014 X-17 Technologies', body });
}

function orderModal() {
  return `<div class="overlay" id="ordOv">
    <div class="modal">
      <button class="close" onclick="closeOrder()">\u00D7</button>
      <div id="ordForm">
        <h3>Place your order</h3>
        <div class="note" id="ordItem"></div>
        <label>Quantity</label><input type="number" id="ordQty" value="1" min="1">
        <label>Your name *</label><input type="text" id="ordName" placeholder="Full name">
        <label>Contact number *</label><input type="text" id="ordContact" placeholder="09xx xxx xxxx">
        <label>Delivery address *</label><textarea id="ordAddr" rows="2" placeholder="House/Street, Barangay, City, Province"></textarea>
        <label>Notes (optional)</label><input type="text" id="ordNote" placeholder="Landmark, preferred courier, etc.">
        <div class="btns" style="margin-top:16px">
          <button class="btn gold" onclick="submitOrder()" id="ordSend">Send order</button>
        </div>
        <div class="note" id="ordErr" style="color:var(--red)"></div>
      </div>
      <div id="ordDone" style="display:none;text-align:center">
        <h3 style="color:var(--green)">\u2714 Order received!</h3>
        <p class="note">We saved your order and our team will contact you to confirm before shipping (COD via LBC).</p>
        <p class="note">Want it faster? Send it to us on Messenger too \u2014 your order is already copied, just paste it:</p>
        <div class="btns" style="justify-content:center">
          <a class="btn cyan" id="ordFb" href="#" target="_blank" rel="noopener">\uD83D\uDCAC Open Messenger &amp; paste</a>
          <button class="btn ghost" onclick="closeOrder()">Done</button>
        </div>
      </div>
    </div></div>`;
}

function productScript() {
  // client JS: no backticks, no ${ } inside
  return '<script>' +
    'function galSet(i){GI=i;document.getElementById("galMain").src=GAL[i];' +
    'var th=document.querySelectorAll("#galThumbs img");th.forEach(function(t,x){t.className=(x===i)?"active":"";});}' +
    'function galMove(d){if(!GAL.length)return;galSet((GI+d+GAL.length)%GAL.length);}' +
    'function openOrder(){document.getElementById("ordItem").textContent=ORD.name;' +
    'document.getElementById("ordForm").style.display="block";document.getElementById("ordDone").style.display="none";' +
    'document.getElementById("ordOv").classList.add("show");}' +
    'function closeOrder(){document.getElementById("ordOv").classList.remove("show");}' +
    'function buildText(d){var L=["X-17 ORDER","----------","Product: "+ORD.name,"Qty: "+d.qty,"Name: "+d.name,"Contact: "+d.contact,"Address: "+d.address];if(d.note)L.push("Notes: "+d.note);return L.join("\\n");}' +
    'function submitOrder(){var d={qty:document.getElementById("ordQty").value||"1",name:document.getElementById("ordName").value.trim(),contact:document.getElementById("ordContact").value.trim(),address:document.getElementById("ordAddr").value.trim(),note:document.getElementById("ordNote").value.trim()};' +
    'var e=document.getElementById("ordErr");if(!d.name||!d.contact||!d.address){e.textContent="Please fill in your name, contact and address.";return;}' +
    'e.textContent="";var btn=document.getElementById("ordSend");btn.disabled=true;btn.textContent="Sending...";' +
    'fetch("/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({product_id:ORD.id,product_name:ORD.name,qty:d.qty,customer_name:d.name,contact:d.contact,address:d.address,note:d.note})})' +
    '.then(function(r){return r.json();}).then(function(res){btn.disabled=false;btn.textContent="Send order";if(!res.ok){e.textContent=res.error||"Something went wrong. Please try Messenger.";return;}' +
    'var txt=buildText(d);try{navigator.clipboard.writeText(txt);}catch(x){}' +
    'document.getElementById("ordFb").href="https://m.me/' + CFG.FB_PAGE + '";' +
    'document.getElementById("ordForm").style.display="none";document.getElementById("ordDone").style.display="block";})' +
    '.catch(function(){btn.disabled=false;btn.textContent="Send order";e.textContent="Network error. Please try Messenger.";});}' +
    'document.getElementById("ordOv").addEventListener("click",function(ev){if(ev.target.id==="ordOv")closeOrder();});' +
    '</script>';
}

// ---------------------------------------------------------------------
//  Admin pages
// ---------------------------------------------------------------------
function adminShell(title, inner) {
  const css = `
  body{background:var(--navy)}
  .abar{background:var(--navy2);border-bottom:1px solid var(--line)}
  .abar .wrap{display:flex;align-items:center;gap:16px;height:58px}
  .abar .logo{font-size:1.05rem}.abar .sp{flex:1}
  .abar a{color:var(--mut);font-size:.9rem}.abar a:hover{color:var(--cyan)}
  .atabs{display:flex;gap:8px;padding:16px 0}
  .atabs a{padding:8px 16px;border:1px solid var(--line);border-radius:9px;color:var(--text);font-size:.9rem}
  .atabs a.on{background:var(--cyan);color:#042;border-color:var(--cyan);font-weight:700}
  table{width:100%;border-collapse:collapse;font-size:.9rem}
  th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:middle}
  th{color:var(--mut);font-weight:600;font-size:.8rem;text-transform:uppercase;letter-spacing:.5px}
  .tImg{width:46px;height:46px;object-fit:cover;border-radius:8px;border:1px solid var(--line)}
  .pill{font-size:.75rem;padding:3px 9px;border-radius:999px;font-weight:700}
  .pill.on{background:rgba(34,197,94,.15);color:var(--green)}.pill.off{background:rgba(239,68,68,.15);color:var(--red)}
  .abtn{border:none;border-radius:9px;padding:9px 16px;font-weight:700;cursor:pointer;font-size:.88rem;text-decoration:none;display:inline-block}
  .abtn.cyan{background:var(--cyan);color:#042}.abtn.gold{background:var(--gold);color:#3a2a00}
  .abtn.red{background:rgba(239,68,68,.15);color:var(--red);border:1px solid rgba(239,68,68,.4)}
  .abtn.ghost{background:transparent;border:1px solid var(--line);color:var(--text)}
  .fgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:900px}
  .f{display:flex;flex-direction:column;gap:5px;margin-bottom:4px}
  .f.full{grid-column:1/-1}
  .f label{font-size:.82rem;color:var(--mut)}
  .f input,.f textarea,.f select{background:var(--navy2);border:1px solid var(--line);color:var(--text);padding:10px 12px;border-radius:9px;font-size:.93rem;font-family:inherit;outline:none}
  .imgrow{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
  .imgcell{position:relative;width:92px}
  .imgcell img{width:92px;height:92px;object-fit:cover;border-radius:10px;border:1px solid var(--line)}
  .imgcell .rm{position:absolute;top:-7px;right:-7px;background:var(--red);color:#fff;border:none;width:22px;height:22px;border-radius:50%;cursor:pointer;font-weight:700}
  .imgcell .pm{position:absolute;bottom:4px;left:4px;background:var(--gold);color:#3a2a00;font-size:.65rem;padding:1px 6px;border-radius:5px;font-weight:700}
  .msg{padding:10px 14px;border-radius:9px;margin:10px 0;font-size:.9rem}
  .msg.err{background:rgba(239,68,68,.12);color:var(--red)}.msg.ok{background:rgba(34,197,94,.12);color:var(--green)}
  @media(max-width:700px){.fgrid{grid-template-columns:1fr}}
  `;
  return layout({
    title, head: '<style>' + css + '</style>',
    body: `<header class="abar"><div class="wrap"><span class="logo">X-<b style="color:var(--cyan)">17</b> Admin</span>
      <span class="sp"></span><a href="/shop" target="_blank">View store \u2197</a><a href="/admin/logout">Logout</a></div></header>
      <div class="wrap">${inner}</div>`
  });
}

function adminLogin(error) {
  return layout({
    title: 'Admin Login \u2014 X-17',
    body: `<div class="wrap" style="max-width:380px;margin-top:12vh">
      <h2 style="text-align:center">X-<b style="color:var(--cyan)">17</b> Admin</h2>
      ${error ? `<div class="msg err" style="text-align:center">${esc(error)}</div>` : ''}
      <form method="post" action="/admin/login" style="display:flex;flex-direction:column;gap:12px">
        <input type="password" name="password" placeholder="Admin password" autofocus
          style="background:var(--navy2);border:1px solid var(--line);color:var(--text);padding:12px;border-radius:10px;font-size:1rem">
        <button class="abtn cyan" type="submit" style="padding:12px">Log in</button>
      </form></div>`
  });
}

function adminTabs(on) {
  const t = (id, label, href) => `<a class="${on === id ? 'on' : ''}" href="${href}">${label}</a>`;
  return `<div class="atabs">${t('products', 'Products', '/admin')}${t('orders', 'Orders', '/admin/orders')}</div>`;
}

function adminProductsPage(products, flash) {
  const rows = products.map(p => `<tr>
    <td><img class="tImg" src="${esc(cloud(primaryImg(p), 'w_90,h_90,c_fill'))}"></td>
    <td><b>${esc(p.name)}</b><br><span style="color:var(--mut);font-size:.8rem">${esc(p.router_model || '')}</span></td>
    <td>${money(p.price_now)}</td>
    <td>${p.stock}</td>
    <td><span class="pill ${p.active ? 'on' : 'off'}">${p.active ? 'Active' : 'Hidden'}</span></td>
    <td style="white-space:nowrap">
      <a class="abtn ghost" href="/admin/product/${esc(p.id)}">Edit</a>
      <form method="post" action="/admin/product/${esc(p.id)}/delete" style="display:inline" onsubmit="return confirm('Delete &quot;${esc(p.name).replace(/'/g, '')}&quot;? This cannot be undone.')">
        <button class="abtn red" type="submit">Delete</button></form>
    </td></tr>`).join('');
  return adminShell('Products \u2014 X-17 Admin', adminTabs('products') +
    (flash ? `<div class="msg ok">${esc(flash)}</div>` : '') +
    `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <h2 style="margin:0">Products (${products.length})</h2>
      <a class="abtn gold" href="/admin/product/new">+ Add product</a></div>
    <table><thead><tr><th></th><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
    <tbody>${rows || '<tr><td colspan="6" style="color:var(--mut);padding:30px;text-align:center">No products yet. Click \u201C+ Add product\u201D.</td></tr>'}</tbody></table>`);
}

function adminProductForm(p, categories, isNew) {
  p = p || {};
  let feats = [];
  try { feats = Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]'); } catch (e) { feats = []; }
  const imgs = p.images || [];
  const catOpts = ['<option value="">\u2014 none \u2014</option>'].concat(
    categories.map(c => `<option value="${esc(c.id)}" ${p.category && p.category.id === c.id ? 'selected' : ''}>${esc(c.name)}</option>`)).join('');
  const presetReady = !!CFG.PRESET;
  const imgCells = imgs.map(i => `<div class="imgcell" data-id="${esc(i.id)}">
      <img src="${esc(cloud(i.url, 'w_180,h_180,c_fill'))}">
      ${i.is_primary ? '<span class="pm">Main</span>' : ''}
      <button type="button" class="rm" onclick="rmImg('${esc(i.id)}')">\u00D7</button></div>`).join('');
  const inner = adminTabs('products') +
    `<a href="/admin" style="color:var(--mut);font-size:.9rem">\u2039 Back to products</a>
    <h2>${isNew ? 'Add product' : 'Edit: ' + esc(p.name)}</h2>
    <div id="amsg"></div>
    <form id="pform" class="fgrid" onsubmit="return saveProduct(event)">
      <div class="f full"><label>Product name *</label><input name="name" required value="${esc(p.name || '')}"></div>
      <div class="f"><label>Router model (subtitle)</label><input name="router_model" value="${esc(p.router_model || '')}" placeholder="e.g. With TP-Link EAP225"></div>
      <div class="f"><label>Category</label><select name="category_id">${catOpts}</select></div>
      <div class="f"><label>Price now (\u20B1) *</label><input name="price_now" type="number" step="0.01" required value="${esc(p.price_now != null ? p.price_now : '')}"></div>
      <div class="f"><label>Price was (\u20B1, optional)</label><input name="price_was" type="number" step="0.01" value="${esc(p.price_was != null ? p.price_was : '')}"></div>
      <div class="f"><label>Stock quantity</label><input name="stock" type="number" value="${esc(p.stock != null ? p.stock : 0)}"></div>
      <div class="f"><label>Show on site?</label><select name="active"><option value="true" ${p.active !== false ? 'selected' : ''}>Active (visible)</option><option value="false" ${p.active === false ? 'selected' : ''}>Hidden</option></select></div>
      <div class="f full"><label>Short description</label><input name="short_desc" value="${esc(p.short_desc || '')}"></div>
      <div class="f full"><label>Features (one per line)</label><textarea name="features" rows="5" placeholder="Earn from providing WiFi access&#10;Raspberry Pi motherboard&#10;All coins accepted">${esc(feats.join('\n'))}</textarea></div>
      <div class="f full"><label>Full description</label><textarea name="description" rows="4">${esc(p.description || '')}</textarea></div>
      <div class="f"><label>Shopee link</label><input name="shopee_url" value="${esc(p.shopee_url != null ? p.shopee_url : CFG.SHOPEE_URL)}"></div>
      <div class="f"><label>Lazada link</label><input name="lazada_url" value="${esc(p.lazada_url != null ? p.lazada_url : CFG.LAZADA_URL)}"></div>
      <div class="f full" style="margin-top:8px"><button class="abtn cyan" type="submit" style="padding:12px 28px">${isNew ? 'Create product' : 'Save changes'}</button></div>
    </form>
    <hr style="border-color:var(--line);margin:26px 0">
    <h3>Photos</h3>
    ${isNew ? '<p class="note" style="color:var(--mut)">Save the product first, then add photos here.</p>' :
      (presetReady ? `<p class="note" style="color:var(--mut)">Upload clear product photos. First one is the main image. Drag not needed \u2014 upload in order.</p>
      <div class="imgrow" id="imgrow">${imgCells}</div>
      <div style="margin-top:12px"><input type="file" id="imgfile" accept="image/*" multiple>
      <span id="upst" class="note" style="color:var(--mut)"></span></div>`
      : `<div class="msg err">Photo upload needs a one-time Cloudinary setting (an unsigned upload preset). Tell me when you're ready and I'll guide you \u2014 it takes 1 minute. Until then you can still edit everything else.</div>`)}`;
  const script = isNew ? '' : `<script>
    var PID=${jsonForScript(p.id)},CLOUD=${jsonForScript(CFG.CLOUD)},PRESET=${jsonForScript(CFG.PRESET)};
    function rmImg(id){if(!confirm("Remove this photo?"))return;fetch("/admin/image/"+id+"/delete",{method:"POST"}).then(function(){var c=document.querySelector('.imgcell[data-id="'+id+'"]');if(c)c.remove();});}
    var fileEl=document.getElementById("imgfile");
    if(fileEl){fileEl.addEventListener("change",function(){var files=Array.prototype.slice.call(this.files);if(!files.length)return;var st=document.getElementById("upst");var done=0;st.textContent="Uploading...";
      (function next(){if(!files.length){st.textContent="Done. Reloading...";setTimeout(function(){location.reload();},600);return;}var f=files.shift();var fd=new FormData();fd.append("file",f);fd.append("upload_preset",PRESET);
      fetch("https://api.cloudinary.com/v1_1/"+CLOUD+"/image/upload",{method:"POST",body:fd}).then(function(r){return r.json();}).then(function(res){if(res.secure_url){return fetch("/admin/product/"+PID+"/image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:res.secure_url})});}throw new Error("upload failed");}).then(function(){done++;st.textContent="Uploaded "+done+"...";next();}).catch(function(){st.textContent="An upload failed. Check the preset.";});})();
    });}
    function saveProduct(ev){ev.preventDefault();var fd=new FormData(document.getElementById("pform"));var o={};fd.forEach(function(v,k){o[k]=v;});var m=document.getElementById("amsg");m.innerHTML="";
      fetch("/admin/product/"+PID,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(function(r){return r.json();}).then(function(res){if(res.ok){m.innerHTML='<div class="msg ok">Saved.</div>';}else{m.innerHTML='<div class="msg err">'+(res.error||"Error")+'</div>';}window.scrollTo(0,0);}).catch(function(){m.innerHTML='<div class="msg err">Network error.</div>';});return false;}
  </script>`;
  // new-product form posts to create endpoint
  const createScript = isNew ? `<script>
    function saveProduct(ev){ev.preventDefault();var fd=new FormData(document.getElementById("pform"));var o={};fd.forEach(function(v,k){o[k]=v;});
      fetch("/admin/product/new",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(function(r){return r.json();}).then(function(res){if(res.ok){location.href="/admin/product/"+res.id;}else{document.getElementById("amsg").innerHTML='<div class="msg err">'+(res.error||"Error")+'</div>';}}).catch(function(){document.getElementById("amsg").innerHTML='<div class="msg err">Network error.</div>';});return false;}
  </script>` : '';
  return adminShell((isNew ? 'Add product' : 'Edit product') + ' \u2014 X-17 Admin', inner + script + createScript);
}

function adminOrdersPage(orders) {
  const rows = orders.map(o => {
    let items = '';
    try { const it = Array.isArray(o.items) ? o.items : JSON.parse(o.items || '[]'); items = it.map(x => esc(x.product_name || x.name || '') + ' \u00D7' + (x.qty || 1)).join(', '); } catch (e) { items = ''; }
    const d = new Date(o.created_at);
    return `<tr>
      <td style="white-space:nowrap;color:var(--mut);font-size:.82rem">${d.toLocaleString('en-PH')}</td>
      <td><b>${esc(o.customer_name)}</b><br><span style="color:var(--mut);font-size:.82rem">${esc(o.contact || '')}</span></td>
      <td>${items}</td>
      <td style="font-size:.84rem;color:var(--mut)">${esc(o.address || '')}</td>
      <td><span class="pill ${o.status === 'new' ? 'on' : 'off'}">${esc(o.status)}</span></td>
    </tr>`;
  }).join('');
  return adminShell('Orders \u2014 X-17 Admin', adminTabs('orders') +
    `<h2>Orders (${orders.length})</h2>
    <table><thead><tr><th>Date</th><th>Customer</th><th>Items</th><th>Address</th><th>Status</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" style="color:var(--mut);padding:30px;text-align:center">No orders yet.</td></tr>'}</tbody></table>`);
}

// ---------------------------------------------------------------------
//  Field parsing for product save
// ---------------------------------------------------------------------
function parseProductBody(b) {
  const out = {};
  if (b.name != null) out.name = String(b.name).trim();
  if (b.router_model != null) out.router_model = String(b.router_model).trim() || null;
  if (b.short_desc != null) out.short_desc = String(b.short_desc).trim() || null;
  if (b.description != null) out.description = String(b.description).trim() || null;
  if (b.category_id != null) out.category_id = b.category_id ? b.category_id : null;
  if (b.price_now != null && b.price_now !== '') out.price_now = Number(b.price_now);
  if (b.price_was !== undefined) out.price_was = (b.price_was === '' || b.price_was == null) ? null : Number(b.price_was);
  if (b.stock != null && b.stock !== '') out.stock = parseInt(b.stock, 10) || 0;
  if (b.active != null) out.active = (b.active === true || b.active === 'true');
  if (b.features != null) {
    const arr = String(b.features).split('\n').map(s => s.trim()).filter(Boolean);
    out.features = arr;
  }
  ['shopee_url', 'lazada_url'].forEach(k => { if (b[k] != null) out[k] = String(b[k]).trim() || null; });
  return out;
}

// ---------------------------------------------------------------------
//  Route registration
// ---------------------------------------------------------------------
function registerStore(app) {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  const wrap = fn => (req, res) => Promise.resolve(fn(req, res)).catch(err => {
    console.error('[store]', err && err.message);
    if (res.headersSent) return;
    if (err && err.code === 'NO_SECRET') {
      return res.status(503).send(adminShell('Setup needed', '<div class="msg err" style="margin-top:20px">Admin isn\u2019t fully connected yet: the <b>SUPABASE_SECRET_KEY</b> and/or <b>ADMIN_PASSWORD</b> need to be set in Railway. Ping me and I\u2019ll walk you through it.</div>'));
    }
    res.status(500).send('Server error');
  });
  const needAdmin = (req, res, next) => { if (!isAdmin(req)) return res.redirect('/admin/login'); next(); };

  // ---- Public store ----
  app.get('/shop', wrap(async (req, res) => {
    const [products, categories] = await Promise.all([getProducts(), getCategories()]);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(homePage(products, categories, req.query.q || '', req.query.cat || ''));
  }));

  app.get('/product/:slug', wrap(async (req, res) => {
    const p = await getProductBySlug(req.params.slug);
    if (!p) return res.status(404).send(layout({ title: 'Not found', body: storeHeader('') + '<div class="wrap"><div class="empty">Product not found. <a style="color:var(--cyan)" href="/shop">Back to shop</a></div></div>' }));
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(productPage(p));
  }));

  app.post('/order', wrap(async (req, res) => {
    const b = req.body || {};
    if (!b.customer_name || !b.contact || !b.address) return res.json({ ok: false, error: 'Missing required fields' });
    const order = {
      customer_name: String(b.customer_name).slice(0, 120),
      contact: String(b.contact).slice(0, 60),
      address: String(b.address).slice(0, 400),
      note: b.note ? String(b.note).slice(0, 400) : null,
      items: [{ product_id: b.product_id, product_name: b.product_name, qty: parseInt(b.qty, 10) || 1 }],
      status: 'new',
    };
    try { await createOrder(order); res.json({ ok: true }); }
    catch (e) { console.error('[order]', e.message); res.json({ ok: false, error: 'Could not save order' }); }
  }));

  // ---- Admin auth ----
  app.get('/admin/login', (req, res) => { if (isAdmin(req)) return res.redirect('/admin'); res.send(adminLogin(req.query.e ? 'Wrong password' : '')); });
  app.post('/admin/login', (req, res) => {
    if (!CFG.ADMIN_PASSWORD) return res.send(adminLogin('Admin password not set yet (configure ADMIN_PASSWORD).'));
    const pw = (req.body && req.body.password) || '';
    const ok = pw.length === CFG.ADMIN_PASSWORD.length && crypto.timingSafeEqual(Buffer.from(pw), Buffer.from(CFG.ADMIN_PASSWORD));
    if (!ok) return res.redirect('/admin/login?e=1');
    setAdminCookie(res, req); res.redirect('/admin');
  });
  app.get('/admin/logout', (req, res) => { clearAdminCookie(res); res.redirect('/admin/login'); });

  // ---- Admin pages ----
  app.get('/admin', needAdmin, wrap(async (req, res) => {
    const products = await adminGetProducts();
    res.send(adminProductsPage(products, req.query.flash || ''));
  }));
  app.get('/admin/orders', needAdmin, wrap(async (req, res) => {
    res.send(adminOrdersPage(await adminGetOrders()));
  }));
  app.get('/admin/product/new', needAdmin, wrap(async (req, res) => {
    res.send(adminProductForm({ active: true, stock: 0 }, await getCategories(), true));
  }));
  app.get('/admin/product/:id', needAdmin, wrap(async (req, res) => {
    const [p, cats] = await Promise.all([adminGetProduct(req.params.id), getCategories()]);
    if (!p) return res.redirect('/admin');
    res.send(adminProductForm(p, cats, false));
  }));

  // ---- Admin APIs ----
  app.post('/admin/product/new', needAdmin, wrap(async (req, res) => {
    const f = parseProductBody(req.body);
    if (!f.name) return res.json({ ok: false, error: 'Name is required' });
    f.slug = slugify(f.name);
    if (f.price_now == null) return res.json({ ok: false, error: 'Price is required' });
    try {
      const row = await adminCreateProduct(f);
      res.json({ ok: true, id: row.id });
    } catch (e) {
      if (String(e.message).includes('duplicate')) { f.slug = f.slug + '-' + Math.random().toString(36).slice(2, 6); const row = await adminCreateProduct(f); return res.json({ ok: true, id: row.id }); }
      res.json({ ok: false, error: e.message });
    }
  }));
  app.post('/admin/product/:id', needAdmin, wrap(async (req, res) => {
    const f = parseProductBody(req.body);
    f.updated_at = new Date().toISOString();
    await adminUpdateProduct(req.params.id, f);
    res.json({ ok: true });
  }));
  app.post('/admin/product/:id/delete', needAdmin, wrap(async (req, res) => {
    await adminDeleteProduct(req.params.id);
    res.redirect('/admin?flash=' + encodeURIComponent('Product deleted.'));
  }));
  app.post('/admin/product/:id/image', needAdmin, wrap(async (req, res) => {
    const url = req.body && req.body.url;
    if (!url) return res.json({ ok: false, error: 'No url' });
    const existing = await adminGetProduct(req.params.id);
    const isPrimary = !existing.images || existing.images.length === 0;
    const sort = existing.images ? existing.images.length : 0;
    const row = await adminAddImage(req.params.id, url, isPrimary, sort);
    res.json({ ok: true, id: row.id });
  }));
  app.post('/admin/image/:id/delete', needAdmin, wrap(async (req, res) => {
    await adminDeleteImage(req.params.id);
    res.json({ ok: true });
  }));

  console.log('[store] routes mounted: /shop /product/:slug /admin');
}

module.exports = registerStore;
