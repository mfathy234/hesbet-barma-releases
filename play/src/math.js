/* Equation maths, pure. An equation is { a, b, op, r, unk, ans }: unk says which of a, b or r is the hidden number and ans is its value.
   ctx = { grade, level, twist } where twist is a DAILY.twists entry or null. RNG can be seeded so the daily challenge is the same for everyone. */

if (typeof module !== 'undefined' && module.exports && typeof GRADES === 'undefined') Object.assign(global, require('./data.js'));

const mulberry = seed => () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
  return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
};

const RNG = {
  f: Math.random,
  seed(n) { this.f = mulberry(n >>> 0); },
  reset() { this.f = Math.random; }
};

const ri = (a, b) => a + Math.floor(RNG.f() * (b - a + 1));
const pick = a => a[ri(0, a.length - 1)];
const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = ri(0, i); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Seed from a text key such as a date (FNV-1a). */
function hashSeed(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function eqParams(ctx) {
  const shift = ctx.twist && ctx.twist.gradeShift ? ctx.twist.gradeShift : 0;
  const g = GRADES[clamp(ctx.grade + shift, 0, GRADES.length - 1)], lv = ctx.level;
  const ramp = Math.min(1, LEVEL_RAMP.start + LEVEL_RAMP.step * lv);
  return {
    A: Math.max(6, Math.round(g.A * ramp)),
    M: g.M ? Math.max(3, Math.round(g.M * ramp)) : 0,
    stage: Math.min(MAX_STAGE, Math.floor((lv - 1) / 2))
  };
}

function stageOps(stage, M, twist) {
  if (twist && twist.ops) return twist.ops;
  const hi = M > 0;
  switch (stage) {
    case 0: return ['+'];
    case 1: return ['−'];
    case 2: return hi ? ['×'] : ['+'];
    case 3: return hi ? ['÷'] : ['−'];
    default: return hi ? ['+', '−', '×', '÷'] : ['+', '−'];
  }
}

const pairs = (r, m) => {
  const o = [];
  for (let a = 2; a <= m; a++) if (r % a === 0 && r / a >= 2 && r / a <= m) o.push([a, r / a]);
  if (r >= 2 && r <= m) o.push([1, r]);
  return o;
};
const divisors = (a, m) => { const o = []; for (let d = 2; d <= m; d++) if (a % d === 0 && a / d >= 1) o.push(d); return o; };

/** Build an equation whose hidden number (unk: 'a', 'b' or 'r') equals v, or null when that is impossible for the operator. */
function buildEq(op, unk, v, A, M) {
  const m = M || 9;
  let a, b, r;
  if (unk === 'r') {
    r = v;
    if (op === '+') { if (r < 1) return null; if (r === 1) { a = 0; b = 1; } else { a = ri(1, r - 1); b = r - a; } }
    else if (op === '−') { b = ri(1, Math.max(1, A - r)); a = r + b; }
    else if (op === '×') { const ps = pairs(r, m); if (!ps.length) return null; [a, b] = pick(ps); }
    else { if (r < 1) return null; b = ri(2, m); a = r * b; }
  } else if (unk === 'b') {
    b = v;
    if (op === '+') { a = ri(1, Math.max(1, A - b)); r = a + b; }
    else if (op === '−') { r = ri(1, Math.max(1, A - b)); a = b + r; }
    else if (op === '×') { a = ri(2, m); r = a * b; }
    else { if (b < 2) return null; r = ri(2, m); a = b * r; }
  } else {
    a = v;
    if (op === '+') { b = ri(1, Math.max(1, A - a)); r = a + b; }
    else if (op === '−') { if (a < 2) return null; b = ri(1, a - 1); r = a - b; }
    else if (op === '×') { b = ri(2, m); r = a * b; }
    else { const ds = divisors(a, m); if (!ds.length) return null; b = pick(ds); r = a / b; }
  }
  return { a, b, op, r, unk, ans: v };
}

function sampleValue(op, unk, A, M) {
  const m = M || 9;
  if (unk === 'r') return op === '+' ? ri(2, A) : op === '−' ? ri(1, Math.max(1, A - 2)) : op === '×' ? ri(2, m) * ri(2, m) : ri(2, m);
  if (unk === 'b') return op === '+' || op === '−' ? ri(1, Math.max(1, A - 1)) : ri(2, m);
  return op === '+' ? ri(1, Math.max(1, A - 1)) : op === '−' ? ri(2, Math.max(2, A)) : op === '×' ? ri(2, m) : ri(2, m) * ri(2, m);
}

function randomEq(ctx) {
  const { A, M, stage } = eqParams(ctx), ops = stageOps(stage, M, ctx.twist);
  for (let k = 0; k < 8; k++) {
    const op = pick(ops), unk = stage >= 5 ? pick(['a', 'b', 'r', 'r']) : 'r';
    const e = buildEq(op, unk, sampleValue(op, unk, A, M), A, M);
    if (e) return e;
  }
  const v = ri(2, A);
  return buildEq('+', 'r', v, A, M) || { a: v, b: 0, op: '+', r: v, unk: 'r', ans: v };
}

/** An equation whose answer is exactly v (so a block already on the board can be the answer). */
function eqFor(v, ctx) {
  const { A, M, stage } = eqParams(ctx), ops = shuffle(stageOps(stage, M, ctx.twist));
  const unks = stage >= 5 ? shuffle(['a', 'b', 'r', 'r']) : ['r'];
  for (const u of unks) for (const op of ops) { const e = buildEq(op, u, v, A, M); if (e) return e; }
  return { a: v, b: 0, op: '+', r: v, unk: 'r', ans: v };
}

const eqText = e => `${e.a}${e.op}${e.b}=${e.r}${e.unk}`;

/** The equation really holds when the hidden number is put back. */
function eqHolds(e) {
  const a = e.unk === 'a' ? e.ans : e.a, b = e.unk === 'b' ? e.ans : e.b, r = e.unk === 'r' ? e.ans : e.r;
  const v = e.op === '+' ? a + b : e.op === '−' ? a - b : e.op === '×' ? a * b : a / b;
  return v === r;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RNG, mulberry, ri, pick, shuffle, clamp, hashSeed, eqParams, stageOps, buildEq, randomEq, eqFor, eqText, eqHolds };
}
