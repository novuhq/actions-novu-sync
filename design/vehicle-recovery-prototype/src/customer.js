/* Customer app — a full recovery on Sheikh Zayed Road, from request to receipt. */

const CLASSES = {
  WL: { code: 'WL', name: 'Wheel-Lift', full: 'Wheel-Lift', desc: 'Everyday cars · tight urban access', base: 150 },
  FB: { code: 'FB', name: 'Flatbed', full: 'Flatbed · Tilt & Slide', desc: '4×4s, vans and non-runners', base: 250 },
  LA: { code: 'LA', name: 'Low-Angle', full: 'Low-Angle Sports', desc: 'Lowered supercars · zero scraping', base: 450 },
  EN: { code: 'EN', name: 'Enclosed', full: 'Enclosed Transporter', desc: 'Supercars & classics · full cover', base: 800 },
};
const VEHICLES = {
  mclaren: { name: 'McLaren 720S', note: 'Lowered', advise: 'LA', reason: 'a lowered McLaren 720S' },
  roma: { name: 'Ferrari Roma', note: 'Collector car', advise: 'EN', reason: 'a collector Ferrari Roma' },
  rover: { name: 'Range Rover', note: 'Non-runner', advise: 'FB', reason: 'a Range Rover that won’t start' },
  camry: { name: 'Toyota Camry', note: 'Everyday car', advise: 'WL', reason: 'an everyday Camry' },
};
const DROPS = {
  marina: { name: 'Dubai Marina', short: 'Dubai Marina', km: 11, min: 18 },
  hills: { name: 'Home · Emirates Hills', short: 'Emirates Hills', km: 8, min: 14 },
  alquoz: { name: 'Service centre · Al Quoz', short: 'Al Quoz', km: 14, min: 22 },
};
const ISSUES = ['Breakdown', 'Flat tyre', 'Accident', 'Battery', 'Move my car'];
const PAYMENTS = [
  { id: 'visa', tile: 'VISA', name: 'Visa ·· 4492', meta: 'Expires 09/28 · default', group: 'card' },
  { id: 'mc', tile: 'MC', name: 'Mastercard ·· 8810', meta: 'Expires 03/27', group: 'card' },
  { id: 'apple', tile: 'PAY', name: 'Apple Pay', meta: 'Confirm with Face ID', group: 'card' },
  { id: 'cash', tile: 'AED', name: 'Cash on completion', meta: 'Pay the operator directly', group: 'other' },
  { id: 'corp', tile: 'CORP', name: 'Corporate account', meta: 'Monthly invoicing', group: 'other' },
];
const PAST_TRIPS = [
  { cls: 'LA', title: 'Low-Angle · Marina', meta: '13 Oct · McLaren 720S', amount: 653 },
  { cls: 'FB', title: 'Flatbed · JLT', meta: '2 Oct · Range Rover', amount: 410 },
  { cls: 'EN', title: 'Enclosed · DIFC', meta: '21 Sep · Ferrari Roma', amount: 980 },
  { cls: 'WL', title: 'Wheel-Lift · Deira', meta: '8 Sep · Toyota Camry', amount: 220 },
];

function customerState() {
  return {
    lang: 'en', issue: 'Breakdown', vehicle: 'mclaren', drop: 'marina', cls: null, priority: true, pay: 'visa',
    rating: 5, tip: 50, trips: PAST_TRIPS.slice(), booked: null, sched: { day: 18, slot: '09:00 – 10:00' },
    chat: [{ from: 'them', text: 'Good evening — how can we help with your recovery tonight?' }], typing: false,
    photos: 0, step: 0,
  };
}
const clsOf = (s) => s.cls || VEHICLES[s.vehicle].advise;
function fare(s) {
  const c = CLASSES[clsOf(s)], d = DROPS[s.drop];
  const dist = d.km * 12, prio = s.priority ? 40 : 0;
  const sub = c.base + dist + prio, vat = Math.round(sub * 0.05);
  return { base: c.base, dist, prio, sub, vat, total: sub + vat, km: d.km };
}
function frame(pts, W, H, box, zmax = 2.4) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const bw = Math.max(40, Math.max(...xs) - Math.min(...xs)), bh = Math.max(40, Math.max(...ys) - Math.min(...ys));
  const aw = W - box.l - box.r, ah = H - box.t - box.b;
  const z = Math.min(aw / bw, ah / bh, zmax);
  const bcx = (Math.max(...xs) + Math.min(...xs)) / 2, bcy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const sx = box.l + aw / 2, sy = box.t + ah / 2;
  return { view: Dubai.camera(bcx + (W / 2 - sx) / z, bcy + (H / 2 - sy) / z, W, H, z), z };
}
const dropRoute = (s) => Dubai.ROUTES[s.drop];
const dropPoint = (s) => { const r = dropRoute(s); return r[r.length - 1]; };

function tabbar(cur) {
  const t = (id, label, ic) => `<button type="button" data-act="go" data-to="${id}" data-dir="fade" ${cur === id ? 'aria-current="page"' : ''}>${icon(ic, 22)}<span>${label}</span></button>`;
  return `<nav class="tabbar" aria-label="Main">${t('home', 'Recover', 'home')}${t('activity', 'Activity', 'list')}${t('concierge', 'Concierge', 'headset')}</nav>`;
}
function progress(n) {
  const labels = ['Assigned', 'En route', 'Secured', 'Delivered'];
  return `<ol aria-label="Recovery progress" style="margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px">${labels.map((l, i) => `<li class="col g8"${i === n ? ' aria-current="step"' : ''}><span style="height:4px;border-radius:2px;background:${i < n ? 'var(--gold)' : i === n ? 'linear-gradient(90deg,var(--gold) 0 55%,var(--line-2) 55%)' : 'var(--line-2)'}"></span><span class="small" style="color:${i <= n ? 'var(--sand)' : 'var(--sand-3)'};${i === n ? 'font-weight:600' : ''}">${l}</span></li>`).join('')}</ol>`;
}
function driverRow() {
  return `<div class="rowx g14"><span class="avatar ring">A</span><div class="grow col g4"><span style="font-size:18px;font-weight:600">Ahmed K.</span><span class="rowx g6 small" style="color:var(--sand-2)">${UI.stars('4.9')}<span>· Low-Angle operator</span></span></div>${UI.plate('D', '12345')}</div>`;
}

const Customer = {
  state: customerState(),
  steps: [
    { grp: 'Request' }, { id: 'welcome', label: 'Welcome · English / العربية' }, { id: 'home', label: 'Request on the map' }, { id: 'truck', label: 'Choose the right truck' }, { id: 'confirm', label: 'Upfront fare' }, { id: 'pay', label: 'Payment' },
    { grp: 'Live recovery' }, { id: 'matching', label: 'Matching a truck' }, { id: 'tracking', label: 'Live tracking' }, { id: 'securing', label: 'Securing your car' }, { id: 'tow', label: 'On the way to drop-off' },
    { grp: 'After the tow' }, { id: 'delivered', label: 'Delivered · rate & tip' }, { id: 'receipt', label: 'VAT receipt' }, { id: 'activity', label: 'Activity & history' },
    { grp: 'Premium & help' }, { id: 'premium', label: 'Enclosed premium care' }, { id: 'schedule', label: 'Schedule a transport' }, { id: 'concierge', label: 'Concierge chat' },
  ],
  screens: {},
  actions: {},
};

