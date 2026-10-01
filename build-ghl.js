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

// Robust extraction of <div id="ab-mobility-checkup">...</div>
const startTag = '<div id="ab-mobility-checkup">';
const startIndex = htmlContent.indexOf(startTag);
if (startIndex === -1) {
  console.error('Could not find <div id="ab-mobility-checkup"> in index.html');
  process.exit(1);
}

// Find closing </div> before <script src="script.js">
const scriptTagIndex = htmlContent.indexOf('<script src="script.js">');
if (scriptTagIndex === -1) {
  console.error('Could not find <script src="script.js"> in index.html');
  process.exit(1);
}

const beforeScript = htmlContent.substring(startIndex, scriptTagIndex);
const lastDivIndex = beforeScript.lastIndexOf('</div>');
if (lastDivIndex === -1) {
  console.error('Could not find closing </div> in index.html');
  process.exit(1);
}

const checkupDiv = beforeScript.substring(0, lastDivIndex + 6).trim();

const finalOutput = `<!-- ==========================================================================
     CHECK-UP DI MOBILITÀ — SALES PAGE (ANDREA BOLZAN)
     Deliverable per elemento Custom Code / HTML di GoHighLevel
     Nessun tag HTML root, HEAD o BODY. Unico wrapper: #ab-mobility-checkup
     ========================================================================== -->

<style>
${cssContent.trim()}
</style>

${checkupDiv}

<!-- Script opzionali GSAP & ScrollTrigger via CDN (progressive enhancement non bloccante) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Script applicativo Check-up di Mobilità -->
<script>
${jsContent.trim()}
</script>
`;

fs.writeFileSync(outPath, finalOutput, 'utf8');
console.log('Successfully generated highlevel-paste.html. File size:', fs.statSync(outPath).size, 'bytes');
