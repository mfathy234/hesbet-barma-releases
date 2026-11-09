/* Screens and flow: menu, pause, the confirm dialog, game over, language and mute, the quick pass, and the back-out rule shared by Esc and the Android back button. */

const SCREENS = ['settings', 'shop', 'daily', 'ach'];

function closeAll() { ['pauseOv', 'confirmOv', 'overOv'].forEach(i => $('#' + i).classList.remove('show')); }
function hideScreens() { SCREENS.forEach(s => $('#' + s + 'Ov').classList.remove('show')); }

/** Open a full screen (settings, shop, daily, ach) on top of whatever is under it. */
function openScreen(name) {
  UI.under = UI.under || UI.state;
  UI.state = name;
  hideScreens();
  $('#' + name + 'Ov').classList.add('show');
  const body = $('#' + name + 'Body');
  if (body) body.scrollTop = 0;
  sfx('click');
}

function closeScreen() {
  hideScreens();
  UI.state = UI.under || 'menu';
  UI.under = null;
  if (UI.state === 'menu') renderMenu();
  if (UI.state === 'pause') $('#bResume').focus({ preventScroll: true });
}

/** The one confirm dialog: the exact thing is named in the title and on the yes button. */
function askConfirm(title, body, yes, onYes, no) {
  $('#confirmTitle').textContent = title;
  $('#confirmBody').textContent = body;
  $('#confirmYes').textContent = yes;
  $('#confirmNo').textContent = no || t('cancel');
  UI.confirmYes = onYes;
  $('#confirmOv').classList.add('show');
  $('#confirmNo').focus({ preventScroll: true });
}
function closeConfirm() { $('#confirmOv').classList.remove('show'); UI.confirmYes = null; }

function pause(on) {
  if (!G || G.over || UI.state === 'menu') return;
  G.paused = on;
  UI.state = on ? 'pause' : 'play';
  $('#pauseOv').classList.toggle('show', on);
  if (on) $('#bResume').focus({ preventScroll: true });
}

function goMenu() {
  if (G && !G.over && (G.correct > 0 || G.coins > 0)) finishRun();
  closeAll();
  hideScreens();
  G = null;
  UI.state = 'menu';
  UI.under = null;
  $('#menu').classList.add('show');
  UI.save = settlePass(UI.save);
  renderMenu();
  hud();
  drawChars(true);
  $('#pTime').classList.add('hide');
  $('#chalk').classList.remove('danger');
  $('#eq').innerHTML = '';
  setSay(t('tip'), 'tip', 99);
  ctx.clearRect(0, 0, W, H);
  Sound.music('menu');
  if (typeof HesbaUpdate !== 'undefined') HesbaUpdate.onMenu();
}

/** Escape / Android back. Returns 'ok' when it closed something, 'exit' on the bare menu. */
function backOut() {
  if ($('#confirmOv').classList.contains('show')) { closeConfirm(); return 'ok'; }
  switch (UI.state) {
    case 'play': pause(true); return 'ok';
    case 'pause': pause(false); return 'ok';
    case 'over': goMenu(); return 'ok';
    case 'settings': case 'shop': case 'daily': case 'ach': closeScreen(); return 'ok';
    default: return 'exit';
  }
}

function showOver() {
  const g = G, time = g.reason === 'time', res = g.result || { record: false, unlocked: [], daily: null };
  UI.state = 'over';
  $('#oT').textContent = t(time ? 'time_t' : 'over_t');
  $('#oM').textContent = t(time ? 'time_m' : 'over_m');
  $('#oRec').classList.toggle('on', res.record);
  $('#oScore').textContent = nf(g.score);
  $('#oOk').textContent = nf(g.correct);
  $('#oCombo').textContent = '×' + nf(g.maxCombo);
  $('#oCoins').textContent = nf(g.coins);
  $('#oBest').textContent = nf(bestFor(g.mode));
  const note = $('#oDaily');
  if (res.daily) {
    note.textContent = res.daily.win ? t('daily_won', nf(res.daily.reward)) : t('daily_miss', nf(g.daily.target));
    note.className = 'dnote ' + (res.daily.win ? 'win' : '');
  } else { note.textContent = ''; note.className = 'dnote hide'; }
  const ach = $('#oAch');
  ach.innerHTML = '';
  res.unlocked.forEach(a => {
    const row = el('div', 'achnote');
    row.append(el('span', '', '★'), el('b', '', nameOf(a)), el('em', '', t('ach_pays', nf(a.coins))));
    ach.append(row);
  });
  $('#overOwl').innerHTML = owlSVG(time || res.record ? 'cheer' : 'wince', g.hat);
  $('#overOv').classList.add('show');
  $('#bAgain').focus({ preventScroll: true });
  hud();
}

