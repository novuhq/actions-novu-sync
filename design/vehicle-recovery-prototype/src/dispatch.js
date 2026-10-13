/* Dispatch web app — the control room: live map, assignment, roster and analytics. */

const STATUS = {
  unassigned: { label: 'Unassigned', cls: 'crit', color: '#F0604D' },
  assigned: { label: 'Assigned', cls: '', color: '#BDB3A0' },
  enroute: { label: 'En route', cls: 'info', color: '#5BA8F5' },
  loading: { label: 'Loading', cls: 'gold', color: '#E0AA4E' },
  complete: { label: 'Complete', cls: 'good', color: '#3CCB7F' },
};
function dispatchState() {
  return {
    view: 'live', filter: 'all', assigned: null,
    jobs: [
      { id: 'jlt', ref: 'JLT-0912', code: 'FB', title: 'Flatbed · JLT', meta: 'Range Rover · non-runner · waiting 2 min', s: 'unassigned', x: 130, y: 682 },
      { id: 'szr', ref: 'SZR-0907', code: 'LA', title: 'Low-Angle · Sheikh Zayed Rd', meta: 'Ahmed K. · McLaren 720S · ETA 6 min', s: 'assigned', x: 330, y: 558.4 },
      { id: 'difc', ref: 'DIF-0908', code: 'EN', title: 'Enclosed · DIFC', meta: 'Yusuf R. · ETA 12 min', s: 'enroute', x: 690, y: 394 },
      { id: 'marina', ref: 'MAR-0910', code: 'LA', title: 'Low-Angle · Marina', meta: 'Imran S. · ETA 9 min', s: 'enroute', x: 152, y: 594 },
      { id: 'deira', ref: 'DEI-0903', code: 'WL', title: 'Wheel-Lift · Deira', meta: 'Omar F. · on site', s: 'loading', x: 960, y: 186 },
      { id: 'barsha', ref: 'BAR-0899', code: 'FB', title: 'Flatbed · Al Barsha', meta: 'Khalid N. · handed over', s: 'complete', x: 305, y: 655 },
    ],
  };
}
const MOVERS = [
  { id: 'ahmed', pts: Dubai.ROUTES.toPickup, period: 16000 },
  { id: 'yusuf', pts: [[600, 452], [640, 431], [690, 394]], period: 20000 },
  { id: 'imran', pts: [[262, 594], [175, 639], [152, 594]], period: 18000 },
];
const IDLE = [[175, 655, 'S'], [250, 690, 'R'], [402, 521], [470, 600], [560, 470], [640, 520], [720, 330], [806, 410], [880, 262], [90, 650], [380, 708]];
const OFFLINE = [[520, 560], [760, 300]];

const Dispatch = {
  state: dispatchState(),
  root: null,
  token: 0,
  mount(root) {
    this.root = root;
    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-act]');
      if (!a || !root.contains(a)) return;
      const fn = this.actions[a.dataset.act];
      if (fn) { e.preventDefault(); fn.call(this, a.dataset); }
    });
    this.render();
  },
  reset() { this.state = dispatchState(); this.render(); },
  toast(msg) {
    let t = document.querySelector('.dtoast');
    if (!t) { t = document.createElement('div'); t.className = 'dtoast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), 2600);
  },
  render() {
    const s = this.state;
    this.token++;
    const nav = (id, label, ic) => `<button type="button" data-act="view" data-v="${id}" ${s.view === id ? 'aria-current="page"' : ''}>${icon(ic, 18)}${label}</button>`;
    this.root.innerHTML = `<div class="dsp">
      <nav class="dsp-nav" aria-label="Dispatch">
        <div class="rowx g12" style="padding:0 6px">${MARK(32)}<div class="col"><span style="font-family:var(--f-display);font-stretch:125%;font-weight:650;font-size:16px">Dispatch</span><span class="mono" style="font-size:9px;letter-spacing:.16em;color:var(--sand-3)">CONTROL ROOM · <span class="ar" style="letter-spacing:0">دبي</span></span></div></div>
        <div class="links">${nav('live', 'Live operations', 'radar')}${nav('assign', 'Jobs & assignment', 'list')}${nav('fleet', 'Fleet & roster', 'truck')}${nav('analytics', 'Analytics', 'chart')}</div>
        <div class="mt-auto rowx g10" style="padding:12px;border-radius:14px;background:var(--ink-1);border:1px solid var(--line)"><span class="avatar" style="width:34px;height:34px;font-size:14px">L</span><div class="col"><span style="font-weight:600;font-size:13px">Layla H.</span><span class="mono" style="font-size:9px;letter-spacing:.12em;color:var(--sand-3)">NIGHT SHIFT · ON DUTY</span></div></div>
      </nav>
      <main class="dsp-main">${this.views[s.view].call(this, s)}</main></div>`;
    if (s.view === 'live') this.animate();
  },
  views: {},
  actions: {},
};

