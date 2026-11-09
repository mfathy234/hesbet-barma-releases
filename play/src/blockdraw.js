/* Canvas drawing of one block: rounded tile with a highlight, a skin pattern, pie-cut eyes that follow the pointer, and the number or power-up icon. */

function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function drawEyes(c, cx, cy, s, mood, look, blink) {
  const rx = s * 0.095, ry = s * 0.115, dx = s * 0.2;
  c.strokeStyle = K.ink; c.lineCap = 'round'; c.lineJoin = 'round';
  for (const sg of [-1, 1]) {
    const ex = cx + sg * dx;
    c.lineWidth = s * 0.045;
    if (mood === 'wince') {
      c.beginPath(); c.moveTo(ex + sg * rx, cy - ry * 0.75); c.lineTo(ex - sg * rx, cy); c.lineTo(ex + sg * rx, cy + ry * 0.75); c.stroke();
      c.beginPath(); c.moveTo(ex - sg * rx * 1.4, cy - ry * 1.25); c.lineTo(ex + sg * rx * 0.9, cy - ry * 1.55); c.stroke();
    } else if (mood === 'happy') {
      c.beginPath(); c.arc(ex, cy + ry * 0.3, rx * 0.9, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
    } else if (blink) {
      c.beginPath(); c.moveTo(ex - rx, cy + ry * 0.2); c.lineTo(ex + rx, cy + ry * 0.2); c.stroke();
    } else {
      c.lineWidth = s * 0.03; c.fillStyle = K.white;
      c.beginPath(); c.ellipse(ex, cy, rx, ry, 0, 0, 6.283); c.fill(); c.stroke();
      const px = ex + look.x * rx * 0.4, py = cy + look.y * ry * 0.4 + ry * 0.05, pr = rx * 0.58, pry = ry * 0.66;
      c.fillStyle = K.ink; c.beginPath(); c.ellipse(px, py, pr, pry, 0, 0, 6.283); c.fill();
      c.fillStyle = K.white; c.beginPath(); c.moveTo(px, py - pry); c.lineTo(px + pr * 0.15, py - pry * 0.1); c.lineTo(px + pr, py - pry * 0.35); c.closePath(); c.fill();
    }
  }
}

function drawIcon(c, kind, cx, cy, s) {
  c.lineJoin = 'round'; c.lineCap = 'round';
  if (kind === 'hint') {
    c.strokeStyle = K.ink; c.lineWidth = s * 0.04;
    for (let k = 0; k < 5; k++) {
      const a = Math.PI * (1.15 + 0.175 * k);
      c.beginPath(); c.moveTo(cx + Math.cos(a) * s * 0.17, cy - s * 0.04 + Math.sin(a) * s * 0.17); c.lineTo(cx + Math.cos(a) * s * 0.25, cy - s * 0.04 + Math.sin(a) * s * 0.25); c.stroke();
    }
    c.lineWidth = s * 0.05; c.fillStyle = '#fff6b0'; c.beginPath(); c.arc(cx, cy - s * 0.03, s * 0.13, 0, 6.283); c.fill(); c.stroke();
    c.fillStyle = '#9aa3b2'; rr(c, cx - s * 0.07, cy + s * 0.09, s * 0.14, s * 0.08, s * 0.025); c.fill(); c.stroke();
  } else if (kind === 'freeze') {
    for (const [w, col] of [[s * 0.1, K.ink], [s * 0.05, '#ffffff']]) {
      c.strokeStyle = col; c.lineWidth = w;
      for (let k = 0; k < 3; k++) {
        const a = k * Math.PI / 3;
        c.beginPath(); c.moveTo(cx + Math.cos(a) * s * 0.22, cy + Math.sin(a) * s * 0.22); c.lineTo(cx - Math.cos(a) * s * 0.22, cy - Math.sin(a) * s * 0.22); c.stroke();
      }
    }
  } else {
    c.strokeStyle = K.ink; c.lineWidth = s * 0.05;
    c.beginPath(); c.moveTo(cx + s * 0.08, cy - s * 0.13); c.quadraticCurveTo(cx + s * 0.14, cy - s * 0.25, cx + s * 0.22, cy - s * 0.2); c.stroke();
    c.fillStyle = K.ink; c.beginPath(); c.arc(cx, cy + s * 0.03, s * 0.17, 0, 6.283); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.arc(cx - s * 0.06, cy - s * 0.02, s * 0.045, 0, 6.283); c.fill();
    c.fillStyle = K.gold; c.beginPath(); c.arc(cx + s * 0.22, cy - s * 0.2, s * 0.05, 0, 6.283); c.fill();
  }
}

/** Skin patterns, drawn inside the clipped tile. */
function drawPattern(c, pattern, x, y, w, s) {
  c.save();
  c.globalAlpha *= 0.3; c.fillStyle = '#fff'; c.strokeStyle = '#fff'; c.lineWidth = s * 0.05;
  if (pattern === 'dots') {
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) {
      c.beginPath(); c.arc(x + w * (0.2 + 0.3 * q) + (r % 2) * w * 0.12, y + w * (0.22 + 0.28 * r), s * 0.04, 0, 6.283); c.fill();
    }
  } else if (pattern === 'stripes') {
    c.beginPath();
    for (let k = -2; k < 6; k++) { c.moveTo(x + w * 0.25 * k, y + w); c.lineTo(x + w * 0.25 * k + w, y); }
    c.stroke();
  }
  c.restore();
}

