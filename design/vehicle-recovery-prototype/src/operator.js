/* Operator app — Ahmed's side of the same recovery: the McLaren on the E11, towed to Dubai Marina. */

function operatorState() {
  return { online: false, checks: { walk: true, marks: true, ramps: false, straps: false }, photos: 2, signed: false, earned: 760, jobs: 3, completed: false, leg: 1 };
}
const OP_JOBS = [
  { cls: 'LA', route: 'Downtown → DIFC', time: '18:05', amount: 340 },
  { cls: 'FB', route: 'Al Barsha → JLT', time: '19:20', amount: 190 },
  { cls: 'FB', route: 'Deira → Al Quoz', time: '20:40', amount: 230 },
];
const METERS_PER_UNIT = 10.5;

function opTabbar(cur) {
  const t = (id, label, ic) => `<button type="button" data-act="go" data-to="${id}" data-dir="fade" ${cur === id ? 'aria-current="page"' : ''}>${icon(ic, 22)}<span>${label}</span></button>`;
  return `<nav class="tabbar" aria-label="Main" style="grid-template-columns:repeat(2,minmax(0,1fr))">${t('o_home', 'Drive', 'truck')}${t('o_earn', 'Earnings', 'chart')}</nav>`;
}

const Operator = {
  state: operatorState(),
  steps: [
    { grp: 'Get the job' }, { id: 'o_home', label: 'Go online' }, { id: 'o_offer', label: 'Job offer · 15 s to accept' },
    { grp: 'Do the job' }, { id: 'o_nav', label: 'Navigate to pick-up' }, { id: 'o_load', label: 'Guided loading' }, { id: 'o_nav2', label: 'Tow to Dubai Marina' }, { id: 'o_hand', label: 'Handover & signature' },
    { grp: 'Get paid' }, { id: 'o_done', label: 'Job complete' }, { id: 'o_earn', label: 'Earnings' },
  ],
  screens: {},
  actions: {},
};

/* ---------- Home: go online ---------- */
Operator.screens.o_home = {
  render: (s) => {
    const z = 1.45, MAPH = 520;
    const view = Dubai.camera(262, 600, 390, MAPH, z);
    const [hx, hy] = Dubai.project(view, 390, MAPH, 150, 600);
    const map = Dubai.map({ view, z, heat: s.online ? [{ x: 150, y: 600, r: 80 }, { x: 372, y: 520, r: 50, soft: true }, { x: 210, y: 700, r: 44, soft: true }] : [], marks: [{ type: 'nav', x: 300, y: 640, ang: -117.5 }] });
    return `<div class="map" style="height:${MAPH + 40}px;${s.online ? '' : 'filter:saturate(.4) brightness(.8)'}">${map}</div>
      ${s.online ? `<span class="pill mono" style="position:absolute;left:${Math.max(16, hx - 40)}px;top:${hy - 70}px;z-index:2;height:30px;background:var(--gold);color:var(--gold-ink);font-weight:600;font-size:10px">${icon('bolt', 12)}HIGH DEMAND · MARINA</span>` : ''}
      <div class="bar" style="position:absolute;left:20px;right:20px;top:54px;z-index:2">
        <span class="avatar" style="width:46px;height:46px;font-size:18px;border:1px solid var(--line-2)">A</span>
        <span class="pill mono" style="height:34px;padding:0 14px;background:rgba(10,11,16,.9);border:1px solid var(--line-2);color:var(--sand-2)">OPERATOR · LOW-ANGLE</span>
        <button type="button" class="ib" aria-label="Notifications" data-act="opNote">${icon('bell')}</button>
      </div>
      <section class="sheet" style="bottom:86px;padding-bottom:20px">
        <span class="grab"></span>
        <div class="rowx between g16"><div class="col g4"><h1 class="h1" style="font-size:28px;color:${s.online ? 'var(--sand)' : 'var(--sand-3)'}">${s.online ? 'You’re online' : 'You’re offline'}</h1><span class="small" style="color:var(--sand-2)">Ahmed K. · Low-Angle · <span class="mono">D 12345</span></span></div>
          <button type="button" class="switch" role="switch" aria-checked="${s.online}" aria-label="Online" data-act="online"><span></span></button></div>
        ${s.online ? `<div class="rowx g12" style="min-height:52px;padding:0 16px;border-radius:16px;background:#1B170F;border:1px solid #3A2D17;color:var(--gold-2);font-weight:500"><span class="rowx g4" aria-hidden="true">${[0, 1, 2].map((i) => `<span style="width:6px;height:6px;border-radius:50%;background:var(--gold);animation:blink 1.2s ${i * .2}s infinite"></span>`).join('')}</span>Finding Low-Angle jobs near you</div>`
          : '<p style="margin:0;display:flex;align-items:center;min-height:52px;padding:0 16px;border-radius:16px;background:var(--ink-2);color:var(--sand-2)">Go online to receive job offers.</p>'}
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-radius:18px;background:var(--ink-2)">
          <div class="col g4" style="padding:14px 16px"><span class="label">Today · AED</span><span class="num" style="font-size:22px">${fmt(s.earned)}</span></div>
          <div class="col g4" style="padding:14px 16px;border-left:1px solid var(--line-2)"><span class="label">Jobs</span><span class="num" style="font-size:22px">${s.jobs}</span></div>
          <div class="col g4" style="padding:14px 16px;border-left:1px solid var(--line-2)"><span class="label">Rating</span><span class="num" style="font-size:22px">4.9</span></div>
        </div>
      </section>
      ${opTabbar('o_home')}`;
  },
  mount: (el, ph) => { if (ph.state.online) ph.later(() => ph.go('o_offer', { dir: 'up' }), 3600); },
  repatch: (el, ph) => { ph.clearTimers(); if (ph.state.online) ph.later(() => ph.go('o_offer', { dir: 'up' }), 3600); },
};
Operator.actions.online = (d, el, ph) => { ph.state.online = !ph.state.online; ph.patch(); };
Operator.actions.opNote = (d, el, ph) => ph.toast('No new messages from dispatch');

