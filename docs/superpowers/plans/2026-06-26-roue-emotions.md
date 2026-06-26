# Roue des émotions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `roue-des-emotions.html` — a page with 3 independently-rotating SVG rings (primary emotions, nuances, needs) supporting drag and step buttons.

**Architecture:** Pure HTML/CSS/JS, no frameworks. SVG rings are `<g>` elements rotated via `style.transform`. Text follows arcs via `<textPath>` referencing `<path>` elements in `<defs>`. Drag uses Pointer Events API.

**Tech Stack:** HTML5, CSS3, SVG, vanilla JS (ES2020)

## Global Constraints

- No external libraries or frameworks
- Must match existing glassmorphism design system (CSS variables from `style.css`)
- `style.css` is already linked from the root — reuse its variables
- SVG viewBox: `0 0 600 600`, center at `(300, 300)`
- Touch and mouse support via Pointer Events API
- File naming: `roue-des-emotions.html`, `roue-des-emotions.css`, `roue-des-emotions.js`

---

### Task 1: HTML scaffold + CSS styles

**Files:**
- Create: `roue-des-emotions.html`
- Create: `roue-des-emotions.css`

**Interfaces:**
- Produces: `#roue` (SVG element), `#btn-reset`, `.btn-step[data-ring][data-dir]` consumed by Task 3

- [ ] **Step 1: Create `roue-des-emotions.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Roue des émotions — UTEP</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="roue-des-emotions.css">
</head>
<body>
  <div class="container roue-page">

    <div class="barre-nav">
      <a href="index.html" class="retour">← Accueil</a>
      <button id="btn-reset" class="btn-roue-reset">↺ Réinitialiser</button>
    </div>

    <header>
      <p class="eyebrow">UTEP</p>
      <h1>Roue des émotions</h1>
      <p class="intro">Faites tourner les disques pour identifier l'émotion, les nuances et le besoin associé.</p>
    </header>

    <div class="roue-wrapper">
      <svg id="roue" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <!-- Built by roue-des-emotions.js -->
      </svg>
    </div>

    <div class="controles">
      <div class="controle-row">
        <span class="controle-label">Émotions primaires</span>
        <div class="controle-btns">
          <button class="btn-step" data-ring="0" data-dir="-1">←</button>
          <button class="btn-step" data-ring="0" data-dir="1">→</button>
        </div>
      </div>
      <div class="controle-row">
        <span class="controle-label">Nuances</span>
        <div class="controle-btns">
          <button class="btn-step" data-ring="1" data-dir="-1">←</button>
          <button class="btn-step" data-ring="1" data-dir="1">→</button>
        </div>
      </div>
      <div class="controle-row">
        <span class="controle-label">Besoins</span>
        <div class="controle-btns">
          <button class="btn-step" data-ring="2" data-dir="-1">←</button>
          <button class="btn-step" data-ring="2" data-dir="1">→</button>
        </div>
      </div>
    </div>

  </div>
  <script src="roue-des-emotions.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `roue-des-emotions.css`**

```css
/* ── Roue des émotions ── */
.roue-page { max-width: 680px; }

.barre-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.retour {
  text-decoration: none;
  color: var(--gris);
  font-size: 0.88rem;
  font-weight: 600;
  transition: color 0.15s;
}
.retour:hover { color: var(--marine); }

.btn-roue-reset {
  background: var(--blanc-verre);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--bord-verre);
  border-radius: 999px;
  padding: 6px 18px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--gris);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.btn-roue-reset:hover {
  color: var(--marine);
  border-color: rgba(74,111,165,.4);
}

/* ── SVG wrapper ── */
.roue-wrapper {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0 2rem;
}

#roue {
  width: 100%;
  max-width: 520px;
  cursor: grab;
  filter: drop-shadow(0 8px 32px rgba(45,55,72,.18));
  touch-action: none;
  user-select: none;
}
#roue:active { cursor: grabbing; }

.ring {
  transition: transform 0.28s cubic-bezier(.34,1.56,.64,1);
}
.ring.dragging { transition: none; }

/* ── Controls ── */
.controles {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  max-width: 420px;
  margin: 0 auto;
}

.controle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--blanc-verre);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--bord-verre);
  border-radius: 14px;
  padding: 0.7rem 1rem;
  box-shadow: 0 2px 12px rgba(45,55,72,.06), 0 1px 0 rgba(255,255,255,.9) inset;
}

.controle-label {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--marine);
}

.controle-btns { display: flex; gap: 0.45rem; }

