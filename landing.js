// =====================================================================
//  X-17 TECHNOLOGIES — LANDING PAGE  (Phase 2 redesign)
//  Modern Tech Corporate + Premium E-commerce + Executive Minimalist.
//  Light theme, Inter font, Lucide icons. Education-first: buying -> /shop.
//  All content preserved from the original site. Images in landing-images.json.
// =====================================================================
let IMG = { gallery: [], reviews: [], about: '', products: [] };
try { IMG = require('./landing-images.json'); } catch (e) { console.error('[landing] landing-images.json missing', e.message); }

const L = {
  FB:      'https://web.facebook.com/X17Technologies/',
  MSG:     'https://m.me/X17Technologies',
  SHOP:    '/shop',
  LAZADA:  'https://s.lazada.com.ph/s.ZB8ccv',
  SHOPEE:  'https://ph.shp.ee/6vCNeBNU',
  TEL:     '+639224605116',
  VIDEO:   'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1314529853969553%2F&show_text=false&t=0',
  VIDEOFB: 'https://web.facebook.com/share/v/1HHcLyEy5d/',
};
const SHOTS = [
  'https://res.cloudinary.com/kcfsnfnx/image/upload/f_auto,q_auto/shot-front.jpg',
  'https://res.cloudinary.com/kcfsnfnx/image/upload/f_auto,q_auto/shot-angle.jpg',
  'https://res.cloudinary.com/kcfsnfnx/image/upload/f_auto,q_auto/shot-open-drawer.jpg',
  'https://res.cloudinary.com/kcfsnfnx/image/upload/f_auto,q_auto/shot-rear.jpg',
  'https://res.cloudinary.com/kcfsnfnx/image/upload/f_auto,q_auto/shot-port-detail.jpg',
];

function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
const ic = (name, cls) => `<i data-lucide="${name}"${cls?` class="${cls}"`:''}></i>`;

