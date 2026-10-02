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
  assert(l.includes('href="https://andreabolzan.com/acquisto"'), `Checkout link ${i + 1} in GHL has href="https://andreabolzan.com/acquisto"`);
});
allCheckoutIdx.forEach((l, i) => {
  assert(l.includes('href="https://andreabolzan.com/acquisto"'), `Checkout link ${i + 1} in index.html has href="https://andreabolzan.com/acquisto"`);
});

assert(allWaGhl.length === 5, `Found all 5 WhatsApp links (4 CTA + sticky square) in highlevel-paste.html (found ${allWaGhl.length})`);
assert(allWaIdx.length === 5, `Found all 5 WhatsApp links (4 CTA + sticky square) in index.html (found ${allWaIdx.length})`);

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
const topBarDisplayNone = /#ab-mobility-checkup\s+\.ab-top-bar\s*\{[\s\S]*?display:\s*none;/i.test(css) || css.includes('display: none; /* Default rigorosamente nascosto */');
assert(topBarDisplayNone, 'Top bar is hidden by default in CSS');

const offerCountdownDisplayNone = /#ab-mobility-checkup\s+\.ab-offer-countdown-box\s*\{[\s\S]*?display:\s*none;/i.test(css);
assert(offerCountdownDisplayNone, 'Offer countdown box is hidden by default in CSS');

