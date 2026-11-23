// =====================================================================
//  X-17 TECHNOLOGIES — HOMEPAGE 2.0
//  Flagship: Next-Generation Router-Based Piso WiFi.  Traditional: RPi.
//  Both galleries render LIVE from the Supabase catalog (via store.js),
//  so homepage + shop always match — single source of truth, no invented data.
// =====================================================================
const store = require('./store');
let IMG = { gallery: [], reviews: [], about: '', products: [] };
try { IMG = require('./landing-images.json'); } catch (e) { console.error('[landing] images json missing', e.message); }

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
  'https://res.cloudinary.com/kcfsnfnx/image/upload/f_auto,q_auto/shot-rear.jpg',
  'https://res.cloudinary.com/kcfsnfnx/image/upload/f_auto,q_auto/shot-port-detail.jpg',
];
const esc = store.esc;
const ic = (name, cls) => `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ''}></i>`;

// ---------------------------------------------------------------------
//  Static content
// ---------------------------------------------------------------------
const WHY = [
  { icon:'shield-check', t:'100% Metal Construction', d:'Durable enclosure designed for everyday vending operation.' },
  { icon:'wrench', t:'Simplified Installation', d:'Preconfigured solutions with guided initial setup.' },
  { icon:'sliders-horizontal', t:'Smart Management', d:'Manage settings, monitor activity, and configure access via the admin portal.' },
  { icon:'headphones', t:'After-Sales Assistance', d:'Technical guidance and troubleshooting support.' },
];
const HEROFEATS = [
  { icon:'router', t:'Router-Based Technology' },
  { icon:'cpu', t:'OpenWrt Powered' },
  { icon:'layout-dashboard', t:'Smart Admin Management' },
];
const STEPS = [
  { icon:'wifi', t:'Connect to the Piso WiFi network', d:'Select the Piso WiFi hotspot on your phone from the available networks.' },
  { icon:'smartphone', t:'Open the hotspot portal', d:'The captive portal opens automatically, or open your browser to load it.' },
  { icon:'coins', t:'Follow instructions & insert coins', d:'All Philippine coins accepted — ₱1, ₱5, ₱10, ₱20. Old and new designs work.' },
  { icon:'circle-check-big', t:'Activate & enjoy internet', d:'Start your session and enjoy fast, stable internet access instantly.' },
];
const TESTIMONIALS = [
  { in:'JO', name:'Jomar', tag:'Verified Buyer', date:'Mar 2026', text:'Plug and play na sya wla na akong ginawa. Yung comfast/tplink naka configure na, ang gagawin mo nlng isaksak sa internet at power. Kaya kahit bobo at walang alam, kung gusto mo nito go push!' },
  { in:'AR', name:'Arjay', tag:'Verified Buyer', date:'Apr 2025', text:'2nd order na po namin. Naka ilang harvest na din kami. Maraming salamat sa SELLER ng X17 technologies VERY RESPONSIVE SA MGA TANONG. Safe na safe ang item.' },
  { in:'MC', name:'Margaret Castro', tag:'Verified Buyer', date:'Jan 2026', text:'Easy setup, hassle-free experience. Fast and reliable Piso WiFi connection. High-quality build. Convenient LED coin slot. Perfect for beginners.' },
  { in:'JY', name:'John Romeo Ygar', tag:'Verified Buyer', date:'Jan 2024', text:'Functionality 10/10. Quality 10/10. Material 10/10 goods kase bakal na yung box. Dito na kayo bumili!! Napaka responsive ni seller.' },
  { in:'GI', name:'Gilbert', tag:'Experienced Customer', date:'Apr 2025', text:'Madali ksusap yun seller, unli assist! Nka bili ako nka sale. Secure and safe for public use. Easy setup, hassle-free experience.' },
  { in:'JD', name:'Jaime Davantes', tag:'Experienced Customer', date:'Nov 2025', text:'Received items in very good condition. Great value for money with a durable metal case, built to last.' },
];
const FAQ = [
  { q:'What is router-based Piso WiFi?', a:'It is a Piso WiFi vending machine that runs its hotspot and coin-operated access directly on a compatible OpenWrt-based router, instead of a separate single-board computer. This simplifies the hardware for supported configurations.' },
  { q:'How is it different from Raspberry Pi-based Piso WiFi?', a:'Traditional units use a Raspberry Pi with a separate router or outdoor access point. Router-based units run the vending software on the router itself. Both are proven; the right choice depends on your setup, coverage needs, and budget.' },
  { q:'Does the machine require an existing internet connection?', a:'Yes. You connect your existing internet (any ISP — PLDT, Globe, Converge, Sky, or an LTE router) to the machine via LAN cable (included). The machine shares that connection as paid Piso WiFi.' },
  { q:'Is a separate Raspberry Pi or SD card needed?', a:'For the supported router-based configurations, no separate Raspberry Pi, SD card, or USB-to-LAN adapter is required. Traditional units use a Raspberry Pi as described in each product listing.' },
  { q:'How do I access the admin portal?', a:'Each unit comes preconfigured with admin access so you can monitor sessions and adjust settings. Login details and steps are provided with your unit, and our team can guide you during setup.' },
  { q:'Can I change the WiFi name, time rates, and bandwidth?', a:'Yes. Supported units let you customize the WiFi name, configure time and coin rates, and apply bandwidth controls from the admin portal.' },
  { q:'What happens when I change the WiFi name?', a:'On supported SmartFi configurations, changing the WiFi name may require rebinding the coin slot so payments register correctly. Please follow our setup tutorial when making this change.' },
  { q:'Is technical assistance included?', a:'Yes. We provide after-sales technical guidance and troubleshooting support, plus a tarpaulin "How to Use" guide with every machine.' },
  { q:'What are the warranty conditions?', a:'Units include a 1-week return/refund policy for verified defects and a 1-month parts warranty, with after-sales support for technical assistance.' },
  { q:'How can I order?', a:'Order directly via COD (LBC / J&T nationwide) by messaging our Facebook page, or buy through our official Lazada and Shopee stores. Bulk orders and inquiries are welcome.' },
];