// ---------------------------------------------------------------------
//  Content data
// ---------------------------------------------------------------------
const PRODUCTS = [
  { badge:'Best Value', name:'RPI Series + Mercusys', model:'With Mercusys MW301R Router', img:SHOTS[0],
    feats:['Raspberry Pi 3B 1G Motherboard','100% Metal Case + Waterproof Sticker','WiFi5 Soft — Lifetime License','All Coins Accepted (₱1, ₱5, ₱10, ₱20)','Full Admin + Remote Monitoring'] },
  { badge:'Popular', name:'RPI Series + Comfast', model:'With Comfast EW73 Outdoor AP', img:SHOTS[1],
    feats:['Raspberry Pi 3B 1G Motherboard','100% Metal Case + Waterproof Sticker','WiFi5 Soft — Lifetime License','Up to 76 Users Simultaneously','Full Admin + Remote Monitoring'] },
  { badge:'Best Seller', name:'RPI Series + TP-Link EAP110', model:'With TP-Link EAP110 Outdoor AP', img:SHOTS[3],
    feats:['Raspberry Pi 3B 1G Motherboard','100% Metal Case + Waterproof Sticker','WiFi5 Soft — Lifetime License','300Mbps Outdoor Access Point','Full Admin + Remote Monitoring'] },
  { badge:'Premium', name:'RPI Series + TP-Link EAP225', model:'With TP-Link EAP225 AC1200 Outdoor', img:SHOTS[4],
    feats:['Raspberry Pi 3B 1G Motherboard','100% Metal Case + Waterproof Sticker','WiFi5 Soft — Lifetime License','AC1200 MU-MIMO Gigabit','Indoor/Outdoor Coverage'] },
];
const STEPS = [
  { n:'01', t:'Connect to WiFi', d:'Select the WiFi Vendo hotspot name on your phone or device from the available networks list.' },
  { n:'02', t:'Press "Insert Coin"', d:'All Philippine coins accepted — ₱1, ₱5, ₱10, and ₱20. Old and new designs both work.' },
  { n:'03', t:'Press "Done" on Your Phone', d:'After inserting your coin, tap the "Done" or "Connect" button on the portal page on your device.' },
  { n:'04', t:'Enjoy High-Speed Internet', d:'Automatic login — no password needed. Fast, stable connection ready to use instantly.' },
];
const SPECS = [
  { icon:'cpu', t:'Hardware & Enclosure', items:['Raspberry Pi 3B 1G','100% Metal Case','Waterproof Sticker','Custom Board','Built-In Cooling Fan','Anti-Tamper Lock'] },
  { icon:'settings', t:'Software & Power', items:['WiFi5 Soft OS','Lifetime License','12V, 5A Power Supply','USB to LAN Support','Fixed Random MAC','Custom Theme & Sound'] },
  { icon:'package', t:'Coin & Package Includes', items:['Accepts ₱1, ₱5, ₱10, ₱20','Anti-Hooking Mechanism','Free LAN Cable 10m + 5m','Tarpaulin "How to Use"','1 Week Return Policy','1 Month Parts Warranty'] },
  { icon:'monitor', t:'Admin & Monitoring', items:['Full Admin Access','Sales Monitoring','Remote Management','Speed & BW Control','After-Sales Support','Technical Assistance'] },
];
const WHY = [
  { icon:'factory', t:'Premium Build', d:'100% metal case with anti-tamper locks, cooling fan, and waterproof finish. Built for 24/7 outdoor and indoor deployment.' },
  { icon:'wallet', t:'Affordable Pricing', d:'Competitive one-time pricing with up to 20% savings on direct C.O.D. orders. Lifetime license means no recurring software costs ever.' },
  { icon:'zap', t:'Plug & Play', d:'No tech skills needed. Machine arrives ready to deploy — just plug in, connect to internet, and start earning.' },
  { icon:'globe', t:'Remote Monitoring', d:'Manage your machines remotely. Monitor sales, control speed and bandwidth, edit time rates from anywhere.' },
  { icon:'headphones', t:'After-Sales Support', d:'1 week return policy, 1 month parts warranty, and dedicated technical support team that actually responds.' },
  { icon:'award', t:'Proven & Trusted', d:'Hundreds of satisfied operators across the Philippines. X-17 Technologies is the name that delivers.' },
];
const ABOUT_CHIPS = [
  { icon:'shield', t:'Anti-Tamper Lock' }, { icon:'thermometer', t:'Built-In Cooling Fan' },
  { icon:'zap', t:'12V Power Supply' }, { icon:'badge-check', t:'Lifetime License' },
  { icon:'radio', t:'Remote Monitoring' }, { icon:'coins', t:'All Coins Accepted' },
];
const TESTIMONIALS = [
  { in:'JO', name:'Jomar', tag:'Verified Buyer', date:'Mar 2026', text:'Plug and play na sya wla na akong ginawa. Yung comfast/tplink naka configure na, ang gagawin mo nlng isaksak sa internet at power. Kaya kahit bobo at walang alam, kung gusto mo nito go push!' },
  { in:'AR', name:'Arjay', tag:'Verified Buyer', date:'Apr 2025', text:'2nd order na po namin. Naka ilang harvest na din kami. Maraming salamat sa SELLER ng X17 technologies VERY RESPONSIVE SA MGA TANONG. Safe na safe ang item.' },
  { in:'GI', name:'Gilbert', tag:'Experienced Customer', date:'Apr 2025', text:'Madali ksusap yun seller, unli assist! Nka bili ako nka sale. Secure and safe for public use. Easy setup, hassle-free experience.' },
  { in:'EV', name:'Eduardo V.', tag:'Experienced Customer', date:'Nov 2022', text:'Maayos kausap ang seller. Maganda ang produkto at responsive sa mga chat. Ganito dapat ang seller, maasahan talaga.' },
  { in:'MC', name:'Margaret Castro', tag:'Verified Buyer', date:'Jan 2026', text:'Easy setup, hassle-free experience. Fast and reliable Piso WiFi connection. High-quality build. Convenient LED coin slot. Perfect for beginners.' },
  { in:'JY', name:'John Romeo Ygar', tag:'Verified Buyer', date:'Jan 2024', text:'Functionality 10/10. Quality 10/10. Material 10/10 goods kase bakal na yung box. Dito na kayo bumili!! Napaka responsive ni seller.' },
  { in:'CA', name:'Carlito', tag:'Experienced Customer', date:'Feb 2024', text:'Pakaganda, super quality. Legit items plug and play with instructions.' },
  { in:'JD', name:'Jaime Davantes', tag:'Experienced Customer', date:'Nov 2025', text:'Received items in very good condition. Great value for money with a durable metal case, built to last.' },
  { in:'DG', name:'Delia M. Guanizo', tag:'Verified Buyer', date:'Nov 2023', text:'Ok naman po item piso wifi, ang ganda talaga. Salamat sa seller, good quality. Hindi kau magsisi sa uulitin po.' },
];
const FAQ = [
  { q:'Kailangan ba ng technical knowledge para i-set up?', a:'Hindi. Plug and play ang lahat ng aming machines. Kasama sa package ang tarpaulin guide at mayroon kaming tech support para tulungan kayo sa setup.' },
  { q:'Anong internet connection ang kailangan?', a:'Kahit anong ISP — PLDT, Globe, Converge, Sky, or even LTE router. Kailangan lang ng existing internet connection na iko-connect sa machine via LAN cable (kasama sa package).' },
  { q:'Magkano ang average monthly income?', a:'Depende sa location at traffic. Sa mataong lugar tulad ng sari-sari store, palengke, o apartment area, madaling maabot ang ₱3,000–₱10,000+ per month. Mabilis ang ROI.' },
  { q:'May monthly fee ba ang software?', a:'Wala. Lifetime license ang kasama sa bawat machine. One-time bayad lang — walang recurring fees, walang subscriptions, walang hidden charges.' },
  { q:'Paano kung may defects ang machine?', a:'May 1 week return/refund policy (if defective) at 1 month warranty sa parts. May dedicated after-sales support din kami para sa technical assistance.' },
  { q:'Saan pwedeng i-order? Mayroon ba sa Lazada/Shopee?', a:'Yes! Available kami sa Lazada at Shopee under the store name X-17Technologies. Pwede rin mag-message directly sa aming Facebook page para sa direct order — C.O.D. via LBC, bulk orders, at personal inquiries.' },
];
const CONTACTS = [
  { icon:'facebook', t:'Facebook', v:'X17Technologies', href:L.FB },
  { icon:'phone', t:'Call / Text', v:'0922 460 5116', href:'tel:'+L.TEL },
  { icon:'badge-check', t:'DTI Registered', v:'BN No. 5975962', href:null },
  { icon:'shopping-bag', t:'Lazada Store', v:'Shop Now', href:L.LAZADA },
  { icon:'shopping-cart', t:'Shopee Store', v:'Shop Now', href:L.SHOPEE },
  { icon:'map-pin', t:'Based In', v:'Philippines', href:null },
];