/* ---------- Splash ---------- */
Customer.screens.splash = {
  render: () => `
    <div style="position:absolute;inset:0">${skyline({ seed: 3, reflect: true, par: 'xMidYMax slice', pattern: true })}</div>
    <div style="position:absolute;inset:0;background:linear-gradient(rgba(7,8,12,.15),rgba(7,8,12,.55) 60%,#07080C)"></div>
    <button type="button" data-act="go" data-to="welcome" data-dir="fade" aria-label="Continue" style="position:absolute;inset:0;border:0;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:var(--sand)">
      <span class="rise">${MARK(64)}</span>
      <span class="rise col center g6" style="animation-delay:.15s"><span class="mono" style="font-size:12px;letter-spacing:.24em">VEHICLE RECOVERY</span><span class="ar" style="font-size:15px;color:var(--gold-2)">دبي · DUBAI</span></span>
    </button>`,
  mount: (el, ph) => ph.later(() => ph.go('welcome', { dir: 'fade' }), 2200),
};

/* ---------- Welcome (English / Arabic) ---------- */
Customer.screens.welcome = {
  render: (s) => {
    const ar = s.lang === 'ar';
    const T = ar ? {
      eyebrow: 'خدمة سحب فاخرة · دبي', h: 'المساعدة على الطريق،<br>بكل سهولة.', p: 'سحب فاخر في جميع أنحاء دبي، ليلاً ونهاراً. من سيارتك اليومية إلى السيارات الخارقة، الشاحنة المناسبة في كل مرة.', go: 'ابدأ الآن', have: 'لدي حساب بالفعل', sw: 'English',
    } : {
      eyebrow: 'Premium roadside recovery · Dubai', h: 'Recovery,<br>made simple.', p: 'Premium towing across Dubai, day or night. From daily drives to supercars, the right truck every time.', go: 'Get started', have: 'I already have an account', sw: 'العربية',
    };
    return `<div class="pad col fill g16" dir="${ar ? 'rtl' : 'ltr'}" lang="${ar ? 'ar' : 'en'}">
      <div class="bar"><span class="rowx g10">${MARK(30)}<span class="mono" style="font-size:11px;letter-spacing:.16em;color:var(--sand-2)" dir="ltr">VEHICLE RECOVERY</span></span>
        <button type="button" class="chip${ar ? '' : ' ar'}" data-act="lang" aria-label="${ar ? 'Switch to English' : 'Switch to Arabic'}" style="min-height:40px">${icon('globe', 16)}${T.sw}</button></div>
      <div style="position:relative;height:300px;border-radius:170px 170px 26px 26px;overflow:hidden;box-shadow:inset 0 0 0 1px var(--gold-line);flex:none">
        ${skyline({ seed: 5, reflect: true, par: 'xMidYMax slice', pattern: true, moonX: 1010, moonY: 70 })}
        <div style="position:absolute;inset:10px;border-radius:160px 160px 18px 18px;box-shadow:inset 0 0 0 1px rgba(224,170,78,.18);pointer-events:none"></div>
        <span class="mono" style="position:absolute;left:50%;bottom:16px;transform:translateX(-50%);font-size:10px;letter-spacing:.18em;color:var(--sand-2);white-space:nowrap" dir="ltr">25.2048° N · 55.2708° E</span>
      </div>
      <div class="col g10 rise">
        <span class="${ar ? 'ar' : 'eyebrow'}" style="${ar ? 'color:var(--gold-2);font-size:14px;font-weight:600' : ''}">${T.eyebrow}</span>
        <h1 class="h-xl" style="${ar ? 'font-family:var(--f-ar);font-stretch:100%;letter-spacing:0;font-size:34px;line-height:1.25' : ''}">${T.h}</h1>
        <p class="sub" style="${ar ? 'font-family:var(--f-ar);line-height:1.7' : ''}">${T.p}</p>
      </div>
      <div class="col g10 mt-auto">
        <button type="button" class="btn gold block" data-act="go" data-to="home" style="${ar ? 'font-family:var(--f-ar)' : ''}">${T.go}${icon(ar ? 'back' : 'arrow', 18, 2)}</button>
        <button type="button" class="btn dark block" data-act="go" data-to="home" style="${ar ? 'font-family:var(--f-ar)' : ''}">${T.have}</button>
      </div></div>`;
  },
};
Customer.actions.lang = (d, el, ph) => { ph.state.lang = ph.state.lang === 'ar' ? 'en' : 'ar'; ph.patch(); };

/* ---------- Home: request on the map ---------- */
Customer.screens.home = {
  render: (s) => {
    const MAPH = 410, z = 1.6;
    const P = Dubai.PLACES.pickup;
    const view = Dubai.camera(330, 549, 390, MAPH, z);
    const [px, py] = Dubai.project(view, 390, MAPH, P.x, P.y);
    const v = VEHICLES[s.vehicle];
    const map = Dubai.map({ view, z, marks: [
      { type: 'truck', x: 296, y: 632, ang: -117.5 }, { type: 'truck', x: 402, y: 521, ang: -27.5 }, { type: 'truck', x: 236, y: 609, ang: 152.5 },
      { type: 'me', x: P.x, y: P.y },
    ] });
    return `<div class="map" style="height:${MAPH + 40}px">${map}</div>
      <div style="position:absolute;left:${px}px;top:${py - 54}px;transform:translateX(-50%);z-index:2;display:flex;align-items:center;gap:8px;height:32px;padding:0 12px;border-radius:999px;background:#F2E8D5;color:#0B0C10;font-size:13px;font-weight:600;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.45)">You're here<span class="mono" style="font-size:10px;color:#5A574F">E11</span></div>
      <div style="position:absolute;left:20px;right:20px;top:54px;z-index:2" class="bar">
        <div class="col g2" style="padding:8px 14px;border-radius:16px;background:rgba(10,11,16,.86);border:1px solid var(--line)"><span style="font-size:14px;font-weight:600">Good evening</span><span class="ar" style="font-size:13px;color:var(--gold-2)">مساء الخير</span></div>
        <span class="rowx g8"><span class="pill mono" style="height:34px;background:rgba(10,11,16,.86);border:1px solid var(--line)">31°C · DUBAI</span><button type="button" class="ib" data-act="go" data-to="concierge" data-dir="fade" aria-label="Concierge">${icon('headset')}</button></span>
      </div>
      <section class="sheet" style="bottom:86px;padding-bottom:20px;gap:16px">
        <span class="grab"></span>
        <div class="col g10"><span class="label">What happened?</span>
          <div class="chips" role="group" aria-label="What happened">${ISSUES.map((i) => `<button type="button" class="chip" data-act="issue" data-v="${i}" aria-pressed="${s.issue === i}">${i}</button>`).join('')}</div></div>
        <div class="group" style="background:var(--ink-2)">
          <div class="li" style="cursor:default"><span style="width:40px;display:flex;justify-content:center"><span style="width:12px;height:12px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 4px var(--gold-soft)"></span></span><span class="grow col g2"><span class="label">Pick-up · current location</span><span class="t">Sheikh Zayed Road, Al Sufouh</span></span></div>
          <button type="button" class="li" data-act="pickDrop"><span style="width:40px;display:flex;justify-content:center"><span style="width:11px;height:11px;border-radius:3px;border:2px solid var(--sand)"></span></span><span class="grow col g2"><span class="label">Drop-off</span><span class="t">${DROPS[s.drop].name}</span></span><span class="chev">${icon('next', 18)}</span></button>
          <button type="button" class="li" data-act="pickCar"><span class="tile sm" style="width:40px;height:40px">${icon('car', 22, 1.6)}</span><span class="grow col g2"><span class="label">Vehicle</span><span class="t">${v.name} <span style="font-weight:400;color:var(--sand-2)">· ${v.note.toLowerCase()}</span></span></span><span class="chev">${icon('next', 18)}</span></button>
        </div>
        <button type="button" class="btn gold block" data-act="go" data-to="truck">Choose a truck${icon('arrow', 18, 2)}</button>
      </section>
      ${tabbar('home')}`;
  },
};
Customer.actions.issue = (d, el, ph) => { ph.state.issue = d.v; ph.patch(); };
Customer.actions.pickDrop = (d, el, ph) => {
  const s = ph.state;
  ph.sheet(`<h2 class="h2">Where should we take it?</h2><div class="group">${Object.entries(DROPS).map(([k, v]) => `<button type="button" class="li" data-act="setDrop" data-v="${k}"><span class="tile sm">${icon(k === 'marina' ? 'pin' : k === 'hills' ? 'home' : 'truck', 18)}</span><span class="grow col g2"><span class="t">${v.name}</span><span class="m">${v.km} km from you</span></span><span class="radio${s.drop === k ? ' on' : ''}">${s.drop === k ? icon('check', 14, 3) : ''}</span></button>`).join('')}</div>`, { label: 'Drop-off' });
};
Customer.actions.setDrop = (d, el, ph) => { ph.state.drop = d.v; ph.closeSheet(); ph.patch(); };
Customer.actions.pickCar = (d, el, ph) => {
  const s = ph.state;
  ph.sheet(`<h2 class="h2">Which car?</h2><p class="sub" style="margin-top:-8px">We advise the truck from your car's details.</p><div class="group">${Object.entries(VEHICLES).map(([k, v]) => `<button type="button" class="li" data-act="setCar" data-v="${k}"><span class="tile sm">${icon('car', 20, 1.6)}</span><span class="grow col g2"><span class="t">${v.name}</span><span class="m">${v.note} · advised ${CLASSES[v.advise].name}</span></span><span class="radio${s.vehicle === k ? ' on' : ''}">${s.vehicle === k ? icon('check', 14, 3) : ''}</span></button>`).join('')}</div>`, { label: 'Vehicle' });
};
Customer.actions.setCar = (d, el, ph) => { ph.state.vehicle = d.v; ph.state.cls = null; ph.closeSheet(); ph.patch(); };