// ---------------------------------------------------------------------
//  CSS
// ---------------------------------------------------------------------
const CSS = `
:root{--navy:#0B1425;--navy2:#162B45;--teal:#16B8AD;--teal-d:#0E9C92;--teal-l:#E7F7F5;--amber:#F5B942;--amber-d:#E0A62C;--bg:#FFFFFF;--bg2:#F4F7FB;--text:#162B45;--mut:#64748B;--line:#E2E8F0;--red:#E11D48;--green:#16A34A;--radius:14px;--shadow:0 1px 2px rgba(16,42,76,.06),0 10px 26px rgba(16,42,76,.06);--shadow-h:0 16px 40px rgba(16,42,76,.14);--maxw:1200px}
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
.section.dark{background:var(--navy);color:#fff}
.accent{color:var(--teal)}
[data-lucide]{width:22px;height:22px;stroke-width:2}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;border:none;border-radius:11px;padding:13px 24px;font-weight:600;font-size:.97rem;font-family:inherit;cursor:pointer;transition:all .17s;white-space:nowrap}
.btn [data-lucide]{width:18px;height:18px}
.btn.primary{background:var(--teal);color:#fff}
.btn.primary:hover{background:var(--teal-d);transform:translateY(-1px)}
.btn.amber{background:var(--amber);color:#3a2a00}.btn.amber:hover{background:var(--amber-d)}
.btn.ghost{background:transparent;border:1.5px solid var(--line);color:var(--text)}
.btn.ghost:hover{border-color:var(--teal);color:var(--teal)}
.btn.ghost-light{background:transparent;border:1.5px solid rgba(255,255,255,.3);color:#fff}
.btn.ghost-light:hover{border-color:var(--teal);color:var(--teal)}
.btn:focus-visible{outline:3px solid rgba(22,184,173,.45);outline-offset:2px}
/* nav */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:transparent;transition:background .3s,box-shadow .3s;border-bottom:1px solid transparent}
.nav.scrolled{background:var(--navy);box-shadow:0 2px 20px rgba(0,0,0,.25)}
.nav .container{display:flex;align-items:center;justify-content:space-between;height:72px}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.18rem;color:#fff;letter-spacing:.2px;white-space:nowrap}
.logo b{white-space:nowrap}
.logo .mark{width:38px;height:38px;border-radius:9px;background:linear-gradient(135deg,var(--teal),var(--teal-d));display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:800;color:#fff}
.logo b{color:var(--teal);font-weight:800}
.nav-menu{display:flex;align-items:center;gap:26px}
.nav-menu a{color:#d4e0f0;font-size:.92rem;font-weight:500;transition:color .15s}
.nav-menu a:hover{color:var(--teal)}
.nav-actions{display:flex;align-items:center;gap:12px}
.hamburger{display:none;background:none;border:none;color:#fff;cursor:pointer;padding:6px}
.mobile-menu{position:fixed;inset:0 0 0 auto;width:min(320px,82vw);background:var(--navy);z-index:200;transform:translateX(100%);transition:transform .3s;padding:84px 28px 28px;box-shadow:-10px 0 40px rgba(0,0,0,.4);display:flex;flex-direction:column;gap:6px}
.mobile-menu.open{transform:translateX(0)}
.mobile-menu a{color:#d4e0f0;padding:13px 10px;border-radius:9px;font-weight:500;font-size:1.02rem}
.mobile-menu a:hover{background:rgba(255,255,255,.06);color:var(--teal)}
.mobile-menu .btn{margin-top:10px}
.mclose{position:absolute;top:22px;right:22px;background:none;border:none;color:#fff;cursor:pointer}
.mbackdrop{position:fixed;inset:0;background:rgba(5,12,25,.5);z-index:150;opacity:0;visibility:hidden;transition:.3s}
.mbackdrop.open{opacity:1;visibility:visible}
/* hero */
.hero{background:linear-gradient(135deg,#0B1425 0%,#122238 58%,#16304f 100%);color:#fff;padding:128px 0 84px;position:relative;overflow:hidden}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:52px;align-items:center}
.eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(22,184,173,.14);border:1px solid rgba(22,184,173,.35);color:var(--teal);font-size:.74rem;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:7px 15px;border-radius:999px;margin-bottom:22px}
.hero h1{font-size:clamp(2.2rem,5vw,3.4rem);font-weight:800;margin-bottom:18px;letter-spacing:-.02em}
.hero p.desc{color:#aebbd4;font-size:1.06rem;max-width:48ch;margin-bottom:28px}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.chatlink{display:inline-flex;align-items:center;gap:7px;color:#cfe;font-size:.92rem;font-weight:500;margin-top:16px}
.chatlink [data-lucide]{color:var(--teal);width:18px;height:18px}
.hero-media{position:relative}
.hero-media>img{width:100%;border-radius:18px;border:1px solid rgba(255,255,255,.1);box-shadow:0 30px 70px rgba(0,0,0,.45);background:#0a1626}
.hero-ind{display:flex;flex-direction:column;gap:10px;position:absolute;top:50%;right:-10px;transform:translateY(-50%)}
.hero-ind .pill{display:flex;align-items:center;gap:9px;background:rgba(11,20,37,.86);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.12);border-radius:11px;padding:10px 14px;font-size:.82rem;font-weight:600;white-space:nowrap}
.hero-ind .pill [data-lucide]{color:var(--teal);width:18px;height:18px}
/* section head */
.section-head{text-align:center;max-width:740px;margin:0 auto 52px}
.section-head .label{display:inline-block;color:var(--teal);font-size:.78rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:12px}
.section.dark .section-head .label{color:var(--teal)}
.section-head h2{font-size:clamp(1.7rem,3.4vw,2.5rem)}
.section-head p{color:var(--mut);margin-top:14px;font-size:1.02rem}
.section.dark .section-head p{color:#aebbd4}
/* feature strip */
.feat-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:34px 0}
.feat-item{display:flex;gap:14px;align-items:flex-start}
.feat-item .ib{width:46px;height:46px;flex:none;border-radius:11px;background:var(--teal-l);display:flex;align-items:center;justify-content:center}
.feat-item .ib [data-lucide]{color:var(--teal);width:22px;height:22px}
.feat-item h4{font-size:1rem;margin-bottom:4px}
.feat-item p{color:var(--mut);font-size:.88rem}
/* flagship product cards */
.fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.fcard{background:#fff;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;box-shadow:var(--shadow);transition:transform .18s,box-shadow .18s}
.fcard:hover{transform:translateY(-5px);box-shadow:var(--shadow-h)}
.fcard-media{position:relative;aspect-ratio:4/3;background:var(--bg2);overflow:hidden}
.fcard-media img{width:100%;height:100%;object-fit:cover}
.fbadge{position:absolute;top:12px;left:12px;background:var(--amber);color:#3a2a00;font-weight:800;font-size:.74rem;padding:4px 9px;border-radius:7px}
.fcard-body{padding:20px;display:flex;flex-direction:column;flex:1}
.fcard-body h3{font-size:1.1rem;margin-bottom:4px}
.fcard-model{color:var(--teal);font-size:.85rem;font-weight:600;margin-bottom:14px}
.fcard-feats{list-style:none;padding:0;margin:0 0 16px;display:grid;gap:7px}
.fcard-feats li{position:relative;padding-left:24px;font-size:.86rem;color:var(--mut)}
.fcard-feats li [data-lucide]{position:absolute;left:0;top:2px;width:15px;height:15px;color:var(--teal)}
.fcard-price{display:flex;align-items:baseline;gap:9px;margin-top:auto}
.fcard-price .now{font-size:1.4rem;font-weight:800;color:var(--navy)}
.fcard-price .was{color:var(--mut);text-decoration:line-through;font-size:.88rem}
.fcard-save{color:var(--red);font-weight:800;font-size:.86rem;margin-top:2px}
.fcard-stock{font-size:.82rem;font-weight:600;margin:8px 0 14px}
.fcard-stock.in{color:var(--green)}.fcard-stock.out{color:var(--red)}
.fcard-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.fcard-actions .btn{width:100%;padding:11px 10px;font-size:.9rem}
.center-cta{text-align:center;margin-top:36px}
.empty-note{grid-column:1/-1;text-align:center;color:var(--mut);padding:40px;border:1px dashed var(--line);border-radius:var(--radius)}
/* selector */
.sel-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.sel-card{border-radius:18px;padding:36px;position:relative;overflow:hidden;min-height:230px;display:flex;flex-direction:column;justify-content:center}
.sel-card.modern{background:linear-gradient(135deg,#0B1425,#16304f);color:#fff;border:1px solid var(--navy2)}
.sel-card.trad{background:var(--bg2);border:1px solid var(--line)}
.sel-card .slabel{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.6px;text-transform:uppercase;padding:5px 12px;border-radius:999px;margin-bottom:14px}
.sel-card.modern .slabel{background:rgba(22,184,173,.18);color:var(--teal);border:1px solid rgba(22,184,173,.4)}
.sel-card.trad .slabel{background:#fff;color:var(--teal);border:1px solid var(--line)}
.sel-card h3{font-size:1.5rem;margin-bottom:10px}
.sel-card.trad h3{color:var(--teal)}
.sel-card p{font-size:.95rem;margin-bottom:22px;max-width:40ch}
.sel-card.modern p{color:#aebbd4}.sel-card.trad p{color:var(--mut)}
.sel-card .simg{position:absolute;right:-20px;bottom:-20px;width:170px;opacity:.9;border-radius:12px}
/* how */
.how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:40px}
.how-step{text-align:center;padding:10px}
.how-step .ib{width:62px;height:62px;margin:0 auto 14px;border-radius:50%;background:var(--teal-l);display:flex;align-items:center;justify-content:center;position:relative}
.how-step .ib [data-lucide]{color:var(--teal);width:26px;height:26px}
.how-step .n{position:absolute;top:-6px;right:-6px;width:24px;height:24px;border-radius:50%;background:var(--teal);color:#fff;font-size:.78rem;font-weight:700;display:flex;align-items:center;justify-content:center}
.how-step h4{font-size:1rem;margin-bottom:6px}
.how-step p{color:var(--mut);font-size:.88rem}
.video-wrap{max-width:820px;margin:0 auto}
.video-frame{position:relative;padding-top:56.25%;border-radius:16px;overflow:hidden;box-shadow:var(--shadow-h);border:1px solid var(--line);background:#000}
.video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.video-note{text-align:center;margin-top:16px}
.video-note a{color:var(--teal);font-weight:600}
/* traditional cards */
.tgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.tcard{background:#fff;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);transition:transform .16s,box-shadow .16s}
.tcard:hover{transform:translateY(-4px);box-shadow:var(--shadow-h)}
.tcard-media{aspect-ratio:4/3;background:var(--bg2)}
.tcard-media img{width:100%;height:100%;object-fit:cover}
.tcard-body{padding:14px 16px}
.tcard-name{font-size:.92rem;font-weight:600;min-height:2.6em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.tcard-price{color:var(--navy);font-weight:800;font-size:1.1rem;margin-top:6px}
/* gallery */
.gallery-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
.gallery-item{position:relative;border-radius:12px;overflow:hidden;cursor:pointer;box-shadow:var(--shadow);border:1px solid var(--line);aspect-ratio:3/4}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .35s}
.gallery-item:hover img{transform:scale(1.05)}
/* testimonials */
.tst-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.tst-card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:26px;box-shadow:var(--shadow);display:flex;flex-direction:column}
.stars{color:var(--amber);font-size:.95rem;letter-spacing:2px;margin-bottom:12px}
.tst-card p{color:var(--text);font-size:.93rem;margin-bottom:18px;flex:1}
.tst-foot{display:flex;align-items:center;gap:12px}
.tst-av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--navy2),var(--navy));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem}
.tst-foot b{display:block;font-size:.9rem}.tst-foot span{font-size:.78rem;color:var(--mut)}
.proof-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-top:40px}
.proof-item{position:relative;aspect-ratio:3/4;border-radius:12px;overflow:hidden;cursor:pointer;box-shadow:var(--shadow);border:1px solid var(--line);background:var(--bg2)}
.proof-item img{width:100%;height:100%;object-fit:cover}
/* estimator */
.est-wrap{display:grid;grid-template-columns:1.1fr .9fr;gap:30px;max-width:980px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow);overflow:hidden}
.est-inputs{padding:34px}
.est-field{margin-bottom:24px}
.est-field label{display:flex;justify-content:space-between;font-size:.9rem;font-weight:600;margin-bottom:10px}
.est-field label .v{color:var(--teal);font-weight:800}
.est-field input[type=range]{width:100%;accent-color:var(--teal);height:6px}
.est-field input[type=number]{width:100%;border:1px solid var(--line);border-radius:9px;padding:11px 13px;font-size:.95rem;font-family:inherit;outline:none}
.est-field input[type=number]:focus{border-color:var(--teal)}
.est-out{background:linear-gradient(160deg,#0B1425,#16304f);color:#fff;padding:34px;display:flex;flex-direction:column;justify-content:center;gap:18px}
.est-row{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.12)}
.est-row:last-of-type{border-bottom:none}
.est-row .k{color:#aebbd4;font-size:.88rem}
.est-row .val{font-size:1.5rem;font-weight:800}
.est-row.big .val{color:var(--teal);font-size:1.9rem}
.est-disc{font-size:.78rem;color:var(--mut);text-align:center;max-width:780px;margin:18px auto 0;line-height:1.5}
/* faq */
.faq-wrap{max-width:840px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.faq-item{background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden}
.faq-q{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;background:none;border:none;text-align:left;padding:19px 22px;font-size:1rem;font-weight:600;color:var(--text);cursor:pointer;font-family:inherit}
.faq-q [data-lucide]{color:var(--teal);transition:transform .25s;flex:none}
.faq-item.open .faq-q [data-lucide]{transform:rotate(180deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease}
.faq-a p{padding:0 22px 20px;color:var(--mut);font-size:.94rem}
/* cta */
.cta{background:var(--navy);color:#fff;text-align:center;padding:72px 0}
.cta h2{font-size:clamp(1.7rem,3.4vw,2.4rem);margin-bottom:14px}
.cta p{color:#aebbd4;max-width:52ch;margin:0 auto 26px}
.cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
/* footer */
.footer{background:#071022;color:#aebbd4;padding:56px 0 28px}
.footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:34px;padding-bottom:34px;border-bottom:1px solid rgba(255,255,255,.1)}
.footer .logo{margin-bottom:14px}
.footer-grid p{color:#8ea3c4;font-size:.9rem;max-width:34ch}
.footer h4{color:#fff;font-size:.92rem;margin-bottom:14px}
.footer-col a{display:block;color:#aebbd4;font-size:.88rem;padding:5px 0}
.footer-col a:hover{color:var(--teal)}
.footer-bottom{text-align:center;padding-top:22px;color:#7489ab;font-size:.82rem}
.footer-bottom .tag{color:var(--teal);font-weight:700;letter-spacing:2px;margin-top:6px;font-size:.78rem}
/* lightbox */
.lightbox{position:fixed;inset:0;background:rgba(5,12,25,.92);z-index:300;display:none;align-items:center;justify-content:center;padding:24px;cursor:zoom-out}
.lightbox.open{display:flex}
.lightbox img{max-width:92vw;max-height:90vh;border-radius:10px}
.lightbox .lbclose{position:absolute;top:20px;right:24px;background:rgba(255,255,255,.12);border:none;color:#fff;width:42px;height:42px;border-radius:50%;cursor:pointer;font-size:1.3rem}
/* reveal */
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.reveal.show{opacity:1;transform:none}
/* responsive */
@media(max-width:1000px){
  .feat-strip{grid-template-columns:repeat(2,1fr);gap:22px}
  .fgrid{grid-template-columns:1fr}
  .tgrid{grid-template-columns:repeat(2,1fr)}
  .gallery-grid{grid-template-columns:repeat(3,1fr)}
  .hero-grid{grid-template-columns:1fr;gap:40px}
  .hero-media{order:-1;max-width:480px}
  .hero-ind{position:static;transform:none;flex-direction:row;flex-wrap:wrap;margin-top:16px;justify-content:center}
  .sel-grid{grid-template-columns:1fr}
  .how-grid{grid-template-columns:repeat(2,1fr)}
  .tst-grid{grid-template-columns:1fr}
  .est-wrap{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:940px){.nav-menu{display:none}.nav-actions .btn.ghost-light{display:none}.hamburger{display:block}}
@media(max-width:620px){
  .nav-actions .btn.primary{display:none}
  .section{padding:58px 0}.hero{padding:112px 0 60px}.container{padding:0 18px}
  .feat-strip{grid-template-columns:1fr}
  .tgrid{grid-template-columns:repeat(2,1fr)}
  .gallery-grid{grid-template-columns:repeat(2,1fr)}
  .how-grid{grid-template-columns:1fr 1fr}
  .footer-grid{grid-template-columns:1fr}
  .sel-card .simg{display:none}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}.reveal{opacity:1;transform:none}}
`;

