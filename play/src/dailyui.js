/* The daily challenge screen (تحدي النهارده) and the trophies screen (الإنجازات). Rules are in daily.js and meta.js. */

function renderDaily() {
  const s = UI.save, now = Date.now(), d = dailyFor(dateKey(now), s.grade), done = dailyDone(s, now);
  const body = $('#dailyBody');
  body.innerHTML = '';
  const card = el('div', 'dcard');
  const date = el('div', 'ddate', dateKey(now).split('-').reverse().map(nf).join(' / '));
  const twist = el('div', 'dtwist');
  twist.append(el('small', '', t('daily_twist')), el('b', '', nameOf(d.twist)));
  const rows = el('div', 'dstats');
  [[t('daily_target', nf(d.target)), 'star'], [t('daily_secs', nf(d.seconds)), 'clock'], [t('daily_reward', nf(dailyReward(liveStreak(s, now) + 1))), 'coin']].forEach(([txt, ic]) => {
    const r = el('div', 'drow');
    r.innerHTML = `<i>${icon(ic)}</i>`;
    r.append(el('span', '', txt));
    rows.append(r);
  });
  const best = el('div', 'dbest');
  best.append(el('small', '', t('daily_best')), el('b', '', nf(dailyToday(s, now) ? s.daily.best : 0)));
  const streak = el('div', 'dstreak');
  streak.innerHTML = `<i>${icon('flame')}</i>`;
  streak.append(el('b', '', nf(liveStreak(s, now))), el('small', '', t('daily_streak')));
  const row = el('div', 'dtop');
  row.append(best, streak);
  const go = el('button', 'btn gold', done ? t('daily_again') : t('daily_go'));
  go.id = 'dailyGo'; go.type = 'button';
  go.onclick = () => { hideScreens(); UI.under = null; UI.state = 'menu'; newGame('daily'); };
  card.append(date, twist, rows, row);
  if (done) card.append(el('div', 'dnote win', t('daily_done')));
  card.append(go);
  body.append(card);
}

function openDaily() {
  openScreen('daily');
  renderDaily();
}

function achProgress(a) {
  const v = Math.min(UI.save.meta.stats[a.stat] || 0, a.n);
  return [v, a.n];
}

function renderAch() {
  const meta = UI.save.meta, body = $('#achBody');
  body.innerHTML = '';
  $('#achCount').textContent = t('ach_count', nf(meta.ach.length), nf(ACHIEVEMENTS.length));
  ACHIEVEMENTS.forEach(a => {
    const got = meta.ach.includes(a.id), [v, n] = achProgress(a);
    const row = el('div', 'ach' + (got ? ' got' : ''));
    row.dataset.ach = a.id;
    const ic = el('i', 'ach-ic');
    ic.innerHTML = icon(got ? 'trophy' : 'lock');
    const txt = el('div', 'ach-txt');
    txt.append(el('b', '', nameOf(a)), el('small', '', nameOf(a, true)));
    const bar = el('div', 'bar');
    const fill = el('span');
    fill.style.width = Math.round(v / n * 100) + '%';
    bar.append(fill);
    if (!got) txt.append(bar);
    const side = el('div', 'ach-side');
    side.append(el('em', '', t('ach_pays', nf(a.coins))));
    if (!got) side.append(el('small', '', nf(v) + '/' + nf(n)));
    row.append(ic, txt, side);
    body.append(row);
  });
}

function openAch() {
  openScreen('ach');
  renderAch();
}
