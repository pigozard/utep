'use strict';

const CX = 300, CY = 300, R = 268;

const EMOTIONS = [
  { label: 'JOIE',      color: '#E040A0', emoji: '😊' },
  { label: 'PEUR',      color: '#29B6D4', emoji: '😨' },
  { label: 'DÉGOÛT',    color: '#66BB6A', emoji: '🤢' },
  { label: 'SURPRISE',  color: '#9CCC65', emoji: '😲' },
  { label: 'TRISTESSE', color: '#FFC107', emoji: '😢' },
  { label: 'COLÈRE',    color: '#EF5350', emoji: '😠' },
];

// ── SVG helpers ────────────────────────────────────────────

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function toXY(r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return {
    x: +(CX + r * Math.cos(rad)).toFixed(2),
    y: +(CY + r * Math.sin(rad)).toFixed(2),
  };
}

function sliceD(r, a1, a2) {
  const s = toXY(r, a1), e = toXY(r, a2);
  const large = ((a2 - a1) % 360 + 360) % 360 > 180 ? 1 : 0;
  return `M${CX},${CY} L${s.x},${s.y} A${r},${r} 0 ${large},1 ${e.x},${e.y} Z`;
}

// ── Build wheel ────────────────────────────────────────────

const svg = document.getElementById('roue');
const step = 360 / EMOTIONS.length;
const g = svgEl('g', { id: 'ring', class: 'ring' });

EMOTIONS.forEach((em, i) => {
  const a1  = i * step;
  const a2  = (i + 1) * step;
  const mid = a1 + step / 2;

  // Slice
  g.appendChild(svgEl('path', {
    d: sliceD(R, a1, a2),
    fill: em.color,
    stroke: 'rgba(255,255,255,0.55)',
    'stroke-width': '2.5',
  }));

  // Emoji — large, at 48% radius
  const ep = toXY(R * 0.48, mid);
  const emoji = svgEl('text', {
    x: ep.x, y: ep.y,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    'font-size': '52',
  });
  emoji.textContent = em.emoji;
  g.appendChild(emoji);

  // Label — at 78% radius, rotated radially then flipped for bottom half
  const lp = toXY(R * 0.78, mid);
  const rot = (mid > 90 && mid < 270) ? mid + 180 : mid;
  const label = svgEl('text', {
    x: lp.x, y: lp.y,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    'font-size': '15',
    'font-weight': '800',
    'letter-spacing': '0.07em',
    'font-family': '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    fill: '#fff',
    transform: `rotate(${rot},${lp.x},${lp.y})`,
  });
  label.textContent = em.label;
  g.appendChild(label);
});

// Outer border
g.appendChild(svgEl('circle', {
  cx: CX, cy: CY, r: R,
  fill: 'none',
  stroke: 'rgba(255,255,255,0.55)',
  'stroke-width': '2.5',
}));

svg.appendChild(g);

// ── Rotation ───────────────────────────────────────────────

let angle = 0;

function setAngle(a, animated = true) {
  angle = a;
  g.classList.toggle('dragging', !animated);
  g.style.transformOrigin = `${CX}px ${CY}px`;
  g.style.transform = `rotate(${a}deg)`;
}

// Drag
let drag = null;

svg.addEventListener('pointerdown', e => {
  e.preventDefault();
  const rect  = svg.getBoundingClientRect();
  const scale = 600 / rect.width;
  const x = (e.clientX - rect.left) * scale - CX;
  const y = (e.clientY - rect.top)  * scale - CY;
  if (Math.hypot(x, y) > R) return;
  drag = { startMouse: Math.atan2(y, x) * 180 / Math.PI, startAngle: angle };
  svg.setPointerCapture(e.pointerId);
});

svg.addEventListener('pointermove', e => {
  if (!drag) return;
  const rect  = svg.getBoundingClientRect();
  const scale = 600 / rect.width;
  const x = (e.clientX - rect.left) * scale - CX;
  const y = (e.clientY - rect.top)  * scale - CY;
  let delta = Math.atan2(y, x) * 180 / Math.PI - drag.startMouse;
  if (delta >  180) delta -= 360;
  if (delta < -180) delta += 360;
  setAngle(drag.startAngle + delta, false);
});

svg.addEventListener('pointerup', () => { drag = null; });

// Step buttons
document.querySelectorAll('.btn-step').forEach(btn => {
  btn.addEventListener('click', () => {
    setAngle(angle + +btn.dataset.dir * step);
  });
});

// Reset
document.getElementById('btn-reset').addEventListener('click', () => setAngle(0));
