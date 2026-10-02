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

// Mappatura automatica asset locali -> CDN Google Drive ad alte prestazioni per GoHighLevel
const CDN_MAP = {
  // Andrea Bolzan (Folder: Bolza - 1XmdtQgltDi3Q4PDGp3zvYfPaNT0G0Oha)
  'assets/andrea/IMG_7648.jpg': 'https://lh3.googleusercontent.com/d/1Xagbv25DzeoQerhQGOcRR1oJpaxkYzup=s1200',
  'assets/andrea/IMG_7649.jpg': 'https://lh3.googleusercontent.com/d/15UxBgSMf4rUVGcLQ1u8ga7bRiZdZhSaW=s1200',
  'assets/andrea/IMG_7650.jpg': 'https://lh3.googleusercontent.com/d/1nbRD4GwrL9v_nMAIfZ2SLKmaR1JoDMca=s1200',
  'assets/andrea/IMG_7651.jpg': 'https://lh3.googleusercontent.com/d/1eRM85m9_xPp1lTT2uyPiWnCRfwwZObrh=s1200',
  'assets/andrea/IMG_7652.jpg': 'https://lh3.googleusercontent.com/d/1ilx4y0i0kNj7LfHllFx6aMVWS-l7xIc0=s1200',

  // Social Proof Reviews (Folder: screen/recensione - 1NNwaqOviLcjahV278L02LetO2m4OPeIi)
  'assets/social-proof/reviews/Lucia Orlando.jpg': 'https://lh3.googleusercontent.com/d/1ocuUX0qi9Jc_F-pi2c67_E7HxVrZUhOf=s800',
  'assets/social-proof/reviews/Andrea Ferrari.jpg': 'https://lh3.googleusercontent.com/d/1jcKX8X36HhDDB2Y97budf4U7RVzPM5oC=s800',
  'assets/social-proof/reviews/Luca Timpani.jpg': 'https://lh3.googleusercontent.com/d/1wcFBWAbxx0SwJ_HuzdhuC_OpyIdb_12p=s800',
  'assets/social-proof/reviews/Michele Vicari.jpg': 'https://lh3.googleusercontent.com/d/1GvOJHW68oK2J8UuLnD-WUnry6Y_oyO6K=s800',
  'assets/social-proof/reviews/Monica Gavillucci.jpg': 'https://lh3.googleusercontent.com/d/1ZF4URLsENQtTVO-2J4zaueNGlqHVUXO-=s800',
  'assets/social-proof/reviews/Luca Ugolini.jpg': 'https://lh3.googleusercontent.com/d/1iwZaeWmIMqAmDAtmH7_Ll1KAdtVxU2df=s800',
  'assets/social-proof/reviews/Dario Parodi.jpg': 'https://lh3.googleusercontent.com/d/1GyJVrJvDfnts0Vyb-pR_hi0xGxMahcqj=s800',
  'assets/social-proof/reviews/Katia Lagona.jpg': 'https://lh3.googleusercontent.com/d/149Ya-clHOsi-B6nmw2Kv7kUq-jXHHyzP=s800',

  // Video testimonianze: anteprime dai file Drive (cartella Testimonianze)
  'assets/social-proof/videos/video-1-thumb.jpg': 'https://drive.google.com/thumbnail?id=1B86jpAQdueYDEC6k_z3trq_gBdQT5CJu&sz=w640',
  'assets/social-proof/videos/video-2-thumb.jpg': 'https://drive.google.com/thumbnail?id=1ny4_iebo_z0kETrKlOzpFEcmrzkzQAGJ&sz=w640',
  'assets/social-proof/videos/video-3-thumb.jpg': 'https://drive.google.com/thumbnail?id=18BwI9imqQ7xUr8pNMh22ifTeY8Phqeqp&sz=w640',
  'assets/social-proof/videos/video-4-thumb.jpg': 'https://drive.google.com/thumbnail?id=1EM8D8JaJ8pwYGOCiU5un8l9PawnjGrKn&sz=w640',
  'assets/social-proof/videos/video-5-thumb.jpg': 'https://drive.google.com/thumbnail?id=1WS1MJorPInZS5KKGa6dTKzfFvev9XMRx&sz=w640',
  'assets/social-proof/videos/video-6-thumb.jpg': 'https://drive.google.com/thumbnail?id=1jVlMSxyMnuzRJ5klryHleqjZAcEl4S9l&sz=w640',

  // Social Proof Chats (Folder: screen - 1jHGrmlWsk1uf4CNwgQTm6N4j1neHyQ-p)
  'assets/social-proof/chats/chat-1.png': 'https://lh3.googleusercontent.com/d/1KFphfbwlu_8IADoutyOXadJ-zFtEAYIU=s800',
  'assets/social-proof/chats/chat-2.png': 'https://lh3.googleusercontent.com/d/1b_xRngPbai3CBXk8Hvnyq40F9fuSC9hB=s800',
  'assets/social-proof/chats/chat-3.png': 'https://lh3.googleusercontent.com/d/1B8fa8g5Y1LHViDIv9RLlZV0FbA7uUi4y=s800',
  'assets/social-proof/chats/chat-4.png': 'https://lh3.googleusercontent.com/d/1QVOfAQ_mo41tQyEjk_4Pq7ywsLHh_fxq=s800',
  'assets/social-proof/chats/chat-5.png': 'https://lh3.googleusercontent.com/d/1ugLIIYHhgo0jepzD-KVqEjwnqdd1xwJl=s800',
  'assets/social-proof/chats/chat-6.png': 'https://lh3.googleusercontent.com/d/1qX-cP83WG0k7mk-i05ZymmEyLiuf5VVx=s800',
  'assets/social-proof/chats/chat-7.png': 'https://lh3.googleusercontent.com/d/14b0typpayeijkwjHFJORcIvexz2WoY4j=s800',
  'assets/social-proof/chats/chat-8.png': 'https://lh3.googleusercontent.com/d/1cwULfmv2gfnjquv9PuqCG1sFkJkJ2Yl4=s800',
  'assets/social-proof/chats/chat-9.png': 'https://lh3.googleusercontent.com/d/16x_C-HGzJNv4MtTc1usNzQBq32G1CXVu=s800',
  'assets/social-proof/chats/chat-10.png': 'https://lh3.googleusercontent.com/d/1KwzmJrmOSB4wfjoRL1dHdoLx2e5yt2uP=s800',
  'assets/social-proof/chats/chat-11.png': 'https://lh3.googleusercontent.com/d/136Qu0OM4pX-2uL2AkBuAdgndcdVOcju1=s800',
  'assets/social-proof/chats/chat-12.png': 'https://lh3.googleusercontent.com/d/1dR6YO8iFeYHpBJtcSRL7mJOfQzRz0iD5=s800',
  'assets/social-proof/chats/chat-13.png': 'https://lh3.googleusercontent.com/d/1GyzGZZQT4AkVfSjRzBv6JBMVsx3achWU=s800',
  'assets/social-proof/chats/chat-14.png': 'https://lh3.googleusercontent.com/d/1CS6bnH8dC_2KbIci-ujdEKJkx6NbhvuE=s800'
};

let ghlCheckupDiv = checkupDiv;
for (const [localPath, cdnUrl] of Object.entries(CDN_MAP)) {
  ghlCheckupDiv = ghlCheckupDiv.split(localPath).join(cdnUrl);
}

const finalOutput = `<!-- ==========================================================================
     CHECK-UP DI MOBILITÀ — SALES PAGE (ANDREA BOLZAN)
     Deliverable per elemento Custom Code / HTML di GoHighLevel
     Nessun tag HTML root, HEAD o BODY. Unico wrapper: #ab-mobility-checkup
     ========================================================================== -->

<style>
${cssContent.trim()}
</style>

${ghlCheckupDiv}

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
