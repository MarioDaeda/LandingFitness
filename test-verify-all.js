const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const ghlHtml = fs.readFileSync('highlevel-paste.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

const errors = [];

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    errors.push(message);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('=== 1. GHL Deliverable Structure Check ===');
const hasHtmlTag = /<html[\s>]/i.test(ghlHtml) || /<\/html>/i.test(ghlHtml);
const hasHeadTag = /<head[\s>]/i.test(ghlHtml) || /<\/head>/i.test(ghlHtml);
const hasBodyTag = /<body[\s>]/i.test(ghlHtml) || /<\/body>/i.test(ghlHtml);
assert(!hasHtmlTag, 'highlevel-paste.html contains no <html> or </html>');
assert(!hasHeadTag, 'highlevel-paste.html contains no <head> or </head>');
assert(!hasBodyTag, 'highlevel-paste.html contains no <body> or </body>');

const wrapperMatches = ghlHtml.match(/id="ab-mobility-checkup"/g);
assert(wrapperMatches && wrapperMatches.length === 1, 'Wrapper id="ab-mobility-checkup" occurs exactly once');

console.log('\n=== 2. Single H1 Verification ===');
const h1InIndex = html.match(/<h1[\s\S]*?<\/h1>/gi) || [];
const h1InGhl = ghlHtml.match(/<h1[\s\S]*?<\/h1>/gi) || [];
assert(h1InIndex.length === 1, `index.html has exactly 1 H1 (found ${h1InIndex.length})`);
assert(h1InGhl.length === 1, `highlevel-paste.html has exactly 1 H1 (found ${h1InGhl.length})`);

console.log('\n=== 3. CTA Links Verification ===');
const checkoutRegex = /<a\s+[^>]*?data-checkout-link[^>]*?>/gi;
const waRegex = /<a\s+[^>]*?data-whatsapp-link[^>]*?>/gi;
const allCheckoutGhl = ghlHtml.match(checkoutRegex) || [];
const allWaGhl = ghlHtml.match(waRegex) || [];
const allCheckoutIdx = html.match(checkoutRegex) || [];
const allWaIdx = html.match(waRegex) || [];

assert(allCheckoutGhl.length === 10, `Found all 10 checkout links in highlevel-paste.html (found ${allCheckoutGhl.length})`);
assert(allCheckoutIdx.length === 10, `Found all 10 checkout links in index.html (found ${allCheckoutIdx.length})`);

allCheckoutGhl.forEach((l, i) => {
  assert(l.includes('href="#CHECKOUT_URL"'), `Checkout link ${i + 1} in GHL has href="#CHECKOUT_URL"`);
});
allCheckoutIdx.forEach((l, i) => {
  assert(l.includes('href="#CHECKOUT_URL"'), `Checkout link ${i + 1} in index.html has href="#CHECKOUT_URL"`);
});

assert(allWaGhl.length === 4, `Found all 4 WhatsApp links in highlevel-paste.html (found ${allWaGhl.length})`);
assert(allWaIdx.length === 4, `Found all 4 WhatsApp links in index.html (found ${allWaIdx.length})`);

allWaGhl.forEach((l, i) => {
  assert(l.includes('href="#WHATSAPP_URL"'), `WhatsApp link ${i + 1} in GHL has href="#WHATSAPP_URL"`);
  assert(l.includes('target="_blank"'), `WhatsApp link ${i + 1} in GHL has target="_blank"`);
  assert(l.includes('rel="noopener noreferrer"'), `WhatsApp link ${i + 1} in GHL has rel="noopener noreferrer"`);
});
allWaIdx.forEach((l, i) => {
  assert(l.includes('href="#WHATSAPP_URL"'), `WhatsApp link ${i + 1} in index.html has href="#WHATSAPP_URL"`);
  assert(l.includes('target="_blank"'), `WhatsApp link ${i + 1} in index.html has target="_blank"`);
  assert(l.includes('rel="noopener noreferrer"'), `WhatsApp link ${i + 1} in index.html has rel="noopener noreferrer"`);
});

console.log('\n=== 4. Unscoped CSS Selectors Check ===');
const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
let depth = 0;
let buffer = '';
let inKeyframes = false;
let unscopedSelectors = [];

for (let i = 0; i < cleanCss.length; i++) {
  const c = cleanCss[i];
  if (c === '{') {
    const sel = buffer.trim();
    buffer = '';
    if (sel.startsWith('@keyframes') || sel.startsWith('@-webkit-keyframes')) {
      inKeyframes = true;
    } else if (sel.startsWith('@')) {
      // media queries, container queries
    } else if (!inKeyframes) {
      const selectors = sel.split(',');
      for (const s of selectors) {
        const trimmed = s.trim();
        if (trimmed && !trimmed.startsWith('#ab-mobility-checkup') && !trimmed.startsWith('@') && !trimmed.match(/^(from|to|\d+%)$/)) {
          unscopedSelectors.push(trimmed);
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
assert(unscopedSelectors.length === 0, `All CSS selectors are scoped inside #ab-mobility-checkup (unscoped: ${unscopedSelectors.length})`);

console.log('\n=== 5. Section Presence Check ===');
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
  assert(ghlHtml.includes(sec), `Section/Element '${sec}' is present in deliverable`);
});

console.log('\n=== 6. Invented Content Check ===');
const forbiddenStrings = [
  'Oggi per la prima volta sono riuscito a toccare terra',
  'Trekking di 5 ore sulle Dolomiti fatto ieri',
  'I 3 esercizi che mi hai dato sono diventati il mio rito',
  'Nessun algoritmo o scheda precompilata',
  'L\'età non definisce la possibilità di migliorare: definisce solo',
  'spinta scapolare e stabilità'
];
forbiddenStrings.forEach(s => {
  const leaked = html.includes(s) || ghlHtml.includes(s);
  assert(!leaked, `Forbidden phrase '${s.substring(0, 30)}...' is not present`);
});

console.log('\n=== 7. Countdown Safe Fallback Check ===');
const topBarDisplayNone = css.includes('#ab-mobility-checkup .ab-top-bar {\n  display: none;') || css.includes('display: none; /* Default rigorosamente nascosto */');
assert(topBarDisplayNone, 'Top bar is hidden by default in CSS');

const offerCountdownDisplayNone = css.includes('#ab-mobility-checkup .ab-offer-countdown-box {\n  display: none;');
assert(offerCountdownDisplayNone, 'Offer countdown box is hidden by default in CSS');

console.log('\n=== 8. Residual Placeholders & Copy Cleanliness Check ===');
assert(!/\[ASSET/i.test(html) && !/\[ASSET/i.test(ghlHtml), 'No [ASSET: ...] placeholders remaining in HTML');
assert(!/\[DATI FISCALI/i.test(html) && !/\[DATI FISCALI/i.test(ghlHtml), 'No [DATI FISCALI...] placeholder remaining in HTML');
assert(!/\[PRIVACY/i.test(html) && !/\[PRIVACY/i.test(ghlHtml), 'No [PRIVACY...] placeholder remaining in HTML');
assert(!/\[TERMINI/i.test(html) && !/\[TERMINI/i.test(ghlHtml), 'No [TERMINI...] placeholder remaining in HTML');
assert(!/\[COOKIE/i.test(html) && !/\[COOKIE/i.test(ghlHtml), 'No [COOKIE...] placeholder remaining in HTML');
assert(!/X\s+su\s+6/i.test(html) && !/X\s+su\s+6/i.test(ghlHtml), 'No "X su 6" placeholder remaining in HTML');
assert(!/X\s+su/i.test(html) && !/X\s+su/i.test(ghlHtml), 'No "X su" placeholder remaining in HTML');
assert(!/\[ASSET/i.test(js) && !/X\s+su/i.test(js), 'No placeholders remaining in script.js');

console.log('\n=== 9. WCAG AA Contrast Tokens Check ===');
assert(css.includes('--ab-color-accent: #b8420f;'), 'Accent color set to #b8420f (contrast >= 4.5:1)');
assert(css.includes('#aab4c4'), 'Footer disclaimer color set to #aab4c4 (contrast >= 4.5:1)');

console.log('\n=== 10. Script IIFE, Tracking & Query Params Forwarding Check ===');
assert(js.includes('(function () {') || js.includes('(function() {'), 'script.js encapsulates code in an IIFE');
assert(!/^const AB_CONFIG/m.test(js), 'AB_CONFIG is not declared in global scope outside IIFE');

// Functional testing of appendQueryParams
const { appendQueryParams } = require('./script.js');
assert(typeof appendQueryParams === 'function', 'appendQueryParams is exported and callable');
assert(appendQueryParams('#CHECKOUT_URL') === '#CHECKOUT_URL', 'appendQueryParams preserves hash anchors untouched');
assert(appendQueryParams('#WHATSAPP_URL') === '#WHATSAPP_URL', 'appendQueryParams preserves WhatsApp hash anchors untouched');

// Mock window.location for query parameter forwarding test
const origWindow = global.window;
global.window = {
  location: {
    search: '?utm_source=meta_ad&utm_campaign=winter_promo&fbclid=test12345',
    href: 'https://andrea-bolzan.com/mobility-checkup'
  }
};
const checkoutForwarded = appendQueryParams('https://buy.stripe.com/test_checkout');
assert(checkoutForwarded.includes('utm_source=meta_ad'), 'appendQueryParams forwards utm_source');
assert(checkoutForwarded.includes('utm_campaign=winter_promo'), 'appendQueryParams forwards utm_campaign');
assert(checkoutForwarded.includes('fbclid=test12345'), 'appendQueryParams forwards fbclid');

const waForwarded = appendQueryParams('https://wa.me/393400000000?text=Ciao%20Andrea');
assert(waForwarded.includes('text=Ciao'), 'appendQueryParams preserves existing text parameter on WhatsApp URL');
assert(waForwarded.includes('utm_source=meta_ad'), 'appendQueryParams appends tracking to WhatsApp URL');
global.window = origWindow;

console.log('\n=== 11. Heading Scoped Resets (GHL Theme Isolation) Check ===');
assert(/#ab-mobility-checkup \.ab-title-h1\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*normal;/s.test(css), 'H1 has scoped text-transform none and letter-spacing normal');
assert(/#ab-mobility-checkup \.ab-title-h2\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*normal;/s.test(css), 'H2 has scoped text-transform none and letter-spacing normal');
assert(/#ab-mobility-checkup \.ab-title-h3\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*normal;/s.test(css), 'H3 has scoped text-transform none and letter-spacing normal');
assert(/#ab-mobility-checkup \.ab-bridge__title\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*normal;/s.test(css), 'Bridge title has scoped heading resets');
assert(/#ab-mobility-checkup \.ab-why-card__title\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*normal;/s.test(css), 'Why card title has scoped heading resets');

console.log('\n=== 12. Accessibility, CLS & Media Aspect Ratio Checks ===');
assert(html.includes('role="region"') && html.includes('ab-chat-slider'), 'Chat slider in index.html has role="region"');
assert(ghlHtml.includes('role="region"') && ghlHtml.includes('ab-chat-slider'), 'Chat slider in highlevel-paste.html has role="region"');
assert(!html.includes('ab-vsl-play-btn'), 'Fake play button removed from Hero cover in index.html');
assert(!ghlHtml.includes('ab-vsl-play-btn'), 'Fake play button removed from Hero cover in highlevel-paste.html');
assert(!html.includes('Alternativa testuale:'), 'Unnecessary "Alternativa testuale:" removed from Hero cover in index.html');
assert(!ghlHtml.includes('Alternativa testuale:'), 'Unnecessary "Alternativa testuale:" removed from Hero cover in highlevel-paste.html');
assert(!html.includes('aria-label="Video di presentazione del Check-up di Mobilità"'), 'Fake player aria-label removed from index.html');
assert(!ghlHtml.includes('aria-label="Video di presentazione del Check-up di Mobilità"'), 'Fake player aria-label removed from highlevel-paste.html');

// Alt text realistic claims
assert(!html.includes('eliminazione dolori cronici'), 'Luca Timpani alt text updated in index.html');
assert(!ghlHtml.includes('eliminazione dolori cronici'), 'Luca Timpani alt text updated in highlevel-paste.html');
assert(html.includes('alleviando di molto') || html.includes('netta riduzione'), 'Luca Timpani has realistic claim in index.html');
assert(ghlHtml.includes('alleviando di molto') || ghlHtml.includes('netta riduzione'), 'Luca Timpani has realistic claim in highlevel-paste.html');

// Review dimensions & CLS checks
assert(!/width=["']600["']\s+height=["']700["']/.test(html), 'No 600x700 generic review dimensions in index.html');
assert(!/width=["']600["']\s+height=["']700["']/.test(ghlHtml), 'No 600x700 generic review dimensions in highlevel-paste.html');
assert(html.includes('Monica Gavillucci.jpg" alt="Testimonianza di Monica Gavillucci') && html.includes('width="800" height="493"'), 'Monica Gavillucci has accurate 800x493 dimensions');
assert(html.includes('width="280" height="350"'), 'Chat cards have accurate 280x350 dimensions (4:5 aspect ratio)');

// Photo cover 3:2 ratio rule
assert(css.includes('.ab-hero-photo-card .ab-vsl-ratio'), 'Hero photo card has dedicated ratio rule');
assert(css.includes('aspect-ratio: 2 / 3;') || css.includes('aspect-ratio: 2/3;'), 'Bio photo has 2:3 aspect ratio');
assert(css.includes('min-height: 44px;'), 'Footer links have min 44px touch target');

// Verify all local assets in GHL deliverable are mapped to CDN
assert(!/src=["']assets\//.test(ghlHtml), 'highlevel-paste.html has zero remaining local asset paths');

console.log('\n========================================');
if (errors.length > 0) {
  console.error(`🚨 TOTAL FAILURES: ${errors.length}`);
  errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
  process.exit(1);
} else {
  console.log('🎉 ALL AUTOMATED CHECKS PASSED PERFECTLY!');
  process.exit(0);
}