/* ---------- Job offer with a live 15-second window ---------- */
Operator.screens.o_offer = {
  render: () => {
    const route = Dubai.ROUTES.toPickup;
    const { view, z } = frame(route, 390, 300, { t: 60, b: 50, l: 80, r: 80 }, 2.6);
    const map = Dubai.map({ view, z, routes: [{ pts: route, flow: true }], marks: [{ type: 'nav', x: route[0][0], y: route[0][1], ang: -117.5 }, { type: 'me', x: route[2][0], y: route[2][1] }] });
    const C = 2 * Math.PI * 22;
    return `<div class="map" style="height:310px">${map}</div>
      <section class="col g18" style="position:absolute;left:0;right:0;top:282px;bottom:0;padding:24px 20px 34px;border-radius:28px 28px 0 0;background:var(--night);border-top:1px solid var(--line)">
        <div class="rowx between g12"><div class="col g6"><span class="eyebrow">New job · Low-Angle</span><span class="small" style="color:var(--sand-2)">Breakdown on the hard shoulder</span></div>
          <div role="timer" aria-label="Offer expires in 15 seconds" style="position:relative;width:58px;height:58px;flex:none">
            <svg width="58" height="58" viewBox="0 0 58 58" style="transform:rotate(-90deg)" aria-hidden="true"><circle cx="29" cy="29" r="22" fill="none" stroke="var(--line-2)" stroke-width="4"/><circle id="ring" cx="29" cy="29" r="22" fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="0" style="transition:stroke-dashoffset 1s linear"/></svg>
            <span id="secs" class="mono" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600">15</span></div></div>
        <div class="col g6"><h1 class="h-xl" style="font-size:32px">Sheikh Zayed Rd</h1><span class="rowx g8" style="color:var(--sand-2)">${icon('arrow', 16)}Drop-off · Dubai Marina</span></div>
        <div class="card rowx g14" style="padding:14px 16px"><span class="tile sm" style="width:40px;height:40px">${icon('car', 22, 1.6)}</span><div class="col g2"><span style="font-weight:600">McLaren 720S</span><span class="muted">Lowered · non-starting · owner in car</span></div></div>
        <div class="rowx between" style="align-items:flex-end"><div class="col g4"><span class="label">You earn</span><span class="rowx g8" style="align-items:baseline"><span class="mono t-gold">AED</span><span class="num t-gold" style="font-size:50px">480</span></span></div><span class="muted" style="text-align:right;line-height:1.5">~6 min to pick-up<br>11 km tow</span></div>
        <div class="mt-auto" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:10px">
          <button type="button" class="btn dark" data-act="decline">Decline</button>
          <button type="button" class="btn gold" data-act="accept">Accept job${icon('check', 18, 2.4)}</button></div>
      </section>`;
  },
  mount: (el, ph) => {
    const C = 2 * Math.PI * 22;
    let n = 15;
    const ring = el.querySelector('#ring'), secs = el.querySelector('#secs');
    ph.every(() => {
      n--;
      secs.textContent = Math.max(0, n);
      ring.style.strokeDashoffset = (C * (1 - n / 15)).toFixed(1);
      if (n === 0) { ph.toast('Offer expired · it went to the next truck'); ph.later(() => ph.go('o_home', { dir: 'back' }), 900); }
    }, 1000);
  },
};
Operator.actions.decline = (d, el, ph) => { ph.toast('Job declined'); ph.go('o_home', { dir: 'back' }); };
Operator.actions.accept = (d, el, ph) => { ph.state.leg = 1; ph.go('o_nav'); };