const unassignedCount = (s) => s.jobs.filter((j) => j.s === 'unassigned').length;

Dispatch.views.live = function (s) {
  const un = unassignedCount(s);
  const list = s.jobs.filter((j) => s.filter === 'all' || (s.filter === 'unassigned' ? j.s === 'unassigned' : !['unassigned', 'complete'].includes(j.s)));
  const z = .8;
  const view = [16, 110, 990, 660];
  const marks = [];
  for (const [x, y, l] of IDLE) if (!(l === 'S' && s.assigned === 'saeed') && !(l === 'R' && s.assigned === 'rashid')) marks.push({ type: 'dot', x, y, color: '#3CCB7F', letter: l });
  for (const [x, y] of OFFLINE) marks.push({ type: 'dot', x, y, color: '#5D6272' });
  for (const j of s.jobs) marks.push({ type: 'job', x: j.x, y: j.y, code: j.code, color: STATUS[j.s].color, hot: j.s === 'unassigned', act: j.s === 'unassigned' ? 'openJob' : '', jid: j.id });
  if (un) marks.push({ type: 'link', a: [175, 655], b: [130, 682] });
  for (const m of MOVERS) { const p = Dubai.along(m.pts, 0); marks.push({ type: 'dot', id: `mv-${m.id}`, x: p.x, y: p.y, color: '#5BA8F5' }); }
  if (s.assigned) { marks.push({ type: 'dot', id: 'mv-new', x: 175, y: 655, color: '#5BA8F5', letter: s.assigned === 'saeed' ? 'S' : 'R' }); }
  const map = Dubai.map({ view, z, marks, heat: [{ x: 150, y: 610, r: 70, soft: true }, { x: 660, y: 420, r: 60, soft: true }] });
  return `<div class="dsp-head"><div class="col g6"><span class="rowx g8 mono" style="font-size:10px;letter-spacing:.16em;color:var(--sand-3)"><span style="width:7px;height:7px;border-radius:50%;background:var(--good);animation:blink 1.6s infinite"></span>LIVE · DUBAI · 21:49</span><h2>Live operations</h2></div>
      <div class="rowx g10" style="flex-wrap:wrap"><label class="rowx g8" style="height:44px;padding:0 14px;border-radius:12px;background:var(--ink-1);border:1px solid var(--line);min-width:0;flex:1 1 240px">${icon('search', 16)}<span class="sr">Search</span><input id="dsearch" placeholder="Search jobs, trucks or plates" style="flex:1;min-width:0;border:0;background:transparent;outline:none"></label><button type="button" class="btn gold" data-act="newJob" style="min-height:44px;border-radius:12px;font-size:14px">${icon('plus', 16, 2.2)}New job</button></div></div>
    <section class="kpis" aria-label="Right now">
      <div class="kpi"><span class="k">Live jobs</span><span class="v">6</span></div>
      <div class="kpi ${un ? 'alert' : ''}"><span class="k">Unassigned${un ? '<span class="mono" style="font-size:10px;letter-spacing:.1em">WAITING 2 MIN</span>' : ''}</span><span class="v">${un}</span></div>
      <div class="kpi"><span class="k">Trucks available</span><span class="rowx g6" style="align-items:baseline"><span class="v">${s.assigned ? 10 : 11}</span><span class="mono muted">/ 18</span></span></div>
      <div class="kpi"><span class="k">Avg response · 30 days</span><span class="rowx g6" style="align-items:baseline"><span class="v">4:12</span><span class="mono muted">MIN</span></span></div>
    </section>
    <div class="split">
      <section class="panel dsp-map" aria-label="Operations map">${map}
        <div class="legend"><span><i style="width:9px;height:9px;border-radius:50%;background:#3CCB7F;display:inline-block"></i>Available · ${s.assigned ? 10 : 11}</span><span><i style="width:9px;height:9px;border-radius:50%;background:#5BA8F5;display:inline-block"></i>On job · ${s.assigned ? 6 : 5}</span><span><i style="width:9px;height:9px;border-radius:50%;background:#5D6272;display:inline-block"></i>Offline · 2</span></div>
        ${un ? `<div class="callout"><span style="width:8px;height:8px;border-radius:50%;background:var(--crit);animation:blink 1.2s infinite"></span><span class="col g2"><span style="font-weight:600">Flatbed · JLT needs a truck</span><span class="small" style="color:var(--sand-2)">Saeed M. is 1.8 km away · free</span></span><button type="button" class="btn gold" data-act="openJob" data-id="jlt" style="min-height:36px;padding:0 14px;border-radius:10px;font-size:13px">Assign</button></div>` : ''}
      </section>
      <section class="panel dsp-list" aria-label="Live jobs">
        <div class="col g12" style="padding:18px 18px 14px;border-bottom:1px solid var(--line)"><div class="rowx between"><h3 style="margin:0;font-size:16px">Live jobs</h3><span class="mono muted">${list.length} SHOWN</span></div>
          <div class="seg" role="group" aria-label="Filter jobs">${[['all', 'All · 6'], ['unassigned', `Unassigned · ${un}`], ['active', `Active · ${s.jobs.filter((j) => !['unassigned', 'complete'].includes(j.s)).length}`]].map(([id, l]) => `<button type="button" data-act="filter" data-v="${id}" aria-pressed="${s.filter === id}">${l}</button>`).join('')}</div></div>
        <div class="col" style="padding:6px 8px">${list.map((j) => `<button type="button" class="job ${j.s === 'unassigned' ? 'hot' : ''}" data-act="openJob" data-id="${j.id}"><span class="tile sm">${j.code}</span><span class="grow col g2" style="min-width:0"><span class="t">${j.title}</span><span class="m">${j.meta}</span></span><span class="pill ${STATUS[j.s].cls}"><i></i>${STATUS[j.s].label}</span></button>`).join('') || '<p class="muted" style="padding:20px">No jobs match this filter.</p>'}</div>
      </section>
    </div>`;
};

