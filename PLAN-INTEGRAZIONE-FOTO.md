# Piano Esecutivo — Integrazione Foto e Asset Multimediali nella Landing Page

Data redazione: 01/10/2026 (Aggiornato con audit effettivo dei file)  
Destinatari: Qiu, Andrea Bolzan, Team di Sviluppo  
Riferimento Copy: `brief/copy.md`  
File deliverable: `index.html`, `styles.css`, `highlevel-paste.html`, `build-ghl.js`

---

## 1. Executive Summary & Audit Reale dei File

Qiu ha condiviso tre cartelle Google Drive contenenti il materiale originale per il **Check-up di Mobilità**:
1. **Cartella 1**: `https://drive.google.com/drive/folders/1wh5fJfnEM1EV4SRst1bAffCRa6zNnLlw?usp=sharing`
2. **Cartella 2**: `https://drive.google.com/drive/folders/1jHGrmlWsk1uf4CNwgQTm6N4j1neHyQ-p?usp=sharing`
3. **Cartella 3**: `https://drive.google.com/drive/folders/1XmdtQgltDi3Q4PDGp3zvYfPaNT0G0Oha?usp=sharing`

A differenza della bozza ipotetica iniziale, **tutti i file e metadati sono stati estratti, ispezionati e scaricati localmente**.

### Tabella di Corrispondenza delle Cartelle Condivise

| Cartella Drive | Titolo Ufficiale Drive | Contenuto Effettivo | Quantità & Formato | Cartella Locale |
|---|---|---|---|---|
| **Cartella 1** (`1wh5fJ...`) | **Testimonianze** | Video-testimonianze orizzontali e verticali di clienti reali | 6 video MP4 (da 5 MB a 26 MB) + 6 miniature generate | `assets/social-proof/videos/` |
| **Cartella 2** (`1jHGrm...`) | **screen** | Screenshot autentici conversazioni chat WhatsApp con evidenziazioni + Sottocartella **recensione** con le schede grafiche dei clienti nominati nel copy | 14 PNG chat + 8 schede recensione con foto e testo integrale | `assets/social-proof/chats/`<br>`assets/social-proof/reviews/` |
| **Cartella 3** (`1XmdtQ...`) | **Bolza** | Fotografie professionali di Andrea Bolzan in gesti iconici di mobilità e forza a corpo libero (Milano & natura) | 5 JPG ad altissima risoluzione | `assets/andrea/` |

---

## 2. Inventario Dettagliato dei File

### 2.1 Cartella 3: "Bolza" (Andrea Bolzan)
- **`IMG_7648.JPG`** (4.6 MB — ID: `1Xagbv25DzeoQerhQGOcRR1oJpaxkYzup`): Verticale a una mano su prato verde con cielo limpido. Integrata come **poster del riquadro Video VSL** nella Sezione 1 (Hero).
- **`IMG_7649.JPG`** (1.3 MB — ID: `15UxBgSMf4rUVGcLQ1u8ga7bRiZdZhSaW`): Verticale a una mano sui binari del tram a Milano (orientamento verticale). Integrata nella **Sezione 12 (Chi è Andrea Bolzan)**.
- **`IMG_7650.JPG`** (1.3 MB — ID: `1nbRD4GwrL9v_nMAIfZ2SLKmaR1JoDMca`): Ponte completo (bridge) con sfondo Castello Sforzesco / Parco Sempione.
- **`IMG_7651.JPG`** (1.1 MB — ID: `1eRM85m9_xPp1lTT2uyPiWnCRfwwZObrh`): Accosciata / pistol squat dinamico con distensione gamba su muretto.
- **`IMG_7652.JPG`** (1.9 MB — ID: `1ilx4y0i0kNj7LfHllFx6aMVWS-l7xIc0`): Peacock / planche freeze a una mano davanti all'Arco della Pace a Milano.