/* ---------- Navigation (both legs) ---------- */
function navScreen(leg) {
  const plan = leg === 1
    ? { route: Dubai.ROUTES.toPickup, total: 6, D: 14000, to: 'To pick-up', arrive: 'ARRIVE 21:54', cta: 'Start loading', next: 'o_load',
      man: [['turn', 'Right onto Sheikh Zayed Rd', 'Then keep right on the E11'], ['up', 'Continue on the E11', 'McLaren on the hard shoulder, right side']], done: ['You’ve arrived', 'McLaren 720S · hazard lights on'] }
    : { route: Dubai.ROUTES.marina, total: 18, D: 13000, to: 'To drop-off', arrive: 'ARRIVE 22:18', cta: 'Start handover', next: 'o_hand',
      man: [['up', 'Continue on the E11', 'Towards Dubai Marina, exit 32'], ['turn', 'Right towards Dubai Marina', 'Drop-off on the left']], done: ['Arrived at Dubai Marina', 'Owner waiting at the lobby'] };
  return {
    plan,
    render: () => {
      const z = 1.9, r = plan.route;
      const p = Dubai.along(r, 0);
      const view = Dubai.camera(p.x, p.y + 12, 390, 844, z);
      const end = r[r.length - 1];
      const map = Dubai.map({ view, z, routes: [{ pts: r, id: 'nrt', flow: true }], marks: [leg === 1 ? { type: 'me', x: end[0], y: end[1] } : { type: 'drop', x: end[0], y: end[1] }, { type: 'nav', id: 'me', x: p.x, y: p.y, ang: p.ang }] });
      const [ic, t, sub] = plan.man[0];
      return `<div class="map" style="height:100%" id="nmap">${map}</div>
        <div style="position:absolute;left:12px;right:12px;top:50px;z-index:2;border-radius:26px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.55)">
          <div class="rowx g16" style="padding:18px 20px;background:var(--gold);color:var(--gold-ink)"><span id="manIc">${icon(ic, 46, 2.2)}</span><div class="col g2"><span class="num" id="manD" style="font-size:36px">600 m</span><span id="manT" style="font-size:17px;font-weight:600">${t}</span></div></div>
          <div class="rowx g10" style="padding:10px 20px;background:#1B170F;color:var(--gold-2);font-size:14px">${icon('info', 16)}<span id="manS">${sub}</span></div>
        </div>
        <section class="sheet" style="gap:16px">
          <span class="grab"></span>
          <div class="rowx between" style="align-items:flex-end"><div class="col g4"><span class="label">${plan.to}</span><span class="rowx g8" style="align-items:baseline"><span class="num" id="neta" style="font-size:42px">${plan.total}</span><span style="font-size:18px;font-weight:600">min</span></span></div>
            <div class="col g4" style="align-items:flex-end"><span class="mono" id="nkm">${leg === 1 ? '1.3 KM' : '11 KM'}</span><span class="mono" style="color:var(--sand-2)">${plan.arrive}</span></div></div>
          <div class="rowx g12" style="padding:12px 14px;border-radius:16px;background:var(--ink-2)"><span class="tile goldline sm">LA</span><div class="grow col g2"><span style="font-weight:600">McLaren 720S · lowered</span><span class="muted">${leg === 1 ? 'Sheikh Zayed Rd · hard shoulder' : 'Secured · 4 soft straps · 6 photos'}</span></div>${UI.plate('D', '12345')}</div>
          <div style="display:grid;grid-template-columns:60px 60px minmax(0,1fr);gap:10px">
            <button type="button" class="btn dark" data-act="opCall" aria-label="Call the owner" style="padding:0">${icon('phone', 20)}</button>
            <button type="button" class="btn dark" data-act="opMsg" aria-label="Message the owner" style="padding:0">${icon('chat', 20)}</button>
            <button type="button" class="btn gold" id="ncta" data-act="go" data-to="${plan.next}">${plan.cta}</button></div>
        </section>`;
    },
    mount: (el, ph) => {
      const r = plan.route, z = 1.9;
      const svg = el.querySelector('#nmap svg'), me = el.querySelector('#me');
      const nrt = el.querySelector('#nrt'), glow = el.querySelector('#nrt-glow'), flow = el.querySelector('#nrt-flow');
      const segLen = r.slice(1).map((q, i) => Math.hypot(q[0] - r[i][0], q[1] - r[i][1]));
      const tot = segLen.reduce((a, b) => a + b, 0);
      let t0 = null, done = false, lastSeg = -1;
      ph.loop((ts) => {
        if (t0 === null) t0 = ts;
        const t = Math.min(1, (ts - t0) / plan.D);
        const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const p = Dubai.along(r, e);
        me.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(p.ang + 90).toFixed(1)})`);
        svg.setAttribute('viewBox', Dubai.camera(p.x, p.y + 12, 390, 844, z).join(' '));
        const d = Dubai.pathD(p.rest);
        nrt.setAttribute('d', d); glow.setAttribute('d', d); flow.setAttribute('d', d);
        const remSeg = Math.max(0, segLen.slice(0, p.i + 1).reduce((a, b) => a + b, 0) - e * tot);
        if (p.i !== lastSeg && !done) {
          lastSeg = p.i;
          const m = plan.man[Math.min(p.i, plan.man.length - 1)];
          el.querySelector('#manIc').innerHTML = icon(m[0], 46, 2.2);
          el.querySelector('#manT').textContent = m[1];
          el.querySelector('#manS').textContent = m[2];
        }
        const meters = remSeg * METERS_PER_UNIT;
        el.querySelector('#manD').textContent = meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.max(50, Math.round(meters / 50) * 50)} m`;
        el.querySelector('#neta').textContent = Math.max(1, Math.ceil(plan.total * (1 - e)));
        const kmLeft = (1 - e) * (leg === 1 ? 1.3 : 11);
        el.querySelector('#nkm').textContent = `${kmLeft < 10 ? kmLeft.toFixed(1) : Math.round(kmLeft)} KM`;
        if (t >= 1) {
          done = true;
          el.querySelector('#manIc').innerHTML = icon('pin', 46, 2);
          el.querySelector('#manD').textContent = plan.done[0];
          el.querySelector('#manD').style.fontSize = '24px';
          el.querySelector('#manT').textContent = plan.done[1];
          el.querySelector('#neta').textContent = '0';
          el.querySelector('#nkm').textContent = '0 KM';
          el.querySelector('#ncta').animate([{ boxShadow: '0 0 0 0 rgba(224,170,78,.6)' }, { boxShadow: '0 0 0 14px rgba(224,170,78,0)' }], { duration: 1400, iterations: Infinity });
          return false;
        }
      });
    },
  };
}
Operator.screens.o_nav = navScreen(1);
Operator.screens.o_nav2 = navScreen(2);
Operator.actions.opCall = (d, el, ph) => ph.toast(`${icon('phone', 16)}Calling the owner…`);
Operator.actions.opMsg = (d, el, ph) => ph.toast(`${icon('chat', 16)}Sent: “On my way, 6 minutes”`);

