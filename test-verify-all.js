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
const allCheckout = ghlHtml.match(checkoutRegex) || [];
const allWa = ghlHtml.match(waRegex) || [];
assert(allCheckout.length === 10, `Found all 10 checkout links (found ${allCheckout.length})`);
allCheckout.forEach((l, i) => {
  assert(l.includes('href="#CHECKOUT_URL"'), `Checkout link ${i + 1} has href="#CHECKOUT_URL"`);
});

assert(allWa.length === 4, `Found all 4 WhatsApp links (found ${allWa.length})`);
allWa.forEach((l, i) => {
  assert(l.includes('href="#WHATSAPP_URL"'), `WhatsApp link ${i + 1} has href="#WHATSAPP_URL"`);
  assert(l.includes('target="_blank"'), `WhatsApp link ${i + 1} has target="_blank"`);
  assert(l.includes('rel="noopener noreferrer"'), `WhatsApp link ${i + 1} has rel="noopener noreferrer"`);
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
assert(css.includes('--ab-color-accent: #A3552F;'), 'Accent color set to #A3552F (contrast >= 4.5:1)');
assert(css.includes('#A3B1AB'), 'Footer disclaimer color set to #A3B1AB (contrast >= 4.5:1)');

console.log('\n=== 10. Script IIFE & Re-render Robustness Check ===');
assert(js.includes('(function () {') || js.includes('(function() {'), 'script.js encapsulates code in an IIFE');
assert(!/^const AB_CONFIG/m.test(js), 'AB_CONFIG is not declared in global scope outside IIFE');

console.log('\n=== 11. Accessibility, CLS & Hero Photographic Cover Check ===');
assert(html.includes('role="region"') && html.includes('ab-chat-slider'), 'Chat slider has role="region" for accessibility');
assert(!html.includes('ab-vsl-play-btn'), 'Fake play button removed from Hero cover');
assert(!html.includes('Alternativa testuale:'), 'Unnecessary "Alternativa testuale:" removed from Hero cover');
assert(!html.includes('aria-label="Video di presentazione del Check-up di Mobilità"'), 'Fake player aria-label removed from Hero cover');
assert(!html.includes('eliminazione dolori cronici'), 'Luca Timpani alt text updated to avoid medical over-claim');
assert(css.includes('aspect-ratio: 2 / 3;') || css.includes('aspect-ratio: 2/3;'), 'Bio photo has 2:3 aspect ratio');
assert(css.includes('min-height: 44px;'), 'Footer links have min 44px touch target');

console.log('\n========================================');
if (errors.length > 0) {
  console.error(`🚨 TOTAL FAILURES: ${errors.length}`);
  errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
  process.exit(1);
} else {
  console.log('🎉 ALL AUTOMATED CHECKS PASSED PERFECTLY!');
  process.exit(0);
}