// ---------------------------------------------------------------------
//  CSS
// ---------------------------------------------------------------------
const CSS = `
:root{
  --navy:#0B1425;--navy2:#162B45;
  --teal:#16B8AD;--teal-d:#0E9C92;--teal-l:#E7F7F5;
  --amber:#F5B942;--amber-d:#E0A62C;
  --bg:#FFFFFF;--bg2:#F4F7FB;
  --text:#162B45;--mut:#64748B;--line:#E2E8F0;
  --green:#16A34A;
  --radius:14px;
  --shadow:0 1px 2px rgba(16,42,76,.06),0 10px 26px rgba(16,42,76,.06);
  --shadow-h:0 16px 40px rgba(16,42,76,.14);
  --maxw:1200px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;background:var(--bg);color:var(--text);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
h1,h2,h3,h4{line-height:1.18;font-weight:700;letter-spacing:-.015em;margin:0}
p{margin:0}
.container{max-width:var(--maxw);margin:0 auto;padding:0 24px}
.section{padding:84px 0}
.section.alt{background:var(--bg2)}
.svg-fallback i:empty{display:inline-block;width:1em;height:1em}
[data-lucide]{width:22px;height:22px;stroke-width:2}
.accent{color:var(--teal)}
/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;border:none;border-radius:11px;padding:13px 24px;font-weight:600;font-size:.97rem;font-family:inherit;cursor:pointer;transition:all .17s;white-space:nowrap}
.btn [data-lucide]{width:18px;height:18px}
.btn.primary{background:var(--teal);color:#fff}
.btn.primary:hover{background:var(--teal-d);transform:translateY(-1px)}
.btn.amber{background:var(--amber);color:#3a2a00}
.btn.amber:hover{background:var(--amber-d)}
.btn.ghost{background:transparent;border:1.5px solid var(--line);color:var(--text)}
.btn.ghost:hover{border-color:var(--teal);color:var(--teal)}
.btn.ghost-light{background:transparent;border:1.5px solid rgba(255,255,255,.3);color:#fff}
.btn.ghost-light:hover{border-color:var(--teal);color:var(--teal);background:rgba(255,255,255,.04)}
.btn:focus-visible{outline:3px solid rgba(22,184,173,.45);outline-offset:2px}
/* nav */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:transparent;transition:background .3s,box-shadow .3s,border-color .3s;border-bottom:1px solid transparent}
.nav.scrolled{background:var(--navy);box-shadow:0 2px 20px rgba(0,0,0,.25)}
.nav .container{display:flex;align-items:center;justify-content:space-between;height:72px}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.2rem;color:#fff;letter-spacing:.3px}
.logo .mark{width:38px;height:38px;border-radius:9px;background:linear-gradient(135deg,var(--teal),var(--teal-d));display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:800;color:#fff;letter-spacing:0}
.logo b{color:var(--teal)}
.nav-menu{display:flex;align-items:center;gap:30px}
.nav-menu a{color:#d4e0f0;font-size:.93rem;font-weight:500;transition:color .15s}
.nav-menu a:hover{color:var(--teal)}
.nav-actions{display:flex;align-items:center;gap:12px}
.hamburger{display:none;background:none;border:none;color:#fff;cursor:pointer;padding:6px}
.mobile-menu{position:fixed;inset:0 0 0 auto;width:min(320px,82vw);background:var(--navy);z-index:200;transform:translateX(100%);transition:transform .3s ease;padding:84px 28px 28px;box-shadow:-10px 0 40px rgba(0,0,0,.4);display:flex;flex-direction:column;gap:6px}
.mobile-menu.open{transform:translateX(0)}
.mobile-menu a{color:#d4e0f0;padding:13px 10px;border-radius:9px;font-weight:500;font-size:1.02rem}
.mobile-menu a:hover{background:rgba(255,255,255,.06);color:var(--teal)}
.mobile-menu .btn{margin-top:10px}
.mclose{position:absolute;top:22px;right:22px;background:none;border:none;color:#fff;cursor:pointer}
.mbackdrop{position:fixed;inset:0;background:rgba(5,12,25,.5);z-index:150;opacity:0;visibility:hidden;transition:.3s}
.mbackdrop.open{opacity:1;visibility:visible}
/* hero */
.hero{background:linear-gradient(135deg,#0B1425 0%,#122238 55%,#16304f 100%);color:#fff;padding:132px 0 90px;position:relative;overflow:hidden}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(22,184,173,.14);border:1px solid rgba(22,184,173,.35);color:var(--teal);font-size:.78rem;font-weight:600;letter-spacing:.5px;text-transform:uppercase;padding:7px 15px;border-radius:999px;margin-bottom:22px}
.hero h1{font-size:clamp(2.2rem,5vw,3.5rem);font-weight:800;margin-bottom:14px}
.hero .lead{color:var(--teal);font-size:clamp(1.05rem,2vw,1.35rem);font-weight:700;letter-spacing:.3px;margin-bottom:18px}
.hero p.desc{color:#aebbd4;font-size:1.05rem;max-width:46ch;margin-bottom:30px}
.hero-stats{display:flex;gap:30px;margin:28px 0 32px;flex-wrap:wrap}
.hero-stats .st b{display:block;font-size:1.7rem;font-weight:800;color:#fff}
.hero-stats .st span{font-size:.76rem;color:#8ea3c4;text-transform:uppercase;letter-spacing:.6px}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap}
.hero-media{position:relative}
.hero-media img{width:100%;border-radius:18px;border:1px solid rgba(255,255,255,.1);box-shadow:0 30px 70px rgba(0,0,0,.45)}
.hero-media .float{position:absolute;bottom:18px;left:18px;background:rgba(11,20,37,.82);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:10px;font-size:.85rem;font-weight:600}
.hero-media .float [data-lucide]{color:var(--teal);width:20px;height:20px}
/* section head */
.section-head{text-align:center;max-width:720px;margin:0 auto 52px}
.section-head .label{display:inline-block;color:var(--teal);font-size:.8rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:12px}
.section-head h2{font-size:clamp(1.7rem,3.4vw,2.5rem)}
.section-head p{color:var(--mut);margin-top:14px;font-size:1.02rem}
/* about */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:54px;align-items:center}
.about-media{position:relative}
.about-media img{width:100%;border-radius:16px;box-shadow:var(--shadow);border:1px solid var(--line)}
.about-media .tag{position:absolute;top:-14px;left:-14px;background:var(--amber);color:#3a2a00;border-radius:12px;padding:12px 16px;font-weight:800;box-shadow:var(--shadow);line-height:1.1}
.about-media .tag b{display:block;font-size:1.5rem}.about-media .tag span{font-size:.72rem;letter-spacing:.5px}
.about-body .label{color:var(--teal);font-size:.8rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
.about-body h2{font-size:clamp(1.6rem,3vw,2.2rem);margin:10px 0 18px}
.about-body p{color:var(--mut);margin-bottom:16px}
.chips{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px}
.chip{display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:11px 14px;font-size:.9rem;font-weight:500}
.chip [data-lucide]{color:var(--teal);width:19px;height:19px;flex:none}
/* video */
.video-wrap{max-width:860px;margin:0 auto}
.video-frame{position:relative;padding-top:56.25%;border-radius:16px;overflow:hidden;box-shadow:var(--shadow-h);border:1px solid var(--line);background:#000}
.video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.video-note{text-align:center;margin-top:16px;color:var(--mut);font-size:.92rem}
.video-note a{color:var(--teal);font-weight:600}
/* products */
.prod-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}
.prod-card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;box-shadow:var(--shadow);transition:transform .18s,box-shadow .18s}
.prod-card:hover{transform:translateY(-5px);box-shadow:var(--shadow-h)}
.prod-media{position:relative;aspect-ratio:4/3;background:var(--bg2);overflow:hidden}
.prod-media img{width:100%;height:100%;object-fit:cover}
.prod-badge{position:absolute;top:12px;left:12px;background:var(--navy);color:#fff;font-size:.72rem;font-weight:700;letter-spacing:.4px;padding:5px 11px;border-radius:7px}
.prod-badge.hot{background:var(--amber);color:#3a2a00}
.prod-body{padding:20px;display:flex;flex-direction:column;flex:1}
.prod-body h3{font-size:1.12rem;margin-bottom:4px}
.prod-model{color:var(--teal);font-size:.86rem;font-weight:600;margin-bottom:14px}
.prod-feats{list-style:none;padding:0;margin:0 0 18px;display:grid;gap:8px}
.prod-feats li{position:relative;padding-left:26px;font-size:.88rem;color:var(--mut)}
.prod-feats li [data-lucide]{position:absolute;left:0;top:2px;width:16px;height:16px;color:var(--teal)}
.prod-body .btn{margin-top:auto;width:100%}
/* steps */
.steps-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:22px}
.step{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:28px 24px;box-shadow:var(--shadow);position:relative}
.step .num{font-size:2.4rem;font-weight:800;color:var(--teal-l);line-height:1}
.step .num b{color:var(--teal)}
.step h3{font-size:1.1rem;margin:14px 0 8px}
.step p{color:var(--mut);font-size:.92rem}
/* specs */
.spec-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px}
.spec-card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:26px;box-shadow:var(--shadow)}
.spec-card .sh{display:flex;align-items:center;gap:11px;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--line)}
.spec-card .sh .ib{width:42px;height:42px;border-radius:10px;background:var(--teal-l);display:flex;align-items:center;justify-content:center}
.spec-card .sh .ib [data-lucide]{color:var(--teal)}
.spec-card .sh h3{font-size:1.05rem}
.spec-card ul{list-style:none;padding:0;margin:0;display:grid;gap:11px}
.spec-card li{position:relative;padding-left:26px;font-size:.92rem}
.spec-card li [data-lucide]{position:absolute;left:0;top:2px;width:17px;height:17px;color:var(--green)}
/* why */
.why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.why-card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:30px 26px;box-shadow:var(--shadow);transition:transform .18s,box-shadow .18s}
.why-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-h)}
.why-card .ib{width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,var(--teal),var(--teal-d));display:flex;align-items:center;justify-content:center;margin-bottom:18px}
.why-card .ib [data-lucide]{color:#fff;width:24px;height:24px}
.why-card h3{font-size:1.18rem;margin-bottom:10px}
.why-card p{color:var(--mut);font-size:.94rem}
/* gallery */
.gallery-grid{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:200px;gap:16px}
.gallery-item{position:relative;border-radius:14px;overflow:hidden;cursor:pointer;box-shadow:var(--shadow);border:1px solid var(--line)}
.gallery-item.tall{grid-row:span 2}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .35s}
.gallery-item:hover img{transform:scale(1.05)}
.gallery-item .ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(11,20,37,.78),transparent 55%);display:flex;align-items:flex-end;padding:16px;opacity:0;transition:opacity .25s}
.gallery-item:hover .ov{opacity:1}
.gallery-item .ov span{color:#fff;font-weight:600;font-size:.9rem}
/* testimonials */
.tst-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px}
.tst-card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:26px;box-shadow:var(--shadow);display:flex;flex-direction:column}
.stars{color:var(--amber);font-size:.95rem;letter-spacing:2px;margin-bottom:12px}
.tst-card p{color:var(--text);font-size:.95rem;margin-bottom:20px;flex:1}
.tst-foot{display:flex;align-items:center;gap:12px}
.tst-av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--navy2),var(--navy));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.88rem}
.tst-foot b{display:block;font-size:.92rem}
.tst-foot span{font-size:.78rem;color:var(--mut)}
/* proof */
.proof-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.proof-item{position:relative;aspect-ratio:3/4;border-radius:12px;overflow:hidden;cursor:pointer;box-shadow:var(--shadow);border:1px solid var(--line);background:var(--bg2)}
.proof-item img{width:100%;height:100%;object-fit:cover}
.proof-item .ov{position:absolute;inset:0;background:rgba(11,20,37,.55);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:.85rem;gap:6px;opacity:0;transition:.25s}
.proof-item:hover .ov{opacity:1}
.proof-cta{text-align:center;margin-top:34px}
/* faq */
.faq-wrap{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.faq-item{background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden}
.faq-q{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;background:none;border:none;text-align:left;padding:19px 22px;font-size:1rem;font-weight:600;color:var(--text);cursor:pointer;font-family:inherit}
.faq-q [data-lucide]{color:var(--teal);transition:transform .25s;flex:none}
.faq-item.open .faq-q [data-lucide]{transform:rotate(180deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease}
.faq-a p{padding:0 22px 20px;color:var(--mut);font-size:.95rem}
/* contact */
.contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-bottom:40px}
.contact-card{display:flex;align-items:center;gap:15px;background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);transition:transform .16s,border-color .16s}
.contact-card:hover{transform:translateY(-3px);border-color:var(--teal)}
.contact-card .ib{width:46px;height:46px;border-radius:11px;background:var(--teal-l);display:flex;align-items:center;justify-content:center;flex:none}
.contact-card .ib [data-lucide]{color:var(--teal)}
.contact-card .label{font-size:.78rem;color:var(--mut);text-transform:uppercase;letter-spacing:.4px}
.contact-card b{font-size:1rem;color:var(--text)}
.contact-cta{text-align:center}
/* footer */
.footer{background:var(--navy);color:#aebbd4;padding:58px 0 30px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;padding-bottom:36px;border-bottom:1px solid rgba(255,255,255,.1)}
.footer .logo{margin-bottom:16px}
.footer-grid p{color:#8ea3c4;font-size:.92rem;max-width:34ch}
.footer h4{color:#fff;font-size:.95rem;margin-bottom:16px;letter-spacing:.3px}
.footer-col a{display:block;color:#aebbd4;font-size:.9rem;padding:5px 0;transition:color .15s}
.footer-col a:hover{color:var(--teal)}
.footer-bottom{text-align:center;padding-top:24px;color:#7489ab;font-size:.84rem}
.footer-bottom .tagline{color:var(--teal);font-weight:700;letter-spacing:2px;margin-top:8px;font-size:.8rem}
/* lightbox */
.lightbox{position:fixed;inset:0;background:rgba(5,12,25,.92);z-index:300;display:none;align-items:center;justify-content:center;padding:24px;cursor:zoom-out}
.lightbox.open{display:flex}
.lightbox img{max-width:92vw;max-height:90vh;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.lightbox .lbclose{position:absolute;top:20px;right:24px;background:rgba(255,255,255,.12);border:none;color:#fff;width:42px;height:42px;border-radius:50%;cursor:pointer;font-size:1.3rem}
/* reveal */
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.reveal.show{opacity:1;transform:none}
/* responsive */
@media(max-width:960px){
  .hero-grid{grid-template-columns:1fr;gap:40px}
  .hero-media{order:-1;max-width:460px}
  .about-grid{grid-template-columns:1fr;gap:36px}
  .footer-grid{grid-template-columns:1fr 1fr;gap:30px}
  .gallery-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:760px){
  .nav-menu{display:none}
  .nav-actions .btn.ghost-light{display:none}
  .hamburger{display:block}
  .section{padding:60px 0}
  .hero{padding:118px 0 70px}
  .container{padding:0 18px}
  .footer-grid{grid-template-columns:1fr}
  .chips{grid-template-columns:1fr}
}
@media(max-width:460px){
  .gallery-grid{grid-template-columns:1fr;grid-auto-rows:220px}
  .gallery-item.tall{grid-row:span 1}
  .hero-stats{gap:20px}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}.reveal{opacity:1;transform:none}}
`;

