# Piano di Progetto — Architettura e Componenti Landing Check-up di Mobilità

Applicazione principi Impeccable:
- `/impeccable init`: Contesto focalizzato sulla sales page a singola pagina per GoHighLevel, funnel ad alta conversione senza attriti tecnici.
- `/impeccable shape landing`: Gerarchia commerciale orientata alla trasparenza, autorità editoriale e centralità visiva della Mappa del Movimento.

---

## Panoramica Sezioni

| Sez. | Nome Sezione | Ruolo Funnel | Sfondo / Mood |
|---|---|---|---|
| **0** | Barra Offerta Sticky | Urgenza genuina (se deadline attiva) | Scurissimo / Deep Green (`#17201d` / `#1f5848`) |
| **1** | Hero | Value Proposition & Hook visivo VSL | Canvas chiaro (`#f4f1e9`) |
| **2** | Quello che il Check-up ti mostra | Rivelazione & Gap di consapevolezza | Surface bianco caldo (`#fffdf8`) |
| **3** | Prova Sociale Iniziale | Autorevolezza & Casi studio reali | Canvas chiaro (`#f4f1e9`) |
| **4** | Ti riconosci? | Identificazione empatica (6 scenari) | Surface bianco caldo (`#fffdf8`) |
| **5** | Ponte Aspirazionale | Pausa editoriale & Desiderio | Deep Green Brand (`#1f5848`, testo chiaro) |
| **6** | Punto Zero | Diagnosi del problema profondo & Citazione | Canvas chiaro (`#f4f1e9`) |
| **7** | Movimento Adattivo | Presentazione del Metodo | Surface bianco caldo (`#fffdf8`) |
| **8** | Come Funziona | Processo in 3 step chiari e trasparenti | Canvas chiaro (`#f4f1e9`) |
| **9** | Mappa del Movimento | Fulcro visivo / Valore tangibile consegnato | Surface premium (`#fffdf8` + accenti) |
| **10** | Destinazioni di Movimento | Concretezza e applicazione pratica | Canvas chiaro (`#f4f1e9`) |
| **11** | Perché una Destinazione | Criterio, progresso e costanza | Canvas chiaro (`#f4f1e9`) |
| **12** | Chi è Andrea Bolzan | Storia personale, credibilità e metriche | Surface bianco caldo (`#fffdf8`) |
| **13** | Fa per te? (Sì / No) | Qualificazione & Disinnesco obiezioni | Canvas chiaro (`#f4f1e9`) |
| **14** | Offerta Commerciale | Stack di valore, prezzo 57 €, CTA principale | Deep Green / Dark Slate (`#17201d` / `#1f5848`) |
| **15** | FAQ | Risoluzione dubbi e trasparenza medica | Surface bianco caldo (`#fffdf8`) |
| **16** | Chiusura e Footer | Ultima chiamata & Note legali | Canvas / Dark muted (`#17201d`) |

---

## Dettaglio Sezioni

### Sezione 0: Barra Offerta (Sticky Top Bar)
- **Obiettivo**: Mostrare la scadenza dell'offerta solo se impostata esplicitamente.
- **Contenuto**: "Offerta valida ancora per [COUNTDOWN]".
- **Componente**: Bar orizzontale sticky, altezza 40px, font tabular-nums.
- **CTA**: Nessuna (informativa).
- **Asset**: Nessuno.
- **Desktop**: Barra fissa in testa alla pagina.
- **Mobile**: Barra compatta a tutta larghezza.
- **Animazione**: Nessuna (stabile).
- **Fallback No-JS**: Se `deadlineISO` è vuota, l'elemento è nascosto di default via CSS con classe `.ab-countdown--hidden`. Non mostra mai `00:00:00`.