// ---------------------------------------------------------------------
//  Product helpers (from live catalog)
// ---------------------------------------------------------------------
function featsOf(p){ try { return Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]'); } catch (e) { return []; } }
function splitCollections(products){
  const router = [], rpi = [];
  (products || []).forEach(p => { (store.groupRank(p).r === 0 ? router : rpi).push(p); });
  return { router, rpi };
}
function flagshipCard(p){
  const img = store.cloud(store.primaryImg(p), 'w_600,h_450,c_fill');
  const pct = store.discountPct(p), sv = store.savings(p);
  const oos = (p.stock != null && Number(p.stock) <= 0);
  const feats = featsOf(p);
  return `<div class="fcard reveal">
    <div class="fcard-media"><img src="${img}" alt="${esc(p.name)}" loading="lazy">${pct ? `<span class="fbadge">-${pct}%</span>` : ''}</div>
    <div class="fcard-body">
      <h3>${esc(p.name)}</h3>
      ${p.router_model ? `<div class="fcard-model">${esc(p.router_model)}</div>` : ''}
      ${feats.length ? `<ul class="fcard-feats">${feats.slice(0,6).map(f => `<li>${ic('check')} ${esc(f)}</li>`).join('')}</ul>` : ''}
      <div class="fcard-price"><span class="now">${store.money(p.price_now)}</span>${p.price_was ? `<span class="was">${store.money(p.price_was)}</span>` : ''}</div>
      ${sv ? `<div class="fcard-save">Save ${store.money(sv)}</div>` : ''}
      <div class="fcard-stock ${oos ? 'out' : 'in'}">${oos ? '✖ Out of stock' : '✔ In Stock'}</div>
      <div class="fcard-actions">
        <a class="btn ghost" href="/product/${esc(p.slug)}">View Details</a>
        <a class="btn primary" href="/product/${esc(p.slug)}">${ic('shopping-cart')} Order Now</a>
      </div>
    </div>
  </div>`;
}
function tradCard(p){
  const img = store.cloud(store.primaryImg(p), 'w_420,h_320,c_fill');
  return `<a class="tcard reveal" href="/product/${esc(p.slug)}">
    <div class="tcard-media"><img src="${img}" alt="${esc(p.name)}" loading="lazy"></div>
    <div class="tcard-body"><div class="tcard-name">${esc(p.name)}</div><div class="tcard-price">${store.money(p.price_now)}</div></div>
  </a>`;
}

// ---------------------------------------------------------------------
//  Sections
// ---------------------------------------------------------------------
function navBar(){
  const links = [['#flagship','Products'],['#how-it-works','How It Works'],['#traditional','Traditional'],['#reviews','Reviews'],['#faq','FAQ'],['#contact','Contact']];
  return `<nav class="nav" id="nav"><div class="container">
    <a class="logo" href="#top"><span class="mark">X17</span>X-17<b>Technologies</b></a>
    <div class="nav-menu">${links.map(l => `<a href="${l[0]}">${l[1]}</a>`).join('')}</div>
    <div class="nav-actions">
      <a class="btn ghost-light" href="${L.FB}" target="_blank" rel="noopener">Inquire</a>
      <a class="btn primary" href="${L.SHOP}">${ic('shopping-cart')} Shop Now</a>
      <button class="hamburger" aria-label="Menu" onclick="openMenu()">${ic('menu')}</button>
    </div>
  </div></nav>
  <div class="mbackdrop" id="mbackdrop" onclick="closeMenu()"></div>
  <div class="mobile-menu" id="mobileMenu">
    <button class="mclose" aria-label="Close" onclick="closeMenu()">${ic('x')}</button>
    ${links.map(l => `<a href="${l[0]}" onclick="closeMenu()">${l[1]}</a>`).join('')}
    <a class="btn primary" href="${L.SHOP}">${ic('shopping-cart')} Shop Now</a>
    <a class="btn ghost-light" href="${L.FB}" target="_blank" rel="noopener">Inquire on Facebook</a>
  </div>`;
}
function hero(heroImg){
  return `<header class="hero" id="top"><div class="container"><div class="hero-grid">
    <div class="hero-body">
      <span class="eyebrow">${ic('zap')} Next-Generation WiFi Vending Technology</span>
      <h1>Smarter WiFi.<br>Smarter <span class="accent">Business.</span></h1>
      <p class="desc">Discover next-generation router-based Piso WiFi vending machines powered by modern networking technology. Designed for simplified installation, flexible management, and dependable business operation.</p>
      <div class="hero-cta">
        <a class="btn primary" href="#flagship">Explore Modern Piso WiFi ${ic('arrow-right')}</a>
        <a class="btn ghost-light" href="${L.SHOP}">${ic('grid-3x3')} Browse All Products</a>
      </div>
      <a class="chatlink" href="${L.MSG}" target="_blank" rel="noopener">${ic('message-circle')} Chat with Us</a>
    </div>
    <div class="hero-media">
      <img src="${heroImg}" alt="X-17 Router-Based Piso WiFi Vending Machine" fetchpriority="high">
      <div class="hero-ind">${HEROFEATS.map(f => `<div class="pill">${ic(f.icon)} ${esc(f.t)}</div>`).join('')}</div>
    </div>
  </div></div></header>`;
}
function whyStrip(){
  return `<section class="section"><div class="container">
    <div class="feat-strip">${WHY.map(w => `<div class="feat-item reveal"><div class="ib">${ic(w.icon)}</div><div><h4>${esc(w.t)}</h4><p>${esc(w.d)}</p></div></div>`).join('')}</div>
  </div></section>`;
}
function sectionHead(label, title, sub){
  return `<div class="section-head reveal"><span class="label">${esc(label)}</span><h2>${title}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;
}
function flagship(router){
  const cards = router.length
    ? router.map(flagshipCard).join('')
    : `<div class="empty-note">New router-based models are being added. <a class="accent" href="${L.SHOP}">Visit the shop</a> or message us for availability.</div>`;
  return `<section class="section alt" id="flagship"><div class="container">
    ${sectionHead('Flagship Collection', 'Next-Generation <span class="accent">Router-Based</span> Piso WiFi', 'Explore our modern OpenWrt-powered vending solutions, engineered to simplify hardware requirements and internet hotspot management.')}
    <div class="fgrid">${cards}</div>
    <div class="center-cta"><a class="btn ghost" href="${L.SHOP}">${ic('scale')} Compare Modern Models</a></div>
  </div></section>`;
}
function selector(modernImg, tradImg){
  return `<section class="section"><div class="container">
    ${sectionHead('Collections', 'Find the Right Piso WiFi System for Your Business', '')}
    <div class="sel-grid">
      <div class="sel-card modern reveal">
        <span class="slabel">Next-Generation Technology</span>
        <h3>Modern Router-Based Series</h3>
        <p>Explore compact, router-based WiFi vending systems featuring modern network management and simplified hardware architecture.</p>
        <a class="btn primary" href="#flagship">Explore Modern Series ${ic('arrow-right')}</a>
        <img class="simg" src="${modernImg}" alt="" loading="lazy">
      </div>
      <div class="sel-card trad reveal">
        <span class="slabel">Classic Proven Configuration</span>
        <h3>Traditional Raspberry Pi Series</h3>
        <p>Discover our established Raspberry Pi vending machines with multiple router and outdoor access point options.</p>
        <a class="btn ghost" href="#traditional">Explore Traditional Series ${ic('arrow-right')}</a>
        <img class="simg" src="${tradImg}" alt="" loading="lazy">
      </div>
    </div>
  </div></section>`;
}
function howItWorks(){
  return `<section class="section alt" id="how-it-works"><div class="container">
    ${sectionHead('Process', 'How Piso WiFi <span class="accent">Works</span>')}
    <div class="how-grid">${STEPS.map((s,i) => `<div class="how-step reveal"><div class="ib">${ic(s.icon)}<span class="n">${i+1}</span></div><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p></div>`).join('')}</div>
    <div class="video-wrap reveal">
      <div class="video-frame"><iframe src="${L.VIDEO}" title="X-17 WiFi Vending Machine product video" scrolling="no" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" loading="lazy"></iframe></div>
      <p class="video-note"><a href="${L.VIDEOFB}" target="_blank" rel="noopener">${ic('play')} Watch Our Setup &amp; Usage Tutorials →</a></p>
    </div>
  </div></section>`;
}
function traditional(rpi){
  const cards = rpi.length
    ? rpi.map(tradCard).join('')
    : `<div class="empty-note">Traditional products are available in the <a class="accent" href="${L.SHOP}">shop</a>.</div>`;
  return `<section class="section" id="traditional"><div class="container">
    ${sectionHead('Classic Series', 'Traditional <span class="accent">Raspberry Pi</span> Piso WiFi Series', 'Our established vending machine solutions with multiple networking hardware configurations.')}
    <div class="tgrid">${cards}</div>
    <div class="center-cta"><a class="btn primary" href="${L.SHOP}">View All Traditional Products ${ic('arrow-right')}</a></div>
  </div></section>`;
}
function gallery(){
  if (!IMG.gallery || !IMG.gallery.length) return '';
  const items = IMG.gallery.map((g,i) => `<div class="gallery-item reveal" onclick="lb('g${i}')"><img id="g${i}" src="${g.src}" alt="${esc(g.alt||g.label||'Product photo')}" loading="lazy"></div>`).join('');
  return `<section class="section alt"><div class="container">
    ${sectionHead('Gallery', 'Product <span class="accent">Showcase</span>', 'Actual photos of our Piso WiFi vending machines.')}
    <div class="gallery-grid">${items}</div>
  </div></section>`;
}
function testimonials(){
  const cards = TESTIMONIALS.map(t => `<div class="tst-card reveal"><div class="stars">★★★★★</div><p>${esc(t.text)}</p><div class="tst-foot"><div class="tst-av">${esc(t.in)}</div><div><b>${esc(t.name)}</b><span>${esc(t.tag)} · ${esc(t.date)}</span></div></div></div>`).join('');
  const proof = (IMG.reviews && IMG.reviews.length)
    ? `<div class="proof-grid">${IMG.reviews.map((src,i) => `<div class="proof-item reveal" onclick="lb('r${i}')"><img id="r${i}" src="${src}" alt="Customer review ${i+1}" loading="lazy"></div>`).join('')}</div>` : '';
  return `<section class="section" id="reviews"><div class="container">
    ${sectionHead('Reviews', 'Trusted by <span class="accent">Piso WiFi Operators</span>', '')}
    <div class="tst-grid">${cards}</div>
    ${proof}
    <div class="center-cta"><a class="btn amber" href="${L.LAZADA}" target="_blank" rel="noopener">${ic('shopping-cart')} See More Customer Reviews</a></div>
  </div></section>`;
}
function estimator(){
  return `<section class="section alt" id="estimator"><div class="container">
    ${sectionHead('Revenue', 'Estimate Your <span class="accent">Piso WiFi</span> Revenue', 'Adjust the values to see illustrative earning potential.')}
    <div class="est-wrap reveal">
      <div class="est-inputs">
        <div class="est-field"><label>Paying sessions per day <span class="v" id="vSess">50</span></label><input type="range" id="estSess" min="0" max="500" step="5" value="50" oninput="estCalc()"></div>
        <div class="est-field"><label>Average payment per session <span class="v" id="vPay">₱5</span></label><input type="range" id="estPay" min="1" max="50" step="1" value="5" oninput="estCalc()"></div>
        <div class="est-field"><label>Monthly operating expenses (₱)</label><input type="number" id="estExp" min="0" step="100" value="1500" oninput="estCalc()"></div>
      </div>
      <div class="est-out">
        <div class="est-row"><span class="k">Daily Gross Revenue</span><span class="val" id="outDaily">₱250</span></div>
        <div class="est-row"><span class="k">Monthly Gross Revenue</span><span class="val" id="outMonthly">₱7,500</span></div>
        <div class="est-row big"><span class="k">Estimated Remainder</span><span class="val" id="outRem">₱6,000</span></div>
      </div>
    </div>
    <p class="est-disc">Estimates are illustrative only and are not guaranteed earnings. Actual results depend on location, demand, operating costs, connection stability, and other factors.</p>
  </div></section>`;
}
function faq(){
  return `<section class="section" id="faq"><div class="container">
    ${sectionHead('FAQ', 'Frequently Asked <span class="accent">Questions</span>')}
    <div class="faq-wrap">${FAQ.map(f => `<div class="faq-item"><button class="faq-q" onclick="toggleFaq(this)">${esc(f.q)} ${ic('chevron-down')}</button><div class="faq-a"><p>${esc(f.a)}</p></div></div>`).join('')}</div>
  </div></section>`;
}
function finalCta(){
  return `<section class="cta" id="contact"><div class="container">
    <h2>Ready to Start Your Piso WiFi Business?</h2>
    <p>Explore our complete range of modern and traditional Piso WiFi vending solutions.</p>
    <div class="cta-btns">
      <a class="btn primary" href="${L.SHOP}">${ic('shopping-cart')} Browse Products</a>
      <a class="btn ghost-light" href="${L.MSG}" target="_blank" rel="noopener">${ic('message-circle')} Message X-17Technologies</a>
    </div>
  </div></section>`;
}
function footer(){
  const fl = a => `<a href="${a[0]}"${a[0].startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${a[1]}</a>`;
  const modern = [['#flagship','Router-Based Series'],[L.SHOP,'Shop All Modern Machines']];
  const trad = [['#traditional','Raspberry Pi Series'],[L.SHOP,'Shop All Traditional'],['#estimator','Revenue Estimator']];
  const support = [['#faq','FAQ'],[L.VIDEOFB,'Setup Tutorials'],[L.LAZADA,'Lazada Store'],[L.SHOPEE,'Shopee Store']];
  return `<footer class="footer"><div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <a class="logo" href="#top"><span class="mark">X17</span>X-17<b>Technologies</b></a>
        <p>Premium Piso WiFi vending machines and networking solutions in the Philippines. Smarter Connectivity. Simpler Management.</p>
        <p style="margin-top:12px">${ic('phone')} 0922 460 5116 &nbsp;·&nbsp; DTI BN No. 5975962</p>
      </div>
      <div class="footer-col"><h4>Modern Router-Based</h4>${modern.map(fl).join('')}</div>
      <div class="footer-col"><h4>Traditional Piso WiFi</h4>${trad.map(fl).join('')}</div>
      <div class="footer-col"><h4>Support &amp; Contact</h4>${support.map(fl).join('')}${fl([L.FB,'Facebook Page'])}${fl([L.MSG,'Messenger'])}</div>
    </div>
    <div class="footer-bottom">© 2026 X-17Technologies · DTI Registered BN No. 5975962 · Philippines. All rights reserved. · 1-week return (defective) · 1-month parts warranty.<div class="tag">CONNECT · MANAGE · EARN</div></div>
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
      window.toggleFaq=function(b){var it=b.parentElement,a=it.querySelector('.faq-a');var o=it.classList.toggle('open');a.style.maxHeight=o?(a.scrollHeight+'px'):'0';};
      window.lb=function(id){var im=document.getElementById(id);if(!im)return;document.getElementById('lbimg').src=im.src;document.getElementById('lightbox').classList.add('open');};
      window.lbClose=function(){document.getElementById('lightbox').classList.remove('open');};
      function peso(n){return '₱'+Math.round(n).toLocaleString('en-PH');}
      window.estCalc=function(){var s=+document.getElementById('estSess').value,p=+document.getElementById('estPay').value,e=+document.getElementById('estExp').value||0;
        document.getElementById('vSess').textContent=s;document.getElementById('vPay').textContent=peso(p);
        var d=s*p,m=d*30,r=m-e;
        document.getElementById('outDaily').textContent=peso(d);
        document.getElementById('outMonthly').textContent=peso(m);
        document.getElementById('outRem').textContent=peso(r);};
      if(document.getElementById('estSess'))estCalc();
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target);}});},{threshold:.1});
      document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeMenu();lbClose();}});
      function icons(){if(window.lucide&&window.lucide.createIcons)window.lucide.createIcons();}
      icons();window.addEventListener('load',icons);
    })();
  </script>`;
}

// ---------------------------------------------------------------------
//  Page
// ---------------------------------------------------------------------
function landingPage(products){
  const { router, rpi } = splitCollections(products);
  const heroImg = router.length ? store.cloud(store.primaryImg(router[0]), 'w_760,h_600,c_pad,b_auto') : SHOTS[0];
  const modernImg = router.length ? store.cloud(store.primaryImg(router[0]), 'w_340,h_340,c_fill') : SHOTS[1];
  const tradImg = rpi.length ? store.cloud(store.primaryImg(rpi[0]), 'w_340,h_340,c_fill') : SHOTS[0];
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>X-17Technologies | Next-Generation Router-Based & Raspberry Pi Piso WiFi Vending Machines</title>
<meta name="description" content="X-17Technologies — next-generation router-based (OpenWrt) and traditional Raspberry Pi Piso WiFi vending machines. 100% metal, plug-and-play, earn 24/7. Shop now.">
<meta name="theme-color" content="#0B1425">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='9' fill='%2316B8AD'/%3E%3Ctext x='20' y='26' font-family='Arial' font-size='15' font-weight='bold' fill='white' text-anchor='middle'%3EX17%3C/text%3E%3C/svg%3E">
<style>${CSS}</style>
</head><body>
${navBar()}
${hero(heroImg)}
${whyStrip()}
${flagship(router)}
${selector(modernImg, tradImg)}
${howItWorks()}
${traditional(rpi)}
${gallery()}
${testimonials()}
${estimator()}
${faq()}
${finalCta()}
${footer()}
<div class="lightbox" id="lightbox" onclick="lbClose()"><button class="lbclose" aria-label="Close">&times;</button><img id="lbimg" src="" alt="Enlarged view"></div>
<script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js" defer></script>
${script()}
<script data-goatcounter="https://x-17technologies.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body></html>`;
}

module.exports = landingPage;
