/* Input: taps on the canvas, number keys to type an answer, arrows + Enter to move a cursor, Esc/P to pause, M to mute. */

function hitTest(x, y) {
  const c = Math.floor((x - wx) / cell);
  if (c < 0 || c >= COLS || y > wy + ROWS * cell + 2) return null;
  const col = G.cols[c];
  for (let i = col.length - 1; i >= 0; i--) {
    const p = blockXY(c, i, col[i]);
    if (y >= p.y && y < p.y + cell) return { c, i };
  }
  return null;
}

function onPointer(e) {
  if (!G || G.over || G.paused || UI.state !== 'play') return;
  const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  ptr = { x, y };
  G.kb = false;
  const h = hitTest(x, y);
  if (h) tapBlock(h.c, h.i);
}

const DIGITS = {};
ARABIC_DIGITS.split('').forEach((d, i) => { DIGITS[d] = String(i); });

function moveCursor(k) {
  if (!G.kb) { G.kb = true; const col = G.cols[G.cur.c] || []; G.cur.i = Math.max(0, col.length - 1); return; }
  if (k === 'ArrowLeft') G.cur.c = clamp(G.cur.c - 1, 0, COLS - 1);
  if (k === 'ArrowRight') G.cur.c = clamp(G.cur.c + 1, 0, COLS - 1);
  if (k === 'ArrowUp') G.cur.i += 1;
  if (k === 'ArrowDown') G.cur.i -= 1;
  G.cur.i = clamp(G.cur.i, 0, Math.max(0, G.cols[G.cur.c].length - 1));
}

function onKey(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key;
  if (k === 'Escape' || ((k === 'p' || k === 'P') && G && !G.over)) {
    if (backOut() === 'ok') e.preventDefault();
    return;
  }
  if (k === 'm' || k === 'M') { toggleMute(); return; }
  if (!G || UI.state !== 'play' || G.over || G.paused || G.ready > 0) return;
  const d = /^[0-9]$/.test(k) ? k : DIGITS[k];
  if (d !== undefined) {
    e.preventDefault();
    if (G.typed.length < 4) G.typed += d;
    G.typedT = 0.9;
    renderEq(false);
    if (G.eq && G.typed.length >= String(G.eq.ans).length) { G.typedT = 0; submitTyped(); }
    return;
  }
  if (k === 'Backspace') { e.preventDefault(); G.typed = G.typed.slice(0, -1); renderEq(false); return; }
  if (document.activeElement && document.activeElement.tagName === 'BUTTON') return;
  if (document.activeElement !== cv) cv.focus({ preventScroll: true });
  if (k.startsWith('Arrow')) { e.preventDefault(); moveCursor(k); return; }
  if (k === 'Enter' || k === ' ') {
    e.preventDefault();
    if (G.typed) { G.typedT = 0; submitTyped(); return; }
    if (!G.kb) { G.kb = true; return; }
    const col = G.cols[G.cur.c], i = Math.min(G.cur.i, col.length - 1);
    if (i >= 0) tapBlock(G.cur.c, i);
  }
}
