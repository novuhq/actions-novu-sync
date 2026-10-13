/* Phone runtime: an app is { state, screens, actions }. Screens render HTML strings and may
   mount behaviour; every timer belongs to the screen that started it and stops when it leaves. */

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(.2,.7,.2,1)';

class Phone {
  constructor(root, app) {
    this.root = root;
    this.app = app;
    this.timers = [];
    this.token = 0;
    root.classList.add('app');
    root.innerHTML = '<div class="vp"></div><div class="toast" role="status" aria-live="polite"></div>';
    this.vp = root.querySelector('.vp');
    this.toastEl = root.querySelector('.toast');
    root.addEventListener('click', (e) => this.onClick(e));
    root.addEventListener('submit', (e) => { e.preventDefault(); const f = e.target.closest('form'); const fn = f && this.app.actions[f.dataset.act]; if (fn) fn(f.dataset, f, this); });
    app.phone = this;
  }
  get state() { return this.app.state; }
  later(fn, ms) { const tok = this.token; const t = setTimeout(() => { if (tok === this.token) fn(); }, reduceMotion ? Math.min(ms, 400) : ms); this.timers.push(['t', t]); return t; }
  every(fn, ms) { const t = setInterval(fn, ms); this.timers.push(['i', t]); return t; }
  loop(fn) {
    const tok = this.token;
    const step = (ts) => { if (tok !== this.token) return; if (fn(ts) !== false) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  clearTimers() { for (const [k, t] of this.timers) (k === 't' ? clearTimeout : clearInterval)(t); this.timers = []; }

  go(id, opts = {}) {
    const scr = this.app.screens[id];
    if (!scr) return;
    this.clearTimers();
    this.token++;
    this.closeSheet(true);
    if (scr.before) scr.before(this.state, opts);
    const el = document.createElement('div');
    el.className = 'scr';
    el.dataset.screen = id;
    el.innerHTML = scr.render(this.state, opts);
    const old = this.cur;
    const dir = reduceMotion ? 'none' : (opts.dir || 'fwd');
    if (old && dir === 'back') this.vp.insertBefore(el, old); else this.vp.appendChild(el);
    this.cur = el;
    this.curId = id;
    if (old) {
      old.style.pointerEvents = 'none';
      const done = () => old.remove();
      const T = 380;
      if (dir === 'fwd') {
        el.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: T, easing: EASE });
        old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(-26%)', opacity: .4 }], { duration: T, easing: EASE }).onfinish = done;
      } else if (dir === 'back') {
        el.animate([{ transform: 'translateX(-26%)', opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: T, easing: EASE });
        old.animate([{ transform: 'none' }, { transform: 'translateX(100%)' }], { duration: T, easing: EASE }).onfinish = done;
      } else if (dir === 'up') {
        el.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 440, easing: EASE }).onfinish = done;
      } else if (dir === 'fade') {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' }).onfinish = done;
      } else done();
    }
    if (scr.mount) scr.mount(el, this, opts);
    if (this.app.onNav) this.app.onNav(id);
  }
  /* re-render the current screen in place (selection changes); keeps running timers */
  patch(opts = {}) {
    const scr = this.app.screens[this.curId];
    if (!scr || !this.cur) return;
    const keep = this.cur.querySelector('.scroll');
    const top = keep ? keep.scrollTop : 0;
    this.cur.innerHTML = scr.render(this.state, opts);
    const k2 = this.cur.querySelector('.scroll');
    if (k2) k2.scrollTop = top;
    if (scr.repatch) scr.repatch(this.cur, this);
  }
  $(sel) { return this.cur ? this.cur.querySelector(sel) : null; }

  onClick(e) {
    const a = e.target.closest('[data-act]');
    if (!a || !this.root.contains(a) || a.disabled) return;
    if (a.classList.contains('scrim') && e.target !== a) return;
    const act = a.dataset.act;
    if (act === 'go') { this.go(a.dataset.to, { dir: a.dataset.dir || 'fwd' }); return; }
    if (act === 'closeSheet') { this.closeSheet(); return; }
    const fn = this.app.actions[act];
    if (fn) { e.preventDefault(); fn(a.dataset, a, this); }
  }
  toast(msg, ms = 2400) {
    this.toastEl.innerHTML = msg;
    this.toastEl.classList.add('show');
    clearTimeout(this._tt);
    this._tt = setTimeout(() => this.toastEl.classList.remove('show'), ms);
  }
  sheet(html, opts = {}) {
    this.closeSheet(true);
    const s = document.createElement('div');
    s.className = 'scrim';
    s.dataset.act = 'closeSheet';
    s.innerHTML = `<div class="sheet" role="dialog" aria-label="${esc(opts.label || 'Options')}"><span class="grab"></span>${html}</div>`;
    this.root.appendChild(s);
    this.sheetEl = s;
    if (!reduceMotion) {
      s.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
      s.firstElementChild.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 360, easing: EASE });
    }
    if (opts.mount) opts.mount(s, this);
    return s;
  }
  closeSheet(now) {
    const s = this.sheetEl;
    if (!s) return;
    this.sheetEl = null;
    if (s._cleanup) s._cleanup();
    if (now || reduceMotion) { s.remove(); return; }
    s.firstElementChild.animate([{ transform: 'none' }, { transform: 'translateY(100%)' }], { duration: 260, easing: 'ease-in' });
    s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260 }).onfinish = () => s.remove();
  }
}

