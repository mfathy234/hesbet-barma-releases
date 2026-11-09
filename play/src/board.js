/* The block board, pure. cols is COLS arrays of blocks, index 0 = the bottom of the column (newest row is inserted at index 0).
   A block is { id, v, p } where p is '' or a power-up ('hint', 'freeze', 'bomb'). Visual state (dy, shake, ...) is added by play.js. */

if (typeof module !== 'undefined' && module.exports && typeof COLS === 'undefined') Object.assign(global, require('./data.js'));
if (typeof module !== 'undefined' && module.exports && typeof RNG === 'undefined') Object.assign(global, require('./math.js'));

const newCols = () => Array.from({ length: COLS }, () => []);

/** All blocks touching (c, i) with the same value, plain blocks only. Returns [[c, i], ...]. */
function floodSame(cols, c, i) {
  const start = cols[c] && cols[c][i];
  if (!start || start.p) return [];
  const v = start.v, seen = new Set([c + ',' + i]), q = [[c, i]], out = [];
  while (q.length) {
    const [cc, ii] = q.pop();
    out.push([cc, ii]);
    for (const [dc, di] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nc = cc + dc, ni = ii + di;
      if (nc < 0 || nc >= COLS || ni < 0) continue;
      const nb = cols[nc][ni];
      if (!nb || nb.p || nb.v !== v || seen.has(nc + ',' + ni)) continue;
      seen.add(nc + ',' + ni);
      q.push([nc, ni]);
    }
  }
  return out;
}

const powerCount = cols => cols.reduce((n, col) => n + col.filter(b => b.p).length, 0);
const hasAnswer = (cols, eq) => Boolean(eq) && cols.some(col => col.some(b => !b.p && b.v === eq.ans));
const tallest = cols => cols.reduce((m, col) => Math.max(m, col.length), 0);

/** Cheapest valid pick of a power-up kind from the POWER weights. */
function pickPower(roll) {
  return roll < POWER.hint ? 'hint' : roll < POWER.hint + POWER.freeze ? 'freeze' : 'bomb';
}

/** One new row: a few answers that match likely equations, some spare numbers and sometimes a power-up. ctx = { eq, nextId, params, powerMult }. */
function makeRow(cols, ctx, withPower = true) {
  const pool = [];
  for (let k = 0; k < 4; k++) pool.push(ctx.randomAns());
  if (ctx.eq && RNG.f() < POWER.matchChance) pool[0] = ctx.eq.ans;
  const row = [];
  for (let c = 0; c < COLS; c++) {
    const spare = RNG.f() < POWER.spareChance;
    row.push({ id: ctx.nextId(), v: spare ? ri(1, Math.max(3, Math.round(ctx.params.A / 2))) : pool[ri(0, 3)], p: '' });
  }
  const chance = POWER.chance * (ctx.powerMult || 1);
  if (withPower && RNG.f() < chance && powerCount(cols) < POWER.max) {
    row[ri(0, COLS - 1)] = { id: ctx.nextId(), v: 0, p: pickPower(RNG.f()) };
  }
  return row;
}

/** A new equation whose answer is among the highest (most reachable) numbers on the board; avoids repeating prev. */
function nextEquation(cols, ctx, prev) {
  const nums = [];
  cols.forEach(col => col.forEach((b, i) => { if (!b.p) nums.push({ v: b.v, i }); }));
  if (!nums.length) return null;
  nums.sort((a, b) => b.i - a.i);
  const top = nums.slice(0, Math.min(nums.length, 14));
  let e = null;
  for (let k = 0; k < 6; k++) {
    e = eqFor(pick(top).v, ctx.eqCtx);
    if (!prev || eqText(e) !== eqText(prev)) break;
  }
  return e;
}

/** Seconds a row takes to rise. */
function riseSeconds(mode, level, twist) {
  const r = RISE[mode] || RISE.endless;
  const base = Math.max(r.min, r.base - r.step * (level - 1));
  return twist && twist.riseMult ? base * twist.riseMult : base;
}

/** Rows that fit the well: from the well's pixel height and width. */
function rowsFor(w, h) {
  const cell = Math.max(BOARD.minCell, Math.floor((w - BOARD.pad) / COLS));
  return clamp(Math.floor((h - 14) / cell), BOARD.minRows, BOARD.maxRows);
}

/** Score for clearing `chain` blocks at a combo count. */
function scoreFor(chain, combo) {
  return SCORE.base * chain * (1 + Math.floor(combo / SCORE.comboEvery));
}
function coinsFor(chain, combo) {
  return chain + (combo % COINS.comboEvery === 0 ? COINS.perCombo : 0);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { newCols, floodSame, powerCount, hasAnswer, tallest, pickPower, makeRow, nextEquation, riseSeconds, rowsFor, scoreFor, coinsFor };
}
