/* Achievements and lifetime stats, pure. save.meta = { ach: [ids], stats: { ... } }. A run folds into the stats; every goal reached pays its coins once. */

if (typeof module !== 'undefined' && module.exports && typeof ACHIEVEMENTS === 'undefined') Object.assign(global, require('./data.js'));

const STAT_KEYS = ['correct', 'runs', 'maxCombo', 'maxLevel', 'maxScore', 'bombs', 'maxChain', 'dailyWins', 'bestStreak', 'bought', 'coinsEarned'];
const SUM_STATS = ['correct', 'runs', 'bombs', 'dailyWins', 'bought', 'coinsEarned'];

const asObj = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const newMeta = () => ({ ach: [], stats: Object.fromEntries(STAT_KEYS.map(k => [k, 0])) });

function sanitizeMeta(raw) {
  const r = asObj(raw), st = asObj(r.stats), out = newMeta();
  STAT_KEYS.forEach(k => { const n = Number(st[k]); out.stats[k] = Number.isFinite(n) ? Math.max(0, Math.min(1e9, Math.floor(n))) : 0; });
  const known = ACHIEVEMENTS.map(a => a.id);
  out.ach = Array.isArray(r.ach) ? [...new Set(r.ach.filter(id => known.includes(id)))] : [];
  return out;
}

/** Fold a finished run (or a purchase, daily win ...) into the stats. patch values add up for SUM_STATS and take the max for the rest. */
function foldStats(meta, patch) {
  const stats = { ...meta.stats };
  Object.keys(patch).filter(k => STAT_KEYS.includes(k)).forEach(k => {
    const v = Math.max(0, Math.floor(Number(patch[k]) || 0));
    stats[k] = SUM_STATS.includes(k) ? stats[k] + v : Math.max(stats[k], v);
  });
  return { ...meta, stats };
}

/** Achievements whose goal is reached and that are not yet unlocked. */
const reached = meta => ACHIEVEMENTS.filter(a => !meta.ach.includes(a.id) && meta.stats[a.stat] >= a.n);

/** Unlock everything reached; returns the new meta, the unlocked list and the coins they pay. */
function unlockReached(meta) {
  const list = reached(meta);
  if (!list.length) return { meta, unlocked: [], coins: 0 };
  return { meta: { ...meta, ach: [...meta.ach, ...list.map(a => a.id)] }, unlocked: list, coins: list.reduce((s, a) => s + a.coins, 0) };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STAT_KEYS, newMeta, sanitizeMeta, foldStats, reached, unlockReached };
}
