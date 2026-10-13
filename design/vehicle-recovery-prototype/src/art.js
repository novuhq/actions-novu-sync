/* Art: icons, the shared Dubai map (one world coordinate space, 1000 x 1000, north up),
   and the night skyline illustration. Every map in the prototype is a camera onto the same city. */

const ICON = {
  back: '<path d="M15 6l-6 6 6 6"/>',
  next: '<path d="M9 6l6 6-6 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  locate: '<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
  car: '<path d="M2.5 15.5v-2.2l2.6-4.1a2 2 0 0 1 1.7-.9h7.7a3 3 0 0 1 2.1.9l2.9 2.9 1.9.6a1.6 1.6 0 0 1 1.1 1.5v1.3"/><circle cx="7" cy="16" r="1.8"/><circle cx="17.5" cy="16" r="1.8"/><path d="M9 16h6.6M2.5 16h2.6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  share: '<path d="M12 3v12M7 8l5-5 5 5M5 13v6h14v-6"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5L12 6l2.5-1.5M9.5 19.5L12 18l2.5 1.5"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  refresh: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
  home: '<path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
  radar: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5h4"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor" stroke="none"/>',
  turn: '<path d="M7 21v-8a4 4 0 0 1 4-4h8M15 5l4 4-4 4"/>',
  up: '<path d="M12 20V6M6 12l6-6 6 6"/>',
  send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
  restart: '<path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.7 5.4 3.7 8.5s-1.2 5.9-3.7 8.5M12 3.5C9.5 6.1 8.3 8.9 8.3 12s1.2 5.9 3.7 8.5"/>',
  card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/>',
};
function icon(name, size = 20, sw = 1.8) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;
}
const MARK = (s = 32) => `<svg width="${s}" height="${s}" viewBox="0 0 36 36" aria-hidden="true"><rect width="36" height="36" rx="10" fill="#E0AA4E"/><circle cx="12" cy="24" r="3" fill="#1A1206"/><path d="M12 15a9 9 0 0 1 9 9M12 9a15 15 0 0 1 15 15" fill="none" stroke="#1A1206" stroke-width="2.4" stroke-linecap="round"/></svg>`;

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const f1 = (n) => Math.round(n * 10) / 10;

/* Shared <defs> live once in the document; every map and skyline references them. */
const SHARED_DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <pattern id="pStreets" width="12" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-27.47)"><path d="M12 0V9M0 9H12" fill="none" stroke="#161A23" stroke-width=".6"/></pattern>
  <pattern id="pStar" width="24" height="24" patternUnits="userSpaceOnUse"><g fill="none" stroke="#E0AA4E" stroke-width=".45"><path d="M6 6h12v12H6z"/><path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z"/><path d="M12 0v3.5M12 20.5V24M0 12h3.5M20.5 12H24"/></g></pattern>
  <radialGradient id="gHeat"><stop offset="0" stop-color="#E0AA4E" stop-opacity=".5"/><stop offset=".55" stop-color="#E0AA4E" stop-opacity=".16"/><stop offset="1" stop-color="#E0AA4E" stop-opacity="0"/></radialGradient>
  <radialGradient id="gHeatSoft"><stop offset="0" stop-color="#E0AA4E" stop-opacity=".24"/><stop offset="1" stop-color="#E0AA4E" stop-opacity="0"/></radialGradient>
  <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06070C"/><stop offset=".62" stop-color="#121224"/><stop offset=".86" stop-color="#2A1C2A"/><stop offset="1" stop-color="#3A2626"/></linearGradient>
  <linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1220"/><stop offset="1" stop-color="#05070B"/></linearGradient>
  <linearGradient id="gReflect" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <mask id="mReflect" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#gReflect)"/></mask>
  <radialGradient id="gMoon"><stop offset="0" stop-color="#F2E8D5" stop-opacity=".35"/><stop offset="1" stop-color="#F2E8D5" stop-opacity="0"/></radialGradient>
  <radialGradient id="gGlow"><stop offset="0" stop-color="#E0AA4E" stop-opacity=".22"/><stop offset="1" stop-color="#E0AA4E" stop-opacity="0"/></radialGradient>