/* ---------- Choose a truck ---------- */
Customer.screens.truck = {
  render: (s) => {
    const sel = clsOf(s), adv = VEHICLES[s.vehicle].advise, c = CLASSES[sel];
    return `<div class="pad col fill g20">
      <div class="bar">${UI.back('home')}${UI.steps(2)}<span class="mono muted" style="width:46px;text-align:right">2/4</span></div>
      <div class="col g8"><h1 class="h1">Choose your truck</h1><p class="sub">For ${VEHICLES[s.vehicle].reason}, we advise <span class="t-gold nowrap" style="font-weight:600">${CLASSES[adv].name}</span>.</p></div>
      <div class="col g10">${Object.values(CLASSES).map((k) => {
        const on = k.code === sel;
        return `<button type="button" data-act="cls" data-v="${k.code}" aria-pressed="${on}" style="display:flex;align-items:center;gap:14px;min-height:88px;padding:14px 16px;border-radius:20px;border:1.5px solid ${on ? 'var(--gold)' : 'var(--line)'};background:${on ? '#1B170F' : 'var(--ink-1)'};text-align:left">
          <span class="tile ${on ? 'gold' : ''}">${k.code}</span>
          <span class="grow col g4"><span class="rowx g8" style="flex-wrap:wrap"><span style="font-size:17px;font-weight:600">${k.name}</span>${k.code === adv ? '<span class="pill gold mono" style="height:20px;font-size:9px">ADVISED</span>' : ''}</span><span class="muted">${k.desc}</span></span>
          <span class="col" style="align-items:flex-end;gap:2px"><span class="label" style="font-size:9px">From AED</span><span class="num" style="font-size:20px">${k.base}</span></span></button>`;
      }).join('')}</div>
      <button type="button" class="rowx g8 center" data-act="go" data-to="premium" style="min-height:44px;border:0;background:transparent;color:var(--sand-2);font-size:14px">${icon('info', 16)}What makes <span class="t-gold" style="font-weight:600">Enclosed</span> different?</button>
      <button type="button" class="btn gold block mt-auto" data-act="go" data-to="confirm" style="justify-content:space-between">Continue with ${c.name}<span class="price">FROM AED ${c.base}</span></button>
    </div>`;
  },
};
Customer.actions.cls = (d, el, ph) => { ph.state.cls = d.v; ph.patch(); };

/* ---------- Confirm & fare ---------- */
Customer.screens.confirm = {
  render: (s) => {
    const f = fare(s), c = CLASSES[clsOf(s)], route = dropRoute(s);
    const { view, z } = frame(route, 390, 270, { t: 76, b: 44, l: 64, r: 64 });
    const map = Dubai.map({ view, z, routes: [{ pts: route }], marks: [{ type: 'drop', x: route[2][0], y: route[2][1] }, { type: 'me', x: route[0][0], y: route[0][1] }] });
    const line = (k, v, extra = '') => `<div class="rowx between" style="padding:8px 2px"><span style="color:var(--sand-2)">${k}</span>${extra}<span style="font-variant-numeric:tabular-nums">${v}</span></div>`;
    return `<div class="map" style="height:280px">${map}</div>
      <div style="position:absolute;left:20px;top:54px;z-index:2">${UI.back('truck')}</div>
      <section class="col g16" style="position:absolute;left:0;right:0;top:250px;bottom:0;padding:24px 20px 34px;border-radius:28px 28px 0 0;background:var(--night);border-top:1px solid var(--line)">
        <div class="rowx g14"><span class="tile gold">${c.code}</span><div class="grow col g2"><span class="label">Your recovery · 3/4</span><h1 class="h2" style="font-size:22px">${c.full}</h1><span class="small" style="color:var(--sand-2)">${VEHICLES[s.vehicle].name} · ${VEHICLES[s.vehicle].note.toLowerCase()}</span></div></div>
        <div class="card rowx between" style="padding:14px 16px"><div class="col g4"><span class="label">Sheikh Zayed Rd → ${DROPS[s.drop].short}</span><span class="small" style="color:var(--sand-2)">${s.issue} · pick-up on the E11 hard shoulder</span></div><span class="mono">${f.km} km</span></div>
        <div class="col">
          ${line(`Base fare · ${c.name}`, `AED ${f.base}`)}
          ${line(`Distance · ${f.km} km`, `AED ${f.dist}`)}
          <div class="rowx between" style="padding:6px 2px"><span class="rowx g10" style="color:var(--sand-2)"><button type="button" class="switch sm" role="switch" aria-checked="${s.priority}" aria-label="Priority dispatch" data-act="prio"><span></span></button>Priority dispatch</span><span style="font-variant-numeric:tabular-nums">${s.priority ? 'AED 40' : '—'}</span></div>
          ${line('VAT · 5%', `AED ${f.vat}`)}
          <div class="rowx between" style="padding:14px 2px 0;margin-top:6px;border-top:1px solid var(--line);align-items:baseline"><span style="font-weight:600">Total <span class="muted">· fixed upfront</span></span><span class="rowx g6" style="align-items:baseline"><span class="mono muted">AED</span><span class="num" style="font-size:34px">${fmt(f.total)}</span></span></div>
        </div>
        <button type="button" class="btn gold block mt-auto" data-act="go" data-to="pay">Confirm · AED ${fmt(f.total)}</button>
      </section>`;
  },
};
Customer.actions.prio = (d, el, ph) => { ph.state.priority = !ph.state.priority; ph.patch(); };

