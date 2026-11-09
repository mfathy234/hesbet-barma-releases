/* One run: building the board, answering, power-ups, levels, the rising rows, and recording the result. Pure rules are in math.js and board.js. */

const eqCtx = () => ({ grade: G.grade, level: G.level, twist: G.twist });
const timed = () => G.mode === 'sprint' || G.mode === 'daily';

function rowCtx() {
  const e = eqCtx();
  return { eq: G.eq, nextId: () => G.id++, params: eqParams(e), powerMult: G.twist && G.twist.powerMult, randomAns: () => randomEq(e).ans, eqCtx: e };
}

function insertRow(power = true) {
  const row = makeRow(G.cols, rowCtx(), power);
  for (let c = 0; c < COLS; c++) G.cols[c].unshift({ ...row[c], dy: 0, vy: 0, sq: 0, sh: 0, hurt: 0, ph: RNG.f() * 6 });
}

function newEquation() {
  const e = nextEquation(G.cols, { eqCtx: eqCtx() }, G.eq);
  G.eq = e; G.hintId = 0; G.typed = '';
  renderEq(Boolean(e));
}
function ensureEq() { if (!hasAnswer(G.cols, G.eq)) newEquation(); }

const stageName = () => {
  const { stage, M } = eqParams(eqCtx());
  return t(stage === 2 && !M ? 'stage2b' : stage === 3 && !M ? 'stage3b' : 'stage' + stage);
};

/** mode: endless, sprint, practice or daily. */
function newGame(mode) {
  const save = UI.save, now = Date.now();
  const daily = mode === 'daily' ? dailyFor(dateKey(now), save.grade) : null;
  if (daily) RNG.seed(daily.seed); else RNG.reset();
  ROWS = rowsFor(W, H);
  resize();
  G = {
    mode, grade: save.grade, twist: daily ? daily.twist : null, daily, skin: skinOf(save, now), hat: wornOf(save, 'hat', now), bag: wornOf(save, 'bag', now),
    cols: newCols(), rise: 0, level: 1, correct: 0, score: 0, coins: 0, combo: 0, maxCombo: 0, maxChain: 0, bombs: 0,
    pending: 0, freeze: 0, eq: null, hintId: 0, hintT: 0, time: mode === 'daily' ? DAILY.seconds : SPRINT_SECONDS, t: 0, over: false, overT: 0, shown: false, paused: false, ready: READY_SECONDS,
    parts: [], ghosts: [], texts: [], shake: 0, id: 1, typed: '', typedT: 0, kb: false, cur: { c: 0, i: 0 }, warned: false, danger: 0, dangerSay: 0,
    owlM: 'idle', owlT: 0, hogM: 'idle', hogT: 0, sayT: 0, tick: 0, flash: 0, recorded: false, result: null
  };
  for (let k = 0; k < START_ROWS; k++) insertRow(false);
  ensureEq();
  setSay(t('tip'), 'tip', 99);
  UI.state = 'play';
  closeAll();
  $('#menu').classList.remove('show');
  hud();
  drawChars(true);
  Sound.music('play');
}

function floatText(x, y, txt, col = K.gold, size = 26) { G.texts.push({ x, y, txt, col, size, t: 0 }); }

function puffs(x, y, n, col) {
  if (calm()) n = Math.ceil(n / 3);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.28, sp = 40 + Math.random() * 90;
    G.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 30, t: 0, life: 0.5 + Math.random() * 0.3, r: cell * (0.1 + Math.random() * 0.1), col: col || K.white, kind: Math.random() < 0.3 ? 'star' : 'puff' });
  }
}

function removeAt(c, i, chain) {
  const col = G.cols[c], b = col[i], p = blockXY(c, i, b);
  G.ghosts.push({ x: p.x, y: p.y, b, t: 0 });
  puffs(p.x + cell / 2, p.y + cell / 2, chain ? 6 : 8, null);
  col.splice(i, 1);
  for (let j = i; j < col.length; j++) { if (col[j].dy <= 0) col[j].vy = 0; col[j].dy += 1; }
}

function mood(who, m, sec) {
  if (who === 'owl') { G.owlM = m; G.owlT = sec; } else { G.hogM = m; G.hogT = sec; }
}

function tapBlock(c, i) {
  if (!G || G.over || G.paused || G.ready > 0) return;
  const b = G.cols[c][i];
  if (!b) return;
  if (b.p) { usePower(c, i); return; }
  if (b.v === G.eq.ans) correct(c, i); else wrong(c, i);
}

