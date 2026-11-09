/* DOM side of a run: HUD chips, the chalkboard equation and message, and the owl and hedgehog on the board. */

const cache = {};
function setTxt(id, v) {
  if (cache[id] !== v) { cache[id] = v; $(id).textContent = v; }
}

function setSay(txt, kind, sec = 2.4) {
  if (G) G.sayT = sec;
  const e = $('#say');
  e.textContent = txt;
  e.className = kind || '';
}

function bestFor(mode) {
  const s = UI.save;
  if (mode === 'daily') return dailyToday(s) ? s.daily.best : 0;
  return s.best[mode] || 0;
}

function hud() {
  const g = G, s = UI.save;
  setTxt('#vScore', nf(g ? g.score : 0));
  setTxt('#vCoins', nf(s.coins + (g ? g.coins : 0)));
  const mode = g ? g.mode : 'endless';
  setTxt('#vBest', nf(Math.max(bestFor(mode), g && g.mode !== 'practice' ? g.score : 0)));
  if (!g) return;
  setTxt('#lvl', t('lvl') + ' ' + nf(g.level) + ' · ' + stageName());
  const pc = $('#pCombo');
  setTxt('#pCombo', t('combo') + ' ×' + nf(g.combo));
  pc.classList.toggle('dim', g.combo < 2);
  pc.classList.toggle('gold', g.combo >= 3);
  const pt = $('#pTime');
  let show = false, txt = '', ice = false;
  if (g.freeze > 0) { show = true; ice = true; txt = t('freezeChip', nf(Math.ceil(g.freeze))); }
  else if (timed()) { show = true; const sec = Math.ceil(g.time); txt = nf(Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0')); }
  pt.classList.toggle('hide', !show);
  pt.classList.toggle('ice', ice);
  setTxt('#pTime', txt);
  $('#chalk').classList.toggle('danger', g.danger > 0.55 && !g.over);
}

function renderEq(anim) {
  const e = G && G.eq, box = $('#eq');
  if (!e) { box.innerHTML = ''; return; }
  const q = G.typed ? nf(G.typed) : t('q'), U = '<span class="q">' + q + '</span>';
  const f = x => nf(x);
  const parts = [e.unk === 'a' ? U : f(e.a), ' ' + e.op + ' ', e.unk === 'b' ? U : f(e.b), ' = ', e.unk === 'r' ? U : f(e.r)];
  const len = [f(e.a), f(e.b), f(e.r)].join('').length + 5;
  box.style.fontSize = (len <= 8 ? 46 : len <= 10 ? 40 : len <= 12 ? 34 : 29) + 'px';
  box.innerHTML = parts.join('‎');
  box.setAttribute('aria-label', parts.join(' ').replace(/<[^>]+>/g, ''));
  if (anim && !calm()) { box.classList.remove('in'); void box.offsetWidth; box.classList.add('in'); }
}

let shownOwl = '', shownHog = '';
function wornNow() {
  const now = Date.now();
  return { hat: G ? G.hat : wornOf(UI.save, 'hat', now), bag: G ? G.bag : wornOf(UI.save, 'bag', now) };
}

function drawChars(force) {
  const w = wornNow();
  const om = G && G.owlT > 0 ? G.owlM : (G && G.danger > 0.65 ? 'wince' : 'idle');
  const hm = G && G.hogT > 0 ? G.hogM : (G && G.danger > 0.65 ? 'oops' : 'idle');
  const ok = om + w.hat, hk = hm + w.bag;
  if (force || ok !== shownOwl) { shownOwl = ok; $('#owl').innerHTML = owlSVG(om, w.hat); }
  if (force || hk !== shownHog) { shownHog = hk; $('#hog').innerHTML = hogSVG(hm, w.bag); }
}

/** The pair on the menu cards: cheering, wearing what the player picked. */
function renderCast() {
  const w = wornNow();
  $('#castOwl').innerHTML = owlSVG('cheer', w.hat);
  $('#castHog').innerHTML = hogSVG('cheer', w.bag);
}
