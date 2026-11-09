/* The one list of every sprite: key, viewBox, size, svg. The game's menus and the art tools (export, sheet, canvas) both read it. */

function notebookTile() {
  return `<rect width="96" height="96" fill="${K.paper}"/><path d="M0 24H96M0 48H96M0 72H96M24 0V96M48 0V96M72 0V96" stroke="${K.grid}" stroke-width="1.500"/><path d="M8 0V96" stroke="${K.margin}" stroke-width="2" opacity=".75"/>`;
}

function chalkboardArt() {
  return `<rect x="4" y="4" width="232" height="112" rx="14" fill="${K.board}" stroke="${K.frame}" stroke-width="8"/><rect x="2" y="2" width="236" height="116" rx="16" fill="none" ${S(3)}/>
  <path d="M30 56h28M44 42v28M90 50h30M90 62h30M150 44l24 24M174 44l-24 24" stroke="${K.chalk}" stroke-width="5" stroke-linecap="round" opacity=".9"/><rect x="24" y="112" width="46" height="8" rx="3" fill="${K.frameD}" ${S(2)}/>`;
}

/** Title lockup: "Hesbet Barma" on a chalkboard sign, with the owl and the hedgehog beside it. */
function logoArt() {
  return `<g transform="translate(0 10)"><rect x="70" y="40" width="340" height="120" rx="20" fill="${K.board}" stroke="${K.frame}" stroke-width="9"/><rect x="66" y="36" width="348" height="128" rx="24" fill="none" ${S(4)}/>
  <text x="240" y="118" text-anchor="middle" font-family="Lalezar" font-size="78" fill="${K.chalk}" stroke="${K.ink}" stroke-width="2" direction="rtl">حسبة برما</text>
  <text x="240" y="148" text-anchor="middle" font-family="Cairo" font-weight="700" font-size="20" fill="${K.chalkY}" letter-spacing="3">HESBET BARMA</text></g>
  <svg x="0" y="0" width="120" height="135" viewBox="0 0 160 180">${owlArt('cheer', 'fez')}</svg>
  <svg x="360" y="20" width="120" height="120" viewBox="0 0 160 160">${hogArt('cheer', 'red')}</svg>`;
}

function spriteCatalogue() {
  const out = [];
  const add = (key, vb, w, h, svg) => out.push({ key, vb, w, h, svg });
  ['idle', 'cheer', 'wince'].forEach(m => add(`owl:${m}`, '0 0 160 180', 96, 108, owlArt(m, 'fez')));
  HATS.forEach(h => add(`owl:hat_${h.id}`, '0 0 160 180', 96, 108, owlArt('idle', h.id)));
  ['idle', 'cheer', 'oops'].forEach(m => add(`hog:${m}`, '0 0 160 160', 96, 96, hogArt(m, 'red')));
  BAGS.forEach(b => add(`hog:bag_${b.id}`, '0 0 160 160', 96, 96, hogArt('idle', b.id)));
  add('cart:0', '0 0 170 130', 102, 78, cartArt());
  SKINS.forEach(s => [0, 1, 2, 3, 4].forEach(i => add(`block:${s.id}:${i}`, '0 0 64 64', 64, 64, blockArt(s.id, i, '', [7, 12, 25, 36, 48][i]))));
  ['hint', 'freeze', 'bomb'].forEach(p => add(`power:${p}`, '0 0 64 64', 64, 64, blockArt('classic', 0, p, 0)));
  ['star', 'coin', 'trophy', 'flame', 'gift', 'calendar', 'shop', 'gear', 'stack', 'clock', 'pencil'].forEach(n => add(`ui:${n}`, ICONS[n].match(/viewBox="([^"]+)"/)[1], 48, 48, ICONS[n].replace(/^<svg[^>]*>|<\/svg>$/g, '')));
  add('bg:notebook', '0 0 96 96', 96, 96, notebookTile());
  add('bg:chalkboard', '0 0 240 120', 240, 120, chalkboardArt());
  add('logo', '0 0 480 190', 480, 190, logoArt());
  return out;
}