/* ---------- Guided loading ---------- */
Operator.screens.o_load = {
  render: (s) => {
    const defs = [['walk', 'Walk-around photographs', 'Four angles before touching the car'], ['marks', 'Note existing marks', '1 mark noted · front splitter'], ['ramps', 'Deploy low-angle ramps', 'Check splitter clearance first'], ['straps', 'Strap & secure wheels', 'Soft straps on all four wheels']];
    const n = defs.filter(([k]) => s.checks[k]).length;
    const left = 4 - n;
    const shots = ['FRONT', 'REAR', 'LEFT', 'RIGHT', 'SPLITTER', 'STRAPS'];
    return `<div class="pad col fill g16">
      <div class="rowx g14">${UI.back('o_nav')}<div class="col g2"><span class="eyebrow">Low-Angle protocol</span><span class="small" style="color:var(--sand-2)">McLaren 720S · Sheikh Zayed Rd</span></div></div>
      <div class="col g6"><h1 class="h1">Loading checklist</h1><p class="sub">Capture condition before loading.</p></div>
      <div class="col g8"><div class="rowx between"><span class="label">Progress</span><span class="mono small">${n} / 4</span></div><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px">${defs.map(([k]) => `<span style="height:4px;border-radius:2px;background:${s.checks[k] ? 'var(--gold)' : 'var(--line-2)'}"></span>`).join('')}</div></div>
      <div class="group">${defs.map(([k, t, m]) => `<button type="button" class="li" data-act="chk" data-v="${k}" aria-pressed="${!!s.checks[k]}"><span class="check ${s.checks[k] ? 'on' : ''}">${s.checks[k] ? icon('check', 15, 3) : ''}</span><span class="grow col g2"><span class="t" style="color:${s.checks[k] ? 'var(--sand-2)' : 'var(--sand)'}">${t}</span><span class="m">${m}</span></span></button>`).join('')}</div>
      <div class="col g8"><span class="label">Condition photos · ${s.photos}</span>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">${shots.slice(0, Math.min(s.photos, 5)).map((l) => UI.carPhoto(l, '21:5' + (shots.indexOf(l) % 10), true).replace('height:100px', 'height:84px')).join('')}
          ${s.photos < 6 ? `<button type="button" data-act="snap" style="height:84px;border-radius:16px;border:1.5px dashed #3E4252;background:transparent;color:var(--sand-2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-size:13px">${icon('camera', 22, 1.6)}Add photo</button>` : ''}</div></div>
      <div class="mt-auto">${left ? `<button type="button" class="btn block" disabled>Confirm secured · ${left} step${left > 1 ? 's' : ''} left</button>` : '<button type="button" class="btn gold block" data-act="secured">Confirm secured · depart' + icon('arrow', 18, 2) + '</button>'}</div>
    </div>`;
  },
};
Operator.actions.chk = (d, el, ph) => { ph.state.checks[d.v] = !ph.state.checks[d.v]; ph.patch(); };
Operator.actions.snap = (d, el, ph) => {
  const f = document.createElement('div');
  f.style.cssText = 'position:absolute;inset:0;z-index:70;background:#fff;pointer-events:none;animation:shutter .35s ease-out forwards';
  ph.root.appendChild(f);
  setTimeout(() => f.remove(), 400);
  ph.state.photos = Math.min(6, ph.state.photos + 1);
  ph.patch();
};
Operator.actions.secured = (d, el, ph) => { ph.toast(`${icon('check', 16, 2.6)}Secured · customer notified`); ph.go('o_nav2'); };