/* ---- menu ---- */

const MODE_ICON = { endless: 'stack', sprint: 'clock', practice: 'pencil' };

function renderMenu() {
  const s = UI.save, now = Date.now();
  $('#grades').innerHTML = GRADE_LABELS[LANG.cur].map((g, i) => `<button class="gchip" role="radio" aria-checked="${i === s.grade}" data-g="${i}">${i === 0 || LANG.cur === 'ar' ? g : 'G' + g}</button>`).join('');
  $('#modes').innerHTML = ['endless', 'sprint', 'practice'].map(m =>
    `<button class="mode" data-m="${m}"><span class="mi">${icon(MODE_ICON[m])}</span><div class="mt"><b>${t('m_' + m)}</b><span>${t('d_' + m)}</span></div>${m === 'practice' ? '' : '<em title="' + t('best') + '">' + nf(s.best[m] || 0) + '</em>'}</button>`).join('');
  $('#mCoins').textContent = nf(s.coins);
  $('#dotDaily').classList.toggle('hide', dailyDone(s, now));
  renderPass();
  renderCast();
}

function passLeftText() {
  const sp = passSplit(passRemaining(UI.save));
  const parts = [];
  if (sp.days) parts.push(t('passDays', nf(sp.days)));
  if (sp.hours || !sp.days) parts.push(t('passHours', nf(sp.hours)));
  return t('passLeft', parts.join(LANG.cur === 'ar' ? ' و ' : ' '));
}

function renderPass() {
  const on = passActive(UI.save);
  $('#btnPass').classList.toggle('hide', on);
  const chip = $('#passChip');
  chip.classList.toggle('hide', !on);
  chip.textContent = on ? passLeftText() : '';
}

function startQuickPass() {
  setSave(startPass(UI.save));
  sfx('win');
  renderMenu();
  if (UI.state === 'shop') renderShop();
}

/* ---- language, mute ---- */

function applyLang() {
  const a = $('#app');
  LANG.cur = UI.save.lang;
  a.lang = LANG.cur;
  a.dir = LANG.cur === 'ar' ? 'rtl' : 'ltr';
  document.title = t('title');
  document.querySelectorAll('[data-t]').forEach(n => { n.textContent = t(n.dataset.t); });
  document.querySelectorAll('[data-aria]').forEach(n => n.setAttribute('aria-label', t(n.dataset.aria)));
  $('#bLang').textContent = t('langBtn');
  const m = UI.save.muted;
  $('#bMute').setAttribute('aria-label', m ? t('unmute') : t('mute'));
  $('#bMute').innerHTML = icon(m ? 'soundOff' : 'soundOn');
  $('#bMute2').textContent = m ? t('snd_off') : t('snd_on');
  cv.setAttribute('aria-label', t('aria'));
  for (const k in cache) delete cache[k];
  renderMenu();
  hud();
  if (G) { renderEq(false); setSay(t('tip'), 'tip', 99); drawChars(true); }
  if (UI.state === 'settings' || UI.under === 'settings') renderSettings();
  if (UI.state === 'shop') renderShop();
  if (UI.state === 'daily') renderDaily();
  if (UI.state === 'ach') renderAch();
}

function applyPrefs() {
  Sound.setPrefs(UI.save.prefs, UI.save.muted);
  $('#app').classList.toggle('calm', Calm.on());
}

function toggleMute() {
  setSave(setSetting(UI.save, 'muted', !UI.save.muted));
  applyPrefs();
  applyLang();
  if (!UI.save.muted) sfx('click');
}

function toggleLang() {
  setSave(setSetting(UI.save, 'lang', UI.save.lang === 'ar' ? 'en' : 'ar'));
  applyLang();
  drawChars(true);
}

function setGrade(g) {
  setSave(setSetting(UI.save, 'grade', g));
  sfx('click');
  renderMenu();
  const n = document.querySelector(`.gchip[data-g="${g}"]`);
  if (n) n.focus({ preventScroll: true });
}

function toast(text) {
  const n = $('#toast');
  n.textContent = text;
  n.classList.add('show');
  clearTimeout(toast.h);
  toast.h = setTimeout(() => n.classList.remove('show'), 2200);
}