.btn-step {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid rgba(74,111,165,.25);
  background: linear-gradient(135deg, var(--bleu-clair) 0%, rgba(255,255,255,.8) 100%);
  color: var(--bleu);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.btn-step:hover {
  background: linear-gradient(135deg, var(--bleu) 0%, #3a5a8a 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(74,111,165,.3);
}
.btn-step:active { transform: scale(0.9); }

/* ── Responsive ── */
@media (max-width: 600px) {
  .controles { max-width: 100%; }
  .controle-label { font-size: 0.80rem; }
  .btn-step { width: 30px; height: 30px; font-size: 0.9rem; }
}
```

- [ ] **Step 3: Open `roue-des-emotions.html` in browser — verify page structure renders with header, empty SVG area, 3 control rows, and back/reset buttons**

- [ ] **Step 4: Commit**

```bash
git add roue-des-emotions.html roue-des-emotions.css
git commit -m "feat: add roue-des-emotions page scaffold and styles"
```

---

### Task 2: SVG data + helpers + ring builder

**Files:**
- Create: `roue-des-emotions.js`

**Interfaces:**
- Consumes: `#roue` SVG element (from Task 1 HTML)
- Produces: `RINGS_DATA` array, `buildRing(ring)` → `SVGGElement`, `ringEls[0..2]` array consumed by Task 3

- [ ] **Step 1: Create `roue-des-emotions.js` with data + SVG helpers**

```js
'use strict';

const CX = 300, CY = 300;

const RINGS_DATA = [
  {
    id: 'primaires',
    rInner: 0,
    rOuter: 110,
    fontSize: 10,
    fontWeight: '800',
    textFill: '#fff',
    segments: [
      { label: 'JOIE',      color: '#E040A0' },
      { label: 'PEUR',      color: '#29B6D4' },
      { label: 'DÉGOÛT',    color: '#66BB6A' },
      { label: 'SURPRISE',  color: '#9CCC65' },
      { label: 'TRISTESSE', color: '#FFC107' },
      { label: 'COLÈRE',    color: '#EF5350' },
    ],
  },
  {
    id: 'nuances',
    rInner: 110,
    rOuter: 220,
    fontSize: 7.5,
    fontWeight: '700',
    textFill: 'rgba(0,0,0,0.82)',
    segments: [
      { label: 'TERRIFIÉ',     color: '#5BC8D9' },
      { label: 'PRÉOCCUPÉ',    color: '#52C1D2' },
      { label: 'MÉFIANT',      color: '#49BACB' },
      { label: 'ANGOISSÉ',     color: '#40B3C4' },
      { label: 'SATISFAIT',    color: '#E8509A' },
      { label: 'OPTIMISTE',    color: '#E248A2' },
      { label: 'HEUREUX',      color: '#DC40AA' },
      { label: 'EXCITÉ',       color: '#D638B2' },
      { label: 'AMOUREUX',     color: '#D030BA' },
      { label: 'IRRITÉ',       color: '#F87272' },
      { label: 'IMPATIENT',    color: '#F45C5C' },
      { label: 'FURIEUX',      color: '#F04646' },
      { label: 'EXASPÉRÉ',     color: '#E83030' },
      { label: 'DÉSESPÉRÉ',    color: '#FFD040' },
      { label: 'DÉSOLÉ',       color: '#FFCA30' },
      { label: 'DÉÇU',         color: '#FFC420' },
      { label: 'AFFECTÉ',      color: '#FFBE10' },
      { label: 'ABATTU',       color: '#FFB800' },
      { label: 'TROUBLÉ',      color: '#B8D870' },
      { label: 'SECOUÉ',       color: '#AACC60' },
      { label: 'ÉMERVEILLÉ',   color: '#9CC050' },
      { label: 'ÉTONNÉ',       color: '#8EB440' },
      { label: 'ENTHOUSIASTE', color: '#7DB845' },
      { label: 'MÉPRISÉ',      color: '#72AD40' },
      { label: 'CONTRARIÉ',    color: '#67A23B' },
      { label: 'BLESSÉ',       color: '#5C9736' },
      { label: 'AMER',         color: '#518C31' },
      { label: 'AIGRI',        color: '#46812C' },
    ],
  },
  {
    id: 'besoins',
    rInner: 220,
    rOuter: 300,
    fontSize: 6.5,
    fontWeight: '700',
    textFill: '#fff',
    segments: [
      { label: ['SE SENTIR EN SÉCURITÉ', 'ÊTRE RASSURÉ'],                   color: '#29B6D4' },
      { label: ['SE PROTÉGER DE CE QUI', 'EST DANGEREUX POUR SOI'],         color: '#66BB6A' },
      { label: ["FAIRE FACE À L'IMPRÉVU", 'POUVOIR AGIR EN CONSÉQUENCE'],  color: '#A5B041' },
      { label: ['ÊTRE ÉCOUTÉ, CONSOLÉ', 'ÊTRE RÉCONFORTÉ'],                 color: '#8D7B3A' },
      { label: ['ÊTRE RESPECTÉ', 'ÊTRE ÉCOUTÉ ET COMPRIS'],                 color: '#8B2020' },
      { label: ['ÊTRE EN LIEN', 'PARTAGER AVEC LES AUTRES'],                color: '#7B3F9E' },
    ],
  },
];

// ── SVG utilities ──────────────────────────────────────────

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

/** Convert polar (angle from 12-o'clock, clockwise) to SVG cartesian */
function toXY(r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return {
    x: +(CX + r * Math.cos(rad)).toFixed(3),
    y: +(CY + r * Math.sin(rad)).toFixed(3),
  };
}

/** SVG arc path string (clockwise sweep=1, counterclockwise sweep=0) */
function arcD(r, a1, a2, sweep = 1) {
  const s = toXY(r, a1), e = toXY(r, a2);
  const large = ((a2 - a1) % 360 + 360) % 360 > 180 ? 1 : 0;
  return `M${s.x},${s.y} A${r},${r} 0 ${large},${sweep} ${e.x},${e.y}`;
}

/** SVG annular segment path */
function segD(rIn, rOut, a1, a2) {
  const large = ((a2 - a1) % 360 + 360) % 360 > 180 ? 1 : 0;
  const s1 = toXY(rOut, a1), e1 = toXY(rOut, a2);
  const s2 = toXY(rIn, a2),  e2 = toXY(rIn, a1);
  if (rIn === 0) {
    return `M${CX},${CY} L${s1.x},${s1.y} A${rOut},${rOut} 0 ${large},1 ${e1.x},${e1.y} Z`;
  }
  return [
    `M${s1.x},${s1.y}`,
    `A${rOut},${rOut} 0 ${large},1 ${e1.x},${e1.y}`,
    `L${s2.x},${s2.y}`,
    `A${rIn},${rIn} 0 ${large},0 ${e2.x},${e2.y}`,
    'Z',
  ].join(' ');
}

// ── Ring builder ───────────────────────────────────────────

function buildRing(ring) {
  const n = ring.segments.length;
  const step = 360 / n;

  const g = svgEl('g', { id: `ring-${ring.id}`, class: 'ring' });
  const defs = svgEl('defs');
  g.appendChild(defs);

  ring.segments.forEach((seg, i) => {
    const a1 = i * step;
    const a2 = (i + 1) * step;
    const mid = a1 + step / 2;

    // Filled segment
    g.appendChild(svgEl('path', {
      d: segD(ring.rInner, ring.rOuter, a1, a2),
      fill: seg.color,
      stroke: 'rgba(255,255,255,0.45)',
      'stroke-width': '1.5',
    }));

    // Text line(s) — curved via textPath
    const lines = Array.isArray(seg.label) ? seg.label : [seg.label];
    const nL = lines.length;
    const band = ring.rOuter - ring.rInner;

    lines.forEach((line, li) => {
      // Radius for each line
      let rText;
      if (ring.rInner === 0) {
        rText = ring.rOuter * (nL === 1 ? 0.60 : (li === 0 ? 0.40 : 0.73));
      } else {
        const frac = nL === 1 ? 0.50 : (li === 0 ? 0.28 : 0.72);
        rText = ring.rInner + band * frac;
      }

      const tpId = `tp-${ring.id}-${i}-${li}`;

      // For bottom-half segments, reverse arc direction so text reads left→right
      const isBottom = mid > 180 && mid < 360;
      const d = isBottom
        ? arcD(rText, a2 - 0.5, a1 + 0.5, 0)
        : arcD(rText, a1 + 0.5, a2 - 0.5, 1);

      defs.appendChild(svgEl('path', { id: tpId, d }));

      const text = svgEl('text', {
        'font-size': ring.fontSize,
        'font-weight': ring.fontWeight,
        'font-family': '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
        fill: ring.textFill,
        'text-anchor': 'middle',
      });

      const tp = svgEl('textPath', { href: `#${tpId}`, startOffset: '50%' });
      tp.textContent = line;
      text.appendChild(tp);
      g.appendChild(text);
    });
  });

  // Outer border circle for this ring
  if (ring.rInner > 0) {
    g.appendChild(svgEl('circle', {
      cx: CX, cy: CY, r: ring.rInner,
      fill: 'none',
      stroke: 'rgba(255,255,255,0.6)',
      'stroke-width': '2',
    }));
  }

  return g;
}

