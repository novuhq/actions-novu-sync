/* Presenter shell: switches between the three apps, lists each journey, scales the phone to fit. */

const GUIDES = {
  customer: { eyebrow: 'Customer app', title: 'From roadside to resolved', lede: 'A full recovery, start to finish: a breakdown on Sheikh Zayed Road, the right truck, an upfront fare, then the tow to Dubai Marina, live on the map.', tip: 'Every choice carries through: change the car or drop-off and the advised truck, fare and route follow. Jump to any step below.' },
  operator: { eyebrow: 'Operator app', title: 'The driver’s side', lede: 'The same McLaren job, seen by Ahmed: take the offer before it expires, navigate on the E11, load by protocol and capture the owner’s signature.', tip: 'Go online to receive the offer. On the handover screen, sign with your finger or mouse to complete the job.' },
  dispatch: { eyebrow: 'Dispatch & fleet · web', title: 'The control room', lede: 'Every job and truck across Dubai on one screen. The Flatbed in JLT is waiting: assign the nearest operator and watch the truck head to it.' },
};

const Shell = {
  mode: 'customer',
  phones: {},
  init() {
    document.body.insertAdjacentHTML('afterbegin', SHARED_DEFS);
    document.querySelector('.backdrop .city').innerHTML = skyline({ seed: 2, sky: false, moonX: 1020, moonY: 70, par: 'xMidYMax meet', natural: true });
    this.header = document.querySelector('.top');
    this.device = document.getElementById('device');
    this.wrap = document.getElementById('deviceWrap');
    this.guide = document.getElementById('guide');

    const mk = (key, app, start) => {
      const host = document.createElement('div');
      host.hidden = true;
      this.device.appendChild(host);
      const ph = new Phone(host, app);
      app.onNav = (id) => { if (this.mode === key) this.markStep(id); };
      this.phones[key] = { ph, app, start, host };
    };
    mk('customer', Customer, 'splash');
    mk('operator', Operator, 'o_home');
    Dispatch.mount(document.getElementById('web'));

    document.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => this.setMode(b.dataset.mode)));
    document.getElementById('restart').addEventListener('click', () => this.restart());
    this.guide.addEventListener('click', (e) => {
      const b = e.target.closest('[data-jump]');
      if (b) this.phones[this.mode].ph.go(b.dataset.jump, { dir: 'fade', jump: true });
    });
    window.addEventListener('resize', () => this.fit());
    window.addEventListener('hashchange', () => this.fromHash());
    if (!this.fromHash()) this.setMode('customer');
  },
  fromHash() {
    const h = (location.hash || '').slice(1);
    if (['customer', 'operator', 'dispatch'].includes(h)) { this.setMode(h); return true; }
    return false;
  },
  setMode(mode) {
    this.mode = mode;
    document.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    const isWeb = mode === 'dispatch';
    document.getElementById('duo').hidden = isWeb;
    document.getElementById('webWrap').hidden = !isWeb;
    if (isWeb) { Dispatch.render(); return; }
    Dispatch.token++;
    for (const [k, p] of Object.entries(this.phones)) p.host.hidden = k !== mode;
    const p = this.phones[mode];
    this.renderGuide();
    if (!p.ph.cur) p.ph.go(p.start, { dir: 'none' });
    else this.markStep(p.ph.curId);
    this.fit();
  },
  restart() {
    if (this.mode === 'dispatch') { Dispatch.reset(); return; }
    const p = this.phones[this.mode];
    p.app.state = this.mode === 'customer' ? customerState() : operatorState();
    p.ph.go(p.start, { dir: 'fade' });
  },
  renderGuide() {
    const g = GUIDES[this.mode];
    const app = this.phones[this.mode].app;
    let n = 0;
    this.guide.innerHTML = `<span class="eyebrow">${g.eyebrow}</span><h1>${g.title}</h1><p class="lede">${g.lede}</p>
      <ol class="steps" aria-label="Journey">${app.steps.map((st) => st.grp ? `<li class="grp">${st.grp}</li>` : `<li><button type="button" data-jump="${st.id}"><span class="n">${String(++n).padStart(2, '0')}</span>${st.label}</button></li>`).join('')}</ol>
      <p class="tip">${icon('info', 16)}<span>${g.tip}</span></p>`;
  },
  markStep(id) {
    const alias = { splash: 'welcome' };
    const target = alias[id] || id;
    this.guide.querySelectorAll('[data-jump]').forEach((b) => { if (b.dataset.jump === target) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  },
  fit() {
    if (this.mode === 'dispatch') return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const hh = this.header.offsetHeight;
    const narrow = vw <= 520;
    this.device.classList.toggle('bare', narrow);
    const W = narrow ? 390 : 416, H = narrow ? 844 : 870;
    const stageW = document.querySelector('.stage').clientWidth - (narrow ? 0 : 32);
    const availH = narrow ? Infinity : Math.max(560, vh - hh - 56);
    const s = Math.min(1, availH / H, stageW / W);
    this.device.style.transform = s < 1 ? `scale(${s})` : '';
    this.wrap.style.width = `${W * s}px`;
    this.wrap.style.height = `${H * s}px`;
  },
};

document.addEventListener('DOMContentLoaded', () => Shell.init());
