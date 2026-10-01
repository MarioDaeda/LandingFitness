# Landing Page — Check-up di Mobilità (Andrea Bolzan)

Sales page long-form ad alta conversione progettata per l'integrazione diretta all'interno di un elemento **Custom Code / HTML** di **GoHighLevel (GHL)**.

---

## 1. Quale file incollare in GoHighLevel
Il deliverable finale e autosufficiente è:
👉 **`highlevel-paste.html`**

Questo file contiene l'intero blocco di stile CSS con namespace `#ab-mobility-checkup`, l'alberatura HTML semantica e la logica JavaScript. **Non** contiene tag `<html>`, `<head>` o `<body>`.

---

## 2. Dove e come incollarlo in GHL
1. Accedi al builder del funnel o della pagina in **GoHighLevel**.
2. Aggiungi una **Sezione a larghezza intera (Full Width)** e una **Riga a 1 colonna (1 Column Row)**.
3. Inserisci l'elemento **Custom Code / Custom JS/HTML**.
4. Clicca su **Open Code Editor**.
5. Apri il file `highlevel-paste.html` con un editor di testo, copia tutto il contenuto e incollalo nell'editor di GHL.
6. Salva la pagina (**Save**) e visualizza l'anteprima (**Preview**).

---

## 3. Come configurare URL, Prezzi, Scadenze e Posti
Tutte le impostazioni commerciali e tecniche sono raggruppate all'interno dell'oggetto `AB_CONFIG` presente all'inizio del tag `<script>` in `highlevel-paste.html` (e in `script.js`):

```javascript
const AB_CONFIG = {
  checkoutUrl: "#CHECKOUT_URL", // 1. URL checkout / pagamento
  whatsappUrl: "#WHATSAPP_URL", // 2. Link diretto a WhatsApp
  deadlineISO: "",             // 3. Data e ora di scadenza ISO (lasciare vuoto se non attiva)
  promoPrice: "57 €",          // 4. Prezzo promozionale attuale
  regularPrice: "150 €",        // 5. Prezzo di listino barrato
  availableSpots: "X su 6",     // 6. Indicatore posti disponibili
  enableAnimations: true,       // 7. Abilita/disabilita animazioni GSAP
  enableStickyCta: true         // 8. Abilita/disabilita sticky bar su smartphone
};
```

### 3.1 Come sostituire `#CHECKOUT_URL`
- Sostituisci `"#CHECKOUT_URL"` con l'URL effettivo del checkout o della seconda fase del funnel (es. `"https://tuodominio.it/checkout-checkup"`).
- In questo modo tutti i pulsanti primari della sales page punteranno automaticamente alla pagina di pagamento.

### 3.2 Come sostituire `#WHATSAPP_URL`
- Sostituisci `"#WHATSAPP_URL"` con il link diretto al numero WhatsApp di Andrea Bolzan con messaggio preimpostato (es. `"https://wa.me/393330000000?text=Ciao%20Andrea,%20vorrei%20informazioni%20sul%20Check-up%20di%20Mobilit%C3%A0"`).

### 3.3 Come impostare la scadenza (`deadlineISO`)
- **Se l'offerta ha una data di termine precisa**: imposta la data in formato ISO (es. `deadlineISO: "2026-10-31T23:59:59"`). La barra superiore e il timer nella sezione offerta calcoleranno automaticamente ore, minuti e secondi rimanenti.
- **Se non è prevista una scadenza immediata**: lascia `deadlineISO: ""` (stringa vuota). Il sistema nasconderà automaticamente la barra superiore fissa e il riquadro timer nell'offerta, evitando zeri fasulli o falsa urgenza.

### 3.4 Come impostare posti e prezzi
- `promoPrice`: aggiorna se cambia il costo (es. `"67 €"`).
- `regularPrice`: valore di riferimento (es. `"150 €"`).
- `availableSpots`: aggiorna i posti rimasti (es. `"2 su 6"` o `"Ultimi 3 posti"`).

---

## 4. Dove sostituire gli Asset (Immagini e Video)
Tutti gli elementi multimediali sono chiaramente etichettati nel markup HTML:
1. **VSL Hero (Sezione 1)**: Cerca la classe `.ab-vsl-ratio`. Sostituisci il blocco placeholder con il tag `<iframe>` di Vimeo/YouTube/Wistia o video HTML5 con `loading="eager"`.
2. **Foto Prima/Dopo Lucia (Sezione 3)**: Cerca la classe `.ab-before-after` e sostituisci i box `.ab-ba-box` con i tag `<img>` delle foto reali (ottimizzate in formato WebP).
3. **Video Andrea Ferrari (Sezione 3)**: Cerca `ab-proof-card` relativa ad Andrea Ferrari e inserisci il player video.
4. **Mappa del Movimento (Sezione 9)**: Cerca la classe `.ab-map-mockup-wrapper`. Puoi mantenere la card interattiva testuale o incorporare screenshot reali della Mappa con l'etichetta obbligatoria *"Esempio di Mappa"*.
5. **Ritratto di Andrea Bolzan (Sezione 12)**: Cerca `.ab-bio-photo-placeholder` e inserisci l'immagine reale con ratio 4:5 (`<img src="..." alt="Ritratto di Andrea Bolzan">`).

---

## 5. Come testare la pagina in locale
- È sufficiente fare doppio clic su `index.html` per aprire la landing nel browser web preferito.
- Il file `design-system.html` mostra la style tile con tutti i token, bottoni e varianti interattive.
- Per rigenerare `highlevel-paste.html` dopo modifiche a `styles.css` o `index.html`, esegui:
  ```powershell
  node build-ghl.js
  ```

---

## 6. Come disabilitare le animazioni
- Per disattivare le animazioni via configurazione, imposta `enableAnimations: false` in `AB_CONFIG`.
- Il sito rispetta nativamente le impostazioni di sistema dell'utente: se nel sistema operativo è attiva l'opzione **"Riduci movimento" (`prefers-reduced-motion: reduce`)**, tutte le animazioni GSAP e le transizioni CSS vengono istantaneamente azzerate.

---

## 7. Quali dati restano da confermare prima del lancio
Come documentato in `CONTENT-NOTES.md` e `QA-REPORT.md`:
1. **Condizioni del credito di 150 €**: definire le modalità e tempistiche di utilizzo (es. durata del coupon, percorsi a cui è applicabile).
2. **Numero esatto di posti disponibili**: sostituire il placeholder `"X su 6"`.
3. **Scadenza effettiva della promozione**: inserire data ISO o mantenere vuoto.
4. **Dati societari nel Footer**: inserire P.IVA, ragione sociale e link a Privacy/Cookie Policy conformi GDPR.

---

## 8. Subagent e Comandi Slash
I profili dei subagent sono stati predisposti nella cartella `.gemini/agents/`:
- `content-auditor.md`
- `landing-builder.md`
- `quality-auditor.md`

> **Nota per le sessioni future:** se i comandi o gli agenti non risultano ancora registrati nella sessione attiva, eseguire il comando `/agents reload` per caricare le definizioni aggiornate.
