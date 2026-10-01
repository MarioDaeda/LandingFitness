const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const ghlHtml = fs.readFileSync('highlevel-paste.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

console.log('--- 1. GHL Deliverable Structure Check ---');
const hasHtmlTag = /<html[\s>]/i.test(ghlHtml) || /<\/html>/i.test(ghlHtml);
const hasHeadTag = /<head[\s>]/i.test(ghlHtml) || /<\/head>/i.test(ghlHtml);
const hasBodyTag = /<body[\s>]/i.test(ghlHtml) || /<\/body>/i.test(ghlHtml);
console.log('Has <html> or </html>:', hasHtmlTag);
console.log('Has <head> or </head>:', hasHeadTag);
console.log('Has <body> or </body>:', hasBodyTag);

const wrapperMatches = ghlHtml.match(/id="ab-mobility-checkup"/g);
console.log('Wrapper id="ab-mobility-checkup" count:', wrapperMatches ? wrapperMatches.length : 0);

console.log('\n--- 2. Single H1 Verification ---');
const h1InIndex = html.match(/<h1[\s\S]*?<\/h1>/gi);
const h1InGhl = ghlHtml.match(/<h1[\s\S]*?<\/h1>/gi);
console.log('H1 count in index.html:', h1InIndex ? h1InIndex.length : 0);
console.log('H1 count in highlevel-paste.html:', h1InGhl ? h1InGhl.length : 0);

console.log('\n--- 3. CTA Links Verification ---');
const checkoutRegex = /<a\s+[^>]*?data-checkout-link[^>]*?>/gi;
const waRegex = /<a\s+[^>]*?data-whatsapp-link[^>]*?>/gi;
const allCheckout = ghlHtml.match(checkoutRegex) || [];
const allWa = ghlHtml.match(waRegex) || [];
console.log('Total checkout links:', allCheckout.length);
allCheckout.forEach((l, i) => {
  if (!l.includes('href="#CHECKOUT_URL"')) {
    console.error(`ERROR: Checkout link ${i} does not have href="#CHECKOUT_URL":`, l);
  }
});
console.log('Total WhatsApp links:', allWa.length);
allWa.forEach((l, i) => {
  if (!l.includes('href="#WHATSAPP_URL"')) {
    console.error(`ERROR: WhatsApp link ${i} does not have href="#WHATSAPP_URL":`, l);
  }
});

console.log('\n--- 4. Unscoped CSS Selectors Check ---');
const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
let depth = 0;
let buffer = '';
let inKeyframes = false;
let errors = [];

for (let i = 0; i < clean.length; i++) {
  const c = clean[i];
  if (c === '{') {
    const sel = buffer.trim();
    buffer = '';
    if (sel.startsWith('@keyframes') || sel.startsWith('@-webkit-keyframes')) {
      inKeyframes = true;
    } else if (sel.startsWith('@')) {
      // media query, etc.
    } else if (!inKeyframes) {
      const selectors = sel.split(',');
      for (const s of selectors) {
        const trimmed = s.trim();
        if (trimmed && !trimmed.startsWith('#ab-mobility-checkup') && !trimmed.startsWith('@') && !trimmed.match(/^(from|to|\d+%)$/)) {
          errors.push(trimmed);
        }
      }
    }
    depth++;
  } else if (c === '}') {
    buffer = '';
    depth--;
    if (depth === 0) inKeyframes = false;
  } else {
    buffer += c;
  }
}
console.log('Unscoped CSS errors count:', errors.length);
if (errors.length > 0) console.log(errors);

console.log('\n--- 5. Section Presence Check ---');
const expectedSections = [
  'ab-top-bar',
  'ab-hero',
  'ab-quello-che-mostra',
  'ab-prova-sociale',
  'ab-ti-riconosci',
  'ab-immagina',
  'ab-punto-zero',
  'ab-movimento-adattivo',
  'ab-come-funziona',
  'ab-mappa-movimento',
  'ab-destinazioni',
  'ab-perche-destinazione',
  'ab-chi-e-andrea',
  'ab-fa-per-te',
  'ab-sezione-offerta',
  'ab-faq',
  'ab-footer'
];
expectedSections.forEach(sec => {
  const found = ghlHtml.includes(sec);
  console.log(`Section/Element '${sec}':`, found ? 'FOUND' : 'MISSING!');
});

console.log('\n--- 6. Invented Content Check ---');
const forbiddenStrings = [
  'Oggi per la prima volta sono riuscito a toccare terra',
  'Trekking di 5 ore sulle Dolomiti fatto ieri',
  'I 3 esercizi che mi hai dato sono diventati il mio rito',
  'Nessun algoritmo o scheda precompilata',
  'L\'età non definisce la possibilità di migliorare: definisce solo',
  'spinta scapolare e stabilità'
];
forbiddenStrings.forEach(s => {
  const foundInIndex = html.includes(s);
  const foundInGhl = ghlHtml.includes(s);
  console.log(`Forbidden phrase '${s.substring(0, 30)}...':`, (foundInIndex || foundInGhl) ? 'LEAKED!' : 'CLEAN (removed)');
});

console.log('\n--- 7. Countdown Safe Fallback Check ---');
const topBarDisplayNone = css.includes('#ab-mobility-checkup .ab-top-bar {\n  display: none;') || css.includes('display: none; /* Default rigorosamente nascosto */');
console.log('Top bar hidden by default in CSS:', topBarDisplayNone);

const offerCountdownDisplayNone = css.includes('#ab-mobility-checkup .ab-offer-countdown-box {\n  display: none;');
console.log('Offer countdown hidden by default in CSS:', offerCountdownDisplayNone);

console.log('\n--- All Automated Checks Complete ---');
