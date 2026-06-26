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
      let rText;
      if (ring.rInner === 0) {
        rText = ring.rOuter * (nL === 1 ? 0.60 : (li === 0 ? 0.40 : 0.73));
      } else {
        const frac = nL === 1 ? 0.50 : (li === 0 ? 0.28 : 0.72);
        rText = ring.rInner + band * frac;
      }

      const tpId = `tp-${ring.id}-${i}-${li}`;

      // Reverse arc for bottom-half segments so text reads left→right
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

  // Separator ring border
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
  // Normalize to [-180, 180] to avoid jumps at the ±180° wrap
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
