# Landing Page — Check-up di Mobilità (Andrea Bolzan)

Sales page long-form ad altissima conversione (CRO) progettata per l'integrazione diretta all'interno di un elemento **Custom Code (JS/HTML)** di **GoHighLevel (GHL)**.

---

> ### 🤖 Documentazione Essenziale per Sviluppatori & LLM (Claude, Gemini, ChatGPT, Cursor, Copilot)
> Prima di apportare qualsiasi modifica al codice, al copy o all'architettura, consulta i seguenti documenti di riferimento:
> - 📄 **[`CONTEXT.md`](CONTEXT.md)**: Identità di business, offerta a 57 € (con 150 € di credito), vincoli architetturali GoHighLevel, isolamento CSS e ingegneria mobile CRO.
> - 📜 **[`CHAT_HISTORY_AND_DECISIONS.md`](CHAT_HISTORY_AND_DECISIONS.md)**: Cronistoria completa di tutte le richieste utente, audit multi-agente, validazione dell'audit di Claude e matrice decisionale file per file.
> - 🎨 **[`SKILLS.md`](SKILLS.md)**: Pattern operativi di prompting (`/goal`, `/boost`, `/grilling`, `/plan`, `/browser`), principi ingegneristici `mattpocock-skills` e repository di micro-interazioni ([Transitions.dev](https://transitions.dev), [Make Interfaces Feel Better](https://interfaces.emilkowal.ski), Vaul, Embla).
> - 📸 **[`PLAN-INTEGRAZIONE-FOTO.md`](PLAN-INTEGRAZIONE-FOTO.md)**: Inventario di tutti i file fotografici e video reali Google Drive scaricati e mappati su CDN.
> - 🧪 **[`test-verify-all.js`](test-verify-all.js)**: Suite di collaudo automatizzata con oltre 90 asserzioni deterministiche di qualità e conformità.

---

## 1. Panoramica del Progetto & Offerta Commerciale

- **Professionista**: **Andrea Bolzan** — Kinesiologo e Insegnante di Movimento e Mobilità (Milano).
- **Prodotto**: **Check-up di Mobilità**
  - 2 incontri 1:1 online su Zoom (60 min ciascuno).
  - Valutazione biomeccanica completa e analisi posturale.
  - Consegna della **Mappa del Movimento** personale.
  - Primi esercizi correttivi e guida passo-passo.
- **Prezzo Promozionale**: **57 €** (invece di 150 € listino).
- **Garanzia di Valore**: **150 € di credito integrale** applicabili all'eventuale percorso di coaching successivo.
- **Scarsità Reale**: Massimo 6 check-up al mese (gestione artigianale individuale di ciascuna Mappa).

---

## 2. Struttura del Repository

```text
Landing/
├── CONTEXT.md                    # Documento di contesto e invarianti per LLM/agenti
├── CHAT_HISTORY_AND_DECISIONS.md # Cronologia decisioni, audit multi-agente e matrice file
├── SKILLS.md                     # Pattern slash (/goal, /boost...), design system e repo
├── README.md                     # Questa guida per sviluppatori e operatori
├── PLAN-INTEGRAZIONE-FOTO.md     # Inventario e mapping CDN foto/video reali
├── QA-REPORT.md                  # Report del primo audit di conformità del copy
├── CONTENT-NOTES.md              # Note su copy, claim medici e condizioni commerciali
├── index.html                    # Sorgente HTML semantico standalone (asset locali)
├── styles.css                    # Foglio di stile scoped con namespace #ab-mobility-checkup
├── script.js                     # Logica client-side incapsulata in IIFE (zero global scope)
├── build-ghl.js                  # Compilatore Node.js: iniezione CSS/JS e mapping CDN Drive
├── test-verify-all.js            # Suite di test automatizzata (90+ asserzioni)
├── highlevel-paste.html          # DELIVERABLE FINALE AUTOSUFFICIENTE PER GOHIGHLEVEL
├── design-system.html            # Style tile con token visivi, bottoni e varianti
└── assets/                       # Asset multimediali reali locali (foto, chat, recensioni)
    ├── andrea/                   # Foto reali di Andrea Bolzan (IMG_7648 - IMG_7652)
    └── social-proof/             # Screenshot chat WhatsApp reali e schede recensione
```

---

## 3. Gestione dei Branch Git

Il repository adotta una strategia a due rami principali:

- **`main`**:
  - Ramo stabile di produzione. Contiene la versione collaudata della landing page, perfettamente funzionante e pronta per l'ambiente GoHighLevel.
- **`feature/mobile-optimization`**:
  - Ramo con le ultime ottimizzazioni avanzate di **Mobile-First CRO & Viewport Engineering**:
    - Sticky bottom CTA bar ergonomica per il pollice (52px, micro-copy *"Blocca il Check-up · 57 €"*, safe-area insets con `constant()` + `env()`, feedback elastico `:active`).
    - IntersectionObserver avanzato basato su `Map` che nasconde la sticky CTA sulla card offerta e la fa ricomparire automaticamente nella sezione FAQ.
    - Layout slider peek-ahead (84% larghezza card + 16% anteprima visiva) a 120 FPS nativi con `scroll-snap-type: x mandatory`.
    - Indicatori slider interattivi con `role="button"` e supporto navigazione da tastiera.
    - Prevenzione dell'auto-zoom Safari iOS (input a 16px).
    - Suite di test estesa a oltre 90 controlli deterministici.

---

## 4. Flusso di Lavoro dello Sviluppatore

Tutte le modifiche devono essere apportate ai file sorgente e compilate tramite la pipeline automatizzata:

```powershell
# 1. Modifica i file sorgente appropriati:
#    - index.html (struttura e testi)
#    - styles.css (stili grafici e animazioni)
#    - script.js (logica interattiva ed eventi)

# 2. Compila il deliverable per GoHighLevel:
node build-ghl.js

# 3. Esegui la suite di test automatizzata (deve dare 0 errori):
node test-verify-all.js

# 4. Verifica lo stato git e committa con messaggi convenzionali:
git status
git commit -m "feat/fix/docs: descrizione chiara"
```

---

## 5. Come Incollare la Landing in GoHighLevel

Il deliverable finale autosufficiente è **`highlevel-paste.html`**.

### Istruzioni Passo-Passo nel Funnel Builder di GHL:
1. Accedi al builder della pagina o del funnel in **GoHighLevel**.
2. Aggiungi una **Sezione a larghezza intera (Full Width Section)**.
3. All'interno della sezione, aggiungi una **Riga a 1 colonna (1 Column Row)**.
4. Inserisci l'elemento **Custom JS/HTML (Custom Code)**.
5. Clicca sull'elemento e seleziona **Open Code Editor**.
6. Apri il file `highlevel-paste.html` con un editor di testo, copia tutto il codice e incollalo nell'editor di GHL.
7. Clicca su **Yes, Save** nell'editor di codice, quindi salva la pagina (**Save**) in alto a destra e apri l'anteprima (**Preview**).

> **Nessun caricamento manuale di immagini necessario:** grazie alla pipeline di `build-ghl.js`, tutte le immagini puntano già ai server CDN diretti di Google Drive ad alta velocità (`https://lh3.googleusercontent.com/d/...`).

---

## 6. Configurazione Parametri Commerciali (`AB_CONFIG`)

All'inizio dello `<script>` in `highlevel-paste.html` (e in `script.js`) è presente l'oggetto di configurazione centrale:

```javascript
const AB_CONFIG = {
  checkoutUrl: "#CHECKOUT_URL", // 1. URL effettivo del checkout Stripe / GHL
  whatsappUrl: "#WHATSAPP_URL", // 2. Link WhatsApp con messaggio preimpostato
  deadlineISO: "",             // 3. Scadenza ISO (es. "2026-10-31T23:59:59"). Lasciare vuoto se non attiva
  promoPrice: "57 €",          // 4. Prezzo promozionale mostrato
  regularPrice: "150 €",        // 5. Prezzo di listino barrato
  availableSpots: "6 al mese",  // 6. Indicatore posti disponibili
  enableAnimations: true,       // 7. Abilita/disabilita animazioni
  enableStickyCta: true         // 8. Abilita/disabilita sticky bar su smartphone
};
```

### 6.1 Sostituzione `#CHECKOUT_URL`
- Sostituisci `"#CHECKOUT_URL"` con l'URL della pagina d'ordine (es. `"https://checkout.andreabolzan.it/checkup"`).
- Tutti i 10 pulsanti d'acquisto si aggiorneranno istantaneamente, preservando i parametri di tracciamento (UTM, `fbclid`, Google Ads).

### 6.2 Sostituzione `#WHATSAPP_URL`
- Sostituisci `"#WHATSAPP_URL"` con il link diretto di Andrea Bolzan:  
  `"https://wa.me/393400000000?text=Ciao%20Andrea,%20vorrei%20informazioni%20sul%20Check-up%20di%20Mobilit%C3%A0"`

### 6.3 Gestione del Countdown (`deadlineISO`)
- **Se l'offerta ha una data di termine precisa**: imposta la data ISO (es. `"2026-10-31T23:59:59"`). La barra superiore e il riquadro nell'offerta calcoleranno automaticamente il tempo rimanente.
- **Se non è prevista una scadenza a tempo**: lascia la stringa vuota (`""`). La barra superiore e il box timer rimarranno rigorosamente nascosti via CSS, garantendo massima trasparenza e zero urgenza ingannevole.

---

## 7. Conformità e Garanzie di Qualità

- **Zero Root Tags**: Nessun `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` in `highlevel-paste.html`.
- **CSS Scoping al 100%**: Zero interferenze con la dashboard o il tema globale di GoHighLevel.
- **WCAG 2.1 AA Compliant**: Contrasti cromatici $\ge 4.5:1$ per testi e pulsanti; touch targets $\ge 44\text{px}$ / $52\text{px}$.
- **Zero Dipendenze Bloccanti**: Funzionamento garantito al 100% anche senza JavaScript o con connessioni degradate.
- **Rispetto di `prefers-reduced-motion`**: Transizioni e animazioni disattivate per gli utenti che richiedono movimento ridotto.
