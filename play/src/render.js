/* Draws one frame of the well: notebook paper, blocks, rise warning, freeze, danger line, particles and floating texts. */

function blockXY(c, i, b) { return { x: wx + c * cell, y: wy + ROWS * cell - (i + 1) * cell - G.rise * cell - b.dy * cell }; }

function drawGrid(wr, wh, wb) {
  ctx.strokeStyle = K.grid; ctx.lineWidth = 1.2; ctx.beginPath();
  const off = (G.rise * cell) % cell;
  for (let k = 0; k <= COLS; k++) { ctx.moveTo(wx + k * cell, wy); ctx.lineTo(wx + k * cell, wb); }
  for (let k = -1; k <= ROWS; k++) { const yy = wb - k * cell - off; ctx.moveTo(wx, yy); ctx.lineTo(wx + wr, yy); }
  ctx.stroke();
}

function drawBlocks(pulse, wb) {
  const quiet = calm(), hot = G.danger > 0.3, skin = G.skin;
  for (let c = 0; c < COLS; c++) {
    const col = G.cols[c];
    for (let i = 0; i < col.length; i++) {
      const b = col[i], pos = blockXY(c, i, b);
      if (pos.y > wb + cell || pos.y < wy - cell * 2) continue;
      const bx = pos.x + (b.sh > 0 ? Math.sin(G.t * 70) * cell * 0.07 * (b.sh / 0.45) * (quiet ? 0 : 1) : 0);
      const dx = ptr.x - (bx + cell / 2), dy = ptr.y - (pos.y + cell * 0.3), dl = Math.hypot(dx, dy) || 1;
      const mood = G.over || b.hurt > 0 || (hot && i >= ROWS - 3 && !b.p) ? 'wince' : 'idle';
      drawBlock(ctx, bx, pos.y, cell, b, { mood, look: { x: dx / dl, y: dy / dl }, blink: ((G.t * 0.9 + b.ph) % 4.2) < 0.13, palette: skin.palette, pattern: skin.pattern, t: G.t, calm: quiet });
      if (b.id === G.hintId) {
        ctx.save(); ctx.strokeStyle = K.gold; ctx.lineWidth = cell * 0.09; ctx.globalAlpha = 0.6 + 0.4 * pulse; rr(ctx, bx - 1, pos.y - 1, cell + 2, cell + 2, cell * 0.26); ctx.stroke();
        ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); rr(ctx, bx - cell * 0.07, pos.y - cell * 0.07, cell * 1.14, cell * 1.14, cell * 0.3); ctx.stroke(); ctx.restore();
      }
      if (b.p) {
        ctx.save(); ctx.globalAlpha = 0.25 + 0.25 * pulse; ctx.strokeStyle = b.p === 'bomb' ? K.tomato : K.gold; ctx.lineWidth = 3;
        rr(ctx, bx + 2, pos.y + 2, cell - 4, cell - 4, cell * 0.2); ctx.stroke(); ctx.restore();
      }
    }
  }
}

function drawKeyboardCursor() {
  if (!G.kb || !G.cols[G.cur.c]) return;
  const col = G.cols[G.cur.c], i = Math.min(G.cur.i, col.length - 1);
  if (i < 0) return;
  const pos = blockXY(G.cur.c, i, col[i]);
  ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = K.ink; rr(ctx, pos.x - 2, pos.y - 2, cell + 4, cell + 4, cell * 0.27); ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.setLineDash([6, 5]); ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
}

function drawRiseWarning(wr, wb) {
  if (G.mode === 'practice' || G.freeze > 0 || G.over || G.ready > 0) return;
  const T = riseSeconds(G.mode, G.level, G.twist);
  if (!(G.pending > 0 || G.rise > 1 - 0.8 / T)) return;
  const fl = calm() ? 0.8 : 0.55 + 0.45 * Math.sin(G.t * 26);
  const gr = ctx.createLinearGradient(0, wb - cell * 0.6, 0, wb);
  gr.addColorStop(0, 'rgba(224,48,30,0)'); gr.addColorStop(1, `rgba(224,48,30,${0.55 * fl})`);
  ctx.fillStyle = gr; ctx.fillRect(wx, wb - cell * 0.6, wr, cell * 0.6);
  ctx.fillStyle = K.red; ctx.globalAlpha = fl; ctx.fillRect(wx, wb - 5, wr, 5);
  ctx.strokeStyle = K.red; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let k = 0; k < COLS; k++) {
    const ax = wx + (k + 0.5) * cell, ay = wb - cell * 0.28 - (calm() ? 0 : (G.t * 30 % 8));
    ctx.beginPath(); ctx.moveTo(ax - 8, ay + 4); ctx.lineTo(ax, ay - 4); ctx.lineTo(ax + 8, ay + 4); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawFreeze(wr, wh) {
  if (G.freeze <= 0) return;
  ctx.fillStyle = 'rgba(150,215,250,.28)'; ctx.fillRect(wx, wy, wr, wh);
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3;
  for (let k = 0; k < 6; k++) {
    const ax = wx + (k + 0.5) * cell;
    ctx.beginPath(); ctx.moveTo(ax - 7, wy); ctx.lineTo(ax, wy + 9 + (k % 2) * 9); ctx.lineTo(ax + 7, wy); ctx.stroke();
  }
}

function drawFrame(wr, wh, pulse) {
  rr(ctx, wx, wy, wr, wh, 10); ctx.lineWidth = 4.5; ctx.strokeStyle = G.danger > 0.4 && pulse > 0.5 ? K.red : K.ink; ctx.stroke();
  ctx.save(); ctx.setLineDash([9, 7]); ctx.strokeStyle = K.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx + 6, wy); ctx.lineTo(wx + wr - 6, wy); ctx.stroke(); ctx.restore();
  ctx.font = '700 11px Cairo, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
  const lt = t('line'), tw = ctx.measureText(lt).width + 14;
  rr(ctx, wx + wr - tw - 8, wy - 9, tw, 18, 9); ctx.fillStyle = K.red; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = K.ink; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.fillText(lt, wx + wr - tw / 2 - 8, wy);
}

