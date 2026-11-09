/* Daily challenge, pure. One seeded 75 s run per local date with one twist and a target score; reaching it pays coins plus a streak bonus. */

if (typeof module !== 'undefined' && module.exports && typeof DAILY === 'undefined') Object.assign(global, require('./data.js'));
if (typeof module !== 'undefined' && module.exports && typeof hashSeed === 'undefined') Object.assign(global, require('./math.js'));

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const pad2 = n => String(n).padStart(2, '0');

/** Local calendar date as YYYY-MM-DD. */
const dateKey = (now = Date.now()) => { const d = new Date(now); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };

/** Whole days since 1970 for a date key, so streaks survive month ends and daylight saving. */
const dayNumber = key => { const [y, m, d] = key.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); };

/** The challenge for a date and grade: seed, twist, target and length. Twists that need times tables are skipped for the early grades. */
function dailyFor(key, grade) {
  const seed = hashSeed('hesba-daily-' + key);
  const g = GRADES[Math.max(0, Math.min(GRADES.length - 1, grade))];
  const usable = DAILY.twists.filter(t => !t.needM || g.M > 0);
  return {
    key, seed, grade, twist: usable[seed % usable.length],
    target: DAILY.targetByGrade[Math.max(0, Math.min(DAILY.targetByGrade.length - 1, grade))], seconds: DAILY.seconds
  };
}

const dailyToday = (save, now = Date.now()) => save.daily.date === dateKey(now) ? save.daily : null;
const dailyDone = (save, now = Date.now()) => Boolean(dailyToday(save, now) && save.daily.done);

/** Coins for a win: base plus a bonus per streak day (capped). */
const dailyReward = streak => DAILY.reward + DAILY.streakBonus * Math.min(Math.max(streak, 1) - 1, DAILY.streakCap - 1);

/**
 * Record a finished daily run. Returns { save, win, reward, streak }. The reward is paid once per date, the first time the target is met;
 * a better score on the same day only raises the day's best.
 */
function recordDaily(save, score, target, now = Date.now()) {
  const key = dateKey(now), d = save.daily;
  const same = d.date === key;
  const best = Math.max(same ? d.best : 0, score);
  const win = score >= target;
  if (win && !(same && d.done)) {
    const streak = d.lastWin && dayNumber(key) - dayNumber(d.lastWin) === 1 ? d.streak + 1 : 1;
    const reward = dailyReward(streak);
    const bests = { ...d.bests, [key]: best };
    return { save: { ...save, coins: save.coins + reward, updatedAt: now, daily: { date: key, best, done: true, streak, lastWin: key, bests } }, win: true, reward, streak };
  }
  const bests = same ? { ...d.bests, [key]: best } : d.bests;
  return { save: { ...save, updatedAt: now, daily: { ...d, date: key, best, done: same ? d.done : false, bests } }, win: false, reward: 0, streak: d.streak };
}

/** The streak still counts if the last win was today or yesterday. */
function liveStreak(save, now = Date.now()) {
  const d = save.daily;
  if (!d.lastWin) return 0;
  const gap = dayNumber(dateKey(now)) - dayNumber(d.lastWin);
  return gap <= 1 ? d.streak : 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DATE_RE, dateKey, dayNumber, dailyFor, dailyToday, dailyDone, dailyReward, recordDaily, liveStreak };
}
