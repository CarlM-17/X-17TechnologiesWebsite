const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const registerStore = require('./store');
const landingPage = require('./landing');
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));

const HTML = '';

// =====================================================================
//  EDIT PRICES HERE  —  change a number, save the file, redeploy.
//  Every spot on the page that shows a price updates automatically.
//  (Use plain numbers with commas, no peso sign — e.g. "8,799".)
// =====================================================================
const PRICES = {
  mercusys: { now: "8,799",  was: "10,299", save: "1,500" },
  comfast:  { now: "9,799",  was: "11,679", save: "1,880" },
  eap110:   { now: "9,499",  was: "11,999", save: "2,500" },
  eap225:   { now: "11,399", was: "13,399", save: "2,000" },
};
// =====================================================================
const PAGE = Object.entries({
  '@@MERCUSYS_NOW@@': PRICES.mercusys.now, '@@MERCUSYS_WAS@@': PRICES.mercusys.was, '@@MERCUSYS_SAVE@@': PRICES.mercusys.save,
  '@@COMFAST_NOW@@': PRICES.comfast.now, '@@COMFAST_WAS@@': PRICES.comfast.was, '@@COMFAST_SAVE@@': PRICES.comfast.save,
  '@@EAP110_NOW@@': PRICES.eap110.now, '@@EAP110_WAS@@': PRICES.eap110.was, '@@EAP110_SAVE@@': PRICES.eap110.save,
  '@@EAP225_NOW@@': PRICES.eap225.now, '@@EAP225_WAS@@': PRICES.eap225.was, '@@EAP225_SAVE@@': PRICES.eap225.save,
}).reduce(function(html, kv){ return html.split(kv[0]).join(kv[1]); }, HTML);

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(landingPage());
});

registerStore(app);

app.listen(PORT, () => {
  console.log(`X-17 Technologies website running on port ${PORT}`);
});
