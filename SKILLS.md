# Skills, Prompting Frameworks & Reference Repositories

> **Guida Integrata alle Competenze Ingegneristiche, Pattern di Prompting e Risorse di Design**  
> Documento per sviluppatori ed LLM futuri (Claude, ChatGPT, Gemini, DeepSeek, Cursor) che descrive i framework operativi, i comandi slash, i repository open source e le convenzioni utilizzate nel progetto "Check-up di Mobilità".

---

## 1. Prompting Frameworks & Pattern di Comando Slash

Il workflow di sviluppo e auditing del progetto adotta pattern operativi codificati per garantire rigore tecnico, precisione di business e assenza di allucinazioni:

### 1.1 `/goal` — Definizione dell'Obiettivo Primario e degli Invarianti
- **Scopo**: Fissare chiaramente il "North Star Metric", il modello economico e le regole non negoziabili prima di scrivere o modificare codice.
- **Applicazione nel Progetto**:
  - Definizione dell'offerta: 57 € promozionale con 150 € di credito applicabile al percorso successivo.
  - Vincolo GoHighLevel: deliverable finale `highlevel-paste.html` rigorosamente privo di tag `<html>`, `<head>`, `<body>`, con namespace unico `#ab-mobility-checkup`.
  - Zero allucinazioni: divieto assoluto di inventare recensioni, citazioni cliniche o risultati fittizi.

### 1.2 `/boost` — Massimizzazione del Rigore Ingegneristico e della CRO
- **Scopo**: Spingere al massimo livello la robustezza del codice, la fluidità grafica (120 FPS su schermi ProMotion), l'ergonomia su smartphone e l'accuratezza dei test.
- **Applicazione nel Progetto**:
  - Ingegnerizzazione del layout peek-ahead (84% larghezza card + 16% anteprima visiva).
  - Sticky bottom CTA bar con touch target a 52px, micro-copy ad alta specificità (*"Blocca il Check-up · 57 €"*), safe-area iOS e accelerazione GPU hardware.
  - IntersectionObserver avanzato con tracciamento a `Map` per gestire sia l'uscita sull'offerta che la ricomparsa tempestiva nelle FAQ.
  - Suite di test automatizzata portata a oltre 90 asserzioni deterministiche.

### 1.3 `/grilling` — Stress-Test Avversariale e Validazione Critica
- **Scopo**: Attaccare sistematicamente le ipotesi di lavoro, i presunti bug e le affermazioni dei revisori per distinguere problemi reali da falsi positivi.
- **Applicazione nel Progetto**:
  - Utilizzato durante la validazione dell'audit di Claude:
    - *Confutata* l'accusa di selettori non scoped tramite verifica analitica dello scanner AST.
    - *Accolta* la necessità di isolare i titoli dai temi aggressivi di GHL (`text-transform: none; letter-spacing: normal;`).
    - *Accolta* la necessità di proteggere `appendQueryParams()` affinché non alterasse i parametri hash o il testo preimpostato di WhatsApp.

### 1.4 `/plan` — Pianificazione Strutturata a Fasi
- **Scopo**: Scomporre compiti complessi in passaggi sequenziali, identificando dipendenze, file impattati e criteri di accettazione verificabili prima dell'implementazione.
- **Applicazione nel Progetto**:
  - Creazione di `PLAN.md` (architettura a 17 sezioni) e `PLAN-INTEGRAZIONE-FOTO.md` (piano di catalogazione e mapping CDN degli asset reali).

### 1.5 `/browser` — Ispezione Visiva e del Viewport
- **Scopo**: Verificare il rendering grafico, la gerarchia visiva nel viewport mobile e l'assenza di salti di layout (Cumulative Layout Shift).
- **Applicazione nel Progetto**:
  - Verifica del fold mobile della Hero (sequenza corretta pre-headline -> headline -> sub -> VSL -> CTA).
  - Verifica del corretto allineamento degli screenshot delle chat e delle card testimonianza in formato 4:5.

---

## 2. Competenze Ingegneristiche di Riferimento (`mattpocock-skills`)