assert(js.includes('2026-10-05T23:00:00+02:00'), 'deadlineISO is configured for Monday 23:00 in script.js');
assert(ghlHtml.includes('2026-10-05T23:00:00+02:00'), 'deadlineISO is configured for Monday 23:00 in highlevel-paste.html');

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
assert(/#ab-mobility-checkup \.ab-title-h1\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*(?:normal|-?[\d.]+em);/s.test(css), 'H1 has scoped text-transform none and explicit letter-spacing (normal or em)');
assert(/#ab-mobility-checkup \.ab-title-h2\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*(?:normal|-?[\d.]+em);/s.test(css), 'H2 has scoped text-transform none and explicit letter-spacing (normal or em)');
assert(/#ab-mobility-checkup \.ab-title-h3\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*(?:normal|-?[\d.]+em);/s.test(css), 'H3 has scoped text-transform none and explicit letter-spacing (normal or em)');
assert(/#ab-mobility-checkup \.ab-bridge__title\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*(?:normal|-?[\d.]+em);/s.test(css), 'Bridge title has scoped heading resets');
assert(/#ab-mobility-checkup \.ab-why-card__title\s*\{[^}]*text-transform:\s*none;[^}]*letter-spacing:\s*(?:normal|-?[\d.]+em);/s.test(css), 'Why card title has scoped heading resets');

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
assert(css.includes('.ab-hero-video {') && /\.ab-hero-video\s*\{[^}]*position:\s*absolute/s.test(css), 'Hero video iframe fills the 16:9 ratio box');
assert(css.includes('aspect-ratio: 2 / 3;') || css.includes('aspect-ratio: 2/3;'), 'Bio photo has 2:3 aspect ratio');
assert(css.includes('min-height: 44px;'), 'Footer links have min 44px touch target');

// Verify all local assets in GHL deliverable are mapped to CDN
assert(!/src=["']assets\//.test(ghlHtml), 'highlevel-paste.html has zero remaining local asset paths');

console.log('\n=== 13. Mobile-First CRO & Viewport Engineering Checks ===');
// 1. Sticky Bottom CTA Bar
assert(/#ab-mobility-checkup \.ab-sticky-btn\s*\{[^}]*min-height:\s*52px;/s.test(css), 'Sticky CTA button has 52px touch height');
assert(/Blocca il Check-up\s*·\s*<span[^>]*data-promo-price[^>]*>57\s*€<\/span>/.test(html), 'Sticky CTA button has micro-copy "Blocca il Check-up · 57 €" in index.html');
assert(/Blocca il Check-up\s*·\s*<span[^>]*data-promo-price[^>]*>57\s*€<\/span>/.test(ghlHtml), 'Sticky CTA button has micro-copy "Blocca il Check-up · 57 €" in highlevel-paste.html');
assert(css.includes('env(safe-area-inset-bottom'), 'Sticky CTA bar supports safe-area-inset-bottom for iOS home bar');
assert(/#ab-mobility-checkup \.ab-sticky-btn:active\s*\{[^}]*transform:\s*scale\(/s.test(css), 'Sticky CTA button has active press feedback');

// 2. Touch targets & iOS Safari touchstart
assert(css.includes('touch-action: manipulation;'), 'touch-action: manipulation is configured for fast touch response');
assert(css.includes('-webkit-tap-highlight-color: transparent;'), '-webkit-tap-highlight-color: transparent is configured');
assert(js.includes('document.addEventListener("touchstart"') || js.includes("document.addEventListener('touchstart'"), 'iOS Safari touchstart listener is registered for instant :active feedback');

// 3. Fluid typography & auto-zoom prevention
assert(/#ab-mobility-checkup \.ab-title-h1\s*\{[^}]*font-size:\s*clamp\(/s.test(css), 'H1 uses fluid typography clamp()');
assert(/#ab-mobility-checkup \.ab-title-h2\s*\{[^}]*font-size:\s*clamp\(/s.test(css), 'H2 uses fluid typography clamp()');
assert(/#ab-mobility-checkup \.ab-title-h3\s*\{[^}]*font-size:\s*clamp\(/s.test(css), 'H3 uses fluid typography clamp()');
assert(/#ab-mobility-checkup \.ab-title-h1\s*\{[^}]*text-wrap:\s*balance;/s.test(css), 'H1 has text-wrap: balance');
assert(/#ab-mobility-checkup \.ab-title-h2\s*\{[^}]*text-wrap:\s*balance;/s.test(css), 'H2 has text-wrap: balance');
assert(/#ab-mobility-checkup input,\s*#ab-mobility-checkup select,\s*#ab-mobility-checkup textarea\s*\{[^}]*font-size:\s*16px;/s.test(css), 'Form inputs have font-size: 16px to prevent iOS auto-zoom');

// 4. Swipe Gestures & Peek-ahead layout (84% card + 16% preview)
assert(/#ab-mobility-checkup \.ab-chat-card\s*\{[^}]*(?:flex:\s*0\s+0\s+84%|width:\s*84%|min-width:\s*84%)/s.test(css), 'Chat cards have 84% width peek-ahead layout on mobile');
assert(/#ab-mobility-checkup \.ab-proof-card\s*\{[^}]*(?:flex:\s*0\s+0\s+84%|width:\s*84%|min-width:\s*84%)/s.test(css), 'Proof cards have 84% width peek-ahead layout on mobile');
assert(/#ab-mobility-checkup \.ab-chat-slider\s*\{[^}]*scroll-snap-type:\s*x mandatory;/s.test(css), 'Chat slider uses native CSS scroll-snap');
assert(/#ab-mobility-checkup \.ab-proof-grid\s*\{[^}]*scroll-snap-type:\s*x mandatory;/s.test(css), 'Proof grid uses native CSS scroll-snap on mobile');
assert(/#ab-mobility-checkup \.ab-chat-slider\s*\{[^}]*-webkit-overflow-scrolling:\s*touch;/s.test(css), 'Chat slider has -webkit-overflow-scrolling: touch');
assert(/#ab-mobility-checkup \.ab-proof-grid\s*\{[^}]*-webkit-overflow-scrolling:\s*touch;/s.test(css), 'Proof grid has -webkit-overflow-scrolling: touch');

// 5. Dynamic viewport units & overscroll behavior
assert(/#ab-mobility-checkup\s*\{[^}]*min-height:\s*100vh;[^}]*min-height:\s*100dvh;/s.test(css), 'Dynamic viewport units (100dvh with 100vh fallback) are configured');
assert(!/#ab-mobility-checkup\s*\{[^}]*overscroll-behavior-y:\s*none;/s.test(css), 'Wrapper has no overscroll-behavior-y: none (it blocks mouse-wheel scroll chaining to the page)');
assert(/#ab-mobility-checkup\s*\{[^}]*overflow-x:\s*clip;/s.test(css), 'Wrapper uses overflow-x: clip so it does not become a scroll container');
assert(css.includes('overscroll-behavior-x: contain;'), 'overscroll-behavior-x: contain is configured on sliders');

// 6. Mobile Performance & Interaction Resilience
assert(css.includes('constant(safe-area-inset-bottom'), 'Sticky CTA bar has constant() fallback for safe-area-inset-bottom');
assert(/#ab-mobility-checkup \.ab-sticky-mobile-cta\s*\{[^}]*will-change:\s*transform,\s*opacity;/s.test(css), 'Sticky CTA bar has will-change GPU acceleration');
assert(js.includes('intersectingMap'), 'Sticky CTA IntersectionObserver tracks element intersection states via Map for FAQ reappearance');
assert(js.includes('role", "button"') || js.includes("role', 'button'"), 'Slider dots have role="button" for accessibility and interactive navigation');

console.log('\n=== 14. Testimonianze, Feedback, Prezzo, Sticky WhatsApp, Hero Video ===');
const count = (re, str) => (str.match(re) || []).length;
for (const [label, src] of [['index.html', html], ['highlevel-paste.html', ghlHtml]]) {
  assert(count(/<img[^>]*class="ab-review-img"/g, src) === 8, `All 8 review cards present in ${label}`);
  assert(count(/class="ab-proof-card ab-video-card"/g, src) === 6, `All 6 video testimonials present in ${label}`);
  assert(count(/<div class="ab-chat-card">/g, src) === 14, `All 14 WhatsApp feedback screenshots present in ${label}`);
  assert(count(/class="[^"]*ab-auto-slider/g, src) === 3, `WhatsApp, written and video sliders are all slow auto-scroll sliders in ${label}`);
  assert(count(/class="ab-proof-grid ab-video-grid ab-auto-slider"/g, src) === 1, `Videos have their own slider in ${label}`);
  assert(!/Video testimonianza \d/.test(src), `No "Video testimonianza N" labels in ${label}`);
  assert(src.includes('drive.google.com/file/d/1y2War-Tw4YqxpwSnb8AzF12W0OztL5gw/preview'), `Hero shows the Drive video in ${label}`);
  assert(!/class="ab-vsl-poster-img"/.test(src), `Hero photo replaced by video in ${label}`);
  assert(/<a class="ab-cta ab-cta--primary ab-cta--full"[^>]*>\s*Compra ora\s*<\/a>/.test(src), `Pricing CTA reads "Compra ora" in ${label}`);
  assert(count(/class="ab-mark"/g, src) === 2, `Two highlighted pricing sentences in ${label}`);
  assert(/<a class="ab-sticky-wa"[^>]*data-whatsapp-link/.test(src), `Sticky bar has square WhatsApp button in ${label}`);
  assert(!src.includes('ab-hero-video-fallback'), `Hero has no "Non vedi il video?" fallback link in ${label}`);
}
assert(/\.ab-mark\s*\{[^}]*#ffe14d/s.test(css), 'Pricing sentences are underlined/highlighted in yellow');
assert(/\.ab-sticky-wa\s*\{[^}]*width:\s*52px;[^}]*height:\s*52px;/s.test(css), 'Sticky WhatsApp button is a 52px square');
assert(js.includes('function setupAutoScroll') && js.includes('"touchstart", pause') && js.includes('"mouseenter", pause'), 'Auto-scroll pauses on touch and hover');
assert(js.includes('prefers-reduced-motion') && js.includes('function setupVideoModal'), 'Auto-scroll respects reduced motion; video modal is registered');
assert(js.includes('ab-video-modal-fallback'), 'Video modal fallback link registered in JS');
assert(js.includes('isModalOpen') && js.includes('ab-pause') && js.includes('ab-resume'), 'Auto-scroll pauses during video modal display and resumes after closure');
assert(js.includes('preventScroll: true'), 'Modal close safely restores focus with preventScroll: true without viewport jumps');
assert(!js.includes('card.getBoundingClientRect().left - sliderLeft'), 'Eliminated layout thrashing and forced reflows from slider dots update loop');
assert(/@media \(max-width: 767px\)\s*\{\s*#ab-mobility-checkup \.ab-journey-connector-bar\s*\{[^}]*flex-direction:\s*column/s.test(css), 'Punto Zero -> Destinazione bar is vertical on mobile');

console.log('\n========================================');
if (errors.length > 0) {
  console.error(`🚨 TOTAL FAILURES: ${errors.length}`);
  errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
  process.exit(1);
} else {
  console.log('🎉 ALL AUTOMATED CHECKS PASSED PERFECTLY!');
  process.exit(0);
}