Dispatch.animate = function () {
  const tok = this.token;
  const s = this.state;
  const els = MOVERS.map((m) => [m, this.root.querySelector(`#mv-${m.id}`)]);
  const fresh = this.root.querySelector('#mv-new');
  const z = .8, sc = Math.round(1 / z * 100) / 100;
  const t0 = performance.now();
  const step = (ts) => {
    if (tok !== this.token) return;
    for (const [m, el] of els) {
      if (!el) continue;
      const ph = ((ts / m.period) % 2);
      const p = Dubai.along(m.pts, ph < 1 ? ph : 2 - ph);
      el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${sc})`);
    }
    if (fresh && s.assigned) {
      const t = Math.min(1, (ts - (s.assignedAt || t0)) / 9000);
      const p = Dubai.along([[175, 655], [152, 667], [130, 682]], t);
      fresh.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${sc})`);
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

Dispatch.views.assign = function (s) {
  const j = s.jobs.find((x) => x.id === 'jlt');
  const ops = [['saeed', 'S', 'Saeed M.', '1.8', '4.9', 'Free', '#3CCB7F'], ['rashid', 'R', 'Rashid A.', '3.4', '4.8', 'Free', '#3CCB7F'], ['khalid', 'K', 'Khalid N.', '5.1', '4.7', 'Finishing', '#5BA8F5']];
  const who = ops.find((o) => o[0] === s.assigned);
  const view = Dubai.camera(150, 676, 420, 230, 2.2);
  const map = Dubai.map({ view, z: 2.2, marks: [{ type: 'ring', x: 130, y: 682, r: 20, o: .4 }, { type: 'ring', x: 130, y: 682, r: 38, o: .25 }, { type: 'ring', x: 130, y: 682, r: 56, o: .15 }, { type: 'dot', x: 175, y: 655, color: s.assigned === 'saeed' ? '#5BA8F5' : '#3CCB7F', letter: 'S' }, { type: 'dot', x: 214, y: 702, color: s.assigned === 'rashid' ? '#5BA8F5' : '#3CCB7F', letter: 'R' }, { type: 'dot', x: 82, y: 640, color: '#5BA8F5', letter: 'K' }, { type: 'job', x: 130, y: 682, code: 'FB', hot: !s.assigned, color: '#BDB3A0' }] });
  return `<div class="dsp-head"><div class="col g6"><span class="mono" style="font-size:11px;letter-spacing:.12em;color:var(--sand-3)"><button type="button" data-act="view" data-v="live" style="border:0;background:none;padding:0;color:var(--sand-2);letter-spacing:inherit;font:inherit">LIVE OPERATIONS</button> / ${j.ref}</span><h2>Assign Flatbed · JLT</h2></div>
      <span class="pill ${who ? 'good' : 'crit'}" style="height:36px;padding:0 14px;font-size:13px"><i></i>${who ? `Assigned · ${who[2]}` : 'Unassigned · 2 min'}</span></div>
    <div class="split" style="align-items:flex-start">
      <article class="panel" style="flex:1 1 320px;min-width:0">
        <div style="height:230px">${map}</div>
        <div class="col g14" style="padding:18px 20px 20px"><div class="col g4"><span class="label">Job · ${j.ref}</span><span style="font-size:18px;font-weight:600">Range Rover · non-runner</span><span class="small" style="color:var(--sand-2)">Jumeirah Lake Towers, Cluster D · basement car park</span></div>
          <dl style="margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;border-radius:14px;overflow:hidden;background:var(--line)">${[['Class', 'Flatbed'], ['Tow', '6 km · to Al Quoz'], ['Fare', 'AED 410'], ['Waiting', who ? 'Assigned' : '2 min']].map(([k, v]) => `<div class="col g4" style="padding:12px 14px;background:var(--ink-1)"><dt class="muted">${k}</dt><dd style="margin:0;font-weight:600;${k === 'Waiting' ? `color:${who ? '#8FE6B5' : '#FFB3A8'}` : ''}">${v}</dd></div>`).join('')}</dl></div>
      </article>
      <section class="panel" style="flex:999 1 480px;min-width:0" aria-label="Suggested operators">
        <div class="rowx between" style="flex-wrap:wrap;gap:8px;padding:18px 20px 10px"><h3 style="margin:0;font-size:16px">Suggested operators</h3><span class="mono muted" style="font-size:10px;letter-spacing:.14em">NEAREST · RIGHT CLASS · TOP RATED</span></div>
        <ol style="margin:0;padding:0 10px 10px;list-style:none" class="col g4">${ops.map(([id, l, name, km, r, st, c], i) => {
          const me = s.assigned === id, locked = s.assigned && !me;
          return `<li class="rowx g14" style="flex-wrap:wrap;min-height:72px;padding:8px 10px;border-radius:16px;background:${me ? 'var(--good-soft)' : (!s.assigned && i === 0 ? 'var(--ink-2)' : 'transparent')}">
            <span class="mono muted" style="width:18px">0${i + 1}</span><span class="avatar" style="width:44px;height:44px;font-size:17px">${l}</span>
            <span class="grow col g2" style="flex:1 1 160px"><span style="font-weight:600;font-size:15px">${name}</span><span class="rowx g10 mono small" style="color:var(--sand-2);font-size:11px"><span>${km} KM</span><span style="color:var(--gold)">★ ${r}</span><span class="rowx g4"><span style="width:6px;height:6px;border-radius:50%;background:${c}"></span>${st}</span></span></span>
            <span class="pill" style="background:var(--ink-2);border:1px solid var(--line-2)">${icon('check', 12, 3)}Flatbed</span>
            <button type="button" class="btn ${me ? '' : (!s.assigned && i === 0 ? 'gold' : 'dark')}" data-act="assign" data-v="${id}" ${locked || me ? 'disabled' : ''} style="min-height:44px;min-width:112px;border-radius:12px;font-size:14px;${me ? 'background:var(--good);color:#06130C;font-weight:600' : ''}">${me ? 'Assigned' : 'Assign'}</button></li>`;
        }).join('')}</ol>
        <div class="rowx between" style="flex-wrap:wrap;gap:10px;padding:14px 20px;border-top:1px solid var(--line)"><span class="muted">Ranked by distance, class fit and rating.</span><button type="button" data-act="${s.assigned ? 'unassign' : 'override'}" style="min-height:36px;border:0;background:none;color:var(--gold-2);font-weight:600">${s.assigned ? 'Undo assignment' : 'Manual override'}</button></div>
        ${who ? `<div class="rowx g12 rise" style="margin:0 20px 20px;padding:14px 16px;border-radius:16px;background:var(--good-soft);color:#8FE6B5">${icon('check', 18, 2.6)}<span class="grow">${who[2]} is on the way · the customer has been notified.</span><button type="button" class="btn dark" data-act="view" data-v="live" style="min-height:40px;border-radius:12px;font-size:13px">Watch on map</button></div>` : ''}
      </section>
    </div>`;
};

Dispatch.views.fleet = function (s) {
  const rows = [
    ['Saeed M.', 'Flatbed', s.assigned === 'saeed' ? 'enroute' : 'available', 'JLT · 1.8 km', 3],
    ['Rashid A.', 'Flatbed', s.assigned === 'rashid' ? 'enroute' : 'available', 'Al Barsha · 3.4 km', 2],
    ['Khalid N.', 'Flatbed', 'finishing', 'Al Barsha', 4],
    ['Ahmed K.', 'Low-Angle', 'onjob', 'Sheikh Zayed Rd', 4],
    ['Imran S.', 'Low-Angle', 'onjob', 'Dubai Marina', 3],
    ['Yusuf R.', 'Enclosed', 'onjob', 'DIFC', 1],
    ['Omar F.', 'Wheel-Lift', 'loading', 'Deira', 5],
    ['Hassan T.', 'Wheel-Lift', 'offline', '—', 0],
  ];
  const pill = { available: ['good', 'Available'], enroute: ['info', 'En route'], onjob: ['info', 'On job'], finishing: ['info', 'Finishing'], loading: ['gold', 'Loading'], offline: ['', 'Offline'] };
  return `<div class="dsp-head"><div class="col g6"><span class="mono muted" style="font-size:10px;letter-spacing:.16em">FLEET · 18 TRUCKS · 4 CLASSES</span><h2>Fleet &amp; roster</h2></div>
      <div class="rowx g6" style="flex-wrap:wrap"><span class="pill good"><i></i>${s.assigned ? 10 : 11} available</span><span class="pill info"><i></i>${s.assigned ? 6 : 5} on job</span><span class="pill"><i></i>2 offline</span></div></div>
    <section class="panel" style="padding:8px 20px 10px"><div style="overflow-x:auto"><table class="tbl"><thead><tr><th scope="col">Operator</th><th scope="col">Truck</th><th scope="col">Status</th><th scope="col">Where</th><th scope="col" style="text-align:right">Jobs today</th></tr></thead>
      <tbody>${rows.map(([n, t, st, w, j]) => `<tr><td style="font-weight:600">${n}</td><td style="color:var(--sand-2)">${t}</td><td><span class="pill ${pill[st][0]}"><i></i>${pill[st][1]}</span></td><td style="color:var(--sand-2)">${w}</td><td class="mono" style="text-align:right">${j}</td></tr>`).join('')}</tbody></table></div>
      <p class="muted" style="margin:6px 0 4px">Showing 8 of 18 trucks · sorted by distance to open jobs</p></section>`;
};

Dispatch.views.analytics = function () {
  const tiles = [['Average response', '4:12', 'MIN', 'Request to truck assigned'], ['Jobs completed', '312', '', 'Across all four classes'], ['Revenue', '241k', 'AED', 'Incl. VAT'], ['Right-class match', '96%', '', null, 96], ['Premium share', '31%', '', null, 31], ['Fleet utilisation', '78%', '', null, 78]];
  const bars = [['Wheel-Lift', 118, false], ['Flatbed', 97, false], ['Low-Angle', 56, true], ['Enclosed', 41, true]];
  return `<div class="dsp-head"><div class="col g6"><span class="mono muted" style="font-size:10px;letter-spacing:.16em">PERFORMANCE · LAST 30 DAYS</span><h2>Fleet analytics</h2></div>
      <button type="button" class="btn dark" data-act="export" style="min-height:44px;border-radius:12px;font-size:14px">${icon('download', 16)}Export report</button></div>
    <section class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))">${tiles.map(([k, v, u, note, meter]) => `<div class="kpi"><span class="k">${k}</span><span class="rowx g6" style="align-items:baseline">${u === 'AED' ? '<span class="mono muted">AED</span>' : ''}<span class="v" style="font-size:38px">${v}</span>${u && u !== 'AED' ? `<span class="mono muted">${u}</span>` : ''}</span>${meter ? `<span style="height:6px;border-radius:3px;background:var(--gold-soft);display:flex"><span style="width:${meter}%;border-radius:3px;background:var(--gold)"></span></span>` : `<span class="muted">${note}</span>`}</div>`).join('')}</section>
    <div class="split">
      <figure class="panel col g20" style="margin:0;flex:999 1 480px;min-width:0;padding:22px 24px 24px">
        <figcaption class="rowx between" style="flex-wrap:wrap;gap:10px;align-items:flex-start"><span class="col g4"><span style="font-weight:600;font-size:16px">Jobs by recovery class</span><span class="muted">312 jobs · Low-Angle and Enclosed make up the premium 31%</span></span><span class="rowx g14 small" style="color:var(--sand-2)"><span class="rowx g6"><span style="width:12px;height:12px;border-radius:3px;background:#6B6F80"></span>Standard</span><span class="rowx g6"><span style="width:12px;height:12px;border-radius:3px;background:var(--gold)"></span>Premium</span></span></figcaption>
        <div class="bars col g14">${bars.map(([n, v, p]) => `<div class="b" title="${n} · ${v} jobs · ${(v / 312 * 100).toFixed(1)}%"><span style="color:var(--sand-2)">${n}</span><span class="track"><span class="fillbar" style="width:${(v / 118 * 82).toFixed(1)}%;background:${p ? 'var(--gold)' : '#6B6F80'}"></span><span class="mono">${v}</span></span></div>`).join('')}</div>
      </figure>
      <section class="panel col g16" style="flex:1 1 280px;min-width:0;padding:22px 24px 24px"><span style="font-weight:600;font-size:16px">Busiest areas tonight</span>
        ${[['Dubai Marina', 9], ['Sheikh Zayed Rd', 7], ['Downtown · DIFC', 6], ['Al Barsha', 4], ['Deira', 3]].map(([a, n]) => `<div class="col g6"><div class="rowx between small"><span>${a}</span><span class="mono muted">${n} jobs</span></div><span style="height:6px;border-radius:3px;background:var(--ink-3);display:flex"><span style="width:${n / 9 * 100}%;border-radius:3px;background:${n === 9 ? 'var(--gold)' : '#6B6F80'}"></span></span></div>`).join('')}
      </section>
    </div>`;
};

Dispatch.actions.view = function (d) { this.state.view = d.v; this.render(); };
Dispatch.actions.filter = function (d) { this.state.filter = d.v; this.render(); };
Dispatch.actions.openJob = function (d) {
  if (d.id && d.id !== 'jlt') { this.toast('Job details open here in the full product'); return; }
  this.state.view = 'assign'; this.render();
};
Dispatch.actions.assign = function (d) {
  const s = this.state;
  s.assigned = d.v; s.assignedAt = performance.now();
  const j = s.jobs.find((x) => x.id === 'jlt');
  const name = d.v === 'saeed' ? 'Saeed M.' : d.v === 'rashid' ? 'Rashid A.' : 'Khalid N.';
  j.s = 'assigned'; j.meta = `${name} · Range Rover · ETA ${d.v === 'saeed' ? 5 : d.v === 'rashid' ? 9 : 12} min`;
  this.toast(`${name} assigned to JLT-0912`);
  this.render();
};
Dispatch.actions.unassign = function () {
  const s = this.state; s.assigned = null;
  const j = s.jobs.find((x) => x.id === 'jlt'); j.s = 'unassigned'; j.meta = 'Range Rover · non-runner · waiting 2 min';
  this.render();
};
Dispatch.actions.override = function () { this.toast('Pick any operator from the roster to override'); };
Dispatch.actions.newJob = function () { this.toast('New job form opens here'); };
Dispatch.actions.export = function () { this.toast('Report export prepared · CSV and PDF'); };
