# Direzione Creativa e Tecnica — Landing Check-up di Mobilità (Andrea Bolzan)

## 1. Obiettivo di Comunicazione
1. Rivolto a over 30 che si sentono più rigidi di quanto vorrebbero.
2. Utile anche a chi si allena già senza conoscere il punto di partenza.
3. Non si acquista una scheda generica: si acquistano osservazione, chiarezza, priorità e direzione.
4. Risultato tangibile: la Mappa del Movimento.
5. Due appuntamenti online, analisi personale e primi esercizi.
6. Andrea ha vissuto personalmente il percorso di costruzione della mobilità e la riabilitazione post-blocco schiena.
7. Prezzo promozionale 57 € (anziché 150 €) con credito 150 €; condizioni, scadenza e posti da confermare.
8. Funnel checkout esterno a GHL.

## 2. Concetto Creativo: "Dal Punto Zero alla Direzione"
- Transizione da rigidità/tentativi casuali a osservazione/priorità/Mappa/direzione.
- Metafora centrale: Mappa del Movimento (annotazioni, coordinate sobrie, tappe, priorità).
- No mappe geografiche letterali, no bussole decorative invadenti, no SaaS/GPS, no palestra aggressiva/fitness bro.

## 3. Personalità Visiva
- Umana, competente, editoriale, concreta, personale, dinamica, premium accessibile.
- Evitare: nero puro, verde neon, gradienti blu-viola, card dentro card, icone in quadrati arrotondati ripetitivi, glow.
- Palette:
  - Canvas: `#f4f1e9`
  - Surface: `#fffdf8`
  - Ink: `#17201d`
  - Muted: `#5f6964`
  - Primary: `#1f5848`
  - Primary Hover: `#174638`
  - Accent: `#c96e4b`
  - Line: `rgba(23, 32, 29, 0.14)`
  - Success: `#287558`
  - Danger: `#a74436`

## 4. Vincoli Tecnici e Compatibilità GoHighLevel
- Deliverable finale: `highlevel-paste.html` da incollare in blocco Custom Code.
- Wrapper unico: `#ab-mobility-checkup`.
- CSS con namespace obbligatorio `#ab-mobility-checkup`, prefisso `ab-` su tutte le classi e variabili.
- Nessuna regola globale su tag base (`html`, `body`, `h1`, `p`, `a`, ecc.).
- Nessun build system / React / npm in runtime.
- Inizializzazione singola via `hydrationDone` con fallback su `DOMContentLoaded`.
- Funzionamento completo e leggibile senza JavaScript e senza GSAP.
- FAQ native con `<details>` / `<summary>`.
- Slider chat accessibile con CSS scroll-snap.
- CTA acquisto con `href="#CHECKOUT_URL"` e `data-checkout-link`.
- CTA WhatsApp con `href="#WHATSAPP_URL"` e `data-whatsapp-link`.
- Sticky CTA mobile disattivabile via configurazione `AB_CONFIG`.
