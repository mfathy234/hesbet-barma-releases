/* The settings screen (الإعدادات): opened from the menu or the pause screen. Rules are in prefs.js / save.js; this file draws the rows and wires them.
   Rows rebuild after every change, so they always show the saved value. */

function changePref(key, value) {
  setSave(setPref(UI.save, key, value));
  applyPrefs();
}

function setRow(label, control, sub) {
  const row = el('div', 'set-row');
  const lbl = el('div', 'set-lbl');
  lbl.append(el('b', '', label));
  if (sub) lbl.append(el('small', '', sub));
  row.append(lbl, control);
  return row;
}

const pct = v => nf(v) + (LANG.cur === 'ar' ? '٪' : '%');

function setSlider(key) {
  const wrap = el('div', 'set-slider');
  const input = el('input');
  input.type = 'range'; input.min = '0'; input.max = '100'; input.step = '5';
  input.value = String(UI.save.prefs[key]);
  input.id = 'pref_' + key;
  input.setAttribute('aria-label', t('set_' + key));
  const out = el('output', '', pct(UI.save.prefs[key]));
  input.oninput = () => { changePref(key, Number(input.value)); out.textContent = pct(UI.save.prefs[key]); };
  input.onchange = () => { if (key === 'sfx') sfx('coin'); };
  wrap.append(input, out);
  return wrap;
}

function setToggle(key, disabled) {
  const on = UI.save.prefs[key];
  const b = el('button', 'toggle' + (on ? ' on' : ''), on ? t('set_on') : t('set_off'));
  b.type = 'button'; b.id = 'pref_' + key; b.disabled = Boolean(disabled);
  b.setAttribute('role', 'switch');
  b.setAttribute('aria-checked', String(on));
  b.onclick = () => {
    changePref(key, !UI.save.prefs[key]);
    if (key === 'vibrate' && UI.save.prefs.vibrate) buzz(40);
    sfx('click');
    renderSettings();
  };
  return b;
}

function setSegments(options, current, onPick, idPrefix) {
  const wrap = el('div', 'seg');
  wrap.setAttribute('role', 'radiogroup');
  options.forEach(([value, label]) => {
    const b = el('button', 'segbtn', label);
    b.type = 'button'; b.id = idPrefix + value;
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(value === current));
    b.onclick = () => onPick(value);
    wrap.append(b);
  });
  return wrap;
}

function eraseSummary() {
  const s = UI.save;
  const items = SHOP_KINDS.reduce((n, k) => n + s.owned[k].length - 1, 0);
  return [s.coins, items, s.meta.ach.length];
}

function askEraseProgress() {
  const [coins, items, trophies] = eraseSummary();
  askConfirm(t('resetTitle'), t('resetBody', nf(coins), nf(items), nf(trophies)), t('resetBtn'), () => {
    setSave(resetProgress(UI.save, Date.now()));
    applyPrefs();
    sfx('bad');
    applyLang();
    renderSettings();
    toast(t('set_reset'));
  });
}

function renderSettings() {
  const body = $('#settingsBody'), keep = body.scrollTop;
  body.innerHTML = '';
  const s = UI.save;
  body.append(setRow(t('set_music'), setSlider('music')));
  body.append(setRow(t('set_sfx'), setSlider('sfx')));
  body.append(setRow(t('set_vibrate'), setToggle('vibrate', !Haptic.can()), Haptic.can() ? '' : t('set_vibrate_no')));
  body.append(setRow(t('set_calm'), setToggle('calm'), t('set_calm_sub')));
  body.append(setRow(t('set_lang'), setSegments([['ar', 'عربي'], ['en', 'English']], s.lang, v => { setSave(setSetting(UI.save, 'lang', v)); applyLang(); drawChars(true); }, 'lang_')));
  body.append(setRow(t('set_grade'), setSegments(GRADE_LABELS[LANG.cur].map((g, i) => [i, i === 0 || LANG.cur === 'ar' ? g : 'G' + g]), s.grade, v => { setSave(setSetting(UI.save, 'grade', v)); renderSettings(); }, 'grade_')));
  const erase = el('button', 'btn red small', t('set_reset'));
  erase.id = 'btnErase'; erase.type = 'button';
  erase.onclick = askEraseProgress;
  const row = setRow(t('set_reset'), erase, t('set_reset_sub'));
  row.classList.add('danger');
  body.append(row);
  body.append(el('p', 'about', t('set_about')));
  body.append(el('p', 'about ver', versionLine(buildId())));
  body.scrollTop = keep;
}
