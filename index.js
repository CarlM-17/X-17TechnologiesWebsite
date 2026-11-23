const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const store = require('./store');          // registerStore() + data helpers
const landingPage = require('./landing');
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));

// Homepage — pulls the live product catalog so the Router-Based and
// Raspberry Pi galleries always match the shop (single source of truth).
app.get('/', async (req, res) => {
  let products = [];
  try { products = await store.getProducts(); }
  catch (e) { console.error('[landing] catalog fetch failed:', e.message); }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(landingPage(products));
});

store(app);   // mount /shop, /product/:slug, /admin, /order ...

app.listen(PORT, () => {
  console.log(`X-17 Technologies website running on port ${PORT}`);
});
