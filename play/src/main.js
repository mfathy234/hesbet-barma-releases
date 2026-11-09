/* Boot and main loop. */

let raf = 0, last = 0;

function frame(ts) {
  raf = requestAnimationFrame(frame);
  const dt = Math.min(0.05, (ts - last) / 1000 || 0.016);
  last = ts;
  try { update(dt); draw(); } catch (e) { console.error(e); }
}

function injectIcons() {
  document.querySelectorAll('[data-icon]').forEach(n => { n.innerHTML = icon(n.dataset.icon); });
}

function wire() {
  const on = (sel, ev, fn) => $(sel).addEventListener(ev, fn);
  cv.addEventListener('pointerdown', onPointer);
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); ptr = { x: e.clientX - r.left, y: e.clientY - r.top }; });
  document.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', () => { if (document.hidden && G && !G.over && !G.paused && UI.state === 'play') pause(true); });
  on('#bPause', 'click', () => { sfx('click'); pause(true); });
  on('#bMute', 'click', toggleMute);
  on('#bMute2', 'click', toggleMute);
  on('#bLang', 'click', toggleLang);
  on('#bResume', 'click', () => pause(false));
  on('#bSettingsP', 'click', () => { openScreen('settings'); renderSettings(); });
  on('#bHome', 'click', () => askConfirm(t('leaveQ'), t('leaveD'), t('leaveYes'), goMenu, t('leaveNo')));
  on('#confirmNo', 'click', closeConfirm);
  on('#confirmYes', 'click', () => { const fn = UI.confirmYes; closeConfirm(); if (fn) fn(); });
  on('#bAgain', 'click', () => { sfx('click'); const m = G.mode; closeAll(); newGame(m); });
  on('#bMenu', 'click', goMenu);
  on('#grades', 'click', e => { const b = e.target.closest('.gchip'); if (b) setGrade(Number(b.dataset.g)); });
  on('#modes', 'click', e => { const b = e.target.closest('.mode'); if (!b) return; sfx('click'); newGame(b.dataset.m); });
  on('#btnDaily', 'click', openDaily);
  on('#btnShop', 'click', openShop);
  on('#btnAch', 'click', openAch);
  on('#btnSettings', 'click', () => { openScreen('settings'); renderSettings(); });
  on('#btnPass', 'click', startQuickPass);
  document.querySelectorAll('.backbtn').forEach(b => b.addEventListener('click', closeScreen));
  const ro = new ResizeObserver(resize);
  ro.observe($('#wellwrap'));
  window.addEventListener('resize', resize);
}

function boot() {
  let save;
  try { save = loadSave(localStorage); } catch (e) { save = newSave(Date.now()); }
  UI.save = settlePass(save);
  injectIcons();
  $('#cart').innerHTML = cartSVG();
  wire();
  Sound.arm();
  applyPrefs();
  applyLang();
  resize();
  goMenu();
  setInterval(() => { if (UI.state === 'menu') { const s = settlePass(UI.save); if (s !== UI.save) setSave(s); renderPass(); } }, 15000);
  last = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
  HesbaUpdate.init();
}

boot();