// ---------------------------------------------------------------------
//  Markup helpers
// ---------------------------------------------------------------------
function navBar(){
  const links = [['#about','About'],['#products','Products'],['#how-it-works','How It Works'],['#specs','Specs'],['#testimonials','Reviews'],['#contact','Contact']];
  return `<nav class="nav" id="nav"><div class="container">
    <a class="logo" href="#hero"><span class="mark">X17</span>X-17 <b>Tech</b></a>
    <div class="nav-menu">${links.map(l=>`<a href="${l[0]}">${l[1]}</a>`).join('')}</div>
    <div class="nav-actions">
      <a class="btn ghost-light" href="${L.FB}" target="_blank" rel="noopener">Inquire</a>
      <a class="btn primary" href="${L.SHOP}">${ic('shopping-cart')} Shop</a>
      <button class="hamburger" aria-label="Menu" onclick="openMenu()">${ic('menu')}</button>
    </div>
  </div></nav>
  <div class="mbackdrop" id="mbackdrop" onclick="closeMenu()"></div>
  <div class="mobile-menu" id="mobileMenu">
    <button class="mclose" aria-label="Close" onclick="closeMenu()">${ic('x')}</button>
    ${links.map(l=>`<a href="${l[0]}" onclick="closeMenu()">${l[1]}</a>`).join('')}
    <a class="btn primary" href="${L.SHOP}">${ic('shopping-cart')} Shop Now</a>
    <a class="btn ghost-light" href="${L.FB}" target="_blank" rel="noopener">Inquire on Facebook</a>
  </div>`;
}