/* ---------- Handover & signature ---------- */
Operator.screens.o_hand = {
  render: (s) => `<div class="pad col fill g16">
      <div class="rowx g14">${UI.back('o_nav2')}<div class="col g2"><span class="eyebrow">Handover · Dubai Marina</span><span class="small" style="color:var(--sand-2)">McLaren 720S · Low-Angle</span></div></div>
      <div class="col g6"><h1 class="h1">Confirm delivery</h1><p class="sub">Unloaded and inspected with the owner.</p></div>
      <ul class="group" style="margin:0;padding:0;list-style:none">${[['Vehicle unloaded safely', 'Low-angle ramps · no contact'], ['Condition re-photographed', 'Matches the pick-up record']].map(([t, m]) => `<li class="li"><span class="check on">${icon('check', 15, 3)}</span><span class="col g2"><span class="t">${t}</span><span class="m">${m}</span></span></li>`).join('')}</ul>
      <div class="col g8"><div class="rowx between"><span class="label">Owner signature</span><button type="button" data-act="clearSig" style="min-height:36px;padding:0 6px;border:0;background:transparent;color:var(--gold-2);font-weight:600">Clear</button></div>
        <div style="position:relative;height:200px;border-radius:20px;background:#F5EFE3;overflow:hidden;touch-action:none">
          <canvas id="sig" aria-label="Signature pad. Sign with your finger or mouse." role="img" style="position:absolute;inset:0;width:100%;height:100%;cursor:crosshair"></canvas>
          <span id="sigHint" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#77736A;pointer-events:none;font-size:15px">Owner signs here</span>
          <span aria-hidden="true" style="position:absolute;left:20px;right:20px;bottom:36px;height:1px;background:#C9C3B6;pointer-events:none"></span>
          <span class="mono" style="position:absolute;left:20px;right:20px;bottom:12px;display:flex;justify-content:space-between;font-size:9px;letter-spacing:.12em;color:#5A574F;pointer-events:none"><span>VEHICLE OWNER</span><span>22:21 · DUBAI MARINA</span></span>
        </div></div>
      <div class="mt-auto"><button type="button" class="btn gold block" id="complete" data-act="complete" ${s.signed ? '' : 'disabled'}>${s.signed ? 'Complete job' + icon('check', 18, 2.4) : 'Owner signature required'}</button></div>
    </div>`,
  before: (s) => { s.signed = false; },
  mount: (el, ph) => {
    const cv = el.querySelector('#sig'), hint = el.querySelector('#sigHint'), btn = el.querySelector('#complete');
    const dpr = window.devicePixelRatio || 1;
    const W = cv.offsetWidth, H = cv.offsetHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0B0C10'; ctx.lineWidth = 2.4;
    let drawing = false, last = null, ink = 0;
    const pt = (e) => { const r = cv.getBoundingClientRect(); const k = W / r.width; return [(e.clientX - r.left) * k, (e.clientY - r.top) * k]; };
    cv.addEventListener('pointerdown', (e) => { drawing = true; last = pt(e); cv.setPointerCapture(e.pointerId); hint.style.display = 'none'; });
    cv.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const p = pt(e);
      ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
      ink += Math.hypot(p[0] - last[0], p[1] - last[1]);
      last = p;
      if (ink > 60 && !ph.state.signed) { ph.state.signed = true; btn.disabled = false; btn.innerHTML = 'Complete job' + icon('check', 18, 2.4); }
    });
    const end = () => { drawing = false; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    el._clearSig = () => { ctx.clearRect(0, 0, W, H); ink = 0; ph.state.signed = false; btn.disabled = true; btn.textContent = 'Owner signature required'; hint.style.display = 'flex'; };
  },
};
Operator.actions.clearSig = (d, el, ph) => { if (ph.cur._clearSig) ph.cur._clearSig(); };
Operator.actions.complete = (d, el, ph) => {
  const s = ph.state;
  if (!s.completed) { s.completed = true; s.earned += 480; s.jobs += 1; }
  ph.go('o_done', { dir: 'up' });
};