</defs></svg>`;

/* ---------------- Dubai map ---------------- */
const Dubai = (() => {
  const K = 0.52;
  const ANG = -27.47;
  const coast = (x) => 640 - K * x;
  const sufouh = (x) => 682 - K * x;
  const szr = (x) => 730 - K * x;
  const khail = (x) => 832 - K * x;
  const e611 = (x) => 960 - K * x;
  const U = [0.461, 0.887];
  const road = (fn, x1 = -80, x2 = 1080) => `M${x1} ${f1(fn(x1))}L${x2} ${f1(fn(x2))}`;

  const PLACES = {
    pickup: { x: 330, y: 558.4, name: 'Sheikh Zayed Road' },
    marina: { x: 152, y: 594, name: 'Dubai Marina' },
    hills: { x: 268, y: 722, name: 'Emirates Hills' },
    alquoz: { x: 548, y: 636, name: 'Al Quoz' },
    barsha: { x: 300, y: 640, name: 'Al Barsha' },
    jlt: { x: 130, y: 682, name: 'JLT' },
    difc: { x: 690, y: 394, name: 'DIFC' },
    deira: { x: 960, y: 186, name: 'Deira' },
    downtown: { x: 652, y: 432, name: 'Downtown' },
  };
  const ROUTES = {
    toPickup: [[300, 640], [273, 588], [330, 558.4]],
    marina: [[330, 558.4], [175, 639], [152, 594]],
    hills: [[330, 558.4], [215, 618.2], [268, 722]],
    alquoz: [[330, 558.4], [470, 485.6], [548, 636]],
  };

  function cross() {
    let minor = '', major = '';
    for (let i = 0; i < 15; i++) {
      const x0 = 30 + i * 72;
      const y0 = szr(x0);
      const a = [x0 - U[0] * 82, y0 - U[1] * 82];
      const b = [x0 + U[0] * 420, y0 + U[1] * 420];
      const d = `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`;
      if (i % 3 === 1) major += d; else minor += d;
    }
    return `<path d="${minor}" stroke="#1A1D27" stroke-width="2.2" fill="none"/><path d="${major}" stroke="#21242F" stroke-width="3.6" fill="none"/>`;
  }
  function palm() {
    const base = [268, coast(268)];
    const o = [-U[0], -U[1]];
    const len = 108;
    const tip = [base[0] + o[0] * len, base[1] + o[1] * len];
    const ang = Math.atan2(o[1], o[0]);
    let fr = '';
    for (let k = 0; k < 8; k++) {
      const t = 0.32 + k * 0.088;
      const p = [base[0] + o[0] * len * t, base[1] + o[1] * len * t];
      const L = 22 + k * 1.6;
      for (const s of [-1, 1]) {
        const a = ang + s * 1.0;
        fr += `M${f1(p[0])} ${f1(p[1])}L${f1(p[0] + Math.cos(a) * L)} ${f1(p[1] + Math.sin(a) * L)}`;
      }
    }
    const R = 66, a1 = ang - 2.05, a2 = ang + 2.05;
    const c1 = [tip[0] + Math.cos(a1) * R, tip[1] + Math.sin(a1) * R];
    const c2 = [tip[0] + Math.cos(a2) * R, tip[1] + Math.sin(a2) * R];
    return `<g stroke="#171B26" fill="none" stroke-linecap="round">
      <path d="M${f1(base[0])} ${f1(base[1])}L${f1(tip[0])} ${f1(tip[1])}" stroke-width="5"/>
      <path d="${fr}" stroke-width="2.6"/>
      <path d="M${f1(c1[0])} ${f1(c1[1])}A${R} ${R} 0 1 1 ${f1(c2[0])} ${f1(c2[1])}" stroke-width="4"/></g>`;
  }
  function world() {
    const r = rng(11);
    let d = '';
    for (let i = 0; i < 46; i++) {
      const a = r() * Math.PI * 2, rr = Math.sqrt(r());
      d += `<circle cx="${f1(600 + Math.cos(a) * 70 * rr)}" cy="${f1(205 + Math.sin(a) * 38 * rr)}" r="${f1(1.2 + r() * 2)}"/>`;
    }
    return `<g fill="#141822">${d}</g>`;
  }
  function parks() {
    const p = (x, y, w, h) => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="3" transform="rotate(${ANG} ${x} ${y})"/>`;
    return `<g fill="#0E1915">${p(332, 652, 26, 14)}${p(808, 372, 46, 24)}${p(560, 452, 22, 12)}${p(205, 700, 30, 16)}</g>`;
  }

  const baseCache = {};
  function base(z) {
    const key = f1(z);
    if (baseCache[key]) return baseCache[key];
    const fs = (px) => f1(px / z);
    const lab = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-family="Geist Mono, ui-monospace, monospace" font-size="${fs(o.size || 8.5)}" letter-spacing="${fs(o.ls || 1.6)}" fill="${o.fill || '#5B6072'}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.rot ? ` transform="rotate(${ANG} ${x} ${y})"` : ''}>${t}</text>`;
    const s = 1 / z;
    const lm = (x, y, path, name, dx = 6, dy = 3) => `<g transform="translate(${x} ${y}) scale(${f1(s * 10) / 10})"><path d="${path}" fill="none" stroke="#C99A4F" stroke-width="1.4" stroke-linejoin="round"/></g>${lab(f1(x + dx * s), f1(y + dy * s), name, { fill: '#9C845A', size: 8 })}`;
    const svg = `
      <rect x="-200" y="-200" width="1400" height="1400" fill="#0D0F15"/>
      <rect x="-200" y="-200" width="1400" height="1400" fill="url(#pStreets)"/>
      ${parks()}
      ${cross()}
      <path d="${road(e611)}" stroke="#1E212B" stroke-width="4" fill="none"/>
      <path d="${road(khail)}" stroke="#23262F" stroke-width="5" fill="none"/>
      <path d="${road(sufouh)}" stroke="#20232D" stroke-width="3.4" fill="none"/>
      <path d="${road(szr)}" stroke="#2A2E3A" stroke-width="8" fill="none"/>
      <path d="${road(szr)}" stroke="#3E4352" stroke-width=".7" fill="none"/>
      <path d="M-200 ${f1(coast(-200))}L1200 ${f1(coast(1200))}L1200 -200L-200 -200Z" fill="#08121A"/>
      <path d="${road(coast, -200, 1200)}" stroke="#4FC1C6" stroke-opacity=".14" stroke-width="7" fill="none"/>
      <path d="${road(coast, -200, 1200)}" stroke="#1D3E46" stroke-width="1.3" fill="none"/>
      <path d="M96 611L150 583L206 556" stroke="#08121A" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M903 171C922 212 952 258 1012 312" stroke="#08121A" stroke-width="15" stroke-linecap="round" fill="none"/>
      ${palm()}
      ${world()}
      <circle cx="368" cy="439" r="4.5" fill="#151924"/>
      ${lm(368, 438, 'M-3 4L-3 -9Q4 -5 4.5 4Z', 'BURJ AL ARAB', 7, -4)}
      ${lm(652, 432, 'M0 -16L1.3 -7L2.6 -5L2.6 5L-2.6 5L-2.6 -5L-1.3 -7Z', 'BURJ KHALIFA', 7, 2)}
      ${lm(712, 372, 'M-5 0A5 3.6 0 1 0 5 0A5 3.6 0 1 0 -5 0M-2 0A2 1.2 0 1 0 2 0A2 1.2 0 1 0 -2 0', 'MUSEUM OF THE FUTURE', 8, 3)}
      ${lm(812, 344, 'M-3.5 5V-6H3.5V5M-1.6 5V-4.2H1.6V5', 'DUBAI FRAME', 7, 3)}
      ${lab(255, 285, 'ARABIAN GULF', { fill: '#23434B', size: 10, ls: 3, anchor: 'middle' })}
      ${lab(600, 160, 'THE WORLD', { fill: '#1F3A41', size: 7.5, anchor: 'middle' })}
      ${lab(218, 322, 'PALM JUMEIRAH', { fill: '#2B4A52', size: 8, anchor: 'middle' })}
      ${lab(64, 632, 'DUBAI MARINA')}
      ${lab(106, 708, 'JLT')}
      ${lab(362, 522, 'AL SUFOUH')}
      ${lab(318, 684, 'AL BARSHA')}
      ${lab(574, 666, 'AL QUOZ')}
      ${lab(522, 398, 'JUMEIRAH')}
      ${lab(626, 470, 'DOWNTOWN')}
      ${lab(700, 414, 'DIFC')}
      ${lab(944, 176, 'DEIRA')}
      ${lab(180, 748, 'EMIRATES HILLS')}
      ${lab(430, 506, 'E11 · SHEIKH ZAYED RD', { rot: true, fill: '#6A6F80', size: 7.5 })}
      ${lab(470, 584, 'E44 · AL KHAIL RD', { rot: true, fill: '#4E5363', size: 7 })}
      ${lab(150, 590, 'AL SUFOUH RD', { rot: true, fill: '#4E5363', size: 7 })}
    `;
    baseCache[key] = svg;
    return svg;
  }

  function along(pts, t) {
    const seg = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      seg.push(l); total += l;
    }
    let d = Math.max(0, Math.min(1, t)) * total;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) {
        const k = seg[i] ? Math.min(1, d / seg[i]) : 0;
        const a = pts[i], b = pts[i + 1];
        return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, i, rest: [[a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], ...pts.slice(i + 1)] };
      }
      d -= seg[i];
    }
    return { x: pts[0][0], y: pts[0][1], ang: 0, i: 0, rest: pts };
  }
  const pathD = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])}`).join('');

  function truckGlyph(z, color = '#E0AA4E', ink = '#1A1206') {
    const s = f1(1 / z * 10) / 10;
    return `<g transform="scale(${s})"><rect x="-16" y="-10.5" width="32" height="21" rx="7" fill="${color}" stroke="#07080C" stroke-width="3"/><path d="M4 -5.5L9.5 0L4 5.5" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M-9 -3.5H0M-9 0H0M-9 3.5H0" stroke="${ink}" stroke-width="1.6" stroke-linecap="round"/></g>`;
  }

  /* opts: view [x,y,w,h], z (px per unit), routes [{pts, done, flow}], marks [...], heat [...] */
  function map(o) {
    const [vx, vy, vw, vh] = o.view;
    const z = o.z || 1.5;
    const px = (n) => f1(n / z);
    let layers = '';
    for (const h of o.heat || []) layers += `<circle cx="${h.x}" cy="${h.y}" r="${h.r}" fill="url(#${h.soft ? 'gHeatSoft' : 'gHeat'})"/>`;
    for (const r of o.routes || []) {
      const d = pathD(r.pts);
      if (r.done) { layers += `<path d="${d}" stroke="#5B6072" stroke-width="${px(3)}" stroke-dasharray="${px(2)} ${px(5)}" fill="none" stroke-linecap="round"/>`; continue; }
      const color = r.color || '#E0AA4E';
      layers += `<path${r.id ? ` id="${r.id}-glow"` : ''} d="${d}" stroke="${color}" stroke-opacity=".2" stroke-width="${px(13)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      layers += `<path${r.id ? ` id="${r.id}"` : ''} d="${d}" stroke="${color}" stroke-width="${px(4)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      if (r.flow) layers += `<path${r.id ? ` id="${r.id}-flow"` : ''} class="flow" d="${d}" stroke="#1A1206" stroke-width="${px(1.6)}" stroke-dasharray="${px(2)} ${px(10)}" fill="none" stroke-linecap="round" style="animation-duration:1.1s"/>`;
    }
    for (const m of o.marks || []) {
      const s = f1(1 / z * 10) / 10;
      if (m.type === 'me') {
        layers += `<g transform="translate(${m.x} ${m.y})"><circle r="${px(60)}" fill="url(#gGlow)"/><g transform="scale(${s})"><circle r="26" fill="none" stroke="${m.color || '#E0AA4E'}" stroke-width="1.5" class="svg-pulse"/><circle r="9" fill="${m.color || '#E0AA4E'}" stroke="#07080C" stroke-width="4"/></g></g>`;
      } else if (m.type === 'drop') {
        layers += `<g transform="translate(${m.x} ${m.y}) scale(${s})"><rect x="-8" y="-8" width="16" height="16" rx="4" fill="#F2E8D5" stroke="#07080C" stroke-width="3.5"/></g>`;
      } else if (m.type === 'truck') {
        layers += `<g${m.id ? ` id="${m.id}"` : ''} transform="translate(${f1(m.x)} ${f1(m.y)}) rotate(${f1(m.ang || 0)})">${truckGlyph(z, m.color, m.ink)}</g>`;
      } else if (m.type === 'nav') {
        layers += `<g${m.id ? ` id="${m.id}"` : ''} transform="translate(${f1(m.x)} ${f1(m.y)}) rotate(${f1((m.ang || 0) + 90)})"><g transform="scale(${s})"><circle r="24" fill="#F2E8D5" fill-opacity=".12"/><circle r="15" fill="#F2E8D5" stroke="#07080C" stroke-width="3"/><path d="M0 -8L6 7L0 3.5L-6 7Z" fill="#07080C"/></g></g>`;
      } else if (m.type === 'dot') {
        layers += `<g${m.id ? ` id="${m.id}"` : ''} transform="translate(${f1(m.x)} ${f1(m.y)}) scale(${s})"><circle r="6.5" fill="${m.color}" stroke="#0D0F15" stroke-width="2.5"/>${m.letter ? `<text y="3" text-anchor="middle" font-family="Geist Mono, monospace" font-size="7.5" font-weight="600" fill="#07080C">${m.letter}</text>` : ''}</g>`;
      } else if (m.type === 'job') {
        layers += `<g transform="translate(${m.x} ${m.y}) scale(${s})"${m.act ? ` data-act="${m.act}" data-id="${m.jid}" style="cursor:pointer"` : ''}>${m.hot ? '<circle r="14" fill="none" stroke="#F0604D" stroke-width="2" class="svg-pulse"/>' : ''}<rect x="-16" y="-11" width="32" height="22" rx="7" fill="${m.hot ? '#F0604D' : '#10121A'}" stroke="${m.hot ? '#0D0F15' : m.color}" stroke-width="${m.hot ? 2.5 : 1.6}"/><text y="3.5" text-anchor="middle" font-family="Geist Mono, monospace" font-size="9" font-weight="600" fill="${m.hot ? '#1B0B09' : '#F2E8D5'}">${m.code}</text></g>`;
      } else if (m.type === 'link') {
        layers += `<path d="M${m.a[0]} ${m.a[1]}L${m.b[0]} ${m.b[1]}" stroke="${m.color || '#F0604D'}" stroke-width="${px(1.5)}" stroke-dasharray="${px(3)} ${px(4)}" fill="none"/>`;
      } else if (m.type === 'ring') {
        layers += `<circle cx="${m.x}" cy="${m.y}" r="${m.r}" fill="none" stroke="#E0AA4E" stroke-opacity="${m.o || .3}" stroke-width="${px(1)}" stroke-dasharray="${px(3)} ${px(4)}"/>`;
      }
    }
    return `<svg viewBox="${vx} ${vy} ${vw} ${vh}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="display:block;width:100%;height:100%">${base(z)}${layers}</svg>`;
  }

  /* world -> pixel inside a container of W x H using slice fit */
  function project(view, W, H, x, y) {
    const [vx, vy, vw, vh] = view;
    const s = Math.max(W / vw, H / vh);
    const ox = (W - vw * s) / 2, oy = (H - vh * s) / 2;
    return [ox + (x - vx) * s, oy + (y - vy) * s];
  }
  function camera(cx, cy, W, H, z) {
    const vw = W / z, vh = H / z;
    return [f1(cx - vw / 2), f1(cy - vh / 2), f1(vw), f1(vh)];
  }

  return { map, project, camera, along, pathD, PLACES, ROUTES, truckGlyph };
})();