function hero(){
  return `<header class="hero" id="hero"><div class="container"><div class="hero-grid">
    <div class="hero-body">
      <span class="hero-badge">${ic('zap')} Philippines #1 Piso WiFi Supplier</span>
      <h1>WiFi <span class="accent">Vending Machine</span> Business</h1>
      <div class="lead">Earn 24/7 — No Monthly Fees</div>
      <p class="desc">Plug-and-play WiFi vending machines powered by Raspberry Pi. Insert coins, connect, and go — the smartest passive income you can own today.</p>
      <div class="hero-stats">
        <div class="st"><b>24/7</b><span>Auto Operation</span></div>
        <div class="st"><b>0</b><span>Monthly Fees</span></div>
        <div class="st"><b>&infin;</b><span>Lifetime License</span></div>
      </div>
      <div class="hero-cta">
        <a class="btn primary" href="${L.SHOP}">${ic('shopping-cart')} Shop Now</a>
        <a class="btn ghost-light" href="${L.MSG}" target="_blank" rel="noopener">${ic('message-circle')} Message Us</a>
        <a class="btn ghost-light" href="#products">View Products</a>
      </div>
    </div>
    <div class="hero-media">
      <img src="${SHOTS[0]}" alt="X-17 WiFi Vending Machine" fetchpriority="high">
      <div class="float">${ic('shield-check')} 100% Metal · Built to Last</div>
    </div>
  </div></div></header>`;
}

