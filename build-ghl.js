const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const cssPath = path.join(rootDir, 'styles.css');
const jsPath = path.join(rootDir, 'script.js');
const htmlPath = path.join(rootDir, 'index.html');
const outPath = path.join(rootDir, 'highlevel-paste.html');

const cssContent = fs.readFileSync(cssPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Extract the markup inside and including <div id="ab-mobility-checkup"> ... </div>
const match = htmlContent.match(/<div id="ab-mobility-checkup">([\s\S]*?)<\/div>\s*<script src="script\.js"><\/script>/);

if (!match) {
  console.error("Could not find #ab-mobility-checkup in index.html");
  process.exit(1);
}

const innerMarkup = match[1];

const finalOutput = `<!-- ==========================================================================
     CHECK-UP DI MOBILITÀ — SALES PAGE (ANDREA BOLZAN)
     Deliverable per elemento Custom Code / HTML di GoHighLevel
     ========================================================================== -->

<style>
${cssContent}
</style>

<div id="ab-mobility-checkup">
${innerMarkup}
</div>

<!-- Script opzionali GSAP & ScrollTrigger via CDN (progressive enhancement non bloccante) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Script applicativo Check-up di Mobilità -->
<script>
${jsContent}
</script>
`;

fs.writeFileSync(outPath, finalOutput, 'utf8');
console.log('Successfully generated highlevel-paste.html. File size:', fs.statSync(outPath).size, 'bytes');