/* ---------------- Skyline ---------------- */
function skyline(o = {}) {
  const W = 1200, G = 420;
  const r = rng(o.seed || 7);
  const H = o.reflect ? 560 : G;
  const far = [], mid = [], lights = [];
  // far layer: dense mid-rise
  for (let x = -10; x < W; ) {
    const w = 18 + r() * 34, h = 60 + r() * 120;
    far.push(`<rect x="${f1(x)}" y="${f1(G - h)}" width="${f1(w)}" height="${f1(h)}"/>`);
    x += w + r() * 6;
  }
  const tower = (x, w, h, top = 'flat') => {
    const y = G - h;
    let d;
    if (top === 'slope') d = `M${x} ${G}V${y + 18}L${x + w} ${y}V${G}Z`;
    else if (top === 'spire') d = `M${x} ${G}V${y + 10}H${x + w * 0.35}L${x + w / 2} ${y - 30}L${x + w * 0.65} ${y + 10}H${x + w}V${G}Z`;
    else if (top === 'round') d = `M${x} ${G}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${G}Z`;
    else d = `M${x} ${G}V${y}H${x + w}V${G}Z`;
    mid.push(`<path d="${d}"/>`);
    for (let i = 0; i < h / 7; i++) {
      if (r() < 0.42) lights.push([x + 3 + r() * (w - 6), y + 14 + r() * (h - 18)]);
    }
  };
  // marina cluster (left)
  tower(40, 26, 230, 'spire'); tower(74, 22, 250, 'flat'); tower(104, 28, 210, 'round'); tower(142, 20, 270, 'spire'); tower(170, 26, 190, 'flat');
  // Dubai Frame
  mid.push(`<path d="M262 ${G}V${G - 150}H322V${G}H306V${G - 136}H278V${G}Z"/>`);
  // Jumeirah mosque: dome + two minarets
  mid.push(`<path d="M360 ${G}V${G - 34}H372A26 26 0 0 1 424 ${G - 34}H436V${G}Z"/><path d="M352 ${G}V${G - 78}L355 ${G - 92}L358 ${G - 78}V${G}Z"/><path d="M438 ${G}V${G - 78}L441 ${G - 92}L444 ${G - 78}V${G}Z"/><circle cx="398" cy="${G - 64}" r="2.2"/>`);
  // Emirates Towers
  tower(474, 22, 250, 'slope'); tower(504, 18, 214, 'slope');
  // Burj Khalifa — stepped, slightly asymmetric setbacks
  const bx = 600;
  const bk = [[-36, G], [-36, 300], [-28, 300], [-28, 238], [-21, 238], [-21, 182], [-14, 182], [-14, 132], [-9, 132], [-9, 92], [-5, 92], [-5, 56], [-2, 56], [0, 6], [2, 56], [6, 56], [6, 100], [10, 100], [10, 146], [16, 146], [16, 196], [23, 196], [23, 252], [30, 252], [30, 310], [37, 310], [37, G]];
  mid.push(`<path d="M${bk.map(([dx, y]) => `${bx + dx} ${y}`).join('L')}Z"/>`);
  for (let i = 0; i < 70; i++) { const y = 70 + r() * 340; const half = Math.max(2, 36 * (y - 40) / 380); lights.push([bx - half * 0.8 + r() * half * 1.6, y]); }
  // Address Sky View — twin towers with bridge
  tower(668, 24, 230, 'flat'); tower(700, 24, 230, 'flat'); mid.push(`<rect x="690" y="${G - 236}" width="12" height="16"/>`);
  // Museum of the Future — the torus
  mid.push(`<path fill-rule="evenodd" d="M752 ${G}V${G - 20}C740 ${G - 60} 750 ${G - 118} 800 ${G - 120}C852 ${G - 118} 862 ${G - 60} 848 ${G - 20}V${G}ZM778 ${G - 64}C778 ${G - 92} 822 ${G - 92} 822 ${G - 64}C822 ${G - 46} 778 ${G - 46} 778 ${G - 64}Z"/>`);
  // Downtown mid-rise
  tower(880, 30, 170, 'flat'); tower(916, 24, 210, 'spire'); tower(946, 30, 150, 'round');
  // Burj Al Arab — the sail
  mid.push(`<path d="M1030 ${G}V${G - 250}Q1106 ${G - 190} 1112 ${G}Z"/><path d="M1030 ${G - 250}V${G - 290}" stroke="#0C0E15" stroke-width="3"/><circle cx="1050" cy="${G - 176}" r="9"/>`);
  tower(1130, 26, 140, 'flat'); tower(1162, 30, 180, 'slope');

  let stars = '';
  if (o.stars !== false) {
    for (let i = 0; i < 90; i++) {
      const sx = r() * W, sy = r() * 200, sr = 0.5 + r() * 1.1;
      stars += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(sr)}" fill="#F2E8D5" opacity="${f1(.25 + r() * .6)}"${r() < 0.25 ? ` class="twinkle" style="animation-delay:${f1(r() * 3)}s"` : ''}/>`;
    }
  }
  const moon = o.moon === false ? '' : `<circle cx="${o.moonX || 960}" cy="${o.moonY || 92}" r="70" fill="url(#gMoon)"/><circle cx="${o.moonX || 960}" cy="${o.moonY || 92}" r="20" fill="#F2E8D5"/><circle cx="${(o.moonX || 960) + 9}" cy="${(o.moonY || 92) - 5}" r="18" fill="#0E0F1C"/>`;
  const lightDots = lights.map(([x, y]) => `<rect x="${f1(x)}" y="${f1(y)}" width="1.6" height="2.2" fill="${r() < .2 ? '#FFE3A6' : '#E0AA4E'}" opacity="${f1(.35 + r() * .55)}"/>`).join('');
  const city = `<g fill="#11131D">${far.join('')}</g><g fill="#0A0B12">${mid.join('')}</g>${o.lights === false ? '' : lightDots}`;
  const reflect = o.reflect ? `<rect y="${G}" width="${W}" height="${H - G}" fill="url(#gWater)"/><g transform="translate(0 ${2 * G}) scale(1 -1)" opacity=".28" mask="url(#mReflect)">${city}</g><g stroke="#E0AA4E" stroke-opacity=".18">${Array.from({ length: 9 }, (_, i) => `<path d="M${f1(80 + r() * 1000)} ${G + 16 + i * 14}h${f1(30 + r() * 90)}"/>`).join('')}</g>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="${o.par || 'xMidYMax slice'}" aria-hidden="true"${o.natural ? '' : ' style="display:block;width:100%;height:100%"'}>${o.sky === false ? '' : `<rect width="${W}" height="${G}" fill="url(#gSky)"/>`}${o.pattern ? `<rect width="${W}" height="${G}" fill="url(#pStar)" opacity=".07"/>` : ''}${stars}${moon}${city}${reflect}</svg>`;
}