/* ---------- Payment ---------- */
Customer.screens.pay = {
  render: (s) => {
    const f = fare(s);
    const row = (m) => { const on = s.pay === m.id; return `<button type="button" class="li" data-act="payWith" data-v="${m.id}" aria-pressed="${on}" style="background:${on ? '#1B170F' : 'transparent'}"><span class="tile sm" style="width:46px;height:32px;border-radius:8px;font-size:10px;font-weight:600">${m.tile}</span><span class="grow col g2"><span class="t">${m.name}</span><span class="m">${m.meta}</span></span><span class="radio${on ? ' on' : ''}">${on ? icon('check', 14, 3) : ''}</span></button>`; };
    const label = { apple: `Pay AED ${fmt(f.total)} with Apple Pay`, cash: `Confirm · AED ${fmt(f.total)} in cash`, corp: `Charge AED ${fmt(f.total)} to account` }[s.pay] || `Pay AED ${fmt(f.total)}`;
    return `<div class="pad col fill g18">
      <div class="bar">${UI.back('confirm')}${UI.steps(4)}<span class="mono muted" style="width:46px;text-align:right">4/4</span></div>
      <div class="col g6"><h1 class="h1">Payment</h1><p class="sub">${CLASSES[clsOf(s)].full} · AED ${fmt(f.total)} incl. VAT</p></div>
      <div class="col g8"><span class="label">Cards &amp; wallet</span><div class="group">${PAYMENTS.filter((m) => m.group === 'card').map(row).join('')}</div></div>
      <div class="col g8"><span class="label">Other ways to pay</span><div class="group">${PAYMENTS.filter((m) => m.group === 'other').map(row).join('')}</div></div>
      <div class="col g12 mt-auto"><span class="rowx g8 muted">${icon('lock', 14)}Secured payment · VAT invoice included</span>
      <button type="button" class="btn gold block" data-act="payNow">${label}</button></div>
    </div>`;
  },
};
Customer.actions.payWith = (d, el, ph) => { ph.state.pay = d.v; ph.patch(); };
Customer.actions.payNow = (d, el, ph) => {
  const s = ph.state, f = fare(s);
  ph.sheet(`<div class="col center g16" style="padding:18px 0 8px;text-align:center">
      <span id="payIcon" style="width:72px;height:72px;border-radius:50%;border:3px solid var(--line-2);border-top-color:var(--gold);animation:spin .9s linear infinite"></span>
      <h2 class="h2" id="payTitle">${s.pay === 'apple' ? 'Confirm with Face ID' : 'Processing payment'}</h2>
      <p class="sub" id="paySub">AED ${fmt(f.total)} · ${PAYMENTS.find((m) => m.id === s.pay).name}</p></div>`, {
    label: 'Payment',
    mount: (sc, p) => {
      const t1 = setTimeout(() => {
        const ic = sc.querySelector('#payIcon');
        ic.style.animation = 'none'; ic.style.border = '0'; ic.style.background = 'var(--gold)'; ic.style.display = 'flex'; ic.style.alignItems = 'center'; ic.style.justifyContent = 'center'; ic.style.color = 'var(--gold-ink)';
        ic.innerHTML = icon('check', 34, 2.6);
        sc.querySelector('#payTitle').textContent = s.pay === 'cash' ? 'Booked' : 'Paid';
      }, 1500);
      const t2 = setTimeout(() => p.go('matching', { dir: 'fade' }), 2500);
      sc._cleanup = () => { clearTimeout(t1); clearTimeout(t2); };
    },
  });
};

