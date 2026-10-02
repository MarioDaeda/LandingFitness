# Project Context & AI Agent Guidelines — Landing Fitness (Andrea Bolzan)

> **Documento di Contesto Ufficiale per LLM e Sviluppatori** (Claude, ChatGPT, Gemini, Cursor, Copilot, DeepSeek, ecc.).  
> Questo documento racchiude il 100% del contesto commerciale, architetturale, tecnico e normativo della landing page "Check-up di Mobilità". Leggilo prima di apportare qualsiasi modifica.

---

## 1. Identità del Progetto & Modello di Business

- **Professionista**: **Andrea Bolzan** — Insegnante di Movimento e Mobilità articolare (Milano). Kinesiologo, ex agonista; ha vissuto in prima persona il recupero funzionale, il blocco della schiena e la riabilitazione attraverso il movimento adattivo e la biomeccanica naturale.
- **Servizio Offerto**: **"Check-up di Mobilità"**
  - **Cosa include**: 
    1. Due appuntamenti 1:1 online su Zoom (il primo di analisi biomeccanica e anamnesi posturale, il secondo di restituzione guidata).
    2. Valutazione completa dei pattern motori e delle catene miofasciali.
    3. Consegna della **Mappa del Movimento** personale e personalizzata (documento diagnostico d'azione).
    4. Primi esercizi correttivi su misura per iniziare subito lo sblocco in sicurezza.
- **Offerta Commerciale & Pricing**:
  - **Prezzo Promozionale**: **57 €** (invece del valore reale di listino di 150 €).
  - **Garanzia di Valore / Incentivo sul Percorso**: **150 € di credito integrale** applicabili sull'eventuale percorso di coaching successivo. Il Check-up è a "rischio zero" per il cliente intenzionato a continuare.
  - **Scarcity & Posti**: Massimo 6 posti al mese a causa della natura individuale dei 2 appuntamenti 1:1 da 60 minuti. Copy pulito e rigoroso: *"Disponibilità limitata a 6 check-up al mese per garantire il tempo dedicato a ciascuna Mappa"*. Vietati countdown fasulli con date non impostate o trattini `--:--:--`.
- **Target di Riferimento**:
  - Uomini e donne over 30/40 che provano rigidità mattutina, tensioni articolari a schiena, anche, spalle o ginocchia.
  - Persone che fanno già attività fisica (palestra, yoga, corsa, trekking, arrampicata) ma sentono un "blocco invisibile" che limita le prestazioni o provoca infiammazioni recidivanti.
- **Tono di Voce e Deontologia (Norme Rigide)**:
  - Tono scientifico, calmo, autorevole, empatico, sobrio ed editoriale.
  - ❌ **VIETATO**: Toni urlati da "fitness bro", promesse di trasformazioni miracolose, countdown con finta urgenza, e soprattutto **claim diagnostico-terapeutici o promesse di guarigione clinica**.
  - **Disclaimer Medico Obbligatorio**: Il Check-up di Mobilità non è una visita medica, non formula diagnosi patologiche e non si sostituisce a ortopedici, fisioterapisti o medici specialisti. In fase acuta di infortunio o post-operatoria il cliente viene reindirizzato a un medico.

---

## 2. Piattaforma Target: GoHighLevel (GHL) Custom Code Element

La pagina è ingegnerizzata per essere inserita all'interno di un blocco **Custom JS/HTML (Custom Code)** in **GoHighLevel**. Ciò impone vincoli architetturali non negoziabili:

| File | Ruolo Architetturale | Regola di Modifica |
|---|---|---|
| [`index.html`](file:///c:/Users/MARIO/Downloads/Landing/index.html) | Sorgente HTML semantico standalone. Usa asset locali in `assets/`. | Modificare questo file per variazioni di markup o struttura. |
| [`styles.css`](file:///c:/Users/MARIO/Downloads/Landing/styles.css) | Foglio di stile isolato con namespace rigoroso `#ab-mobility-checkup`. | Modificare questo file per stili, variabili e animazioni. |
| [`script.js`](file:///c:/Users/MARIO/Downloads/Landing/script.js) | Logica client-side incapsulata in IIFE (accordion FAQ, slider, sticky CTA, tracking). | Modificare questo file per interazioni e gestione eventi. |
| [`build-ghl.js`](file:///c:/Users/MARIO/Downloads/Landing/build-ghl.js) | Compilatore Node.js: inietta CSS/JS ed esegue il remapping automatico degli asset verso Google Drive CDN. | Eseguire con `node build-ghl.js` per generare il deliverable finale. |
| [`highlevel-paste.html`](file:///c:/Users/MARIO/Downloads/Landing/highlevel-paste.html) | **Deliverable Finale per GoHighLevel** (CSS inline + HTML + JS inline). | **NON MODIFICARE A MANO**: generato automaticamente da `build-ghl.js`. |
| [`test-verify-all.js`](file:///c:/Users/MARIO/Downloads/Landing/test-verify-all.js) | Suite di test automatizzata (oltre 90 asserzioni di conformità). | Eseguire sempre con `node test-verify-all.js` (gate bloccante prima di commit/push). |

---

## 3. Invarianti Architetturali Tassativi (Non Violare Mai)

1. **Zero Tag Root in `highlevel-paste.html`**:
   - Assoluto divieto di tag `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`.
   - L'intero blocco deve essere confinato all'interno del container radice: `<div id="ab-mobility-checkup">...</div>`.
2. **Isolamento CSS al 100% (CSS Scoping)**:
   - Ogni singola regola CSS deve iniziare con `#ab-mobility-checkup` (es. `#ab-mobility-checkup .ab-btn`).
   - Nessun selettore globale su elementi nativi (`body`, `a`, `h1`, `p`, `*`).
   - **GHL Theme Isolation**: Per prevenire l'ereditarietà di stili tipografici aggressivi da GoHighLevel (es. `text-transform: uppercase`, tracking deformato), tutti gli heading `h1`, `h2`, `h3`, titoli ponte e titoli card hanno reset scoped espliciti: `text-transform: none; letter-spacing: normal;` (o calibrato a `-0.025em`).
3. **Gerarchia Tipografica e Singolo `<h1>`**:
   - Esattamente un solo tag `<h1>` in tutta la pagina, collocato nella sezione Hero.
4. **Incapsulamento Script & Prevenzione Collisioni su Re-render GHL**:
   - Il codice JavaScript in `script.js` deve essere rigorosamente racchiuso in una **IIFE** (`(function () { ... })();`).
   - Nessuna variabile (es. `AB_CONFIG`) deve essere dichiarata nel `global scope` (tramite `const` o `let` top-level), altrimenti il re-render di GoHighLevel genererebbe l'errore bloccante: `Uncaught SyntaxError: Identifier 'AB_CONFIG' has already been declared`.
5. **Asset & Remapping CDN Automatico (Zero Percorsi Relativi in GHL)**:
   - Nel deliverable GHL non devono esistere percorsi relativi (`src="assets/..."`), poiché sui domini GoHighLevel risulterebbero 404 rotti.
   - `build-ghl.js` riscrive ogni asset locale nel rispettivo URL CDN Google Drive ad alta velocità (`https://lh3.googleusercontent.com/d/FILE_ID=s800` o `=s1200`).
6. **Preservazione dei Parametri di Tracking (UTM & Ads)**:
   - La funzione `appendQueryParams()` propaga in modo trasparente tutti i parametri query dell'URL sorgente (`utm_source`, `utm_medium`, `utm_campaign`, `fbclid`, `gclid`, ecc.) a tutte le CTA checkout e WhatsApp.
   - La funzione rispetta i frammenti hash `#` (non li corrompe se non ancora configurati) e concatena i parametri ai link WhatsApp preservando il parametro `text=...`.
7. **Safe Fallback Countdown**:
   - La barra sticky superiore e il box countdown nell'offerta sono impostati a livello CSS nativo su `display: none;`. Vengono mostrati via JavaScript solo se `AB_CONFIG.deadlineISO` è configurata con una data valida e futura. Se vuota, non viene mostrato alcuno spazio vuoto né timer a zero.
8. **Pulizia Totale del Contenuto (Zero Placeholder Residui)**:
   - Nessun placeholder residuo consentito: zero `[ASSET: ...]`, zero `[DATI FISCALI]`, zero `[PRIVACY]`, zero `[TERMINI]`, zero `[COOKIE]`, zero `"X su 6"`.

---

## 4. Decisioni Visive, Fotografiche e di Copy

1. **Hero VSL: Copertina Fotografica Autentica**:
   - Utilizzo della fotografia ad alto impatto `IMG_7648.jpg` (Andrea Bolzan in verticale a una mano su prato verde).
   - Rapporto d'aspetto proporzionato a 3:2 (`padding-bottom: 66.625%`).
   - **Nessun finto pulsante play** (no play button SVG sovrapposto ingannevole) e nessun finto `aria-label="Video di presentazione"`: è presentata come copertina visiva editoriale di presentazione.
2. **Destinazioni di Movimento Reali (Sezione 10)**:
   - Foto reali di Andrea Bolzan integrate (`IMG_7651.jpg` per l'accosciata/squat, con collegamenti a `IMG_7652.jpg` per handstand e `IMG_7650.jpg` per bridge in `build-ghl.js`).
3. **Ritratto Bio Autentico (Sezione 12)**:
   - Fotografia `IMG_7649.jpg` (verticale sui binari del tram a Milano) con rapporto d'aspetto verticale calibrato a 2:3 (`width="1065" height="1600"`), con `alt` descrittivo ed empatico.
4. **Casi Studio e Social Proof Veritiera (Sezione 3)**:
   - Foto e recensioni reali: Lucia Orlando (65 anni), Andrea Ferrari (38 anni), Michele Vicari (43 anni), Luca Timpani (38 anni), Monica Gavillucci (52 anni, dimensioni native 800x493 anti-CLS).
   - Screenshot WhatsApp reali (`chat-1.png` a `chat-4.png`) con dimensioni fedeli 4:5 (280x350px).
   - Nessuna recensione inventata o citazione clinica fittizia.

---

## 5. Mobile-First CRO & Viewport Engineering

Oltre il 78% del traffico su questa tipologia di funnel proviene da smartphone. Sono stati applicati pattern ingegneristici avanzati:

1. **Sticky Bottom CTA Bar (Thumb-Zone Optimization)**:
   - Altezza touch target calibrata a **52px** con larghezza estesa (`max-width: 480px`).
   - Micro-copy persuasiva ad alta specificità: **`Blocca il Check-up · 57 €`**.
   - Feedback tattile su pressione: `:active { transform: scale(0.98); }`.
   - Supporto Safe-Area iOS (home bar iPhone):  
     `padding-bottom: calc(10px + constant(safe-area-inset-bottom, 0px));`  
     `padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));`
   - Accelerazione hardware GPU: `will-change: transform, opacity;`.
   - **IntersectionObserver Resiliente con Mappatura a Stati (Map-based tracking)**:
     - Monitora con `threshold: 0` la hero (`.ab-hero`), la card offerta (`.ab-pricing-card` / `#ab-sezione-offerta`) e il footer (`#ab-footer`).
     - Tiene traccia dello stato di visibilità di ciascun elemento tramite una `Map`.
     - Risolve il classico bug di scroll: quando l'utente supera l'offerta e legge le FAQ, la sticky CTA riappare prontamente per riagganciare la conversione, ritirandosi solo al footer.
2. **Layout Peek-Ahead (84% Card + 16% Anteprima)**:
   - Nello slider delle chat e nella griglia delle testimonianze mobile, ogni card occupa l'**84% della larghezza** (`flex: 0 0 84%; min-width: 84%; max-width: 84%;`).
   - Il 16% rimanente mostra l'inizio della card successiva, fornendo un "affordance" visivo chiaro che invita allo swipe orizzontale.
   - Movimento a **120 FPS** basato su CSS nativo: `scroll-snap-type: x mandatory;`, `-webkit-overflow-scrolling: touch;`, `overscroll-behavior-x: contain;`.
3. **Indicatori Interattivi (Interactive Slider Dots)**:
   - Pallini di navigazione accessibili con `role="button"`, `tabindex="0"` e `aria-label="Vai alla slide X"`.
   - Supporto click e tastiera (`Enter`/`Space`) con `scrollIntoView({ behavior: 'smooth' })`.
   - Calcolo geometrico della slide attiva tramite `getBoundingClientRect()` e aggiornamento sincrono al caricamento delle immagini lazy.
4. **Tipografia Fluida e Prevenzione Auto-Zoom iOS**:
   - `clamp()` matematico per titoli `H1`, `H2`, `H3`.
   - `text-wrap: balance` su tutti gli heading e testi di impatto per eliminare parole orfane.
   - Tutti i campi form hanno `font-size: 16px;` esplicito per prevenire l'ingrandimento indesiderato del viewport da parte di Safari iOS al focus.
5. **Reattività al Tocco**:
   - `touch-action: manipulation;` e `-webkit-tap-highlight-color: transparent;`.
   - Listener globale passivo `touchstart` registrato all'avvio su Safari iOS per consentire l'attivazione immediata degli stati `:active`.

---

## 6. Accessibilità & Contrasti WCAG 2.1 AA

Tutti i token cromatici e i target di tocco rispettano lo standard internazionale WCAG AA:
- **Colore Accento**: `--ab-color-accent: #b8420f;` (rapporto di contrasto $\ge 4.5:1$ sia su sfondo chiaro `#f4f1e9` che su bianco puro `#ffffff`).
- **Colore Disclaimer Footer**: `--ab-color-footer-text: #aab4c4;` (rapporto di contrasto $\ge 4.5:1$ sullo sfondo scuro del footer `#0c1523`).
- **Touch Targets Minimi**: Link nel footer con `min-height: 44px;`, pulsanti CTA con altezza $\ge 48\text{px}$ e $52\text{px}$ per la sticky bar mobile.
- **Supporto Screen Reader**: `role="region"` con etichette ARIA pertinenti su slider e caroselli; immagini decorative con `aria-hidden="true"` e immagini informative con `alt` descrittivi.
- **Rispettoso del Moto Ridotto**: Azzeramento istantaneo di animazioni e transizioni per gli utenti con impostazione di sistema `prefers-reduced-motion: reduce`.

---

## 7. Protocollo di Modifica & Verifica per LLM

Ogni volta che viene effettuata una modifica al progetto:

```powershell
# 1. Modificare i file sorgente appropriati:
#    - HTML: index.html
#    - Stili: styles.css
#    - Logica: script.js

# 2. Ricompilare il deliverable per GoHighLevel:
node build-ghl.js

# 3. Eseguire la suite di verifica completa (tutte le 90+ asserzioni devono passare):
node test-verify-all.js

# 4. Verificare lo stato git:
git status
```