/* small shared pieces */
const UI = {
  back: (to, label = 'Back') => `<button type="button" class="ib" data-act="go" data-to="${to}" data-dir="back" aria-label="${label}">${icon('back')}</button>`,
  steps: (n, of = 4) => `<div class="rowx g6" role="img" aria-label="Step ${n} of ${of}">${Array.from({ length: of }, (_, i) => `<span style="width:18px;height:4px;border-radius:2px;background:${i < n ? 'var(--gold)' : 'var(--line-2)'}"></span>`).join('')}</div>`,
  plate: (code = 'D', num = '12345') => `<span class="plate" aria-label="Dubai plate ${code} ${num}"><span class="em"><span class="ar">دبي</span><span>DUBAI</span></span><b>${code} ${num}</b></span>`,
  stars: (n, size = 13) => `<span class="rowx g4" style="color:var(--gold)" aria-label="${n} rating">${icon('star', size, 0).replace('fill="none"', 'fill="currentColor"')}<span class="small" style="color:var(--sand-2)">${n}</span></span>`,
  carPhoto: (label, time, shot = true) => `<figure style="margin:0;position:relative;height:100px;border-radius:16px;overflow:hidden;border:1px solid var(--line);background:${shot ? 'linear-gradient(160deg,#1C1F2B,#0E1016)' : 'var(--ink-1)'};display:flex;align-items:flex-end">
      ${shot ? `<svg viewBox="0 0 120 60" style="position:absolute;left:8%;top:18%;width:84%;opacity:.85" aria-hidden="true"><path d="M8 44L14 36Q22 32 36 31L52 24Q62 18 78 18Q94 18 102 26L112 30Q116 32 116 38V44Z" fill="#2A2E3C" stroke="#4A4F60"/><circle cx="34" cy="44" r="7" fill="#07080C" stroke="#5B6072"/><circle cx="96" cy="44" r="7" fill="#07080C" stroke="#5B6072"/><path d="M58 24L66 21H84L92 26Z" fill="#141722"/><path d="M0 52H120" stroke="#E0AA4E" stroke-opacity=".35"/></svg>` : `<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--sand-3)">${icon('camera', 22, 1.6)}</span>`}
      <figcaption class="mono" style="position:relative;width:100%;display:flex;justify-content:space-between;padding:7px 9px;font-size:9px;letter-spacing:.1em;color:var(--sand-2);background:linear-gradient(transparent,rgba(7,8,12,.85))"><span>${label}</span><span>${time || ''}</span></figcaption></figure>`,
};