/* ---------- Matching ---------- */
Customer.screens.matching = {
  render: (s) => {
    const P = Dubai.PLACES.pickup, z = 1.25;
    const view = Dubai.camera(P.x, P.y + 40, 390, 844, z);
    const [px, py] = Dubai.project(view, 390, 844, P.x, P.y);
    const map = Dubai.map({ view, z, marks: [{ type: 'truck', x: 300, y: 640, ang: -117.5 }, { type: 'truck', x: 214, y: 620, ang: 152.5 }, { type: 'truck', x: 452, y: 495, ang: -27.5 }, { type: 'me', x: P.x, y: P.y }] });
    return `<div class="map" style="height:100%">${map}</div>
      <div aria-hidden="true" style="position:absolute;left:${px - 170}px;top:${py - 170}px;width:340px;height:340px;border-radius:50%;background:conic-gradient(from 0deg,rgba(224,170,78,.0),rgba(224,170,78,.28) 18%,rgba(224,170,78,0) 19%);animation:sweep 2.4s linear infinite"></div>
      <div aria-hidden="true" style="position:absolute;left:${px - 170}px;top:${py - 170}px;width:340px;height:340px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(224,170,78,.3)"></div>
      <section class="sheet" style="gap:14px">
        <span class="grab"></span>
        <div id="mStatus" class="col g8"><span class="eyebrow">Matching</span><h1 class="h1" style="font-size:24px">Finding the nearest ${CLASSES[clsOf(s)].name} truck</h1><p class="sub">Checking trucks near Al Sufouh and Al Barsha.</p></div>
        <div class="rowx g6" aria-hidden="true">${[0, 1, 2].map((i) => `<span style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:blink 1.2s ${i * .2}s infinite"></span>`).join('')}</div>
      </section>`;
  },
  mount: (el, ph) => {
    ph.later(() => {
      const st = el.querySelector('#mStatus');
      st.innerHTML = `<span class="eyebrow" style="color:var(--good)">Truck found</span><div class="rowx g14" style="margin-top:4px"><span class="avatar ring">A</span><div class="grow col g2"><span style="font-size:18px;font-weight:600">Ahmed K. accepted</span><span class="small" style="color:var(--sand-2)">Low-Angle truck · 6 min away</span></div>${UI.plate('D', '12345')}</div>`;
      st.classList.add('rise');
      el.querySelector('.sheet .rowx.g6').remove();
    }, 2600);
    ph.later(() => ph.go('tracking', { dir: 'fade' }), 4400);
  },
};

/* ---------- Live tracking (truck to you) ---------- */
function trackingScreen(leg) {
  return {
    render: (s) => {
      const route = leg === 1 ? Dubai.ROUTES.toPickup : dropRoute(s);
      const end = route[route.length - 1];
      const { view, z } = frame(route, 390, 844, { t: 170, b: 340, l: 50, r: 50 }, 2.2);
      const marks = leg === 1 ? [{ type: 'me', x: end[0], y: end[1] }] : [{ type: 'drop', x: end[0], y: end[1] }];
      const st = Dubai.along(route, 0);
      marks.push({ type: 'truck', id: 'trk', x: st.x, y: st.y, ang: st.ang });
      const map = Dubai.map({ view, z, routes: [{ pts: route, id: 'rt', flow: true }], marks });
      const d = DROPS[s.drop];
      return `<div class="map" style="height:100%" data-view="${view.join(',')}">${map}</div>
        <div style="position:absolute;left:20px;right:20px;top:54px;z-index:2;display:flex;align-items:center;gap:16px;padding:14px 18px;border-radius:22px;background:rgba(10,11,16,.94);border:1px solid var(--line-2);box-shadow:0 16px 40px rgba(0,0,0,.5)">
          <div class="col g2"><span class="label">${leg === 1 ? 'Arriving in' : 'Drop-off in'}</span><span class="rowx g6" style="align-items:baseline"><span class="num t-gold" id="eta" style="font-size:38px">${leg === 1 ? 6 : d.min}</span><span style="font-weight:600">min</span></span></div>
          <span style="width:1px;align-self:stretch;background:var(--line-2)"></span>
          <div class="grow col g4"><span style="font-weight:600" id="etaTitle">${leg === 1 ? 'Ahmed is on the E11' : `To ${d.short}`}</span><span class="mono small" style="color:var(--sand-2);font-size:11px;letter-spacing:.06em" id="etaSub">${leg === 1 ? 'ETA 21:54 · LOW-ANGLE' : `${d.km} KM · CAR SECURED`}</span></div>
        </div>
        <section class="sheet" style="gap:18px">
          <span class="grab"></span>
          ${progress(leg === 1 ? 1 : 3)}
          ${driverRow()}
          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">
            <button type="button" class="btn gold" data-act="call" style="flex-direction:column;gap:4px;min-height:62px;font-size:13px">${icon('phone', 20)}Call</button>
            <button type="button" class="btn dark" data-act="message" style="flex-direction:column;gap:4px;min-height:62px;font-size:13px">${icon('chat', 20)}Message</button>
            <button type="button" class="btn dark" data-act="shareTrip" style="flex-direction:column;gap:4px;min-height:62px;font-size:13px">${icon('share', 20)}Share trip</button>
          </div>
        </section>`;
    },
    mount: (el, ph) => {
      const s = ph.state;
      const route = leg === 1 ? Dubai.ROUTES.toPickup : dropRoute(s);
      const total = leg === 1 ? 6 : DROPS[s.drop].min;
      const D = leg === 1 ? 15000 : 13000;
      const trk = el.querySelector('#trk'), rt = el.querySelector('#rt'), glow = el.querySelector('#rt-glow'), flow = el.querySelector('#rt-flow'), eta = el.querySelector('#eta');
      let t0 = null, arrived = false;
      ph.loop((ts) => {
        if (t0 === null) t0 = ts;
        const t = Math.min(1, (ts - t0) / D);
        const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const p = Dubai.along(route, e);
        trk.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.ang.toFixed(1)})`);
        const d = Dubai.pathD(p.rest);
        rt.setAttribute('d', d); glow.setAttribute('d', d); flow.setAttribute('d', d);
        eta.textContent = Math.max(1, Math.ceil(total * (1 - e)));
        if (t >= 1 && !arrived) {
          arrived = true;
          eta.textContent = '0';
          if (leg === 1) {
            el.querySelector('#etaTitle').textContent = 'Ahmed has arrived';
            el.querySelector('#etaSub').textContent = 'HAZARDS ON · STAY IN YOUR CAR';
            ph.toast(`${icon('check', 16, 2.6)}Ahmed has arrived`);
            ph.later(() => ph.go('securing'), 1800);
          } else {
            el.querySelector('#etaTitle').textContent = `Arrived at ${DROPS[s.drop].short}`;
            ph.later(() => ph.go('delivered', { dir: 'up' }), 1400);
          }
          return false;
        }
      });
    },
  };
}
Customer.screens.tracking = trackingScreen(1);
Customer.screens.tow = trackingScreen(2);
Customer.actions.call = (d, el, ph) => {
  ph.sheet(`<div class="col center g14" style="padding:10px 0;text-align:center"><span class="avatar ring" style="width:76px;height:76px;font-size:28px">A</span><h2 class="h2">Ahmed K.</h2><span class="mono t-gold" id="callT">CALLING…</span>
    <button type="button" class="btn block" data-act="closeSheet" style="background:var(--crit);color:#1B0B09;margin-top:8px">${icon('phone', 18)}End call</button></div>`, {
    label: 'Call', mount: (sc) => { let n = 0; const iv = setInterval(() => { n++; if (n > 1) sc.querySelector('#callT').textContent = `00:${String(n - 1).padStart(2, '0')}`; }, 1000); sc._cleanup = () => clearInterval(iv); },
  });
};
Customer.actions.message = (d, el, ph) => {
  ph.sheet(`<div class="rowx g12"><span class="avatar" style="width:40px;height:40px;font-size:16px">A</span><div class="col"><span style="font-weight:600">Ahmed K.</span><span class="muted">Low-Angle operator</span></div></div>
    <div class="col g8" id="dm"><p style="margin:0;align-self:flex-start;max-width:85%;padding:11px 14px;border-radius:6px 18px 18px 18px;background:var(--ink-3)">I'm on the E11, a few minutes away. Please stay in your car with the hazards on.</p></div>
    <div class="chips" style="margin-inline:0;padding-inline:0;flex-wrap:wrap">${['Thank you', 'I’m on the hard shoulder', 'Please call me'].map((q) => `<button type="button" class="chip" data-act="dmSend" data-v="${q}">${q}</button>`).join('')}</div>`, { label: 'Message Ahmed' });
};
Customer.actions.dmSend = (d, el, ph) => {
  const box = ph.root.querySelector('#dm');
  if (!box) return;
  box.insertAdjacentHTML('beforeend', `<p class="rise" style="margin:0;align-self:flex-end;max-width:85%;padding:11px 14px;border-radius:18px 6px 18px 18px;background:var(--sand);color:#0B0C10">${esc(d.v)}</p>`);
  el.remove();
};
Customer.actions.shareTrip = (d, el, ph) => ph.toast(`${icon('share', 16)}Live trip link ready to send`);

/* ---------- Securing ---------- */
Customer.screens.securing = {
  render: (s) => {
    const n = s.step;
    const steps = [
      ['Inspected & photographed', 'Six photos added to your record', '21:55'],
      ['Low-angle ramps positioned', 'No contact with the splitter', '21:57'],
      ['Wheels strapped & secured', 'Soft straps on all four wheels', '21:59'],
      [`Departing to ${DROPS[s.drop].short}`, 'Live map as soon as you move', 'NOW'],
    ];
    return `<div class="pad col fill g20">
      <div class="bar"><span class="pill mono" style="height:34px;padding:0 14px"><i style="color:var(--good);animation:blink 1.6s infinite"></i>OPERATOR ARRIVED · 21:54</span>${UI.plate('D', '12345')}</div>
      <div class="col g6"><h1 class="h1">Securing your car</h1><p class="sub">Every step documented, with live updates.</p></div>
      <ol id="secList" style="margin:0;padding:0;list-style:none;position:relative" class="col">
        <span aria-hidden="true" style="position:absolute;left:14px;top:30px;bottom:30px;width:2px;background:var(--line-2)"></span>
        ${steps.map(([t, m, time], i) => `<li class="rowx g16" style="min-height:62px;position:relative" ${i === n ? 'aria-current="step"' : ''}>
          <span class="check ${i < n ? 'on' : i === n ? 'now' : ''}" style="background:${i < n ? 'var(--sand)' : 'var(--night)'}">${i < n ? icon('check', 15, 3) : ''}</span>
          <span class="grow col g2"><span style="font-size:16px;font-weight:600;color:${i === n ? 'var(--gold-2)' : i < n ? 'var(--sand)' : 'var(--sand-3)'}">${t}</span><span class="muted">${m}</span></span>
          <span class="mono small" style="color:${i === n ? 'var(--gold-2)' : 'var(--sand-3)'}">${i <= n ? time : ''}</span></li>`).join('')}
      </ol>
      <div class="col g10"><div class="rowx between"><span class="label">Live photos · ${Math.min(n, 3) * 2}</span><span class="small t-gold" style="font-weight:600">Shared with you</span></div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">${[['FRONT', '21:55'], ['RAMPS', '21:57'], ['STRAPS', '21:59']].map(([l, t], i) => UI.carPhoto(l, i < n ? t : '', i < n)).join('')}</div></div>
      <div class="rowx g10 mt-auto"><button type="button" class="btn dark grow" data-act="message">${icon('chat', 18)}Message Ahmed</button><button type="button" class="btn gold" data-act="call" aria-label="Call Ahmed" style="width:56px;padding:0">${icon('phone', 20)}</button></div>
    </div>`;
  },
  before: (s) => { s.step = 0; },
  mount: (el, ph) => {
    const s = ph.state;
    const tick = () => {
      s.step++;
      ph.patch();
      if (s.step < 3) ph.later(tick, 1700);
      else ph.later(() => ph.go('tow'), 2000);
    };
    ph.later(tick, 1300);
  },
};

