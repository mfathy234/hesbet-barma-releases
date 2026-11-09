/* Save model: pure and immutable. Every function returns a new save; storage adapters are at the bottom.
   Shop rules are in shop.js, the daily challenge in daily.js, achievements in meta.js, settings in prefs.js. */

if (typeof module !== 'undefined' && module.exports && typeof SAVE_KEY === 'undefined') Object.assign(global, require('./data.js'));
if (typeof module !== 'undefined' && module.exports && typeof sanitizeMeta === 'undefined') Object.assign(global, require('./meta.js'));
if (typeof module !== 'undefined' && module.exports && typeof sanitizePrefs === 'undefined') Object.assign(global, require('./prefs.js'));

const SAVE_VERSION = 1;
const HOUR_MS = 3600 * 1000;
const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
const BEST_MODES = ['endless', 'sprint'];

const toInt = (v, min, max) => (Number.isFinite(Number(v)) ? Math.max(min, Math.min(max, Math.floor(Number(v)))) : min);
const asObject = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const dateKeyOr = v => (typeof v === 'string' && DATE_KEY.test(v) ? v : '');

const newDaily = () => ({ date: '', best: 0, done: false, streak: 0, lastWin: '', bests: {} });

function newSave(now = 0) {
  return {
    v: SAVE_VERSION, createdAt: now, updatedAt: now, lang: 'ar', grade: DEFAULT_GRADE, muted: false, coins: 0, runs: 0,
    best: { endless: 0, sprint: 0 }, prefs: newPrefs(),
    owned: { hat: [DEFAULTS.hat], bag: [DEFAULTS.bag], skin: [DEFAULTS.skin] }, worn: { ...DEFAULTS },
    daily: newDaily(), meta: newMeta(), passUntil: 0, hintSeen: false
  };
}

function sanitizeOwned(raw) {
  const r = asObject(raw), out = {};
  SHOP_KINDS.forEach(kind => {
    const ids = SHOP_ITEMS[kind].map(i => i.id);
    const list = Array.isArray(r[kind]) ? r[kind].filter(id => ids.includes(id)) : [];
    out[kind] = [...new Set([DEFAULTS[kind], ...list])];
  });
  return out;
}

function sanitizeWorn(raw) {
  const r = asObject(raw), out = {};
  SHOP_KINDS.forEach(kind => { out[kind] = SHOP_ITEMS[kind].some(i => i.id === r[kind]) ? r[kind] : DEFAULTS[kind]; });
  return out;
}

function sanitizeDaily(raw) {
  const d = asObject(raw), bests = {};
  Object.keys(asObject(d.bests)).filter(k => DATE_KEY.test(k)).sort().slice(-DAILY.keepBests).forEach(k => { bests[k] = toInt(d.bests[k], 0, 1e7); });
  return { date: dateKeyOr(d.date), best: toInt(d.best, 0, 1e7), done: d.done === true, streak: toInt(d.streak, 0, 1e5), lastWin: dateKeyOr(d.lastWin), bests };
}

/** Anything read from storage goes through here: unknown fields are dropped, numbers clamped, ids checked against the data tables. */
function sanitizeSave(raw, now = 0) {
  const r = asObject(raw), d = newSave(now), b = asObject(r.best);
  return {
    v: SAVE_VERSION,
    createdAt: toInt(r.createdAt, 0, 1e15) || d.createdAt, updatedAt: toInt(r.updatedAt, 0, 1e15) || d.updatedAt,
    lang: r.lang === 'en' ? 'en' : 'ar', grade: Number.isFinite(Number(r.grade)) ? toInt(r.grade, 0, GRADES.length - 1) : DEFAULT_GRADE,
    muted: r.muted === true, coins: toInt(r.coins, 0, 1e9), runs: toInt(r.runs, 0, 1e9),
    best: { endless: toInt(b.endless, 0, 1e8), sprint: toInt(b.sprint, 0, 1e8) },
    prefs: sanitizePrefs(r.prefs), owned: sanitizeOwned(r.owned), worn: sanitizeWorn(r.worn),
    daily: sanitizeDaily(r.daily), meta: sanitizeMeta(r.meta), passUntil: toInt(r.passUntil, 0, 1e15), hintSeen: r.hintSeen === true
  };
}

