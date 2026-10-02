# Skills, Design Frameworks & Reference Repositories

> **Guida alle Competenze, Risorse di Design e Pattern Tecnici** applicati nella realizzazione della sales page "Check-up di Mobilità".  
> Questo documento consente a qualsiasi sviluppatore o LLM futuro di comprendere e replicare i principi estetici, di motion e di qualità del progetto.

---

## 1. Risorse e Repository di Design & Micro-Interazioni

### 1.1 Transitions.dev
- **Autore**: Emil Kowalski ([@emilkowalski_](https://twitter.com/emilkowalski_))
- **URL**: [https://transitions.dev](https://transitions.dev)
- **Principi Applicati nel Progetto**:
  - **Curve di Easing e Token Fluidi**:
    - `--ab-ease-out: cubic-bezier(0.16, 1, 0.3, 1);` (curva naturale per hover, accordion e reveal).
    - `--ab-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);` (curva a molla per la sticky bar su mobile e feedback tattile sui bottoni).
  - **Transizione Fluida Altezza Accordion FAQ**:
    - Utilizzo di CSS `grid-template-rows: 0fr -> 1fr` per transizioni animate native sull'altezza delle risposte FAQ senza reflow a scatti.
  - **Fade-in delle Immagini Lazy**:
    - Tutte le immagini con `loading="lazy"` dispongono di una classe di ingresso progressivo per evitare salti di layout.

### 1.2 Make Interfaces Feel Better
- **Autore**: Emil Kowalski
- **URL**: [https://interfaces.emilkowal.ski](https://interfaces.emilkowal.ski)
- **Principi Applicati nel Progetto**:
  - **Tactile Press Feedback**:
    - Tutti i pulsanti CTA implementano `:active { transform: scale(0.98); }` per una risposta visiva immediata al tocco.
  - **Layered Shadows (Ombre a Strati)**:
    - Sostituzione delle ombre monolitiche con combinazioni multistrato coordinate (`--ab-shadow-sm`, `--ab-shadow-md`, `--ab-shadow-lg`), che simulano luce naturale e profondità tridimensionale.
  - **Raggi Concentrici**:
    - I raggi di curvatura interni ed esterni rispettano la formula $R_{esterno} = R_{interno} + Padding$, garantendo armonia geometrica nei contenitori e nelle card.
  - **Tipografia Avanzata**:
    - Tracking negativo calibrato sui titoli grandi (`letter-spacing: -0.025em;`).
    - Utilizzo di `text-wrap: balance;` sugli heading e `text-wrap: pretty;` sui paragrafi per eliminare parole orfane.
    - Cifre tabulari (`font-variant-numeric: tabular-nums;`) nei prezzi e nei timer.

### 1.3 Impeccable (Design System & Copy Shaping)
- **Metodologia**: Framework per la concezione di landing page persuasive ad alta conversione.
- **Principi Applicati**:
  - **Shaping della Sales Page**:
    - Gerarchia visiva focalizzata sulla trasparenza, con alternanza ritmica tra *Canvas* (`#f4f1e9`) e *Surface* (`#fffdf8`).
  - **Centralità del Valore**:
    - La "Mappa del Movimento" è il fulcro tangibile dell'offerta, posizionata strategicamente dopo la spiegazione del metodo e prima delle opzioni di acquisto.

### 1.4 GSAP (GreenSock Animation Platform)
- **URL**: [https://github.com/greensock/GSAP](https://github.com/greensock/GSAP)
- **Ruolo nel Progetto**:
  - Predisposto per progressive enhancement: se la libreria è presente viene orchestrata un'animazione complessa; se assente, il sito degrada elegantemente a CSS nativo garantendo perfetta leggibilità e performance.

---

## 2. Metodologie di Ingegneria & QA (mattpocock-skills)

Il progetto adotta le best practice e i pattern concettuali derivati dal sistema di skill ingegneristiche di **Matt Pocock** ([github.com/mattpocock](https://github.com/mattpocock)):

| Skill / Pattern | Come è stata applicata in questo progetto |
|---|---|
| **`code-review`** | Audit avversariale su standard e specifiche: verifica dell'isolamento scoped GHL, dei contrasti WCAG e dell'assenza di memory leak o doppie inizializzazioni. |
| **`diagnosing-bugs`** | Loop scientifico di diagnosi e isolamento: ha permesso di individuare e correggere il bug di sovrascrittura UTM in `script.js` e la sensibilità ai newline CRLF/LF su Windows. |
| **`tdd` & Automated QA** | Approccio test-first tramite [`test-verify-all.js`](file:///c:/Users/MARIO/Downloads/Landing/test-verify-all.js), con 64 asserzioni bloccanti (`process.exit(1)`) che agiscono da gate di qualità deterministico prima di ogni rilascio. |
| **`domain-modeling`** | Mantenimento della purezza del dominio di Andrea Bolzan: separazione netta tra il *Check-up di Mobilità* (diagnostico iniziale) e i percorsi completi di coaching. |

---

## 3. Subagent Locali (.gemini/agents/)

Nel repository sono definite le specifiche dei subagent dedicati alla manutenzione della landing:

1. **`landing-builder.md`**:
   - Ruolo: Senior conversion designer e frontend engineer.
   - È l'unico agente autorizzato a modificare il codice frontend (`index.html`, `styles.css`, `script.js`).
2. **`content-auditor.md`**:
   - Ruolo: Auditor del copy in sola lettura.
   - Verifica conformità al brief, refusi, promesse mediche e claim non autorizzati.
3. **`quality-auditor.md`**:
   - Ruolo: QA auditor indipendente in sola lettura.
   - Esegue controlli di compatibilità GoHighLevel, responsive, contrasti WCAG e accessibilità da tastiera.