### Sezione 1: Hero
- **Obiettivo**: Catturare attenzione immediata over 30 con rigidità e presentare la promessa dei due appuntamenti + Mappa.
- **Contenuto**: Pre-headline ("Per chi ha più di 30 anni..."), Headline H1 ("Sblocca cosa ti impedisce di muoverti..."), Sottotitolo, VSL (16:9), CTA primaria ("Prenota il Check-up al prezzo più basso di sempre"), nota WhatsApp e CTA WhatsApp, badge riepilogo "2 appuntamenti online · Mappa personale · Primi esercizi".
- **Componente**: Griglia asimmetrica 55/45.
- **CTA**: Primaria (`#CHECKOUT_URL`) + WhatsApp (`#WHATSAPP_URL`).
- **Asset**: Poster VSL e video iframe placeholder con rapporto 16:9.
- **Desktop**: Testo a sinistra, VSL e CTA primarie ben visibili nel fold.
- **Mobile**: Flusso verticale compatto (Pre-headline -> Headline -> Sub -> VSL -> CTA primaria -> WhatsApp).
- **Animazione**: Entrata composta delicata via GSAP (se attivo) o CSS transition fluida.
- **Fallback No-JS**: Contenuto e bottoni pienamente visibili e cliccabili.

### Sezione 2: Quello che il Check-up mostra
- **Obiettivo**: Evidenziare cosa la persona scoprirà che da sola non vede.
- **Contenuto**: Titolo, sottotitolo, lista di 7 punti critici e rivelazioni.
- **Componente**: Layout editoriale a lista numerata con badge numerali eleganti (01-07).
- **CTA**: Nessuna (sezione informativa ad alto valore).
- **Desktop**: Griglia a 2 colonne editoriali asimmetriche.
- **Mobile**: Singola colonna con spaziatura verticale ritmica.
- **Animazione**: Reveal graduale al viewport.
- **Fallback No-JS**: Lista semantica `<ol>` accessibile e leggibile.

### Sezione 3: Prova Sociale Iniziale
- **Obiettivo**: Dimostrare che oltre 400 persone hanno già ottenuto chiarezza e miglioramento.
- **Contenuto**: Lucia (65 anni) prima/dopo con nota di Andrea; Andrea Ferrari (38 anni) video-testimonianza ernia; Luca Timpani (38 anni) & Michele Vicari (43 anni) verticale dopo anni di yoga; Monica (52 anni, PT) empatia; Chat screenshot slider.
- **Componente**: Griglia mista di testimonianze + Slider chat orizzontale a scorrimento nativo con `scroll-snap-type: x mandatory`.
- **Desktop**: Card affiancate e slider con frecce/tasti.
- **Mobile**: Card verticali e slider con overflow orizzontale intuitivo.
- **Animazione**: Transizioni CSS hover sulle card.
- **Fallback No-JS**: Slider scrollabile nativamente con scrollbar orizzontale stilizzata.

### Sezione 4: Ti riconosci?
- **Obiettivo**: Identificazione empatica con 6 frustrazioni frequenti.
- **Contenuto**: 6 situazioni con citazioni autentiche + rassicurazione finale ("non è colpa tua...").
- **Componente**: Griglia di 6 card differenziate per stile/ritmo con icone SVG lineari sobrie (legno, grafico piatto, verticale, montagna, fischietto, bussola).
- **Desktop**: Griglia 3x2 o 2x3 con variazioni visive.
- **Mobile**: Sequenza a colonna singola con icone ben distanziate.
- **Animazione**: Dissolvenza leggera.
- **Fallback No-JS**: Perfetta leggibilità.

### Sezione 5: Ponte Aspirazionale
- **Obiettivo**: Respiro e immaginazione del futuro desiderato.
- **Contenuto**: "Immagina una cosa... Come sarebbe sapere esattamente cosa ti separa dal movimento che desideri...".
- **Componente**: Sezione a tutta larghezza con fondo `#1f5848`, tipografia grande (28-36px), citazione visiva e singola CTA primaria.
- **CTA**: Primaria (`#CHECKOUT_URL`).
- **Desktop & Mobile**: Centrata, ariosa, senza elementi di disturbo.
- **Animazione**: Parallasse leggera del background o fade-in tipografico.
- **Fallback No-JS**: Statico e funzionale.