Il progetto implementa i principi metodologici del framework ingegneristico di **Matt Pocock** ([github.com/mattpocock](https://github.com/mattpocock)):

| Competenza | Applicazione nella Landing Page |
|---|---|
| **`code-review`** | Revisione sistematica su due assi: **Standards** (scoping GHL, WCAG 2.1 AA, standard HTML5) e **Spec** (aderenza letterale a `brief/copy.md`). |
| **`diagnosing-bugs`** | Loop scientifico di isolamento del bug: formulazione dell'ipotesi, test di riproduzione, correzione mirata e aggiunta del test di non-regressione (es. gestione degli stati di intersezione per la ricomparsa della sticky CTA). |
| **`tdd` & Automated QA** | Suite di test bloccante `test-verify-all.js` (90+ asserzioni, exit code 1 in caso di errore) come barriera invalicabile per il CI/CD e prima di ogni commit. |
| **`domain-modeling`** | Rispetto rigoroso dei confini del dominio: il "Check-up di Mobilità" è una valutazione biomeccanica e conoscitiva (Punto Zero + Mappa), nettamente separata dai percorsi trimestrali o annuali di coaching successivo. |
| **`codebase-design`** | Architettura a moduli con confini puliti: separazione tra sorgenti modulari (`index.html`, `styles.css`, `script.js`) e il deliverable compilato monolitico per GHL (`highlevel-paste.html`). |

---

## 3. Repository e Risorse Open-Source Consultate

### 3.1 [Transitions.dev](https://transitions.dev) & [Make Interfaces Feel Better](https://interfaces.emilkowal.ski)
- **Autore**: Emil Kowalski ([@emilkowalski_](https://twitter.com/emilkowalski_))
- **Pattern Adottati**:
  - **Token di Easing Naturale**:
    - `--ab-ease-out: cubic-bezier(0.16, 1, 0.3, 1);` per hover, reveal allo scroll e transizioni d'interfaccia.
    - `--ab-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);` per feedback tattile e bottoni interattivi.
  - **Transizione Fluida Altezza Accordion FAQ**:
    - Utilizzo di CSS Grid `grid-template-rows: 0fr -> 1fr` per consentire l'animazione nativa dell'altezza del pannello risposta senza scatti o calcoli JS pesanti.
  - **Tactile Press Feedback**:
    - `:active { transform: scale(0.98); }` implementato su tutti i pulsanti e link primari.
  - **Ombre a Strati (Layered Shadows)**:
    - Sostituzione delle ombre monolitiche con ombre coordinate a più strati (`--ab-shadow-sm`, `--ab-shadow-md`, `--ab-shadow-lg`), che simulano illuminazione naturale diffusa.
  - **Raggi Concentrici**:
    - Formula $R_{esterno} = R_{interno} + Padding$ per preservare l'armonia geometrica tra card esterne ed elementi interni.
  - **Micro-Tipografia**:
    - `font-variant-numeric: tabular-nums;` su prezzi e timer per evitare oscillazioni orizzontali.
    - `text-wrap: balance;` sugli heading e `text-wrap: pretty;` sui testi lunghi.

### 3.2 [Vaul](https://github.com/emilkowalski/vaul) (Emil Kowalski)
- **Riferimento**: Modello di interazione per drawer e bottom-sheet touch con gestione fluida dello snap point e dell'inerzia da trascinamento.
- **Applicazione**: Studio della cinematica per la barra sticky mobile e per la chiusura al tocco.

### 3.3 [Embla Carousel](https://github.com/davidjerleke/embla-carousel) (David Jerleke)
- **Riferimento**: Architettura touch-first a 60/120 FPS basata su inerzia nativa senza overhead di runtime.
- **Applicazione**: Riferimento concettuale per lo slider orizzontale CSS con `scroll-snap-type: x mandatory`, indicatori interattivi (`role="button"`) e supporto keyboard accessibility.

### 3.4 [Utopia Core](https://github.com/trys/utopia-core) (Utopia.fyi)
- **Riferimento**: Calcolo matematico della tipografia e dello spacing fluido tramite funzioni `clamp()`.
- **Applicazione**: Heading `h1`, `h2`, `h3` scalano linearmente tra mobile (320px) e desktop (1280px) senza bruschi salti di breakpoint.

### 3.5 Ricerca sull'Ergonomia Mobile & Thumb-Zone (Steven Hoober)
- **Riferimento**: Dati di Steven Hoober sull'utilizzo dei telefoni a una mano (49% navigazione con pollice singolo, 75% interazioni nel terzo inferiore dello schermo).
- **Applicazione**:
  - Collocazione della CTA principale nella sticky bar inferiore sempre raggiungibile con il pollice.
  - Touch targets $\ge 52\text{px}$ per le azioni critiche e $\ge 44\text{px}$ per i link di servizio (conforme ad Apple Human Interface Guidelines e Google Material Design).
  - Eliminazione del ritardo di 300ms al tap tramite `touch-action: manipulation;`.
  - Gestione della Safe Area iOS (`constant(safe-area-inset-bottom)` e `env(safe-area-inset-bottom)`).
  - Prevenzione dell'auto-zoom di Safari iOS impostando `font-size: 16px;` su tutti i campi di input.

---

## 4. Subagent Specializzati (.gemini/agents/)

Nel repository sono definite le schede dei tre agenti operativi per la manutenzione e il testing:

1. **`landing-builder.md`**: Agente esecutivo frontend. L'unico autorizzato ad applicare modifiche al codice di `index.html`, `styles.css` e `script.js`.
2. **`content-auditor.md`**: Agente in sola lettura per la conformità del copy, dell'offerta commerciale e della deontologia medica.
3. **`quality-auditor.md`**: Agente in sola lettura per l'accessibilità WCAG 2.1 AA, la compatibilità GoHighLevel e il collaudo tramite `test-verify-all.js`.