/* ---------- Delivered: rate & tip ---------- */
Customer.screens.delivered = {
  render: (s) => {
    const d = DROPS[s.drop];
    const words = ['', 'Poor', 'Could be better', 'Good', 'Great', 'Exceptional'];
    return `<div style="position:absolute;left:0;right:0;top:0;height:300px">${skyline({ seed: 9, par: 'xMidYMax slice', moonX: 1060, moonY: 80 })}<div style="position:absolute;inset:0;background:linear-gradient(rgba(7,8,12,0) 40%,#07080C)"></div></div>
      <div class="pad col fill g18" style="position:relative">
        <div class="bar"><span class="pill good mono" style="height:34px;padding:0 14px">${icon('check', 14, 2.6)}DELIVERED · 22:21</span><button type="button" class="ib" data-act="go" data-to="home" data-dir="fade" aria-label="Close">${icon('close', 18)}</button></div>
        <div class="col g8" style="margin-top:118px"><h1 class="h-xl" style="font-size:34px">Safely at<br>${d.short}.</h1><p class="sub">Your ${VEHICLES[s.vehicle].name} was handed over, photographed and signed for.</p></div>
        <div class="card col g14" style="padding:18px">
          <div class="rowx g12"><span class="avatar">A</span><div class="col g2"><span style="font-weight:600;font-size:16px">How was Ahmed's service?</span><span class="muted">Low-Angle operator · D 12345</span></div></div>
          <div class="rowx between" role="group" aria-label="Rating">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-act="rate" data-v="${n}" aria-label="${n} star${n > 1 ? 's' : ''}" aria-pressed="${n <= s.rating}" style="width:54px;height:50px;border:0;background:transparent;color:${n <= s.rating ? 'var(--gold)' : '#4A4F60'}"><svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z" fill="${n <= s.rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg></button>`).join('')}</div>
          <span class="mono t-gold" style="align-self:center;font-size:11px;letter-spacing:.16em">${words[s.rating].toUpperCase()}</span>
        </div>
        <div class="col g8"><span class="label">Add a tip for Ahmed</span><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">${[0, 20, 50, 100].map((v) => `<button type="button" class="chip" data-act="tip" data-v="${v}" aria-pressed="${s.tip === v}" style="justify-content:center;min-height:52px;border-radius:16px">${v ? `AED ${v}` : 'None'}</button>`).join('')}</div></div>
        <button type="button" class="btn gold block mt-auto" data-act="go" data-to="receipt">${s.tip ? `Submit · tip AED ${s.tip}` : 'Submit & finish'}</button>
      </div>`;
  },
};
Customer.actions.rate = (d, el, ph) => { ph.state.rating = +d.v; ph.patch(); };
Customer.actions.tip = (d, el, ph) => { ph.state.tip = +d.v; ph.patch(); };

/* ---------- Receipt ---------- */
Customer.screens.receipt = {
  render: (s) => {
    const f = fare(s), c = CLASSES[clsOf(s)], d = DROPS[s.drop];
    const pm = PAYMENTS.find((m) => m.id === s.pay);
    const line = (k, v) => `<div class="rowx between" style="padding:7px 0"><span style="color:var(--sand-2)">${k}</span><span style="font-variant-numeric:tabular-nums">${v}</span></div>`;
    return `<div class="pad col fill g18">
      <div class="bar"><span style="width:46px"></span><span class="label">Receipt</span><button type="button" class="ib" data-act="finish" aria-label="Done">${icon('close', 18)}</button></div>
      <article class="card" style="overflow:hidden">
        <div class="patterned" style="padding:20px;background-color:#14120E;border-bottom:1px solid var(--gold-line);display:flex;align-items:center;justify-content:space-between;gap:12px">
          <span class="rowx g10">${MARK(28)}<span class="col"><span style="font-weight:600">Tax invoice</span><span class="mono muted" style="font-size:10px;letter-spacing:.12em">TODAY · 22:21</span></span></span>
          <span class="pill good">${icon('check', 12, 3)}Paid</span>
        </div>
        <div style="padding:16px 20px 20px">
          <div class="rowx g12" style="padding-bottom:12px;border-bottom:1px solid var(--line)"><span class="tile">${c.code}</span><div class="col g2"><span style="font-weight:600">${c.full}</span><span class="muted">Sheikh Zayed Rd → ${d.short} · ${d.km} km</span></div></div>
          ${line('Base fare', `AED ${f.base}`)}${line('Distance', `AED ${f.dist}`)}${s.priority ? line('Priority dispatch', 'AED 40') : ''}${line('VAT · 5%', `AED ${f.vat}`)}${s.tip ? line('Tip for Ahmed', `AED ${s.tip}`) : ''}
          <div class="rowx between" style="padding-top:12px;margin-top:6px;border-top:1px dashed var(--line-2);align-items:baseline"><span style="font-weight:600">Total paid</span><span class="num" style="font-size:28px">AED ${fmt(f.total + s.tip)}</span></div>
          <span class="muted" style="display:block;margin-top:8px">${pm.name}</span>
        </div>
      </article>
      <div class="rowx g8 muted">${UI.stars(String(s.rating))}<span>You rated Ahmed ${s.rating} of 5</span></div>
      <div class="col g10 mt-auto"><button type="button" class="btn dark block" data-act="receiptSave">${icon('download', 18)}Save VAT invoice</button><button type="button" class="btn gold block" data-act="finish">Done</button></div>
    </div>`;
  },
};
Customer.actions.receiptSave = (d, el, ph) => ph.toast(`${icon('check', 16, 2.6)}Invoice saved to Activity`);
Customer.actions.finish = (d, el, ph) => {
  const s = ph.state, f = fare(s), c = CLASSES[clsOf(s)];
  if (!s.trips.some((t) => t.today)) s.trips.unshift({ cls: c.code, title: `${c.name} · ${DROPS[s.drop].short.replace('Dubai ', '')}`, meta: `Today · ${VEHICLES[s.vehicle].name}`, amount: f.total + s.tip, today: true });
  ph.go('activity', { dir: 'fade' });
};

/* ---------- Activity ---------- */
Customer.screens.activity = {
  render: (s) => {
    const total = s.trips.reduce((a, t) => a + t.amount, 0);
    const [first, ...rest] = s.trips;
    const tripRow = (t) => `<button type="button" class="li" data-act="tripInfo" style="padding:10px 4px"><span class="tile sm ${t.cls === 'EN' ? 'goldline' : ''}">${t.cls}</span><span class="grow col g2"><span class="t">${t.title}</span><span class="m">${t.meta}</span></span><span class="mono">AED ${fmt(t.amount)}</span></button>`;
    return `<div class="pad col fill g18" style="padding-bottom:0">
      <div class="bar"><h1 class="h1" style="font-size:30px">Activity</h1><button type="button" class="ib" data-act="tripInfo" aria-label="Filter">${icon('sliders')}</button></div>
      <div class="fill scroll col g18" style="margin-inline:-20px;padding-inline:20px;padding-bottom:24px">
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-block:1px solid var(--line)">
          <div class="col g4" style="padding:12px 2px"><span class="label">Recoveries</span><span class="num" style="font-size:20px">${s.trips.length}</span></div>
          <div class="col g4" style="padding:12px;border-left:1px solid var(--line)"><span class="label">Total · AED</span><span class="num" style="font-size:20px">${fmt(total)}</span></div>
          <div class="col g4" style="padding:12px;border-left:1px solid var(--line)"><span class="label">VAT invoices</span><span class="num" style="font-size:20px">Ready</span></div>
        </div>
        ${s.booked ? `<div class="card col g12 rise" style="padding:16px;border-color:var(--gold-line)"><span class="eyebrow">Upcoming</span><div class="rowx g12"><span class="tile gold">EN</span><div class="grow col g2"><span class="t" style="font-weight:600">Enclosed Transporter</span><span class="muted">${s.booked.when} · Emirates Hills → Al Quoz</span></div><span class="mono">AED 940</span></div></div>` : ''}
        <article class="card" style="overflow:hidden">
          <div style="height:96px">${(() => { const r = Dubai.ROUTES.marina; const fr = frame(r, 350, 96, { t: 16, b: 16, l: 30, r: 30 }); return Dubai.map({ view: fr.view, z: fr.z, routes: [{ pts: r }], marks: [{ type: 'drop', x: r[2][0], y: r[2][1] }] }); })()}</div>
          <div class="col g12" style="padding:14px 16px 16px">
            <div class="rowx g12"><span class="tile sm">${first.cls}</span><div class="grow col g2"><span style="font-weight:600">${first.title}</span><span class="muted">${first.meta}</span></div><span class="mono">AED ${fmt(first.amount)}</span></div>
            <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px"><button type="button" class="btn dark" data-act="receiptSave" style="min-height:44px;font-size:14px">${icon('download', 16)}VAT receipt</button><button type="button" class="btn" data-act="go" data-to="home" data-dir="fade" style="min-height:44px;font-size:14px;background:var(--gold-soft);color:var(--gold-2)">${icon('refresh', 16)}Re-book</button></div>
          </div>
        </article>
        <div class="col"><span class="label" style="padding-bottom:4px">Earlier</span>${rest.map(tripRow).join('<span style="height:1px;background:var(--line)"></span>')}</div>
      </div></div>
      ${tabbar('activity')}`;
  },
};
Customer.actions.tripInfo = (d, el, ph) => ph.toast('Trip details open from here');

/* ---------- Concierge chat ---------- */
Customer.screens.concierge = {
  render: (s) => `<div class="pad col fill g14" style="padding-bottom:0">
      <div class="rowx g12" style="padding-bottom:14px;border-bottom:1px solid var(--line)">
        <span style="position:relative;width:46px;height:46px;flex:none;border-radius:50%;background:var(--gold-soft);color:var(--gold-2);display:flex;align-items:center;justify-content:center">${icon('headset', 20, 1.7)}<span style="position:absolute;right:0;bottom:0;width:11px;height:11px;border-radius:50%;background:var(--good);box-shadow:0 0 0 2.5px var(--night)"></span></span>
        <div class="grow col"><span style="font-size:17px;font-weight:600">Concierge</span><span class="mono muted" style="font-size:10px;letter-spacing:.12em">ONLINE · 24/7 · ENGLISH &amp; العربية</span></div>
        <button type="button" class="ib gold" data-act="call" aria-label="Call support">${icon('phone')}</button>
      </div>
      <div class="fill scroll col g10" id="chat" style="padding-bottom:12px">
        <span class="mono muted" style="align-self:center;font-size:10px;letter-spacing:.14em">TONIGHT · 21:08</span>
        ${s.chat.map((m) => m.card ? `<article class="card col g12" style="align-self:flex-start;width:88%;padding:14px;border-radius:6px 20px 20px 20px;border-color:var(--line-2)"><div class="rowx g12"><span class="tile gold sm">EN</span><div class="col g2"><span style="font-weight:600">Enclosed Transporter</span><span class="muted">Sat, 18 Oct · 09:00 – 10:00</span></div></div><div class="rowx between small" style="color:var(--sand-2)"><span>Emirates Hills → Al Quoz</span><span class="mono" style="color:var(--sand)">AED 940</span></div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px"><button type="button" class="btn dark" data-act="go" data-to="schedule" style="min-height:44px;font-size:14px">Change</button><button type="button" class="btn gold" data-act="hold" style="min-height:44px;font-size:14px">Hold slot</button></div></article>`
          : `<p style="margin:0;align-self:${m.from === 'me' ? 'flex-end' : 'flex-start'};max-width:80%;padding:12px 15px;border-radius:${m.from === 'me' ? '20px 6px 20px 20px' : '6px 20px 20px 20px'};background:${m.from === 'me' ? 'var(--sand)' : 'var(--ink-2)'};color:${m.from === 'me' ? '#0B0C10' : 'var(--sand)'};line-height:1.45">${esc(m.text)}</p>`).join('')}
        ${s.typing ? '<p aria-label="Concierge is typing" style="margin:0;align-self:flex-start;padding:14px 16px;border-radius:6px 20px 20px 20px;background:var(--ink-2);display:flex;gap:5px">' + [0, 1, 2].map((i) => `<span style="width:7px;height:7px;border-radius:50%;background:var(--sand-3);animation:blink 1.2s ${i * .2}s infinite"></span>`).join('') + '</p>' : ''}
      </div>
      <div class="chips" style="padding-bottom:2px">${['Enclosed truck for a classic', 'Book for Saturday', 'Talk to a person'].map((q) => `<button type="button" class="chip" data-act="ask" data-v="${q}" style="min-height:36px;font-size:13px">${q}</button>`).join('')}</div>
      <form data-act="send" class="rowx g8" style="margin:0 0 8px;padding:6px 6px 6px 14px;border-radius:20px;background:var(--ink-1);border:1px solid var(--line-2)">
        <label for="msg" class="sr">Message the concierge</label>
        <input id="msg" name="msg" autocomplete="off" placeholder="Message the concierge" style="flex:1;min-width:0;height:44px;border:0;background:transparent;outline:none;font-size:15px">
        <button type="submit" class="ib" aria-label="Send" style="width:44px;height:44px;border-radius:14px;background:var(--gold);border-color:var(--gold);color:var(--gold-ink)">${icon('send', 18, 2)}</button>
      </form>
    </div>
    ${tabbar('concierge')}`,
  mount: (el) => { const c = el.querySelector('#chat'); c.scrollTop = c.scrollHeight; },
  repatch: (el) => { const c = el.querySelector('#chat'); c.scrollTop = c.scrollHeight; },
};
function conciergeReply(ph, text) {
  const s = ph.state;
  s.chat.push({ from: 'me', text });
  s.typing = true;
  ph.patch();
  ph.later(() => {
    s.typing = false;
    if (/enclosed|classic|saturday|schedule|book/i.test(text)) {
      s.chat.push({ from: 'them', text: 'Of course. I can hold an Enclosed Transporter for Saturday at 09:00, Emirates Hills to your service centre in Al Quoz.' });
      s.chat.push({ card: true });
    } else if (/person|human|call/i.test(text)) {
      s.chat.push({ from: 'them', text: 'You’re talking to a person. I’m Layla from the concierge desk — tap the call button above any time and we’ll pick up.' });
    } else {
      s.chat.push({ from: 'them', text: 'Thank you — I’m on it. If you’re stranded, stay inside the car with your hazards on and we’ll send the right truck.' });
    }
    ph.patch();
  }, 1300);
}
Customer.actions.send = (d, form, ph) => { const v = form.msg.value.trim(); if (v) conciergeReply(ph, v); };
Customer.actions.ask = (d, el, ph) => conciergeReply(ph, d.v);
Customer.actions.hold = (d, el, ph) => { ph.state.booked = { when: 'Sat, 18 Oct · 09:00 – 10:00' }; ph.toast(`${icon('check', 16, 2.6)}Slot held · Sat, 18 Oct, 09:00`); ph.later(() => ph.go('activity', { dir: 'fade' }), 900); };

/* ---------- Premium care ---------- */
Customer.screens.premium = {
  render: () => `<div class="pad col fill g18">
      <div class="bar">${UI.back('truck')}<span class="eyebrow">Class 04 · Premium care</span></div>
      <figure style="margin:0;position:relative;height:220px;border-radius:24px;overflow:hidden;border:1px solid var(--gold-line);background:#0D0E14">
        <svg viewBox="0 0 350 220" width="100%" height="100%" role="img" aria-label="Enclosed transporter with a sports car covered inside">
          <rect width="350" height="220" fill="url(#pStar)" opacity=".12"/>
          <path d="M8 186H342" stroke="#3A3E4E" stroke-dasharray="3 5"/>
          <g fill="none" stroke="#6B6F80"><path d="M22 44H250M22 39V49M250 39V49"/></g>
          <text x="136" y="34" text-anchor="middle" fill="#8F877A" font-family="Geist Mono, monospace" font-size="8" letter-spacing="1.6">FULLY ENCLOSED · CLIMATE CONTROLLED</text>
          <g fill="#0A0B10" stroke="#E9DCC3" stroke-width="1.5" stroke-linejoin="round"><rect x="22" y="60" width="228" height="106" rx="6"/><path d="M252 166V92Q252 82 262 82H292Q302 82 309 91L326 118Q330 124 330 132V166Z"/></g>
          <path d="M262 92H291L304 116H262Z" fill="#1A1C26" stroke="#E9DCC3" stroke-width="1.2"/>
          <path d="M22 166H330" stroke="#E9DCC3" stroke-width="1.5"/>
          <rect x="22" y="60" width="228" height="106" rx="6" fill="url(#pStar)" opacity=".18"/>
          <g fill="none" stroke="#E0AA4E" stroke-width="1.4" stroke-dasharray="3 3" stroke-linecap="round"><path d="M40 154L46 141Q54 136 74 134L104 125Q124 113 154 113Q186 113 202 127L222 133Q230 135 230 144L230 154"/><circle cx="76" cy="154" r="10"/><circle cx="198" cy="154" r="10"/></g>
          <g fill="#0A0B10" stroke="#E9DCC3" stroke-width="1.5"><circle cx="64" cy="174" r="13"/><circle cx="100" cy="174" r="13"/><circle cx="296" cy="174" r="13"/></g>
          <g fill="#6B6F80"><circle cx="64" cy="174" r="4"/><circle cx="100" cy="174" r="4"/><circle cx="296" cy="174" r="4"/></g>
        </svg>
      </figure>
      <div class="col g6"><h1 class="h1">Enclosed Transporter</h1><p class="sub">For supercars, luxury and classics.</p></div>
      <ul style="margin:0;padding:0;list-style:none" class="col">
        ${[['snow', 'Fully enclosed & climate-controlled', 'Zero exposure to dust, sand or heat'], ['shield', 'Insured to AED 2,000,000', 'Full-value in-transit cover'], ['headset', 'A dedicated concierge', 'One contact, door to door']].map(([ic, t, m], i) => `<li class="rowx g14" style="padding:12px 2px;${i ? 'border-top:1px solid var(--line)' : ''}"><span class="tile goldline sm" style="width:40px;height:40px">${icon(ic, 19, 1.7)}</span><span class="col g2"><span style="font-weight:600">${t}</span><span class="muted">${m}</span></span></li>`).join('')}
      </ul>
      <div class="col g12 mt-auto"><div class="rowx between" style="align-items:baseline"><span class="muted" style="font-size:14px">Book now or schedule ahead</span><span class="rowx g6" style="align-items:baseline"><span class="mono muted">FROM AED</span><span class="num" style="font-size:26px">800</span></span></div>
      <button type="button" class="btn gold block" data-act="go" data-to="schedule">Schedule Premium Care${icon('arrow', 18, 2)}</button></div>
    </div>`,
};

/* ---------- Schedule ---------- */
Customer.screens.schedule = {
  render: (s) => {
    const days = [[15, 'WED', 'Wed'], [16, 'THU', 'Thu'], [17, 'FRI', 'Fri'], [18, 'SAT', 'Sat'], [19, 'SUN', 'Sun'], [20, 'MON', 'Mon']];
    const slots = ['08:00 – 09:00', '09:00 – 10:00', '10:00 – 11:00', '11:00 – 12:00'];
    const day = days.find((d) => d[0] === s.sched.day);
    return `<div class="pad col fill g18">
      <div class="rowx g14">${UI.back('premium')}<h1 class="h2" style="font-size:22px">Schedule a transport</h1></div>
      <div class="card rowx g14" style="padding:14px 16px"><span class="tile gold">EN</span><div class="col g2"><span style="font-weight:600">Enclosed Transporter</span><span class="muted">Ferrari Roma · villa to service centre</span></div></div>
      <div class="col g10"><span class="label">Date · October</span><div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px" role="group" aria-label="Date">${days.map(([n, dow]) => { const on = n === s.sched.day; return `<button type="button" data-act="sday" data-v="${n}" aria-pressed="${on}" style="height:72px;border-radius:16px;border:1px solid ${on ? 'var(--gold)' : 'var(--line)'};background:${on ? 'var(--gold)' : 'var(--ink-1)'};color:${on ? 'var(--gold-ink)' : 'var(--sand)'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px"><span class="mono" style="font-size:10px;letter-spacing:.12em;opacity:.8">${dow}</span><span class="num" style="font-size:20px">${n}</span></button>`; }).join('')}</div></div>
      <div class="col g10"><span class="label">Pick-up window</span><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">${slots.map((sl) => `<button type="button" class="chip" data-act="sslot" data-v="${sl}" aria-pressed="${s.sched.slot === sl}" style="justify-content:center;min-height:50px;border-radius:14px;font-family:var(--f-mono);font-size:14px">${sl}</button>`).join('')}</div></div>
      <div class="card" style="display:grid;grid-template-columns:minmax(0,1fr) 28px minmax(0,1fr);align-items:center;gap:8px;padding:16px"><div class="col g2"><span class="label">From</span><span style="font-weight:600">Emirates Hills</span></div><span style="color:var(--sand-3)">${icon('arrow', 20)}</span><div class="col g2" style="text-align:right"><span class="label">To</span><span style="font-weight:600">Al Quoz</span></div></div>
      <div class="col g12 mt-auto"><div class="rowx between" style="align-items:baseline"><span style="color:var(--sand-2)">Estimate <span class="muted">· concierge confirms</span></span><span class="rowx g6" style="align-items:baseline"><span class="mono muted">AED</span><span class="num" style="font-size:30px">940</span></span></div>
      <button type="button" class="btn gold block" data-act="book">Book for ${day[2]}, ${day[0]} Oct</button></div>
    </div>`;
  },
};
Customer.actions.sday = (d, el, ph) => { ph.state.sched.day = +d.v; ph.patch(); };
Customer.actions.sslot = (d, el, ph) => { ph.state.sched.slot = d.v; ph.patch(); };
Customer.actions.book = (d, el, ph) => {
  const s = ph.state;
  const names = { 15: 'Wed', 16: 'Thu', 17: 'Fri', 18: 'Sat', 19: 'Sun', 20: 'Mon' };
  s.booked = { when: `${names[s.sched.day]}, ${s.sched.day} Oct · ${s.sched.slot}` };
  ph.toast(`${icon('check', 16, 2.6)}Booked · ${names[s.sched.day]}, ${s.sched.day} Oct`);
  ph.later(() => ph.go('activity', { dir: 'fade' }), 900);
};