### Sezione 6: Il Punto Zero
- **Obiettivo**: Spiegare perché i tentativi casuali falliscono e introdurre il concetto di "punto zero".
- **Contenuto**: Narrazione editoriale sul vivere intorno alla rigidità; citazione in evidenza di Luca Ugolini (34 anni); schema visuale concettuale (tentativi casuali -> lavoro su ciò che viene meglio -> stretching aggiunto -> limite normalizzato).
- **Componente**: Articolo editoriale con callout quote e micro-diagramma di percorso lineare.
- **Desktop**: Testo a colonna stretta con citazione a lato o integrata.
- **Mobile**: Flusso sequenziale leggibile.
- **Animazione**: Nessuna necessaria (focus sulla lettura).

### Sezione 7: Movimento Adattivo
- **Obiettivo**: Presentare il metodo di Andrea e la formula risolutiva.
- **Contenuto**: Definizione del Movimento Adattivo; equazione visiva (obiettivo desiderato + punto di partenza reale + mobilità, forza e controllo + progressione compatibile = Movimento Adattivo).
- **Componente**: Box formula di sintesi visiva + CTA.
- **CTA**: Primaria (`#CHECKOUT_URL`).
- **Desktop & Mobile**: Box evidenziato con badge.

### Sezione 8: Come Funziona il Check-up
- **Obiettivo**: Rassicurare sulla trasparenza del processo in 3 step.
- **Contenuto**:
  - Step 1: Primo appuntamento (colloquio + test: mobilità, forza/controllo, sforzo percepito).
  - Step 2: Costruzione della Mappa personale nei giorni successivi.
  - Step 3: Secondo appuntamento (consegna, spiegazione, primi esercizi).
  - Box speciale: Rimando a professionista esterno se necessario, svolgimento 100% online (telefono + spazio).
- **Componente**: Stepper orizzontale desktop / Timeline verticale mobile.
- **CTA**: Primaria (`#CHECKOUT_URL`).
- **Desktop**: 3 colonne collegate da linea visiva di percorso.
- **Mobile**: Timeline con nodi numerati 1, 2, 3.
- **Animazione**: Tracciamento linea GSAP al passaggio di scroll.

### Sezione 9: Mappa del Movimento (Seconda Hero)
- **Obiettivo**: Mostrare il "deliverable" tangibile e desiderabile del servizio.
- **Contenuto**: Etichetta "Esempio di Mappa", Mockup dettagliato della Mappa a più sezioni/pagine; le 6 domande fondamentali; blocco "+ I tuoi primi esercizi".
- **Componente**: Split view: Mockup editoriale annotato a sinistra, elenco delle 6 domande analitiche a destra.
- **CTA**: Primaria (`#CHECKOUT_URL`).
- **Desktop**: Layout 50/50 affiancato ad alto impatto.
- **Mobile**: Mockup in primo piano seguito dalle 6 domande.
- **Animazione**: Reveal controllato del mockup e dei punti chiave.

### Sezione 10: Destinazioni di Movimento
- **Obiettivo**: Collegare la mobilità a movimenti pratici e desiderabili.
- **Contenuto**: Verticale, Pike, Accosciata completa, Trekking, Arrampicata, Il tuo obiettivo. Nota di realtà/esperienze individuali.
- **Componente**: Sequenza di 6 card con illustrazioni/icone SVG ed esempi di vita quotidiana/sportiva.
- **Desktop**: Griglia 3x2 o 2x3 senza caroselli nascosti.
- **Mobile**: Lista verticale semplice ed ergonomica.

### Sezione 11: Perché una Destinazione Cambia Tutto
- **Obiettivo**: Consolidare i 3 vantaggi psicologici (Criterio, Progresso visibile, Costanza).
- **Contenuto**: 3 principi chiave + linea di connessione Punto Zero -> Destinazione + CTA.
- **Componente**: 3 card sintetiche collegate da un asse visivo.
- **CTA**: Primaria (`#CHECKOUT_URL`).

### Sezione 12: Chi è Andrea Bolzan
- **Obiettivo**: Costruire autorevolezza, empatia e connessione umana.
- **Contenuto**: Storia dal "gobbo" del liceo alla rigidità universitaria, 12 anni di insegnamento, l'infortunio alla schiena di ottobre 2025, ripartenza dal punto zero. Striscia metriche (12 anni, 400+ persone, 25+ workshop, 40+ a distanza).
- **Componente**: Layout editoriale bio con ritratto fotografico placeholder 4:5 + barra dei numeri statica.
- **Desktop**: Ritratto a sinistra, testo biografico a destra, metriche in orizzontale sotto.
- **Mobile**: Ritratto, biografia e metriche in griglia 2x2.

