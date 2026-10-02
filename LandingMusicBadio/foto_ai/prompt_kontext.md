# Ritratti IA — Andrea Badiali (FLUX.1 Kontext [dev])

Uso: **solo landing page**, con il consenso di Andrea. Nessuna ambientazione in luoghi, eventi o con persone reali.
Registro visivo: vedi `info/andrea_badiali_bio_completa.md` §7.2 (B/N chiaroscurale + colore caldo desaturato).

---

## 1. Sorgenti

| Sorgente | File | Note |
|---|---|---|
| **A** (principale) | `image/SaveClip.App_584815494_..._n.jpg` (1440×1440) | Giacca navy già presente, volto 3/4 ben definito |
| **B** (da recuperare) | originale ad alta risoluzione di `image/download.jfif` | T-shirt nera, pianoforte alle spalle, sguardo in camera |
| **C** (da recuperare) | originale ad alta risoluzione della foto col dolcevita | Utile come controllo di somiglianza |

> ⚠ Mettere gli originali B e C in `image/originali/`. Sotto i ~800 px di lato sul volto la somiglianza cala in modo visibile.

**Preparazione della sorgente A:** la foto a 1440 px contiene altre due persone e un tavolo, e il volto di Andrea è largo solo ~200 px. Ritaglio verticale 4:5 su di lui, dalla testa a metà busto (`CROP_A` nel notebook), escludendo i vicini e il bordo rosso della sedia. Il ridimensionamento alla risoluzione di Kontext lo fa la pipeline. Un originale a risoluzione maggiore, dal fotografo, migliorerebbe molto la somiglianza.

---

## 2. Parametri comuni

- `num_inference_steps=28`, `guidance_scale=2.5` (alzare a 3.0–3.5 solo se l'istruzione viene ignorata)
- 4 seed per step; si sceglie il migliore e lo si usa come input per lo step successivo
- **Una sola modifica per step.** Se il volto deriva, tornare allo step precedente e cambiare seed — non correggere a valle.

**Formula di identità** (aggiunta in coda a ogni prompt, identica ogni volta):

```
IDENTITY = (
    "Keep the exact same person: same face shape, same facial features, same dark curly "
    "shoulder-length hair, same short beard and moustache, same round clear-frame glasses, "
    "same eye color and natural skin texture with visible pores. Do not beautify or retouch the face."
)
```

---

## 3. Shot 1 — Ritratto da studio (colore) · base di tutti gli altri

Catena sulla sorgente A:

**1a — rimuovere il microfono**
```
Remove the black microphone from the man's hands; his hands are now resting relaxed and out of frame below the chest. Keep the pose, clothing, background and lighting unchanged. {IDENTITY}
```
> Step più delicato: il microfono copre parte del mento/collo. Controllare barba e linea della mascella.

**1b — camicia**
```
Replace the white t-shirt with a crisp white dress shirt with a classic collar, top button open, no tie, worn under the same navy blue tailored blazer. Keep everything else unchanged. {IDENTITY}
```

**1c — sfondo**
```
Replace the background with a seamless warm grey studio backdrop with a soft gradient, slightly lighter behind the head. Keep the man, his clothing and his pose unchanged. {IDENTITY}
```

**1d — luce**
```
Relight the portrait as a professional studio photo: large softbox key light from the left at 45 degrees creating soft Rembrandt lighting, gentle fill from the right, subtle rim light on the hair. Shot on an 85mm lens at f/2.8, shallow depth of field, warm muted color grade, low saturation, fine film grain. Keep the pose and clothing unchanged. {IDENTITY}
```

**1e (opzionale) — espressione**
```
Change only the expression: mouth closed in a calm, subtle closed-lip smile. Keep head angle, gaze direction, pose, clothing, background and lighting unchanged. {IDENTITY}
```
> Rischio medio: modificare la bocca può alterare la somiglianza. Saltare se l'1d è già convincente.

➡ **Risultato = S1.** Uso: sezione Bio. Formato 4:5.

---

## 4. Shot 2 — Hero B/N in stile ECM

Input: **S1**

```
Convert to a black and white fine-art portrait: deep black background, single hard side light from the left leaving the right half of the face in soft shadow, high contrast chiaroscuro, rich blacks, subtle film grain, in the style of a classical music album cover. Keep the pose and clothing unchanged. {IDENTITY}
```
> Hero: lo scatto resta in **4:5**. Allargarlo a 16:9 con Kontext rimpicciolirebbe il volto e peggiorerebbe la somiglianza. Il formato orizzontale si ottiene nel layout web: foto a destra su un fondo nero a tutta larghezza, titolo nello spazio negativo a sinistra.

➡ **Risultato = S2.** Variante a colori dell'hero: stesso prompt sostituendo la prima frase con `Keep the colors, with a warm muted grade and amber key light:`.

---

## 5. Shot 3 — Dolcevita (colore)

Input: **S1**

```
Replace the navy blazer and white shirt with a fine-knit charcoal grey turtleneck sweater. Keep the background, lighting, pose and framing unchanged. {IDENTITY}
```
➡ **S3.** Uso: sezione Poetica. Variante B/N applicando poi il prompt dello Shot 2.

---

## 6. Shot 4 — Al lavoro: partitura e pianoforte (colore)

Input preferito: **sorgente B** (ha già il pianoforte). In mancanza: **S1**.

**4a — ambiente** (solo se si parte da S1)
```
Replace the background with a dim music room: an upright piano with dark wood finish behind him, a warm table lamp, soft evening light. Keep the man, clothing and pose unchanged. {IDENTITY}
```

**4b — oggetto in mano**
```
He is now holding a pencil and looking down at a handwritten music score on a desk in front of him, with sheets of manuscript paper covered in handwritten notes. Keep his face, glasses, hair and clothing unchanged. {IDENTITY}
```
> ⚠ Rischio alto: cambiano posa, sguardo e mani. Generare 6–8 seed e controllare con attenzione mani e note sul pentagramma (spesso illeggibili/incoerenti → accettabile se fuori fuoco).

➡ **S4.** Uso: sezione Catalogo opere. Formato 3:2 orizzontale.

---

## 7. Shot 5 — Teatro generico (colore)

Input: **S1**

**5a — ambiente**
```
Replace the background with the interior of an empty historic Italian opera house seen from the stalls: rows of red velvet seats, gilded balconies softly out of focus, warm amber stage light. No logos, no signage, no recognizable venue. Keep the man, his clothing and pose unchanged. {IDENTITY}
```

**5b (opzionale) — posa seduta**
```
He is now seated in a red velvet theater seat, leaning slightly forward with his forearms on his knees, looking toward the camera. Keep his face, glasses, hair and clothing unchanged. {IDENTITY}
```
> Rischio medio-alto (cambio posa).

➡ **S5.** Uso: sezione Palcoscenici. Formato 3:2 orizzontale.

---

## 8. Controllo prima di pubblicare

Confrontare ogni risultato affiancato alla sorgente A (e a B/C se disponibili):

- [ ] Forma e montatura degli occhiali coerenti con l'originale
- [ ] Capelli: stessa lunghezza, volume e riccio
- [ ] Barba e baffi: stessa densità, non "ripuliti"
- [ ] Pelle con texture naturale, niente effetto plastica
- [ ] Mani: 5 dita, proporzioni corrette
- [ ] Nessun logo, scritta o luogo riconoscibile
- [ ] Color grading coerente con le altre foto del sito
- [ ] **Approvazione finale di Andrea** su ogni immagine pubblicata
