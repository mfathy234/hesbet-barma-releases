/* Shared runtime state and helpers: DOM shortcuts, the UI state object, the canvas and its layout, save access. */

const $ = s => document.querySelector(s);
const UI = { state: 'menu', save: null, confirmYes: null, game: 'blocks' };

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

const buildId = () => (typeof HESBA_BUILD === 'string' ? HESBA_BUILD : 'dev');

const cv = $('#cv'), ctx = cv.getContext('2d');
let G = null, W = 0, H = 0, cell = 40, wx = 0, wy = 0, dpr = 1, ROWS = 9;
let ptr = { x: -999, y: -999 };

function setSave(next) {
  UI.save = next;
  persistSave(localStorage, next);
}

/** Cell size and well position from the canvas wrapper. */
function resize() {
  const r = $('#wellwrap').getBoundingClientRect();
  W = Math.max(1, r.width);
  H = Math.max(1, r.height);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
  cell = Math.max(BOARD.minCell, Math.floor(Math.min((W - BOARD.pad) / COLS, (H - BOARD.pad) / ROWS)));
  wx = Math.round((W - cell * COLS) / 2);
  wy = H - cell * ROWS;
}

const calm = () => Calm.on();
const sfx = (name, pitch) => Sound.play(name, pitch);
const buzz = ms => Haptic.buzz(ms);
