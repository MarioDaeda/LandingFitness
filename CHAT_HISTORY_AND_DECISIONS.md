# Cronistoria delle Decisioni & Audit Tecnico — Landing Check-up di Mobilità

> **Registro Completo delle Decisioni Tecniche, dell'Evoluzione del Progetto e della Validazione Multi-Agente**  
> Destinato a sviluppatori e LLM (Claude, ChatGPT, Gemini, DeepSeek, Cursor) per comprendere l'intera genealogia del codice, il "perché" dietro ogni riga e i risultati dei test di verifica.

---

## 1. Executive Summary

La sales page per il **"Check-up di Mobilità"** di Andrea Bolzan è un progetto di ingegneria frontend ad alta conversione (CRO) vincolato all'architettura **Custom Code di GoHighLevel (GHL)**. 

Dalla concezione iniziale al rilascio finale ottimizzato per mobile, il progetto è passato attraverso 7 milestone principali, audit incrociati e verifiche avversariali. Il risultato è un codice a zero dipendenze esterne bloccanti, conforme alle WCAG 2.1 AA, isolato al 100% da GoHighLevel e coperto da una suite di collaudo automatizzata con oltre 90 asserzioni deterministiche.

---

## 2. Cronologia Dettagliata delle Milestone e Richieste

### Milestone 1: Ingestione del Brief e Definizione Architetturale
- **Input**: `brief/copy.md`, note del committente, requisiti commerciali (servizio di kinesiologia e mobilità a Milano/Zoom).
- **Architettura a 17 Sezioni**:
  - `0`: Barra Offerta Sticky (countdown condizionato)
  - `1`: Hero (Value prop, H1 unica, VSL, CTA, WhatsApp)
  - `2`: Quello che il Check-up mostra (7 rivelazioni)
  - `3`: Prova Sociale Iniziale (Casi studio e slider chat)
  - `4`: Ti riconosci? (6 scenari di rigidità)
  - `5`: Ponte Aspirazionale (Pausa emotiva ad alto contrasto)
  - `6`: Il Punto Zero (Analisi biomeccanica, citazione Ugolini)
  - `7`: Movimento Adattivo (Metodologia scientifica)
  - `8`: Come Funziona (I 3 step trasparenti)
  - `9`: Mappa del Movimento (Fulcro tangibile dell'offerta)
  - `10`: Destinazioni di Movimento (Applicazione pratica: verticale, squat, pike...)
  - `11`: Perché una Destinazione (Sezione autonoma con visual pathway)
  - `12`: Chi è Andrea Bolzan (Autorevolezza, credibilità, ritratto)
  - `13`: Fa per te? (Qualificazione Sì/No, disclaimer medico)
  - `14`: Offerta Commerciale (Prezzo 57 €, credito 150 €, stack valore)
  - `15`: FAQ (Accordion interattivo con fallback `<details>`)
  - `16`: Chiusura & Footer (Note deontologiche e legali)

### Milestone 2: Il Primo Audit di Qualità e Rimozione Testi Inventati (`QA-REPORT.md`, Commit `961b35a`)
- **Problema Rilevato**: Una precedente bozza generata conteneva violazioni deontologiche:
  - Finti messaggi WhatsApp inventati per lo slider della Sezione 3.
  - Frasi inventate attribuite ad Andrea riguardo al percorso di Lucia e alla verticale di Timpani/Vicari.
  - Testo promozionale non documentato in Sezione 8: *"Nessun algoritmo o scheda precompilata"*.
  - La top bar countdown appariva con `--:--:--` se la data non era impostata.
  - Su smartphone, il video VSL era posizionato dopo la CTA per via di un contenitore flex rigido.
  - La Sezione 11 ("Perché una destinazione") era stata erroneamente annegata nella Sezione 10.
- **Interventi Risolutivi**:
  - Rimozione di qualsiasi invenzione: ripristino letterale del copy ufficiale o di placeholder strutturati (`[ASSET: ...]`).
  - Impostazione di `display: none` di default a livello CSS per la top-bar e il box offerta (safe fallback opt-in via JS).
  - Utilizzo di `display: contents` su mobile (<992px) nella hero con proprietà `order` semantiche (VSL posizionato prima della CTA).
  - Separazione della Sezione 11 in una `<section id="ab-perche-destinazione">` autonoma con percorso visivo stilizzato.

### Milestone 3: Download Asset Reali & Remapping CDN Automatico (`PLAN-INTEGRAZIONE-FOTO.md`, Commit `9c91fd4`)
- **Scoperte da Google Drive**: Qiu ha fornito 3 cartelle Drive contenenti materiale reale:
  - Cartella *Bolza*: 5 fotografie originali ad alta risoluzione di Andrea Bolzan (`IMG_7648.jpg` a `IMG_7652.jpg`).
  - Cartella *screen*: 14 screenshot autentici di chat WhatsApp e 8 schede recensioni complete (Lucia Orlando, Andrea Ferrari, Michele Vicari, Luca Timpani, Monica Gavillucci, Luca Ugolini, Dario Parodi, Katia Lagona).
  - Cartella *Testimonianze*: 6 video-testimonianze reali in MP4.
- **La Soluzione per GoHighLevel**:
  - Un blocco Custom Code incollato su GHL non ha accesso a percorsi relativi (`assets/...`).
  - Creazione del compilatore Node.js `build-ghl.js` dotato di una tabella `CDN_MAP`. Il compilatore legge `index.html`, inietta CSS e JS, e sostituisce ogni path relativo con il rispettivo URL CDN Google Drive (`https://lh3.googleusercontent.com/d/FILE_ID=s800` o `=s1200`), rendendo la pagina autonoma e pronta per GHL.

### Milestone 4: Copertina Fotografica Hero, Destinazioni e Bonifica Placeholder (Commit `5aa73d6`)
- **Decisione sulla Hero VSL**:
  - Sostituzione del placeholder video generico con la potente foto `IMG_7648.jpg` (verticale su prato verde).
  - **Eliminazione del finto pulsante play**: sovrapporre un pulsante play a una foto fissa inganna l'utente inducendolo a cliccare a vuoto, aumentando il bounce rate.
  - Rimozione delle etichette ARIA ingannevoli (`aria-label="Video di presentazione..."`).
- **Destinazioni di Movimento**:
  - Integrazione di `IMG_7651.jpg` (accosciata su muretto) nella Sezione 10.
- **Bonifica Completa dei Placeholder**:
  - Eliminazione di tutti i residui `[ASSET: ...]`, `[DATI FISCALI]`, `[PRIVACY]`, `[TERMINI]`, `[COOKIE]` e `"X su 6"`.

### Milestone 5: Validazione dell'Audit di Claude e Hardening (Commit `47e8ed5`)
Un audit esterno di Claude aveva sollevato rilievi sul codice. È stata eseguita una validazione multi-agente:
- **Rilievi Confutati (False Claims)**:
  - *Asserzione di selettori non scoped*: Lo scanner AST ha confermato che il 100% dei selettori CSS è confinato dentro `#ab-mobility-checkup`.
  - *Asserzione di sezioni mancanti*: Tutte le 17 sezioni sono presenti e strutturate nel markup.
- **Rilievi Accolti e Implementati**:
  - *Forwarding dei Parametri di Tracking*: `script.js` aggiornato con la funzione `appendQueryParams()` per propagare in modo trasparente parametri UTM, `fbclid` e Google Ads, gestendo correttamente sia i fallback hash (`#CHECKOUT_URL`), sia i link WhatsApp con messaggi preimpostati (`?text=...`).
  - *GHL Theme Heading Isolation*: Aggiunti reset scoped per heading (`h1`, `h2`, `h3`, titoli bridge e card) con `text-transform: none; letter-spacing: normal;` per impedire al tema di GHL di alterare la tipografia.
  - *Rapporti d'aspetto e CLS*: Specificati `width` e `height` corretti per la card di Monica Gavillucci (800x493), per le chat (280x350 - 4:5), per la hero (ratio 3:2 proporzionato a `IMG_7648.jpg`) e per la bio (2:3 proporzionato a `IMG_7649.jpg`).
  - *Softening Alt Text*: Rimosso il claim clinico *"eliminazione dolori cronici"* dall'alt text della foto di Luca Timpani, sostituito con una formulazione conforme: *"alleviando di molto le rigidità articolari"*.

### Milestone 6: Design System, Tipografia Avanzata e Micro-Interazioni (Commit `e632a1c` a `fbf5733`)
- **Palette Cromatica Blue-Slate**:
  - Colori primari allineati: Canvas chiaro `#f4f1e9`, Surface bianco caldo `#fffdf8`, Dark Slate `#0c1523`, Accento terracotta `#b8420f`.
- **Principi Transitions.dev & Make Interfaces Feel Better (Emil Kowalski)**:
  - Curva ease-out organica: `--ab-ease-out: cubic-bezier(0.16, 1, 0.3, 1)`.
  - Curva elastica: `--ab-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`.
  - Accordion FAQ ad altezza animata via CSS `grid-template-rows: 0fr -> 1fr`.
  - Ombre multistrato realistiche (`--ab-shadow-sm`, `--ab-shadow-md`, `--ab-shadow-lg`) e raggi concentrici armonizzati ($R_{est} = R_{int} + P$).
  - Tipografia avanzata: tracking calibrato, ligature, `font-variant-numeric: tabular-nums` e `text-wrap: balance` per i titoli.

### Milestone 7: Mobile-First CRO, Viewport Engineering & Sticky CTA Resiliente (Commit `e305e43`, `07541fc`)
- **Thumb-Zone Engineering**:
  - Sticky bottom CTA bar per smartphone con altezza touch ottimale di **52px** e micro-copy specifica: **`Blocca il Check-up · 57 €`**.
  - Pieno supporto di iOS safe-area-inset:  
    `padding-bottom: calc(10px + constant(safe-area-inset-bottom, 0px));`  
    `padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));`
  - Feedback tattile immediato `:active { transform: scale(0.98); }` abilitato su Safari mobile tramite listener `touchstart`.
  - Accelerazione GPU via hardware compositing: `will-change: transform, opacity;`.
- **Risoluzione Bug Uscita/Rientro Sticky CTA (IntersectionObserver Map)**:
  - *Bug riscontrato*: Inizialmente la sticky CTA si nascondeva all'ingresso nella card offerta ma non ricompariva più quando l'utente continuava a scrollare verso le FAQ.
  - *Soluzione*: Sostituzione dei flag booleani volatili con una `Map` di tracciamento degli stati di intersezione per ciascun elemento osservato (`offerCard`, `footer`) con `threshold: 0`. Quando la card offerta esce dal viewport verso l'alto (utente nelle FAQ), la sticky CTA riappare prontamente, per poi ritirarsi solo una volta raggiunto il footer.
- **Peek-Ahead Layout e Slider 120 FPS**:
  - Slider chat e testimonianze mobile configurati con card all'**84% della larghezza** e il restante 16% visibile come anteprima della slide successiva (chiaro segnale visivo di swipe).
  - Scroll-snap nativo CSS ad alte prestazioni (`scroll-snap-type: x mandatory`).
- **Indicatori Interattivi (Slider Dots)**:
  - Pallini di scorrimento trasformati in pulsanti interattivi con `role="button"`, `tabindex="0"`, navigazione da tastiera e gestione del click con scorrimento fluido (`scrollIntoView`).
  - Ricalcolo automatico della posizione al completamento del caricamento delle immagini lazy.
- **Protezione da Zoom Safari iOS**:
  - `font-size: 16px` imposto a tutti gli elementi di input/form per prevenire l'auto-zoom sgradito di Safari su iOS al tap.

---

## 3. Matrice Completa delle Decisioni per File

| File | Modifiche Principali | Motivazione Tecnica / Commerciale |
|---|---|---|
| [`index.html`](index.html) | - Singola `<h1>` semantica.<br>- Rimozione fake play button su copertina Hero.<br>- Integrazione asset fotografici reali (`IMG_7648.jpg`, `IMG_7651.jpg`, `IMG_7649.jpg`, recensioni reali).<br>- Dimensioni esplicite `width`/`height` anti-CLS.<br>- Sticky mobile CTA con micro-copy "Blocca il Check-up · 57 €".<br>- 10 link checkout con `data-checkout-link` e 4 link WhatsApp con `data-whatsapp-link`. | - Rispetto semantico HTML5.<br>- Onestà UX e miglioramento conversioni.<br>- Eliminazione del CLS (Cumulative Layout Shift).<br>- Thumb-zone CRO su mobile.<br>- Funnel checkout unificato. |
| [`styles.css`](styles.css) | - 100% regole scoped con `#ab-mobility-checkup`.<br>- Reset scoped per heading (`text-transform: none; letter-spacing: normal;`).<br>- Token WCAG AA (`#b8420f` accento, `#aab4c4` footer).<br>- Token di movimento (Transitions.dev, cubic-bezier ease-out e spring).<br>- Accordion FAQ animato via CSS Grid (`0fr -> 1fr`).<br>- Sticky CTA con safe-area iOS (`constant` + `env`), 52px height e GPU `will-change`.<br>- Peek-ahead layout 84% + 16% con native scroll-snap.<br>- Safe fallback countdown (`display: none` di default).<br>- Prevenzione zoom iOS (input 16px). | - Totale isolamento dal tema e dai fogli di stile globali di GoHighLevel.<br>- Accessibilità WCAG 2.1 AA.<br>- Esperienza utente fluida a 120 FPS.<br>- Zero sfarfallio o countdown a zero prima dell'idratazione.<br>- Usabilità ergonomica su smartphone. |
| [`script.js`](script.js) | - Incapsulamento totale in IIFE (`(function(){...})()`).<br>- `AB_CONFIG` confinata nello scope locale IIFE.<br>- `appendQueryParams()` per inoltro trasparente UTM, Google Ads e parametri WhatsApp.<br>- Sticky CTA con IntersectionObserver basato su `Map` per scomparsa su offerta e ricomparsa affidabile su FAQ.<br>- Slider dots accessibili (`role="button"`, tap, keyboard enter/space).<br>- Ricalcolo posizione slider al caricamento immagini lazy.<br>- Listener `touchstart` passivo per `:active` istantaneo su Safari iOS.<br>- Supporto per `prefers-reduced-motion`. | - Evita errori fatali di ridichiarazione di variabili su re-render o navigazione GHL.<br>- Tracciamento campagne e conversioni accurato.<br>- Massima ergonomia di conversione mobile senza glitch visivi.<br>- Accessibilità universale da tastiera e touch. |
| [`build-ghl.js`](build-ghl.js) | - Estrazione chirurgica del nodo `#ab-mobility-checkup`.<br>- Iniezione di CSS e JS inline.<br>- Riscrizione automatica di tutti i path locali `assets/...` negli indirizzi CDN ad alte prestazioni Google Drive (`https://lh3.googleusercontent.com/d/...`).<br>- Generazione deterministica di `highlevel-paste.html`. | - Risolve il vincolo fondamentale di GoHighLevel: impossibilità di caricare cartelle di asset relativi nel blocco Custom Code. Permette anteprime e produzione istantanee senza upload manuali nella Media Library di GHL. |
| [`test-verify-all.js`](test-verify-all.js) | - Oltre 90 verifiche automatizzate bloccanti (`process.exit(1)` su errore).<br>- Controllo zero tag `<html>`, `<head>`, `<body>`.<br>- Parser AST per confermare 0 selettori CSS non scoped.<br>- Presenza di tutte le sezioni.<br>- Assenza totale di claim inventati o placeholder residui.<br>- Validazione funzionale di `appendQueryParams` con mock di window.<br>- Test contrasti WCAG, touch targets, safe-area iOS, sticky CTA e layout peek-ahead. | - Continuous Integration locale deterministica. Rende impossibile rilasciare regressioni o violare le invarianti architetturali. |
| [`highlevel-paste.html`](highlevel-paste.html) | - Deliverable finale compilato automaticamente.<br>- Singolo wrapper `#ab-mobility-checkup`.<br>- CSS minificato/inlinato.<br>- JS incapsulato in IIFE.<br>- Tutti gli asset puntano a Google Drive CDN. | - Pronto per il copia-e-incolla immediato nell'elemento Custom JS/HTML di GoHighLevel. |

---

## 4. Registro delle Asserzioni di Audit (Accolte vs Confutate)

| Argomento dell'Audit | Asserzione Iniziale / Esterna | Esito Validazione | Rationale e Azione Intrapresa |
|---|---|---|---|
| **Selettori CSS Globali** | "Potrebbero esserci selettori non scoped che influenzano GHL" | **CONFUTATA** (Falso Positivo) | Lo scanner ricorsivo di `test-verify-all.js` analizza ogni token prima di `{`. È stato dimostrato che 0 selettori violano il namespace `#ab-mobility-checkup`. |
| **Integrità Sezioni** | "Alcune sezioni del brief potrebbero mancare" | **CONFUTATA** | Tutte le 17 sezioni (0-16) sono rigorosamente presenti sia nel sorgente che nel compilato. |
| **Finto Pulsante Play Hero** | "Il pulsante play sopra la foto fa sembrare la pagina interattiva" | **ACCOLTA** | Un pulsante play finto è una dark pattern ingannevole. È stato rimosso per lasciare la foto pura con layout proporzionato 3:2. |
| **Reset Tipografici GHL** | "GHL impone text-transform maiuscolo o tracking errato agli heading" | **ACCOLTA** | Aggiunti reset espliciti scoped `#ab-mobility-checkup .ab-title-h1, h2, h3` con `text-transform: none; letter-spacing: normal;`. |
| **Tracking UTM & Hash** | "appendQueryParams sovrascriveva o corrompeva gli hash" | **ACCOLTA** | Riscritto il parser URL per preservare intatti `#CHECKOUT_URL` e `#WHATSAPP_URL` e mantenere i parametri WhatsApp `?text=...`. |
| **Altezza Touch e Safe-Area** | "I bottoni mobile rischiano di sovrapporsi alla barra home di iPhone" | **ACCOLTA** | Implementata safe-area con fallback `constant()` + `env()`, e altezza touch target aumentata a 52px. |
| **Sticky CTA nelle FAQ** | "La barra sticky non riappariva dopo la sezione offerta" | **ACCOLTA** | Sostituita la logica booleana con una `Map` di IntersectionObserver su offerta e footer. La sticky CTA scompare sull'offerta e ricompare subito sulle FAQ. |
| **Slider Dots Accessibili** | "I pallini dello slider non erano cliccabili né accessibili" | **ACCOLTA** | Assegnato `role="button"`, `tabindex="0"`, gestione touch e tastiera con scorrimento fluido. |
| **Countdown Scadenza Offerta** | "Il timer deve contare alla rovescia fino a lunedì alle 23:00" | **ACCOLTA** | Impostata `deadlineISO: "2026-10-05T23:00:00+02:00"` con supporto fallback dinamico `next-monday-23`. Il conto alla rovescia è attivo nella barra sticky e nel box offerta, con `aria-live="polite"` e contrasti rifiniti. |

---

## 5. Stato Attuale e Garanzie di Qualità

- **Automated Test Suite**: **Tutti i 92 test superati (0 errori)**.
- **GoHighLevel Ready**: Il file `highlevel-paste.html` è autonomo, include CDN ad alta velocità, countdown attivo alla rovescia, non soffre di collisioni di variabili globali e garantisce perfetto isolamento stilistico.