function sectionHead(label, title, sub){
  return `<div class="section-head reveal"><span class="label">${esc(label)}</span><h2>${title}</h2>${sub?`<p>${esc(sub)}</p>`:''}</div>`;
}

function about(){
  return `<section class="section" id="about"><div class="container"><div class="about-grid">
    <div class="about-media reveal">
      <div class="tag"><b>100%</b><span>METAL CASE</span></div>
      <img src="${IMG.about||SHOTS[1]}" alt="X-17 WiFi Vending Machine metal case" loading="lazy">
    </div>
    <div class="about-body reveal">
      <span class="label">About Us</span>
      <h2>Powering Passive Income in the Philippines</h2>
      <p>X-17 Technologies is a Philippine-based tech company specializing in WiFi vending machines and Piso WiFi solutions. We design, build, and sell premium coin-operated internet hotspot machines that help everyday Filipinos earn passive income.</p>
      <p>Our machines run on Raspberry Pi 3B with WiFi5 Soft — stable, high-speed, and lifetime licensed. Built from 100% metal with anti-tamper locks and built-in cooling fans, they're engineered to run 24/7 with zero maintenance headaches.</p>
      <div class="chips">${ABOUT_CHIPS.map(c=>`<div class="chip">${ic(c.icon)} ${esc(c.t)}</div>`).join('')}</div>
    </div>
  </div></div></section>`;
}

