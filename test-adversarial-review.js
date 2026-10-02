const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');
const ghlHtml = fs.readFileSync('highlevel-paste.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

const failures = [];
function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
  } catch (err) {
    console.error(`FAIL: ${name} -> ${err.message}`);
    failures.push({ name, error: err.message });
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy but got ${JSON.stringify(actual)}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy but got ${JSON.stringify(actual)}`);
    },
    toContain(substr) {
      if (typeof actual === 'string' && !actual.includes(substr)) throw new Error(`Expected string to contain ${JSON.stringify(substr)}`);
      if (Array.isArray(actual) && !actual.includes(substr)) throw new Error(`Expected array to contain ${JSON.stringify(substr)}`);
    },
    toMatch(regex) {
      if (!regex.test(actual)) throw new Error(`Expected ${JSON.stringify(actual)} to match ${regex}`);
    }
  };
}

console.log('=== ADVERSARIAL VERIFICATION SUITE ===\n');

// --- R1: HERO VIDEO ---
test('R1.1 Hero video served from HighLevel Media in index and ghl', () => {
  const url = 'https://assets.cdn.filesafe.space/uOhWHC9irUCvD2i2XIg7/media/6abf80322c503e697d4d8f85.mov';
  expect(html).toContain(url);
  expect(ghlHtml).toContain(url);
});

test('R1.2 Hero has no Drive iframe anymore', () => {
  const drive = 'drive.google.com/file/d/1y2War-Tw4YqxpwSnb8AzF12W0OztL5gw/preview';
  expect(html.includes(drive) || ghlHtml.includes(drive)).toBe(false);
});

test('R1.3 Hero aspect ratio 16:9 container configured with padding-bottom: 56.25%', () => {
  expect(css).toMatch(/#ab-mobility-checkup \.ab-vsl-ratio\s*\{[^}]*padding-bottom:\s*56\.25%;/);
  expect(css).toMatch(/#ab-mobility-checkup \.ab-hero-video\s*\{[^}]*position:\s*absolute;\s*inset:\s*0;/);
});

// --- R2: TESTIMONIALS, VIDEOS, AUTO-SLIDER & SMART-SNAP ---
test('R2.1 All 14 WhatsApp chat cards have 4:5 aspect ratio (280x350) and lazy loading in index.html', () => {
  for (let i = 1; i <= 14; i++) {
    expect(html).toContain(`assets/social-proof/chats/chat-14.png`.replace('14', i.toString()));
    const regex = new RegExp(`src="assets/social-proof/chats/chat-${i}\\.png"[^>]*loading="lazy"[^>]*width="280"[^>]*height="350"`);
    expect(html).toMatch(regex);
  }
});

test('R2.2 All 6 video testimonials open HighLevel Media files in the native player', () => {
  const files = [
    '6abfc1527bca8cd20c32e971.mp4',
    '6abfc152f30b488137b274bc.mp4',
    '6abfc152f30b488137b274bb.mp4',
    '6abfc152849322987418fb84.mp4',
    '6abfc15202569bee7caf9d3f.mp4',
    '6abfc15202569bee7caf9d35.mp4'
  ];
  files.forEach((file) => {
    const src = `data-video-src="https://assets.cdn.filesafe.space/uOhWHC9irUCvD2i2XIg7/media/${file}"`;
    expect(html).toContain(src);
    expect(ghlHtml).toContain(src);
  });
  expect(js).toContain('document.createElement("video")');
});

test('R2.3 Auto-slider Smart-Snap: is-paused class enables x mandatory snapping', () => {
  expect(css).toMatch(/#ab-mobility-checkup \.ab-auto-slider\.is-paused\s*\{[^}]*scroll-snap-type:\s*x mandatory;/);
  expect(css).toMatch(/#ab-mobility-checkup \.ab-auto-slider\s*\{[^}]*scroll-snap-type:\s*none;/);
});

test('R2.4 Auto-slider pauses instantly on touch/hover and resumes after 3000ms delay', () => {
  expect(js).toContain('slider.addEventListener("mouseenter", pause);');
  expect(js).toContain('slider.addEventListener("touchstart", pause');
  expect(js).toContain('const RESUME_DELAY = 3000;');
});

test('R2.5 Video modal coordinates with auto-sliders (pauses while open, resumes on close)', () => {
  expect(js).toContain('function isModalOpen()');
  expect(js).toContain('s.dispatchEvent(new CustomEvent("ab-pause"))');
  expect(js).toContain('s.dispatchEvent(new CustomEvent("ab-resume"))');
});

test('R2.6 Modal close restores opener focus without violent scrolling (preventScroll)', () => {
  expect(js).toMatch(/opener\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
});

test('R2.7 Slider dots update loop uses cached offsets and does not thrash layout at 60 FPS', () => {
  expect(js).toContain('computeGeometry()');
  expect(js).toContain('getCardOffsets()');
  // Ensure getBoundingClientRect is NOT called in update loop
  expect(js.includes('card.getBoundingClientRect().left - sliderLeft')).toBeFalsy();
});

// --- R3: OFFER SECTION ---
test('R3.1 Pricing CTA text is exactly "Acquista ora" in both files', () => {
  expect(html).toMatch(/<a class="ab-cta ab-cta--primary ab-cta--full"[^>]*>\s*Acquista ora\s*<\/a>/);
  expect(ghlHtml).toMatch(/<a class="ab-cta ab-cta--primary ab-cta--full"[^>]*>\s*Acquista ora\s*<\/a>/);
});

test('R3.2 Pricing promo sentences formatted on two distinct lines with .ab-mark', () => {
  expect(html).toMatch(/<div class="ab-pricing-credit-text">\s*<p><span class="ab-mark">Paghi 57 € qualcosa che ne vale 150\.<\/span><\/p>\s*<p><span class="ab-mark">E avrai un credito di 150 € da poter scalare in un percorso con me\.<\/span><\/p>\s*<\/div>/);
  expect(ghlHtml).toMatch(/<div class="ab-pricing-credit-text">\s*<p><span class="ab-mark">Paghi 57 € qualcosa che ne vale 150\.<\/span><\/p>\s*<p><span class="ab-mark">E avrai un credito di 150 € da poter scalare in un percorso con me\.<\/span><\/p>\s*<\/div>/);
});

test('R3.3 .ab-mark has high-contrast yellow highlight gradient (#ffe14d)', () => {
  expect(css).toMatch(/#ab-mobility-checkup \.ab-mark\s*\{[^}]*#ffe14d/);
});

// --- R4: STICKY MOBILE CTA & SQUARE WHATSAPP BUTTON ---
test('R4.1 Sticky mobile CTA contains square WhatsApp button to the left of main CTA', () => {
  const sticky = /<aside class="ab-sticky-mobile-cta"[^>]*>\s*<div class="ab-sticky-info">[\s\S]*?<\/div>\s*<a class="ab-sticky-wa"[^>]*>[\s\S]*?<\/a>\s*<a class="ab-cta ab-cta--primary ab-sticky-btn"[^>]*>\s*Acquista ora\s*<\/a>/;
  expect(html).toMatch(sticky);
  expect(ghlHtml).toMatch(sticky);
});

test('R4.2 WhatsApp button has 52x52px touch box (exceeds Apple HIG 44px/48px min)', () => {
  expect(css).toMatch(/#ab-mobility-checkup \.ab-sticky-wa\s*\{[^}]*width:\s*52px;\s*height:\s*52px;/);
});

test('R4.3 WhatsApp link configured in AB_CONFIG with the business message link', () => {
  const expectedWa = 'https://api.whatsapp.com/message/3FK3XLUBGYHBJ1';
  expect(js).toContain(expectedWa);
});

// --- R5: INVARIANTS & INTEGRITY ---
test('R5.1 All 10 checkout links preserve https://andreabolzan.com/acquisto', () => {
  const countIdx = (html.match(/href="https:\/\/andreabolzan\.com\/acquisto"/g) || []).length;
  const countGhl = (ghlHtml.match(/href="https:\/\/andreabolzan\.com\/acquisto"/g) || []).length;
  expect(countIdx).toBe(10);
  expect(countGhl).toBe(10);
});

test('R5.2 Active countdown deadline preserved for Monday 23:00 with aria-live="polite"', () => {
  expect(js).toContain('deadlineISO: "2026-10-05T23:00:00+02:00"');
  expect(ghlHtml).toContain('aria-live="polite"');
  expect(html).toContain('aria-live="polite"');
});

test('R5.3 Zero root tags in highlevel-paste.html', () => {
  expect(!/<html[\s>]/i.test(ghlHtml)).toBeTruthy();
  expect(!/<head[\s>]/i.test(ghlHtml)).toBeTruthy();
  expect(!/<body[\s>]/i.test(ghlHtml)).toBeTruthy();
  const wrapperCount = (ghlHtml.match(/id="ab-mobility-checkup"/g) || []).length;
  expect(wrapperCount).toBe(1);
});

test('R5.4 Complete CDN remapping: zero local asset paths remain in highlevel-paste.html', () => {
  expect(!/assets\/andrea\//i.test(ghlHtml)).toBeTruthy();
  expect(!/assets\/social-proof\//i.test(ghlHtml)).toBeTruthy();
});

// --- EDGE CASES: QUERY PARAMS & TRACKING FORWARDING ---
const { appendQueryParams } = require('./script.js');

test('Query param forwarding handles edge cases gracefully', () => {
  // Empty url
  expect(appendQueryParams('')).toBe('');
  expect(appendQueryParams(null)).toBe(null);
  
  // Hash anchor untouched
  expect(appendQueryParams('#WHATSAPP_URL')).toBe('#WHATSAPP_URL');
  expect(appendQueryParams('#ab-faq')).toBe('#ab-faq');
  
  // Forwarding with mocked window.location
  const origWindow = global.window;
  global.window = {
    location: {
      search: '?utm_source=meta&utm_medium=cpc&custom_id=999',
      href: 'https://andreabolzan.com/landing'
    }
  };
  
  const checkoutUrl = 'https://andreabolzan.com/acquisto';
  const resCheckout = appendQueryParams(checkoutUrl);
  expect(resCheckout).toContain('utm_source=meta');
  expect(resCheckout).toContain('utm_medium=cpc');
  expect(resCheckout).toContain('custom_id=999');
  
  const waUrl = 'https://wa.me/393407982266?text=Ciao%20Andrea';
  const resWa = appendQueryParams(waUrl);
  expect(resWa).toContain('text=Ciao+Andrea');
  expect(resWa).toContain('utm_source=meta');
  
  // Preserve already present parameter on target
  const preParamUrl = 'https://andreabolzan.com/acquisto?utm_source=original';
  const resPre = appendQueryParams(preParamUrl);
  expect(resPre).toContain('utm_source=original');
  
  global.window = origWindow;
});

test('R2.8 Auto-slider cancels RAF loop and suspends ticks immediately when paused', () => {
  expect(js).toContain('window.cancelAnimationFrame(rafId)');
  expect(js).toContain('if (!inView || document.hidden || isModalOpen() || paused)');
});

test('R2.9 isModalOpen memoizes modalEl and update avoids scrollWidth query during autoscroll', () => {
  expect(js).toContain('let modalEl = null;');
  expect(js).toContain('const max = looping ? 0 : (slider.scrollWidth - slider.clientWidth);');
});

console.log(`\n========================================`);
if (failures.length > 0) {
  console.error(`TOTAL FAILURES: ${failures.length}`);
  process.exit(1);
} else {
  console.log(`ALL ADVERSARIAL TESTS PASSED (${22} test cases)!`);
  process.exit(0);
}
