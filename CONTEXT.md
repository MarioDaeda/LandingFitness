# Project Context & AI Agent Guidelines — Landing Fitness (Andrea Bolzan)

> **Documento di Contesto Ufficiale per LLM e Agenti AI** (Claude, Gemini, Cursor, Copilot, ChatGPT, ecc.).  
> Leggi questo file prima di apportare qualsiasi modifica al codice o al copy del progetto.

---

## 1. Identità del Progetto & Modello di Business

- **Professionista**: **Andrea Bolzan** — Insegnante di Movimento e Mobilità articolare (Milano). Ex agonista, ha vissuto in prima persona il recupero funzionale e la riabilitazione post-blocco schiena.
- **Servizio in vendita**: **"Check-up di Mobilità"**
  - **Cosa include**: 2 appuntamenti 1:1 online su Zoom + Analisi posturale e articolare completa + Consegna della **Mappa del Movimento** personale + Primi esercizi correttivi.
  - **Prezzo Promo**: **57 €** (invece di 150 €).
  - **Incentivo / Ritorno**: **150 € di credito** scalabili dall'eventuale percorso successivo.
  - **Target**: Uomini e donne over 30 che sentono rigidità, dolori articolari o che si allenano ma non conoscono il loro reale punto di partenza.
- **Tono di Voce**: Autorevole, umano, scientifico ma accessibile, sobrio, empatico.  
  ❌ **VIETATO**: Toni da "fitness bro", promesse di guarigione clinica, claim terapeutici/medici, countdown aggressivi con falsa urgenza.

---

## 2. Architettura Tecnica & Vincoli GoHighLevel (GHL)

La landing page deve funzionare sia come sito statico autonomo, sia come snippet incorporato dentro **GoHighLevel**:

| File | Ruolo Architetturale | Regola di Modifica |
|---|---|---|
| [`index.html`](file:///c:/Users/MARIO/Downloads/Landing/index.html) | Sorgente HTML semantico standalone (fa riferimento agli asset in `assets/`) | Modificare questo file per modifiche strutturali |
| [`styles.css`](file:///c:/Users/MARIO/Downloads/Landing/styles.css) | Foglio di stile isolato con namespace `#ab-mobility-checkup` | Modificare questo file per stili e animazioni |
| [`script.js`](file:///c:/Users/MARIO/Downloads/Landing/script.js) | Logica interattiva (accordion FAQ, slider, sticky CTA, gestione link) | Modificare questo file per logica client-side |
| [`build-ghl.js`](file:///c:/Users/MARIO/Downloads/Landing/build-ghl.js) | Compilatore Node.js: inietta CSS/JS e converte percorsi `assets/` in CDN Google Drive | Eseguire con `node build-ghl.js` per aggiornare il deliverable |
| [`highlevel-paste.html`](file:///c:/Users/MARIO/Downloads/Landing/highlevel-paste.html) | **Deliverable Finale per GoHighLevel** (CSS inline + HTML + JS inline) | **NON MODIFICARE A MANO**: generato automaticamente da `build-ghl.js` |
| [`test-verify-all.js`](file:///c:/Users/MARIO/Downloads/Landing/test-verify-all.js) | Test suite automatizzata (64 check di conformità) | Eseguire sempre con `node test-verify-all.js` |

---

## 3. Invarianti Architetturali Tassativi (Non Violare Mai)

1. **Zero Tag Root in `highlevel-paste.html`**:
   - Vietati tassativamente i tag `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`.
   - L'intero blocco deve essere racchiuso nel container genitore `#ab-mobility-checkup`.
2. **Isolamento CSS al 100%**:
   - Ogni selettore CSS deve iniziare con `#ab-mobility-checkup` (es. `#ab-mobility-checkup .ab-btn`).
   - Vietate regole globali su elementi nativi (`body`, `a`, `h1`, `p`, `*`).
   - Gli heading devono preservare il reset scoped `text-transform: none; letter-spacing: normal;` per non ereditare stili invasivi dal tema GHL.
3. **Singolo `<h1>`**:
   - Esattamente un solo tag `<h1>` in tutta la sales page.
4. **Funnel CTA e Link Esterni**:
   - 10 link checkout con attributo `data-checkout-link` (default `href="#CHECKOUT_URL"`).
   - 4 link WhatsApp con attributo `data-whatsapp-link`, `target="_blank"` e `rel="noopener noreferrer"`.
   - `appendQueryParams` preserva i parametri query (UTM, Pixel, Google Ads) senza sovrascrivere URL personalizzati.
5. **Asset & CDN ad Alta Velocità**:
   - Nel deliverable GHL non devono esistere percorsi relativi (`src="assets/..."`). Tutti gli asset devono puntare agli URL CDN diretti di Google Drive (`https://lh3.googleusercontent.com/d/FILE_ID`).
6. **Accessibilità & Contrasti WCAG 2.1 AA**:
   - Colore accento: `--ab-color-accent: #b8420f;` (rapporto di contrasto $\ge 4.5:1$).
   - Colore testo secondario/footer: `--ab-color-ink-muted` e `--ab-color-footer-text` conformi AA.
   - Tutti i link e pulsanti devono avere touch target minimi di almeno **44x44px** su mobile.
   - Le immagini decorative usano `alt=""` o `aria-hidden="true"`; le foto di contenuto usano `alt` descrittivi e fedeli.
7. **Safe Fallback Countdown**:
   - Top-bar e countdown offerta devono avere `display: none;` di default in CSS. Vengono rivelati via JS solo se `deadlineISO` è configurata con una data valida.

---

## 4. Guida per lo Sviluppatore / Agente AI Successivo

Se ti viene chiesto di fare modifiche al progetto:

```bash
# 1. Modifica i file sorgente (index.html, styles.css, script.js)
# 2. Ricompila il deliverable per GoHighLevel:
node build-ghl.js

# 3. Esegui la suite di verifica completa (deve dare 64/64 PASS):
node test-verify-all.js

# 4. Verifica lo stato git prima del commit:
git status
```