/** o = { mood, look, blink, alpha, scale, palette, pattern, t, calm }. */
function drawBlock(c, x, y, s, b, o) {
  const p = s * 0.05, w = s - 2 * p, r = s * 0.22, lw = Math.max(2.5, s * 0.065);
  const pal = BLOCK_COLORS[o.palette || 'classic'];
  let col, dark;
  if (b.p) [col, dark] = POWER_COLORS[b.p]; else { col = pal.cols[b.v % 5]; dark = pal.dark[b.v % 5]; }
  const cx = x + s / 2, baseAlpha = o.alpha == null ? 1 : o.alpha;
  c.save();
  c.globalAlpha = baseAlpha;
  const beat = o.calm ? 0 : 0.014 * Math.cos(o.t * 12.566 + b.ph), sq = o.calm ? 0 : b.sq * 0.12, sc = o.scale || 1;
  c.translate(cx, y + s); c.scale(sc * (1 + beat + sq), sc * (1 - beat - sq)); c.translate(-cx, -(y + s));
  rr(c, x + p, y + p, w, w, r); c.fillStyle = col; c.fill();
  c.save(); c.clip(); c.fillStyle = dark; c.fillRect(x + p, y + p + w * 0.78, w, w * 0.22);
  if (!b.p && o.pattern) drawPattern(c, o.pattern, x + p, y + p, w, s);
  c.restore();
  rr(c, x + p, y + p, w, w, r); c.lineWidth = lw; c.strokeStyle = K.ink; c.lineJoin = 'round'; c.stroke();
  c.globalAlpha = baseAlpha * 0.75; c.strokeStyle = '#fff'; c.lineWidth = s * 0.05; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x + p + s * 0.1, y + p + s * 0.27); c.quadraticCurveTo(x + p + s * 0.09, y + p + s * 0.1, x + p + s * 0.27, y + p + s * 0.1); c.stroke();
  c.globalAlpha = baseAlpha;
  drawEyes(c, cx, y + s * 0.3, s, o.mood, o.look, o.blink);
  if (b.p) drawIcon(c, b.p, cx, y + s * 0.67, s);
  else {
    const str = nf(b.v), fs = s * (str.length <= 2 ? 0.42 : str.length === 3 ? 0.34 : 0.28);
    c.font = `400 ${fs}px Lalezar, Cairo, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
    c.lineWidth = s * 0.11; c.strokeStyle = K.ink; c.lineJoin = 'round'; c.strokeText(str, cx, y + s * 0.69);
    c.fillStyle = K.white; c.fillText(str, cx, y + s * 0.69);
  }
  c.restore();
}

function starPath(c, x, y, r) {
  c.beginPath();
  for (let k = 0; k < 8; k++) {
    const rad = k % 2 ? r * 0.35 : r, a = k * Math.PI / 4 - Math.PI / 2;
    c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  c.closePath();
}