function video(){
  return `<section class="section alt" id="video"><div class="container">
    ${sectionHead('Watch','See It <span class="accent">In Action</span>','A quick look at the X-17 WiFi Vending Machine — setup, coin slot, and how customers connect.')}
    <div class="video-wrap reveal">
      <div class="video-frame"><iframe src="${L.VIDEO}" title="X-17 WiFi Vending Machine product video" scrolling="no" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" loading="lazy"></iframe></div>
      <p class="video-note">Trouble viewing? <a href="${L.VIDEOFB}" target="_blank" rel="noopener">Watch it on Facebook →</a></p>
    </div>
  </div></section>`;
}

function products(){
  const card = (p,i)=>`<div class="prod-card reveal">
    <div class="prod-media"><span class="prod-badge${i===2?' hot':''}">${esc(p.badge)}</span><img src="${p.img}" alt="${esc(p.name)}" loading="lazy"></div>
    <div class="prod-body">
      <h3>${esc(p.name)}</h3>
      <div class="prod-model">${esc(p.model)}</div>
      <ul class="prod-feats">${p.feats.map(f=>`<li>${ic('check')} ${esc(f)}</li>`).join('')}</ul>
      <a class="btn primary" href="${L.SHOP}">View in Shop ${ic('arrow-right')}</a>
    </div>
  </div>`;
  return `<section class="section" id="products"><div class="container">
    ${sectionHead('Our Products','WiFi Vending Machines — <span class="accent">Raspberry Pi Series</span>','Discounted prices are for direct transactions only — C.O.D. via LBC. Prices may vary on Shopee and Lazada. See live prices in our shop.')}
    <div class="prod-grid">${PRODUCTS.map(card).join('')}</div>
  </div></section>`;
}