/** Change language, grade, mute or hint flag. Bad values leave the save alone. */
function setSetting(save, key, value) {
  if (key === 'lang' && (value === 'ar' || value === 'en')) return save.lang === value ? save : { ...save, lang: value };
  if (key === 'grade' && Number.isInteger(value) && value >= 0 && value < GRADES.length) return save.grade === value ? save : { ...save, grade: value };
  if (key === 'muted' && typeof value === 'boolean') return save.muted === value ? save : { ...save, muted: value };
  if (key === 'hintSeen' && value === true) return save.hintSeen ? save : { ...save, hintSeen: true };
  return save;
}

/**
 * Fold a finished (or abandoned) run into the save: coins, best score, stats and achievements.
 * run = { mode, score, correct, maxCombo, coins, level, bombs, maxChain }. Returns { save, record, unlocked }.
 */
function recordRun(save, run, now = 0) {
  const scored = run.mode !== 'practice';
  const record = BEST_MODES.includes(run.mode) && run.score > (save.best[run.mode] || 0);
  const best = record ? { ...save.best, [run.mode]: run.score } : save.best;
  const patch = {
    correct: run.correct, runs: 1, maxCombo: run.maxCombo, maxLevel: run.level, maxScore: scored ? run.score : 0,
    bombs: run.bombs || 0, maxChain: run.maxChain || 0, coinsEarned: run.coins
  };
  const folded = unlockReached(foldStats(save.meta, patch));
  const coins = save.coins + run.coins + folded.coins;
  const meta = foldStats(folded.meta, { coinsEarned: folded.coins });
  return { save: { ...save, coins, best, runs: save.runs + 1, meta, updatedAt: now }, record, unlocked: folded.unlocked };
}

/** Add a stat patch (a purchase, a daily win) and pay any achievement it reaches. Returns { save, unlocked }. */
function bumpStats(save, patch, now = 0) {
  const folded = unlockReached(foldStats(save.meta, patch));
  const meta = foldStats(folded.meta, { coinsEarned: folded.coins });
  return { save: { ...save, coins: save.coins + folded.coins, meta, updatedAt: now }, unlocked: folded.unlocked };
}

/** Erase the player's progress. Language, grade, sound and settings are kept. */
function resetProgress(save, now = 0) {
  return { ...newSave(save.createdAt || now), lang: save.lang, grade: save.grade, muted: save.muted, prefs: save.prefs, hintSeen: save.hintSeen, updatedAt: now };
}

/* Quick pass: 48 h of free access to every cosmetic. Nothing is granted for good (see shop.js). */
const passClock = { now: () => Date.now() };
const passActive = (save, now = passClock.now()) => Boolean(save) && save.passUntil > now;
const passRemaining = (save, now = passClock.now()) => (passActive(save, now) ? save.passUntil - now : 0);

function passSplit(ms) {
  const hours = Math.ceil(Math.max(0, ms) / HOUR_MS);
  return { days: Math.floor(hours / 24), hours: hours % 24 };
}

const startPass = (save, now = passClock.now()) => (passActive(save, now) ? save : { ...save, passUntil: now + PASS.hours * HOUR_MS, updatedAt: now });

/** After the pass ends, anything worn that was only free through the pass goes back to the default. */
function settlePass(save, now = passClock.now()) {
  if (passActive(save, now)) return save;
  const worn = { ...save.worn };
  let changed = false;
  SHOP_KINDS.forEach(kind => { if (!save.owned[kind].includes(worn[kind])) { worn[kind] = DEFAULTS[kind]; changed = true; } });
  return changed ? { ...save, worn } : save;
}

function loadSave(storage, now = Date.now()) {
  try {
    const text = storage.getItem(SAVE_KEY);
    return text ? sanitizeSave(JSON.parse(text), now) : newSave(now);
  } catch (e) { return newSave(now); }
}

function persistSave(storage, save) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(save)); return true; } catch (e) { return false; }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    newSave, sanitizeSave, setSetting, recordRun, bumpStats, resetProgress, loadSave, persistSave, passClock, passActive, passRemaining, passSplit, startPass, settlePass
  };
}