// ── Init ───────────────────────────────────────────────────

const svg = document.getElementById('roue');

// Outer border
svg.appendChild(svgEl('circle', {
  cx: CX, cy: CY, r: 300,
  fill: 'none',
  stroke: 'rgba(255,255,255,0.6)',
  'stroke-width': '2',
}));

const ringEls = RINGS_DATA.map(ring => {
  const g = buildRing(ring);
  svg.appendChild(g);
  return g;
});
```

- [ ] **Step 2: Open page in browser — verify all 3 rings render with correct colors and text. All text should be right-side-up (no upside-down labels).**

- [ ] **Step 3: Commit**

```bash
git add roue-des-emotions.js
git commit -m "feat: SVG ring builder with data and textPath labels"
```

---

### Task 3: Rotation logic — drag + step buttons + reset

**Files:**
- Modify: `roue-des-emotions.js` (append after Task 2 code)

**Interfaces:**
- Consumes: `svg`, `ringEls[0..2]`, `RINGS_DATA`, `CX`, `CY` (from Task 2)
- Consumes: `#btn-reset`, `.btn-step[data-ring][data-dir]` (from Task 1 HTML)

- [ ] **Step 1: Append rotation logic to `roue-des-emotions.js`**

Add the following code at the end of `roue-des-emotions.js` (after the ring init block):

