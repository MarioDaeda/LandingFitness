# Content Notes — Audit del Copy (Landing Check-up di Mobilità)

Data audit: 01/10/2026  
Fonte ufficiale: `brief/copy.md`  
Revisore: content-auditor (ruolo orchestrato)

---

## 1. Bloccanti
- **Nessun bloccante critico**: il copy contiene tutte le 15 sezioni (0-14), con testi completi, gerarchie chiare e flussi logici conformi all'obiettivo di vendita del Check-up di Mobilità. Si può procedere alla fase di progettazione e sviluppo.

---

## 2. Decisioni necessarie e Condizioni Commerciali da Confermare
1. **Scadenza e Countdown (Sez. 0 e Sez. 12)**:
   - Il copy recita: `Offerta valida ancora per [COUNTDOWN]`.
   - Nessuna data di scadenza ISO specificata.
   - *Azione tecnica adottata*: `deadlineISO: ""` in `AB_CONFIG`. Il countdown e la dicitura relativa vengono automaticamente nascosti (nessun timer fittizio a 00:00:00, nessuna falsa urgenza).
2. **Posti disponibili (Sez. 12)**:
   - Il copy recita: `[X SU 6]`.
   - *Azione tecnica adottata*: configurato come `"X su 6"` in `AB_CONFIG`, contrassegnato visivamente come dato da confermare da parte del cliente.
3. **Credito di 150 € (Sez. 12 e Sez. 13)**:
   - Il copy recita: `Un credito di 150 € sul percorso, se decidi di iniziare un percorso con me` e `i 150 € del Check-up ti vengono scalati per intero dal percorso`.
   - Vanno definite le condizioni contrattuali del credito (es. entro quanti giorni, su quali percorsi specifici).
4. **URL di destinazione**:
   - CTA acquisto puntano a `#CHECKOUT_URL` (da rimpiazzare nel funnel GHL).
   - CTA WhatsApp puntano a `#WHATSAPP_URL` (con numero reale prima del lancio).
5. **Dati legali e societari nel footer**:
   - Mancano P.IVA, Ragione Sociale, link Privacy Policy, Cookie Policy e Termini. Verranno predisposti placeholder semantici pronti alla compilazione.

---

## 3. Correzioni Ortografiche e Terminologiche
- **"Bolza" vs "Andrea Bolzan" (Sez. 3)**:
  - Nel copy c'è la nota `[COPY: aggiungere la lettura di Bolza senza indicare in quanto tempo]`. Nella narrazione pubblica il nome è Andrea Bolzan ("Bolza" è il soprannome). Mantenere il riferimento ad "Andrea" per coerenza di brand.
- **Formattazione prezzi**:
  - Utilizzare lo spazio unificatore tra cifra e simbolo valuta (`57 €`, `150 €`) e font con `font-variant-numeric: tabular-nums`.

---

## 4. Asset Mancanti e Gestione Placeholder
Tutti gli asset non ancora forniti in `brief/assets/` saranno implementati con placeholder accessibili, semanticamente validi ed etichettati, senza scaricare foto stock di terzi o generare volti artificiali:
1. **VSL Video (Hero)**: Placeholder video 16:9 con poster grafico pulito ed etichetta informativa.
2. **Lucia, 65 anni (Sez. 3)**: Card comparativa prima/dopo con slot per 2 immagini reali.
3. **Andrea Ferrari, 38 anni (Sez. 3)**: Riquadro video-testimonianza da recuperare.
4. **Luca Timpani e Michele Vicari (Sez. 3)**: Box testuale/testimonianza per la verticale dopo anni di yoga.
5. **Monica, 52 anni (Sez. 3 & Sez. 13)**: Card personal trainer con citazione empatica.
6. **Chat WhatsApp (Sez. 3)**: Slider a scorrimento nativo con 3-4 card placeholder chat con scroll-snap.
7. **Mappa del Movimento (Sez. 8)**: Mockup visivo editoriale dettagliato con etichetta obbligatoria *"Esempio di Mappa"*.
8. **Foto Andrea Bolzan (Sez. 10)**: Riquadro ritratto editoriale personale 4:5 con etichetta placeholder.
9. **Destinazioni di movimento (Sez. 9)**: 5 card con icone/illustrazioni SVG sobrie per Verticale, Pike, Accosciata, Trekking, Arrampicata.

---

## 5. Claim da Approvare e Note Sanitarie
- **Sez. 9 (La pike)**: *"I clienti che ci sono passati mi raccontano di dormire meglio, di avere meno tensione al collo, meno mal di testa."*
  - **Nota di conformità**: Trattandosi di resoconti aneddotici individuali, non devono essere presentati come garanzie mediche o promesse di cura. Il testo del copy lo inquadra correttamente come ciò che i clienti raccontano (*"I clienti mi raccontano..."*).
- **Sez. 7 e 13 (Limiti di intervento e rimando professionale)**:
  - Viene ribadito in più punti che il Check-up **non è una visita medica, non formula diagnosi e non sostituisce un sanitario**. Questo rafforza l'autorevolezza e la trasparenza legale del servizio.

---

## 6. Problemi Potenziali di Layout e Soluzioni Adottate
- **Lunghezza CTA primaria**: *"Prenota il Check-up al prezzo più basso di sempre"* è una frase di 51 caratteri.
  - *Soluzione*: `max-width: 100%`, `text-wrap: balance`, padding orizzontale bilanciato, font-size scalabile (17px desktop, 15px su mobile <360px), min-height 48px per touch target.
- **Slider Chat**: Evitare librerie esterne. Usare container con `display: flex`, `overflow-x: auto`, `scroll-snap-type: x mandatory`, indicatori visivi di scorrimento, accessibile con tab e swipe.
- **FAQ native**: Usare `<details>` e `<summary>` senza JS bloccante, styling curato dei cursori e frecce SVG animate con transizioni CSS.