function correct(c, i) {
  const list = floodSame(G.cols, c, i), chain = list.length, origin = blockXY(c, i, G.cols[c][i]);
  G.combo++; G.maxCombo = Math.max(G.maxCombo, G.combo); G.maxChain = Math.max(G.maxChain, chain); G.correct++;
  const pts = scoreFor(chain, G.combo);
  list.sort((a, b) => b[1] - a[1]).forEach(([cc, ii]) => removeAt(cc, ii, chain > 1));
  G.score += pts;
  G.coins += coinsFor(chain, G.combo);
  floatText(origin.x + cell / 2, origin.y, '+' + nf(pts), K.gold, 28);
  if (G.combo >= 3) floatText(origin.x + cell / 2, origin.y - cell * 0.55, t('combo') + ' ×' + nf(G.combo), K.tomato, 22);
  if (chain > 1) floatText(origin.x + cell / 2, origin.y + cell * 0.55, '×' + nf(chain), K.sky, 22);
  sfx('pop', Math.min(5, G.combo - 1)); buzz(12);
  setSay(pick(PRAISE[LANG.cur]), '', 1.8);
  mood('owl', 'cheer', 0.9); mood('hog', 'cheer', 0.9);
  if (!calm()) G.shake = Math.max(G.shake, 0.12);
  if (G.correct % LEVEL_EVERY === 0) levelUp();
  G.eq = null; ensureEq(); hud();
}

function levelUp() {
  G.level++;
  sfx('lvl');
  setSay(t('lvlUp', nf(G.level), G.level % 2 === 1 ? stageName() : ''), '', 2.8);
  floatText(wx + cell * COLS / 2, wy + cell * 2.2, t('lvl') + ' ' + nf(G.level), K.gold, 40);
  mood('owl', 'cheer', 1.6); mood('hog', 'cheer', 1.6);
  for (let k = 0; k < 14; k++) puffs(wx + Math.random() * cell * COLS, wy + cell * 1.5 + Math.random() * cell * 2, 1, K.sun);
}

function wrong(c, i) {
  const b = c == null ? null : G.cols[c][i];
  if (b) { b.sh = 0.45; b.hurt = 0.6; }
  G.combo = 0;
  if (G.mode !== 'practice') G.pending = Math.min(RISE.penaltyRows, G.pending + 1);
  setSay(pick(OOPS[LANG.cur]), 'bad', 2);
  mood('owl', 'wince', 1.1); mood('hog', 'oops', 1.1);
  sfx('bad'); buzz([30, 30, 40]);
  if (!calm()) G.shake = Math.max(G.shake, 0.4);
  G.flash = 0.35;
  hud();
}

function usePower(c, i) {
  const b = G.cols[c][i], p = blockXY(c, i, b);
  if (b.p === 'hint') {
    removeAt(c, i); sfx('power');
    let best = null;
    G.cols.forEach(col => col.forEach((x, ii) => { if (!x.p && x.v === G.eq.ans && (!best || ii > best.i)) best = { id: x.id, i: ii }; }));
    if (best) { G.hintId = best.id; G.hintT = POWER.hintSeconds; }
    setSay(t('hintU'), '', 2.4);
  } else if (b.p === 'freeze') {
    removeAt(c, i); sfx('power'); G.freeze = POWER.freezeSeconds; setSay(t('freezeU'), '', 2.4);
    puffs(p.x + cell / 2, p.y + cell / 2, 10, '#bfe6fa');
  } else {
    sfx('bomb'); buzz(60); G.bombs++; setSay(t('bombU'), '', 2.4);
    for (let cc = 0; cc < COLS; cc++) {
      const bb = G.cols[cc][i];
      if (bb) { if (!bb.p) G.score += SCORE.bomb; removeAt(cc, i, true); }
    }
    if (!calm()) G.shake = 0.7;
    floatText(wx + cell * COLS / 2, p.y, 'BOOM', K.tomato, 36);
  }
  ensureEq(); hud();
}

function submitTyped() {
  if (!G || G.over || G.paused || G.ready > 0 || !G.eq || G.typed === '') return;
  const n = parseInt(G.typed, 10);
  G.typed = '';
  if (n === G.eq.ans) {
    let best = null;
    G.cols.forEach((col, c) => col.forEach((b, i) => { if (!b.p && b.v === n && (!best || i > best.i)) best = { c, i }; }));
    if (best) correct(best.c, best.i); else wrong(null);
  } else wrong(null);
  renderEq(false);
}

/** Fold the run into the save once (game over, time up, or leaving early). */
function finishRun() {
  if (!G || G.recorded) return;
  G.recorded = true;
  const now = Date.now();
  const run = { mode: G.mode, score: G.score, correct: G.correct, maxCombo: G.maxCombo, coins: G.coins, level: G.level, bombs: G.bombs, maxChain: G.maxChain };
  const r = recordRun(UI.save, run, now);
  let save = r.save, unlocked = r.unlocked, dailyRes = null;
  if (G.mode === 'daily') {
    dailyRes = recordDaily(save, G.score, G.daily.target, now);
    save = dailyRes.save;
    if (dailyRes.win) {
      const b = bumpStats(save, { dailyWins: 1, bestStreak: dailyRes.streak, coinsEarned: dailyRes.reward }, now);
      save = b.save; unlocked = unlocked.concat(b.unlocked);
    }
  }
  setSave(save);
  RNG.reset();
  G.result = { record: r.record, unlocked, daily: dailyRes };
}