### Sezione 13: Il Check-up fa davvero per te?
- **Obiettivo**: Qualificare e filtrare i visitatori, disarmando obiezioni.
- **Contenuto**: Elenco "Sì, se" (5 punti) vs "No, se" (3 punti); box di risposta a due obiezioni frequenti ("Parto da troppo lontano", "Sto bene, non mi serve").
- **Componente**: Tabella/Griglia comparativa bipolare (segno verde per Sì, segno rosso moderato per No) + Callout obiezioni.
- **Desktop**: 2 colonne affiancate.
- **Mobile**: Colonna "Sì" seguita da colonna "No".

### Sezione 14: Offerta Commerciale (Stack del Valore)
- **Obiettivo**: Presentare l'offerta chiara, irresistibile e trasparente.
- **Contenuto**:
  - Lista di ciò che si riceve (2 appuntamenti, test, Mappa, primi esercizi, rimando esterno, credito 150 €).
  - Box prezzo: Valore 150 € barrato, prezzo attuale 57 €.
  - Promemoria credito 150 € per futuro percorso.
  - Posti disponibili: X su 6.
  - Countdown slot.
  - CTA primaria + CTA WhatsApp.
- **Componente**: Box offerta in evidenza con doppia colonna su desktop (Valore a sinistra, Transazione a destra).
- **CTA**: Primaria (`#CHECKOUT_URL`) + WhatsApp (`#WHATSAPP_URL`).

### Sezione 15: Domande Frequenti (FAQ)
- **Obiettivo**: Eliminare gli ultimi dubbi tecnici, logistici e clinici.
- **Contenuto**: 8 domande ufficiali del copy (Distanza, nessun obiettivo, infortuni/cautela medica, età over 60, proposta di continuazione, requisiti smartphone, durata e tempi consegna Mappa, prenotazione calendario).
- **Componente**: Elementi nativi HTML5 `<details>` con `<summary>`, freccia SVG ad apertura fluida.
- **Accessibilità**: Utilizzabili nativamente da tastiera senza JS.

### Sezione 16: Chiusura e Footer
- **Obiettivo**: Ricapitolare l'invito all'azione e fornire placeholder legali obbligatori.
- **Contenuto**: Micro-riepilogo, CTA primaria finale, link WhatsApp, footer con copyright e placeholder per Dati Fiscali, Privacy, Termini, Cookie.
- **Componente**: Footer minimale elegante a contrasto.

### Componente Globale: Sticky CTA Mobile
- **Obiettivo**: Mantenere la conversione a portata di pollice su smartphone.
- **Comportamento**: Compare quando la CTA dell'hero scompare dallo scroll; scompare quando si raggiunge il footer o l'offerta finale. Include prezzo compatto (57 €) e bottone rapido. Rispetta `env(safe-area-inset-bottom)`.

---

## Integrazione Foto e Asset da Google Drive

Per l'integrazione del materiale multimediale condiviso da Qiu (3 cartelle Google Drive: *Testimonianze* per i video reali dei clienti, *screen* per le chat WhatsApp e le 8 schede recensione con foto e testo integrale, e *Bolza* per le fotografie atletiche di Andrea Bolzan), fare riferimento al documento di dettaglio:
👉 **`PLAN-INTEGRAZIONE-FOTO.md`**

Il piano specifica:
1. Audit reale e inventario completo dei file estratti dalle 3 cartelle Google Drive con ID, dimensioni e formati.
2. Mappatura esatta nelle sezioni 1 (Hero VSL poster), 3 (Prova Sociale: recensioni e slider WhatsApp) e 12 (Ritratto Bio Andrea Bolzan).
3. Integrazione locale istantanea (`assets/`) e automazione in `build-ghl.js` con sostituzione automatica verso CDN Google Drive per `highlevel-paste.html`.
4. Stili CSS scoped `#ab-mobility-checkup` dedicati per rendering responsive, privo di CLS e conforme Core Web Vitals.
5. Flusso di build e verifica automatica con `build-ghl.js` e `test-verify-all.js`.