/* ---------- Job complete ---------- */
Operator.screens.o_done = {
  render: (s) => `<div style="position:absolute;inset:0">${skyline({ seed: 21, reflect: true, par: 'xMidYMax slice', pattern: true, moonX: 300, moonY: 80 })}</div>
    <div style="position:absolute;inset:0;background:linear-gradient(rgba(7,8,12,.2),rgba(7,8,12,.75) 55%,#07080C)"></div>
    <div class="pad col fill g18" style="position:relative;text-align:center;align-items:center">
      <span style="margin-top:96px;width:84px;height:84px;border-radius:50%;background:var(--gold);color:var(--gold-ink);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 10px var(--gold-soft)" class="rise">${icon('check', 40, 2.6)}</span>
      <span class="eyebrow">Job complete · 22:21</span>
      <h1 class="h-xl" style="font-size:44px"><span class="mono" style="font-size:18px;color:var(--gold-2);letter-spacing:.04em">+AED</span> 480</h1>
      <p class="sub">McLaren 720S delivered to Dubai Marina.<br>The owner rated you <span class="t-gold">5 stars</span>.</p>
      <div class="card" style="width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:6px">
        <div class="col g4" style="padding:16px;text-align:left"><span class="label">Today · AED</span><span class="num" id="todayCount" style="font-size:26px">${fmt(s.earned - 480)}</span></div>
        <div class="col g4" style="padding:16px;text-align:left;border-left:1px solid var(--line)"><span class="label">Jobs today</span><span class="num" style="font-size:26px">${s.jobs}</span></div></div>
      <div class="col g10 mt-auto" style="width:100%"><button type="button" class="btn gold block" data-act="backOnline">Back online</button><button type="button" class="btn dark block" data-act="go" data-to="o_earn" data-dir="fade">View earnings</button></div>
    </div>`,
  mount: (el, ph) => {
    const target = ph.state.earned, from = target - 480, n = el.querySelector('#todayCount');
    let t0 = null;
    ph.loop((ts) => { if (t0 === null) t0 = ts + 500; const t = Math.max(0, Math.min(1, (ts - t0) / 1200)); n.textContent = fmt(from + (target - from) * (1 - Math.pow(1 - t, 3))); return t < 1; });
  },
};
Operator.actions.backOnline = (d, el, ph) => { ph.state.online = true; ph.state.checks = { walk: true, marks: true, ramps: false, straps: false }; ph.state.photos = 2; ph.go('o_home', { dir: 'fade' }); };

