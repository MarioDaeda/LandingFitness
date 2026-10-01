# Content Notes — Audit del Copy (Landing Check-up di Mobilità)

Data audit iniziale: 01/10/2026  
Data revisione e hardening: 01/10/2026  
Fonte testuale ufficiale: `brief/copy.md`  
Revisore: content-auditor (ruolo orchestrato in sola lettura)

---

## 1. Bloccanti
- **Nessun bloccante critico**: il copy ufficiale in `brief/copy.md` definisce chiaramente il servizio e le 16 sezioni logiche (0-16).
- **Risoluzione violazione del copy**: Nel tentativo precedente erano stati introdotti testi inventati nella Sezione 3 (chat WhatsApp fittizie, retroscena non documentato per Lucia e per Timpani/Vicari) e nella Sezione 8 (frase non presente nel copy in Step 2). Tali elementi sono stati integralmente rimossi e sostituiti con placeholder rigorosi ed etichettati, nel pieno rispetto del divieto di inventare recensioni, risultati o testimonianze.

---

## 2. Decisioni Necessarie e Condizioni Commerciali da Confermare
1. **Scadenza e Countdown (Sezione 0 e Sezione 14)**:
   - Nel copy: `Offerta valida ancora per [COUNTDOWN]`.
   - Nessuna data ISO documentata.
   - *Comportamento tecnico adottato*: `deadlineISO: ""` in `AB_CONFIG`. Il countdown superiore (Sez. 0) e il box countdown nell'offerta (Sez. 14) sono impostati con `display: none` di default nel CSS e rimangono rigorosamente invisibili finché non viene configurata una data ISO futura valida. Nessuna urgenza fittizia né display a zeri `--:--:--`.
2. **Posti disponibili (Sezione 14)**:
   - Nel copy: `[X SU 6]`.
   - *Comportamento tecnico adottato*: valorizzato come `"X su 6"` in `AB_CONFIG`, contrassegnato visivamente come dato da confermare prima del lancio.
3. **Credito di 150 € (Sezione 14 e Sezione 15)**:
   - Nel copy: `Un credito di 150 € sul percorso, se decidi di iniziare un percorso con me` e `i 150 € del Check-up ti vengono scalati per intero dal percorso`.
   - Da confermare con Andrea Bolzan le condizioni contrattuali del credito (validità temporale, percorsi applicabili).
4. **URL di destinazione CTA**:
   - Tutte le CTA di acquisto usano `href="#CHECKOUT_URL"` con attributo `data-checkout-link`.
   - Tutte le CTA WhatsApp usano `href="#WHATSAPP_URL"` con attributo `data-whatsapp-link`.
5. **Dati fiscali e legali nel Footer (Sezione 16)**:
   - Predisposti slot per P.IVA, Ragione Sociale, Privacy Policy, Cookie Policy e Termini di Servizio.

---

## 3. Correzioni Ortografiche e Terminologiche
- **"Bolza" vs "Andrea Bolzan" (Sez. 3)**:
  - Il copy annota `[COPY: aggiungere la lettura di Bolza senza indicare in quanto tempo]`. È stato predisposto lo slot placeholder etichettato `[COPY DA INTEGRARE: Lettura di Andrea Bolzan sul percorso di Lucia (senza indicare tempi di trasformazione)]`.
- **Formattazione Prezzi e Valute**:
  - Utilizzato lo spazio non separabile tra importo e valuta (`57 €`, `150 €`), con classe `.ab-tabular` per mantenere l'allineamento dei caratteri numerici tabulari.

---

## 4. Asset Mancanti e Gestione Placeholder
Tutti gli asset non presenti nella cartella `brief/assets/` sono stati implementati con placeholder chiari, conformi e privi di immagini stock o volti sintetici:
1. **VSL Video (Hero)**: Riquadro 16:9 con pulsante play SVG, etichetta `[VSL — riquadro video]` e testo alternativo descrittivo accessibile.
2. **Lucia, 65 anni (Sez. 3)**: Box comparativo prima/dopo con due slot `[ASSET: Foto Prima — Lucia, 65 anni]` e `[ASSET: Foto Dopo — Lucia, 65 anni]`.
3. **Andrea Ferrari, 38 anni (Sez. 3)**: Riquadro `[ASSET DA RECUPERARE: video-testimonianza relativa all'ernia]`.
4. **Luca Timpani e Michele Vicari (Sez. 3)**: Box `[CONTENUTO DA INTEGRARE: La verticale dopo anni di yoga]`.
5. **Chat WhatsApp (Sez. 3)**: Slider CSS scroll-snap con 4 card placeholder per screenshot reali delle conversazioni.
6. **Mappa del Movimento (Sez. 9)**: Mockup editoriale con badge obbligatorio `"Esempio di Mappa"` e placeholder `[ASSET: Anteprima di 2–3 pagine della Mappa del Movimento]`.
7. **Foto Andrea Bolzan (Sez. 12)**: Slot con icona avatar e caption `[FOTOGRAFIA REALE: Ritratto editoriale di Andrea Bolzan]`.
8. **Destinazioni di Movimento (Sez. 10)**: 6 card con icone SVG lineari e riquadri dedicati per ciascun asset fotografico/video.

---

## 5. Claim Sensibili e Tutela Sanitaria
- **Sez. 10 (La pike)**:
  - *"I clienti che ci sono passati mi raccontano di dormire meglio, di avere meno tensione al collo, meno mal di testa."*
  - **Segnalazione di conformità**: Trattasi di riscontri soggettivi individuali riportati dai clienti, non di un'efficacia clinica garantita o di un trattamento medico.
- **Trasparenza Medico-Sanitaria (Sez. 8, Sez. 13, Sez. 15 e Footer)**:
  - Viene specificato chiaramente e ripetuto che:
    1. Il Check-up non è una visita medica.
    2. Non formula diagnosi.
    3. Non sostituisce un professionista sanitario qualificato.
    4. In fase acuta di infortunio o post-operatoria il cliente viene invitato ad attendere e rivolgersi a un medico o fisioterapista.

---

## 6. Layout e Adattamento Mobile
- **Hero Asimmetrica (Sez. 1)**: Desktop 55/45; Mobile sequenziale: pre-headline -> headline -> sottotitolo -> VSL -> CTA primaria -> WhatsApp query & button -> pillola riassuntiva.
- **Section 2 (Quello che il Check-up mostra)**: Griglia editoriale a 2 colonne su desktop, 1 colonna su mobile, con evidenziazione dei 7 concetti cardine.
- **Section 11 (Perché una destinazione)**: Sezione autonoma con linea visiva di collegamento tra Punto Zero e Destinazione.
- **Sticky CTA Mobile**: Comparsa automatica solo a superamento della CTA hero, ritiro all'ingresso nell'offerta o nel footer, disattivabile da configurazione.
