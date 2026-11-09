/* Sound: everything is synthesized with WebAudio at run time, so the game ships no audio files. Buses: sfx and music -> master (mute) -> limiter.
   Nothing starts before a tap (arm() listens for the first gesture and resumes a suspended context on later taps). */

/** Music tracks: step = one eighth note in seconds, bass and lead are semitone offsets from root per step (null = rest). */
const MUSIC = {
  menu: { root: 196, step: 0.3, bass: [0, null, 7, null, 5, null, 7, null, 0, null, 7, null, 3, null, 5, null],
    lead: [12, null, 16, 19, null, 16, null, null, 15, null, 19, 17, null, 15, null, null], leadWave: 'triangle' },
  play: { root: 220, step: 0.2, bass: [0, 0, 7, 0, 5, 5, 7, 5, 0, 0, 7, 0, 3, 3, 5, 7],
    lead: [12, 14, 16, null, 19, 16, 14, null, 12, 16, 19, 21, 19, null, 16, null], leadWave: 'square' }
};
const SFX = {
  pop: { notes: [[440, 0.12, 'triangle', 0.09, 0, 0], [880, 0.08, 'sine', 0.04, 0, 0.04]] },
  bad: { notes: [[170, 0.24, 'sawtooth', 0.06, 85, 0]] },
  power: { notes: [[660, 0.08, 'square', 0.05, 0, 0], [990, 0.12, 'square', 0.05, 0, 0.07]] },
  bomb: { notes: [[130, 0.4, 'sawtooth', 0.09, 30, 0]] },
  lvl: { notes: [523, 659, 784, 1047].map((f, i) => [f, 0.14, 'triangle', 0.07, 0, i * 0.09]) },
  over: { notes: [392, 330, 262, 196].map((f, i) => [f, 0.22, 'triangle', 0.08, 0, i * 0.16]) },
  win: { notes: [523, 659, 784, 1047, 1319].map((f, i) => [f, 0.16, 'triangle', 0.07, 0, i * 0.08]) },
  warn: { notes: [[310, 0.07, 'square', 0.035, 0, 0]] },
  click: { notes: [[520, 0.05, 'square', 0.04, 0, 0]] },
  tick: { notes: [[900, 0.04, 'square', 0.03, 0, 0]] },
  coin: { notes: [[988, 0.07, 'square', 0.05, 0, 0], [1319, 0.14, 'square', 0.05, 0, 0.06]] }
};
const POP_RATIOS = [1, 1.125, 1.25, 1.5, 1.667, 2];
const MUSIC_GAIN = 0.2;
const LOOKAHEAD = 0.35;

const Sound = {
  ctx: null, master: null, sfxBus: null, musicBus: null, armed: false,
  vol: { music: 0.7, sfx: 1 }, muted: false, track: '', want: '', step: 0, nextAt: 0, timer: 0,

  arm() {
    if (this.armed) return;
    this.armed = true;
    const go = () => { this.ensure(); if (this.want) this.music(this.want); };
    ['pointerup', 'touchend', 'click', 'keydown'].forEach(ev => window.addEventListener(ev, go, { passive: true }));
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) { this.stopTimer(); this.ctx.suspend().catch(() => null); } else { this.ctx.resume().catch(() => null); if (this.track) this.startTimer(); }
    });
  },

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try { this.ctx = new AC(); } catch (e) { return false; }
      const c = this.ctx, lim = c.createDynamicsCompressor();
      lim.threshold.value = -8; lim.ratio.value = 8;
      this.master = c.createGain(); this.sfxBus = c.createGain(); this.musicBus = c.createGain();
      this.sfxBus.connect(this.master); this.musicBus.connect(this.master); this.master.connect(lim); lim.connect(c.destination);
      this.apply();
    }
    if (this.ctx.state !== 'running') this.ctx.resume().catch(() => null);
    return true;
  },

  setPrefs(prefs, muted) {
    this.vol = { music: prefs.music / 100, sfx: prefs.sfx / 100 };
    this.muted = Boolean(muted);
    this.apply();
  },

  apply() {
    if (!this.ctx) return;
    this.master.gain.value = this.muted ? 0 : 1;
    this.musicBus.gain.value = this.vol.music * MUSIC_GAIN;
    this.sfxBus.gain.value = this.vol.sfx;
  },

  tone(f, d, type, v, f2, when, bus) {
    if (!this.ctx || this.muted) return;
    try {
      const c = this.ctx, t0 = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t0);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d);
      g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g); g.connect(bus || this.sfxBus); o.start(t0); o.stop(t0 + d + 0.03);
    } catch (e) { /* audio is optional */ }
  },

  /** pitch scales the pop sound up with the combo (0..5). */
  play(name, pitch = 0) {
    if (!this.ctx || this.muted || !this.vol.sfx) return;
    const def = SFX[name];
    if (!def) return;
    const r = name === 'pop' ? POP_RATIOS[Math.min(5, Math.max(0, pitch))] : 1;
    def.notes.forEach(([f, d, type, v, f2, when]) => this.tone(f * r, d, type, v, f2 ? f2 * r : 0, when));
  },

  noise(d, v, when) {
    if (!this.ctx) return;
    const c = this.ctx, n = Math.floor(c.sampleRate * d), buf = c.createBuffer(1, n, c.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = c.createBufferSource(), g = c.createGain(), hp = c.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 6000; g.gain.value = v;
    s.buffer = buf; s.connect(hp); hp.connect(g); g.connect(this.musicBus); s.start(c.currentTime + when);
  },

  music(name) {
    this.want = name;
    if (!this.ctx || name === this.track) return;
    this.track = name;
    this.stopTimer();
    if (!name || !MUSIC[name]) return;
    this.step = 0;
    this.nextAt = this.ctx.currentTime + 0.08;
    this.startTimer();
  },

  startTimer() { this.stopTimer(); this.timer = setInterval(() => this.pump(), 120); this.pump(); },
  stopTimer() { if (this.timer) { clearInterval(this.timer); this.timer = 0; } },

  pump() {
    const tr = MUSIC[this.track];
    if (!tr || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.nextAt < now - 0.5) this.nextAt = now + 0.05;
    while (this.nextAt < now + LOOKAHEAD) {
      const i = this.step % tr.bass.length, when = this.nextAt - now;
      const semi = s => tr.root * Math.pow(2, s / 12);
      if (tr.bass[i] !== null) this.tone(semi(tr.bass[i] - 12), tr.step * 1.8, 'triangle', 0.5, 0, when, this.musicBus);
      if (tr.lead[i] !== null) this.tone(semi(tr.lead[i]), tr.step * 1.5, tr.leadWave, tr.leadWave === 'square' ? 0.16 : 0.3, 0, when, this.musicBus);
      if (i % 2 === 1) this.noise(0.04, 0.18, when);
      this.step++;
      this.nextAt += tr.step;
    }
  }
};