/* ---------- Earnings ---------- */
Operator.screens.o_earn = {
  render: (s) => {
    const week = [['MON', 560], ['TUE', 880], ['WED', 680], ['THU', 1110], ['FRI', 810], ['TODAY', s.earned], ['SUN', null]];
    const max = Math.max(...week.map((w) => w[1] || 0));
    const jobs = s.completed ? [{ cls: 'LA', route: 'SZR → Dubai Marina', time: '22:21', amount: 480 }, ...OP_JOBS.slice().reverse()] : OP_JOBS.slice().reverse();
    return `<div class="pad col fill g16" style="padding-bottom:0">
      <div class="bar"><span class="label" style="font-size:11px">Earnings · today</span><span class="pill mono">${s.online ? '<i style="color:var(--good)"></i>ONLINE' : 'OFFLINE'}</span></div>
      <div class="col g6"><h1 style="margin:0;display:flex;align-items:baseline;gap:10px"><span class="mono" style="font-size:15px;color:var(--sand-3)">AED</span><span class="num" style="font-size:58px">${fmt(s.earned)}</span></h1><span style="color:var(--sand-2)">${s.jobs} jobs · ${s.completed ? '4h 40m' : '3h 52m'} online</span></div>
      <figure class="card col g12" style="margin:0;padding:16px 16px 12px">
        <figcaption class="rowx between"><span class="label">This week · AED per day</span><span class="mono small">AED ${fmt(4040 + s.earned)}</span></figcaption>
        <div style="height:136px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));align-items:end;border-bottom:1px solid #3A3E4E">${week.map(([d, v]) => `<div class="col center g6" style="height:136px;justify-content:flex-end" title="${v ? `${d === 'TODAY' ? 'Today' : d} · AED ${fmt(v)}` : 'Sunday · upcoming'}">${d === 'TODAY' ? `<span class="mono" style="font-size:11px">${fmt(v)}</span>` : ''}<span style="width:24px;height:${v ? Math.round(v / max * 104) : 104}px;border-radius:4px 4px 0 0;${v ? `background:${d === 'TODAY' ? 'var(--gold)' : '#4A4F60'}` : 'border:1px dashed #3E4252;border-bottom:0'}"></span></div>`).join('')}</div>
        <div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr))">${week.map(([d]) => `<span class="mono" style="text-align:center;font-size:9.5px;letter-spacing:.06em;color:${d === 'TODAY' ? 'var(--gold-2)' : 'var(--sand-3)'}">${d}</span>`).join('')}</div>
      </figure>
      <div class="fill scroll col"><span class="label" style="padding-bottom:4px">Today's jobs</span>${jobs.map((j, i) => `<div class="rowx g12" style="min-height:50px;${i ? 'border-top:1px solid var(--line)' : ''}"><span class="tile sm" style="height:30px;width:36px;border-radius:8px">${j.cls}</span><span class="grow">${j.route}</span><span class="mono muted">${j.time}</span><span class="mono" style="width:56px;text-align:right">${j.amount}</span></div>`).join('')}</div>
      <button type="button" class="btn gold block" data-act="cashout" style="margin-bottom:12px">Cash out AED ${fmt(s.earned)}</button>
    </div>
    ${opTabbar('o_earn')}`;
  },
};
Operator.actions.cashout = (d, el, ph) => ph.toast(`${icon('check', 16, 2.6)}Cash-out requested`);