function drawEffects(wr, wh) {
  for (const q of G.parts) {
    const k = q.t / q.life;
    ctx.globalAlpha = 1 - k;
    if (q.kind === 'star') { ctx.fillStyle = K.sun; ctx.strokeStyle = K.ink; ctx.lineWidth = 2; starPath(ctx, q.x, q.y, q.r * (1 + k) * 1.4); ctx.fill(); ctx.stroke(); }
    else { ctx.fillStyle = q.col; ctx.strokeStyle = K.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (0.6 + k * 1.2), 0, 6.283); ctx.fill(); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  for (const x of G.texts) {
    if (!x.txt) continue;
    ctx.globalAlpha = x.t < 0.8 ? 1 : 1 - (x.t - 0.8) / 0.3;
    const sc = x.t < 0.15 ? 0.6 + x.t / 0.15 * 0.5 : 1.1 - Math.min(0.1, (x.t - 0.15) * 0.3);
    ctx.font = `400 ${x.size * sc * clamp(cell / 52, 0.7, 1.2)}px Lalezar, Cairo, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
    const hw = ctx.measureText(x.txt).width / 2 + 6, px = clamp(x.x, wx + hw, wx + wr - hw);
    ctx.lineJoin = 'round'; ctx.lineWidth = 6; ctx.strokeStyle = K.ink; ctx.strokeText(x.txt, px, x.y); ctx.fillStyle = x.col; ctx.fillText(x.txt, px, x.y); ctx.globalAlpha = 1;
  }
  if (G.ready > 0 && !G.over) {
    const k = 1 - G.ready / READY_SECONDS;
    ctx.font = `400 ${cell * 1.4 * (0.8 + 0.3 * Math.sin(k * 3.1))}px Lalezar, Cairo, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
    ctx.lineWidth = 9; ctx.strokeStyle = K.ink; ctx.lineJoin = 'round'; ctx.strokeText(t('go'), wx + wr / 2, wy + wh * 0.4); ctx.fillStyle = K.sun; ctx.fillText(t('go'), wx + wr / 2, wy + wh * 0.4);
  }
  if (G.flash) { ctx.fillStyle = `rgba(224,48,30,${G.flash * 0.3})`; ctx.fillRect(0, 0, W, H); }
}

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  if (!G) return;
  const quiet = calm(), shake = quiet ? 0 : G.shake * cell * 0.25;
  ctx.save();
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  const wr = cell * COLS, wh = cell * ROWS, wb = wy + wh, pulse = 0.5 + 0.5 * Math.sin(G.t * 9);
  ctx.save();
  rr(ctx, wx, wy, wr, wh, 10); ctx.fillStyle = '#fffdf3'; ctx.fill(); ctx.clip();
  drawGrid(wr, wh, wb);
  if (G.danger > 0) {
    const gr = ctx.createLinearGradient(0, wy, 0, wy + cell * 2.4), a = G.danger * (0.28 + 0.18 * pulse);
    gr.addColorStop(0, `rgba(224,48,30,${a})`); gr.addColorStop(1, 'rgba(224,48,30,0)');
    ctx.fillStyle = gr; ctx.fillRect(wx, wy, wr, cell * 2.4);
  }
  drawBlocks(pulse, wb);
  drawKeyboardCursor();
  for (const g of G.ghosts) {
    const k = g.t / 0.2;
    drawBlock(ctx, g.x, g.y, cell, g.b, { mood: 'happy', look: { x: 0, y: 0 }, alpha: 1 - k, scale: 1 + k * 0.35, palette: G.skin.palette, pattern: G.skin.pattern, t: G.t, calm: quiet });
  }
  drawRiseWarning(wr, wb);
  drawFreeze(wr, wh);
  ctx.restore();
  drawFrame(wr, wh, pulse);
  drawEffects(wr, wh);
  ctx.restore();
}