### 2.2 Cartella 2: "screen" e Sottocartella "recensione"
#### A) Schede Recensioni Clienti (`screen/recensione` - ID: `1NNwaqOviLcjahV278L02LetO2m4OPeIi`)
Queste schede grafiche contengono foto del cliente, nome, età, professione e testo integrale della testimonianza. Corrispondono esattamente ai clienti citati nel copy ufficiale (`brief/copy.md`):
1. **`Lucia Orlando.jpg`** (ID: `1ocuUX0qi9Jc_F-pi2c67_E7HxVrZUhOf`): Lucia Orlando, 65 anni — Pensionata.
2. **`Andrea Ferrari.jpg`** (ID: `1jcKX8X36HhDDB2Y97budf4U7RVzPM5oC`): Andrea Ferrari, 38 anni — Managing Director (recupero infortunio schiena).
3. **`Michele Vicari.jpg`** (ID: `1GvOJHW68oK2J8UuLnD-WUnry6Y_oyO6K`): Michele Vicari, 43 anni — Direttore Creativo (sblocco della verticale dopo anni di yoga).
4. **`Luca Timpani.jpg`** (ID: `1wcFBWAbxx0SwJ_HuzdhuC_OpyIdb_12p`): Luca Timpani, 38 anni — Commerciale (eliminazione rigidità e dolori cronici).
5. **`Monica Gavillucci.jpg`** (ID: `1ZF4URLsENQtTVO-2J4zaueNGlqHVUXO-`): Monica Gavillucci, 52 anni — Personal Trainer (rapporto umano ed empatia).
6. **`Luca Ugolini.jpg`** (ID: `1iwZaeWmIMqAmDAtmH7_Ll1KAdtVxU2df`): Luca Ugolini, 34 anni — Impiegato (citato nel copy della Sezione 6 - Il Punto Zero).
7. **`Dario Parodi.jpg`** (ID: `1GyJVrJvDfnts0Vyb-pR_hi0xGxMahcqj`): Dario Parodi, 35 anni — Operations Director (percorso a distanza).
8. **`Katia Lagona.jpg`** (ID: `149Ya-clHOsi-B6nmw2Kv7kUq-jXHHyzP`): Katia Lagona, 56 anni — Impiegata (lavoro sul corpo a 360°).

#### B) Chat WhatsApp (`screen/` - ID: `1jHGrmlWsk1uf4CNwgQTm6N4j1neHyQ-p`)
- 14 screenshot autentici (`chat-1.png` .. `chat-14.png`) con passaggi chiave evidenziati in giallo. I primi 4 sono integrati nello slider responsive della Sezione 3.

### 2.3 Cartella 1: "Testimonianze" (Video MP4)
- **Video 1** (`1B86jpAQdueYDEC6k_z3trq_gBdQT5CJu` — 7 MB): Cliente in camminata all'aperto che racconta la sua esperienza.
- **Video 2** (`1ny4_iebo_z0kETrKlOzpFEcmrzkzQAGJ` — 26.2 MB): Cliente donna che descrive il miglioramento articolare.
- **Video 3** (`18BwI9imqQ7xUr8pNMh22ifTeY8Phqeqp` — 14.9 MB): Cliente uomo in canottiera a terra che descrive il recupero.
- **Video 4** (`1EM8D8JaJ8pwYGOCiU5un8l9PawnjGrKn` — 14.6 MB): Cliente con berretto rosso e occhiali (Michele Vicari).
- **Video 5** (`1WS1MJorPInZS5KKGa6dTKzfFvev9XMRx` — 6.3 MB): Cliente donna in home gym con spalliera svedese.
- **Video 6** (`1jVlMSxyMnuzRJ5klryHleqjZAcEl4S9l` — 5.4 MB): Cliente seduto a gambe incrociate sul divano che racconta i progressi.

---

## 3. Matrice di Integrazione nella Sales Page