```js
// ── Rotation state ─────────────────────────────────────────

const ringAngles = [0, 0, 0];

function setAngle(i, angle, animated = true) {
  ringAngles[i] = angle;
  if (animated) {
    ringEls[i].classList.remove('dragging');
  } else {
    ringEls[i].classList.add('dragging');
  }
  ringEls[i].style.transformOrigin = `${CX}px ${CY}px`;
  ringEls[i].style.transform = `rotate(${angle}deg)`;
}

// ── Drag via Pointer Events ────────────────────────────────

let drag = null;

svg.addEventListener('pointerdown', e => {
  e.preventDefault();
  const rect = svg.getBoundingClientRect();
  const scale = 600 / rect.width;
  const x = (e.clientX - rect.left) * scale - CX;
  const y = (e.clientY - rect.top)  * scale - CY;
  const dist = Math.hypot(x, y);

  if (dist < 8 || dist > 300) return;

  const ri = dist <= 110 ? 0 : dist <= 220 ? 1 : 2;
  drag = {
    ri,
    startMouseAngle: Math.atan2(y, x) * 180 / Math.PI,
    startRingAngle:  ringAngles[ri],
  };
  svg.setPointerCapture(e.pointerId);
});

svg.addEventListener('pointermove', e => {
  if (!drag) return;
  const rect = svg.getBoundingClientRect();
  const scale = 600 / rect.width;
  const x = (e.clientX - rect.left) * scale - CX;
  const y = (e.clientY - rect.top)  * scale - CY;
  let delta = Math.atan2(y, x) * 180 / Math.PI - drag.startMouseAngle;
  // Normalize to [-180, 180] to avoid jumps at ±180° wrap
  if (delta > 180)  delta -= 360;
  if (delta < -180) delta += 360;
  setAngle(drag.ri, drag.startRingAngle + delta, false);
});

svg.addEventListener('pointerup', () => { drag = null; });

// ── Step buttons ───────────────────────────────────────────

document.querySelectorAll('.btn-step').forEach(btn => {
  btn.addEventListener('click', () => {
    const ri  = +btn.dataset.ring;
    const dir = +btn.dataset.dir;
    const step = 360 / RINGS_DATA[ri].segments.length;
    setAngle(ri, ringAngles[ri] + dir * step);
  });
});

// ── Reset ──────────────────────────────────────────────────

document.getElementById('btn-reset').addEventListener('click', () => {
  [0, 1, 2].forEach(i => setAngle(i, 0));
});
```

- [ ] **Step 2: Test drag — open browser, drag each ring independently. Verify:**
  - Inner ring (primary emotions) rotates only when dragging inside r=110
  - Middle ring (nuances) rotates only when dragging between r=110 and r=220
  - Outer ring (needs) rotates only when dragging between r=220 and r=300
  - No ring jumps when releasing and re-dragging

- [ ] **Step 3: Test step buttons — click ← and → for each row. Verify animated snap rotation of correct ring**

- [ ] **Step 4: Test reset — rotate all rings, click Réinitialiser, all return to 0°**

- [ ] **Step 5: Test touch (open DevTools → mobile emulation) — drag works with touch on all 3 rings**

- [ ] **Step 6: Commit**

```bash
git add roue-des-emotions.js
git commit -m "feat: drag and step-button rotation for all 3 SVG rings"
```

---

### Task 4: Activate card in index.html

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: nothing
- Produces: clickable card linking to `roue-des-emotions.html`

- [ ] **Step 1: Remove `disabled` class from the roue-des-emotions card in `index.html`**

In `index.html`, find:
```html
<a href="roue-des-emotions.html" class="card disabled">
```

Change to:
```html
<a href="roue-des-emotions.html" class="card">
```

- [ ] **Step 2: Open `index.html` in browser — verify the card is no longer grayed out, hover effect works, and clicking navigates to the roue page**

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: activate roue-des-emotions card on home page"
```