function endGame(reason) {
  if (G.over) return;
  G.over = true; G.overT = 0; G.reason = reason;
  sfx(reason === 'time' ? 'win' : 'over'); buzz(120);
  if (!calm()) G.shake = 0.8;
  mood('owl', 'wince', 99); mood('hog', 'oops', 99);
  finishRun();
}

function updateBlocks(dt) {
  for (const col of G.cols) for (const b of col) {
    if (b.dy > 0) { b.vy += 42 * dt; b.dy -= b.vy * dt; if (b.dy <= 0) { b.dy = 0; b.vy = 0; b.sq = 1; } }
    if (b.sq > 0) b.sq = Math.max(0, b.sq - dt * 5);
    if (b.sh > 0) b.sh = Math.max(0, b.sh - dt);
    if (b.hurt > 0) b.hurt = Math.max(0, b.hurt - dt);
  }
  G.shake = Math.max(0, G.shake - dt * 1.6);
  if (G.flash) G.flash = Math.max(0, G.flash - dt);
  for (const p of G.parts) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; }
  G.parts = G.parts.filter(p => p.t < p.life);
  for (const g of G.ghosts) g.t += dt;
  G.ghosts = G.ghosts.filter(g => g.t < 0.2);
  for (const x of G.texts) { x.t += dt; x.y -= 34 * dt; }
  G.texts = G.texts.filter(x => x.t < 1.1);
}

function updateTimers(dt) {
  if (G.sayT > 0 && G.sayT < 90) { G.sayT -= dt; if (G.sayT <= 0) setSay(t('tip'), 'tip', 99); }
  if (G.owlT > 0 && G.owlT < 90) G.owlT -= dt;
  if (G.hogT > 0 && G.hogT < 90) G.hogT -= dt;
  if (G.hintT > 0) { G.hintT -= dt; if (G.hintT <= 0) G.hintId = 0; }
  if (G.typed) { G.typedT -= dt; if (G.typedT <= 0) submitTyped(); }
  if (G.freeze > 0) { const p = Math.ceil(G.freeze); G.freeze = Math.max(0, G.freeze - dt); if (Math.ceil(G.freeze) !== p) sfx('tick'); }
}

function updateRise(dt) {
  if (G.mode === 'practice') {
    if (G.rise < 0) G.rise = Math.min(0, G.rise + dt * 5);
    const n = G.cols.reduce((s, col) => s + col.length, 0);
    if (G.rise >= 0 && n < 14 && tallest(G.cols) < ROWS - 3) { insertRow(true); G.rise = -1; }
    return;
  }
  if (G.freeze > 0) return;
  const T = riseSeconds(G.mode, G.level, G.twist);
  G.rise += (G.pending > 0 ? RISE.penaltySpeed : 1 / T) * dt;
  const warn = G.pending > 0 || G.rise > 1 - 0.8 / T;
  if (warn && !G.warned) { G.warned = true; sfx('warn'); }
  if (G.rise >= 1) {
    insertRow(true); G.rise -= 1; G.warned = false;
    if (G.pending > 0) G.pending--;
    ensureEq();
  }
}

function update(dt) {
  if (!G || G.paused) return;
  G.t += dt;
  updateBlocks(dt);
  if (G.over) { G.overT += dt; if (G.overT > 1.25 && !G.shown) { G.shown = true; showOver(); } return; }
  if (G.ready > 0) { G.ready -= dt; return; }
  updateTimers(dt);
  if (timed()) { G.time -= dt; if (G.time <= 0) { G.time = 0; endGame('time'); hud(); return; } }
  updateRise(dt);
  const maxLen = tallest(G.cols);
  G.danger = clamp((maxLen + Math.max(0, G.rise) - (ROWS - RISE.dangerRows)) / 2.6, 0, 1);
  if (G.danger > 0.6 && G.dangerSay <= 0) { G.dangerSay = 7; setSay(t('danger'), 'bad', 2); sfx('warn'); }
  if (G.dangerSay > 0) G.dangerSay -= dt;
  if (G.mode !== 'practice' && maxLen + G.rise > ROWS + 1e-6) { endGame('stack'); hud(); return; }
  if (!G.eq) ensureEq();
  G.tick -= dt;
  if (G.tick <= 0) { G.tick = 0.25; hud(); drawChars(false); }
}