| Sezione | Elemento HTML | Asset Assegnato | Origine Asset | Stato |
|---|---|---|---|---|
| **Sez. 1 (Hero)** | Riquadro VSL (`.ab-vsl-card`) | `assets/andrea/IMG_7648.jpg` | Folder Bolza | **INTEGRATO** con overlay scuro e pulsante play |
| **Sez. 3 (Prova Sociale)** | Card Lucia (`.ab-proof-card--featured`) | `assets/social-proof/reviews/Lucia Orlando.jpg` | Folder screen/recensione | **INTEGRATO** (sostituisce i 2 placeholder vuoti) |
| **Sez. 3 (Prova Sociale)** | Card Andrea Ferrari | `assets/social-proof/reviews/Andrea Ferrari.jpg` | Folder screen/recensione | **INTEGRATO** (sostituisce l'indicazione `[ASSET DA RECUPERARE]`) |
| **Sez. 3 (Prova Sociale)** | Card Michele Vicari | `assets/social-proof/reviews/Michele Vicari.jpg` | Folder screen/recensione | **INTEGRATO** (sostituisce `[CONTENUTO DA INTEGRARE]`) |
| **Sez. 3 (Prova Sociale)** | Card Luca Timpani | `assets/social-proof/reviews/Luca Timpani.jpg` | Folder screen/recensione | **INTEGRATO** (scheda completa) |
| **Sez. 3 (Prova Sociale)** | Card Monica Gavillucci | `assets/social-proof/reviews/Monica Gavillucci.jpg` | Folder screen/recensione | **INTEGRATO** (scheda completa con foto) |
| **Sez. 3 (Prova Sociale)** | Chat Slider (4 card) | `assets/social-proof/chats/chat-1.png` .. `chat-4.png` | Folder screen | **INTEGRATO** (sostituisce i placeholder SVG vuoti) |
| **Sez. 12 (Bio Andrea)** | Ritratto Bio (`.ab-bio-photo-card`) | `assets/andrea/IMG_7649.jpg` | Folder Bolza | **INTEGRATO** (sostituisce il box avatar SVG) |

---

## 4. Architettura GoHighLevel & CDN Automatico

### La Sfida Risolta dei Percorsi Relativi
Su GoHighLevel, i file incollati nel blocco Custom Code vengono eseguiti su domini cloud (`app.gohighlevel.com` o il custom domain del funnel). Un percorso relativo come `src="assets/andrea/IMG_7649.jpg"` risulterebbe rotto online.

### Soluzione Implementata in `build-ghl.js`
Il file di build `build-ghl.js` contiene una mappa automatica (`CDN_MAP`) che riscrive tutti i percorsi locali `assets/...` negli indirizzi CDN ad altissima velocità di Google Drive (`https://lh3.googleusercontent.com/d/FILE_ID=s800` o `=s1200`):
1. **In locale (`index.html`)**: Vengono usati i file fisici scaricati nella cartella `assets/` (funziona anche offline).
2. **Per GoHighLevel (`highlevel-paste.html`)**: La compilazione `node build-ghl.js` sostituisce automaticamente tutti i link con i corrispondenti CDN globali Google.
3. **Risultato**: Quando il codice di `highlevel-paste.html` viene incollato su GoHighLevel, **tutte le immagini si vedono istantaneamente senza doverle caricare a mano nella Media Library di GHL**.

---

## 5. Stato di Verifica e Prossimi Step Facoltativi

- **Automated Tests**: Il test suite `node test-verify-all.js` supera tutti i controlli (1 solo H1, 10 checkout links, 4 WhatsApp links, 0 selettori CSS non scoped, tutte le 17 sezioni presenti, 0 testi inventati).
- **Prossimi Step per Qiu / Andrea**:
  1. Se si desidera rendere cliccabili i video delle testimonianze (MP4), è possibile collegare un popup video con i link di preview di Google Drive (`https://drive.google.com/file/d/FILE_ID/preview`).
  2. Le sezioni 9 (Mappa del Movimento) e 10 (Le 5 Destinazioni) mantengono i placeholder grafici previsti, pronti per accogliere il PDF reale della Mappa e clip dedicate dei 5 movimenti quando verranno forniti.