function howItWorks(){
  return `<section class="section alt" id="how-it-works"><div class="container">
    ${sectionHead('Process','How It <span class="accent">Works</span>')}
    <div class="steps-grid">${STEPS.map(s=>`<div class="step reveal"><div class="num"><b>${s.n}</b></div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('')}</div>
  </div></section>`;
}

function specs(){
  return `<section class="section" id="specs"><div class="container">
    ${sectionHead('Specifications','Product <span class="accent">Specifications</span>')}
    <div class="spec-grid">${SPECS.map(g=>`<div class="spec-card reveal">
      <div class="sh"><div class="ib">${ic(g.icon)}</div><h3>${esc(g.t)}</h3></div>
      <ul>${g.items.map(x=>`<li>${ic('check')} ${esc(x)}</li>`).join('')}</ul>
    </div>`).join('')}</div>
  </div></section>`;
}

function why(){
  return `<section class="section alt" id="why-us"><div class="container">
    ${sectionHead('Why Choose Us','Why <span class="accent">X-17 Technologies</span>?')}
    <div class="why-grid">${WHY.map(w=>`<div class="why-card reveal"><div class="ib">${ic(w.icon)}</div><h3>${esc(w.t)}</h3><p>${esc(w.d)}</p></div>`).join('')}</div>
  </div></section>`;
}

function gallery(){
  const items = IMG.gallery.map((g,i)=>`<div class="gallery-item${i===0?' tall':''}" onclick="lb('g${i}')"><img id="g${i}" src="${g.src}" alt="${esc(g.alt||g.label)}" loading="lazy"><div class="ov"><span>${esc(g.label)}</span></div></div>`).join('');
  return `<section class="section" id="gallery"><div class="container">
    ${sectionHead('Gallery','Product <span class="accent">Showcase</span>')}
    <div class="gallery-grid reveal">${items}</div>
  </div></section>`;
}

function testimonials(){
  const card = t=>`<div class="tst-card reveal">
    <div class="stars">★★★★★</div>
    <p>${esc(t.text)}</p>
    <div class="tst-foot"><div class="tst-av">${esc(t.in)}</div><div><b>${esc(t.name)}</b><span>${esc(t.tag)} · ${esc(t.date)}</span></div></div>
  </div>`;
  return `<section class="section alt" id="testimonials"><div class="container">
    ${sectionHead('Reviews','What Our <span class="accent">Customers Say</span>')}
    <div class="tst-grid">${TESTIMONIALS.map(card).join('')}</div>
  </div></section>`;
}

function proof(){
  const items = IMG.reviews.map((src,i)=>`<div class="proof-item" onclick="lb('r${i}')"><img id="r${i}" src="${src}" alt="Customer review ${i+1}" loading="lazy"><div class="ov">${ic('search')} View</div></div>`).join('');
  return `<section class="section" id="review-screenshots"><div class="container">
    ${sectionHead('Proof','Actual <span class="accent">Customer Reviews</span>','')}
    <p style="text-align:center;color:var(--mut);margin:-32px auto 40px;max-width:620px"><strong style="color:var(--text)">4,400+ units sold</strong> on Lazada · real screenshots from Lazada &amp; Shopee verified buyers</p>
    <div class="proof-grid reveal">${items}</div>
    <div class="proof-cta reveal"><a class="btn amber" href="${L.LAZADA}" target="_blank" rel="noopener">${ic('shopping-cart')} See All Reviews on Lazada</a></div>
  </div></section>`;
}

function faq(){
  return `<section class="section alt" id="faq"><div class="container">
    ${sectionHead('FAQ','Frequently Asked <span class="accent">Questions</span>')}
    <div class="faq-wrap">${FAQ.map(f=>`<div class="faq-item"><button class="faq-q" onclick="toggleFaq(this)">${esc(f.q)} ${ic('chevron-down')}</button><div class="faq-a"><p>${esc(f.a)}</p></div></div>`).join('')}</div>
  </div></section>`;
}

function contact(){
  const card = c=>{
    const inner = `<div class="ib">${ic(c.icon)}</div><div><div class="label">${esc(c.t)}</div><b>${esc(c.v)}</b></div>`;
    return c.href ? `<a class="contact-card" href="${c.href}"${c.href.startsWith('http')?' target="_blank" rel="noopener"':''}>${inner}</a>` : `<div class="contact-card">${inner}</div>`;
  };
  return `<section class="section" id="contact"><div class="container">
    ${sectionHead('Get In Touch','Ready to <span class="accent">Start Earning</span>?','Message us on Facebook Messenger for pricing, bulk orders, or any questions. We respond fast.')}
    <div class="contact-grid">${CONTACTS.map(card).join('')}</div>
    <div class="contact-cta reveal"><a class="btn primary" href="${L.MSG}" target="_blank" rel="noopener">${ic('message-circle')} Message Us on Facebook</a></div>
  </div></section>`;
}

function footer(){
  const quick = [['#about','About Us'],['#products','Products'],[L.SHOP,'Shop'],['#how-it-works','How It Works'],['#specs','Specifications'],['#gallery','Gallery']];
  const connect = [[L.FB,'Facebook Page'],[L.MSG,'Messenger'],[L.LAZADA,'Lazada Store'],[L.SHOPEE,'Shopee Store'],['#faq','FAQ']];
  const fl = a=>`<a href="${a[0]}"${a[0].startsWith('http')?' target="_blank" rel="noopener"':''}>${a[1]}</a>`;
  return `<footer class="footer"><div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <a class="logo" href="#hero"><span class="mark">X17</span>X-17 <b>Tech</b></a>
        <p>Premium WiFi Vending Machines and Piso WiFi solutions in the Philippines. Connect, Manage, and Earn.</p>
      </div>
      <div class="footer-col"><h4>Quick Links</h4>${quick.map(fl).join('')}</div>
      <div class="footer-col"><h4>Connect</h4>${connect.map(fl).join('')}</div>
    </div>
    <div class="footer-bottom">© 2026 X-17 Technologies · DTI Registered BN No. 5975962 · Philippines. All rights reserved.<div class="tagline">CONNECT · MANAGE · EARN</div></div>
  </div></footer>`;
}

function script(){
  return `<script>
    (function(){
      var nav=document.getElementById('nav');
      function onScroll(){ nav.classList.toggle('scrolled', window.scrollY>40); }
      window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
      window.openMenu=function(){document.getElementById('mobileMenu').classList.add('open');document.getElementById('mbackdrop').classList.add('open');};
      window.closeMenu=function(){document.getElementById('mobileMenu').classList.remove('open');document.getElementById('mbackdrop').classList.remove('open');};
      window.toggleFaq=function(btn){var it=btn.parentElement;var a=it.querySelector('.faq-a');var open=it.classList.toggle('open');a.style.maxHeight=open?(a.scrollHeight+'px'):'0';};
      window.lb=function(id){var im=document.getElementById(id);if(!im)return;var box=document.getElementById('lightbox');document.getElementById('lbimg').src=im.src;box.classList.add('open');};
      window.lbClose=function(){document.getElementById('lightbox').classList.remove('open');};
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target);}});},{threshold:.12});
      document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'){window.closeMenu();window.lbClose();}});
      if(window.lucide&&window.lucide.createIcons){window.lucide.createIcons();}
      else{window.addEventListener('load',function(){if(window.lucide)window.lucide.createIcons();});}
    })();
  </script>`;
}

function landingPage(){
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>X-17 Technologies | WiFi Vending Machine Philippines</title>
<meta name="description" content="X-17 Technologies — Premium WiFi Vending Machines (Piso WiFi). Plug and play, earn 24/7. Raspberry Pi powered. Shop now!">
<meta name="theme-color" content="#0B1425">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='9' fill='%2316B8AD'/%3E%3Ctext x='20' y='26' font-family='Arial' font-size='15' font-weight='bold' fill='white' text-anchor='middle'%3EX17%3C/text%3E%3C/svg%3E">
<style>${CSS}</style>
</head><body>
${navBar()}
${hero()}
${about()}
${video()}
${products()}
${howItWorks()}
${specs()}
${why()}
${gallery()}
${testimonials()}
${proof()}
${faq()}
${contact()}
${footer()}
<div class="lightbox" id="lightbox" onclick="lbClose()"><button class="lbclose" aria-label="Close">&times;</button><img id="lbimg" src="" alt="Enlarged view"></div>
<script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js" defer></script>
${script()}
<script data-goatcounter="https://x-17technologies.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body></html>`;
}

module.exports = landingPage;
