/* Small UI icons (24 x 24, ink outlines) and the block art used by the shop, the menu and the art sheet. ICONS[name] is an SVG string. */

const ICONS = {
  star: `<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.5.8-4.8 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.6 9.3l6.5-.8z" fill="${K.sun}" stroke="${K.ink}" stroke-width="2" stroke-linejoin="round"/></svg>`,
  coin: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="${K.gold}" stroke="${K.ink}" stroke-width="2"/><circle cx="12" cy="12" r="5.5" fill="none" stroke="${K.goldD}" stroke-width="2"/><path d="M8 7.5q2-1.6 4-1.6" stroke="${K.white}" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24"><path d="M6 3h12v5a6 6 0 0 1-12 0z" fill="${K.gold}" stroke="${K.ink}" stroke-width="2" stroke-linejoin="round"/><path d="M6 5H3q0 5 3.5 5.5M18 5h3q0 5-3.5 5.5M12 14v4M8 21h8" fill="none" stroke="${K.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pause: `<svg viewBox="0 0 24 24"><rect x="5" y="4" width="5" height="16" rx="1.5" fill="${K.ink}"/><rect x="14" y="4" width="5" height="16" rx="1.5" fill="${K.ink}"/></svg>`,
  soundOn: `<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="${K.ink}" stroke="${K.ink}" stroke-width="2" stroke-linejoin="round"/><path d="M16 8.5q2.5 3.5 0 7M19 6q4.5 6 0 12" fill="none" stroke="${K.ink}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  soundOff: `<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="${K.ink}" stroke="${K.ink}" stroke-width="2" stroke-linejoin="round"/><path d="M16 9l6 6M22 9l-6 6" stroke="${K.red}" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  gear: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="${K.white}" stroke="${K.ink}" stroke-width="2.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" stroke="${K.ink}" stroke-width="3" stroke-linecap="round"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="${K.ink}" stroke-width="3"/><circle cx="12" cy="12" r="4" fill="${K.white}"/></svg>`,
  shop: `<svg viewBox="0 0 24 24"><path d="M4 9h16l-1.500 11H5.500z" fill="${K.tomato}" stroke="${K.ink}" stroke-width="2" stroke-linejoin="round"/><path d="M8.500 9V7a3.500 3.500 0 0 1 7 0v2" fill="none" stroke="${K.ink}" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="14.500" r="2" fill="${K.white}" stroke="${K.ink}" stroke-width="1.500"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="${K.white}" stroke="${K.ink}" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="${K.ink}" stroke-width="2" stroke-linecap="round"/><path d="M8 16l3 3 5-6" fill="none" stroke="#3a9230" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  home: `<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7M6 10v10h12V10" fill="none" stroke="${K.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  back: `<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="${K.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  lock: `<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="3" fill="${K.gold}" stroke="${K.ink}" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="${K.ink}" stroke-width="2" stroke-linecap="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path d="M4 12.500l5 5L20 6.500" fill="none" stroke="#3a9230" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  flame: `<svg viewBox="0 0 24 24"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-4 3-7 1 1 2 2 3 2 0-3-1-4 0-7z" fill="${K.tomato}" stroke="${K.ink}" stroke-width="2" stroke-linejoin="round"/><path d="M12 22a3 3 0 0 1-3-3c0-2 2-3 3-5 1 2 3 3 3 5a3 3 0 0 1-3 3z" fill="${K.sun}" stroke="${K.ink}" stroke-width="1.500"/></svg>`,
  gift: `<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2" fill="${K.grape}" stroke="${K.ink}" stroke-width="2"/><path d="M12 9v12M3 13h18" stroke="${K.ink}" stroke-width="2"/><path d="M12 9c-3-5-7-3-5 0M12 9c3-5 7-3 5 0" fill="none" stroke="${K.ink}" stroke-width="2" stroke-linecap="round"/></svg>`,
  stack: `<svg viewBox="0 0 40 40"><rect x="4" y="22" width="14" height="14" rx="4" fill="${K.tomato}" stroke="${K.ink}" stroke-width="3"/><rect x="20" y="22" width="14" height="14" rx="4" fill="${K.sky}" stroke="${K.ink}" stroke-width="3"/><rect x="12" y="6" width="14" height="14" rx="4" fill="${K.sun}" stroke="${K.ink}" stroke-width="3"/></svg>`,
  clock: `<svg viewBox="0 0 40 40"><circle cx="20" cy="23" r="14" fill="#fffdf3" stroke="${K.ink}" stroke-width="3"/><path d="M20 23V13M20 23l7 4M16 5h8" stroke="${K.ink}" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`,
  pencil: `<svg viewBox="0 0 40 40"><path d="M6 30L28 8l6 6L12 36H6z" fill="${K.sun}" stroke="${K.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M28 8l3-3 6 6-3 3" fill="${K.pink}" stroke="${K.ink}" stroke-width="3" stroke-linejoin="round"/></svg>`
};
const icon = name => ICONS[name] || '';

/** One block as a standalone SVG fragment on a 64 grid: tile, highlight, pattern, eyes and its number or power icon. */
function blockArt(skinId, idx, p, v) {
  const skin = SKINS.find(s => s.id === skinId) || SKINS[0], pal = BLOCK_COLORS[skin.palette];
  let col, dark;
  if (p) [col, dark] = POWER_COLORS[p]; else { col = pal.cols[idx % 5]; dark = pal.dark[idx % 5]; }
  const pat = !p && skin.pattern === 'dots' ? [0, 1, 2].map(r => [0, 1, 2].map(q => `<circle cx="${14 + 18 * q + (r % 2) * 7}" cy="${15 + 17 * r}" r="2.4" fill="#fff" opacity=".3"/>`).join('')).join('')
    : !p && skin.pattern === 'stripes' ? `<path d="M-4 52L28 4M10 62L42 14M26 62L58 14M40 62L72 14" stroke="#fff" stroke-width="3" opacity=".25"/>` : '';
  let face;
  if (p === 'hint') face = `<circle cx="32" cy="42" r="8" fill="#fff6b0" ${S(3)}/><rect x="28" y="49" width="8" height="5" rx="1.500" fill="#9aa3b2" ${S(2)}/><path d="M32 26v3M22 31l2 2M42 31l-2 2" ${S(2.500)}/>`;
  else if (p === 'freeze') face = `<path d="M32 30v24M21 36l22 12M21 48l22-12" stroke="${K.ink}" stroke-width="7" stroke-linecap="round"/><path d="M32 30v24M21 36l22 12M21 48l22-12" stroke="#fff" stroke-width="3.500" stroke-linecap="round"/>`;
  else if (p === 'bomb') face = `<circle cx="32" cy="44" r="10" fill="${K.ink}" ${S(3)}/><path d="M36 34q3-7 9-5" fill="none" ${S(3)}/><circle cx="46" cy="28" r="3" fill="${K.gold}"/><circle cx="29" cy="41" r="2.500" fill="#fff" opacity=".7"/>`;
  else face = `<text x="32" y="53" text-anchor="middle" font-family="Lalezar,Cairo,sans-serif" font-size="${String(v).length <= 2 ? 27 : 21}" fill="${K.white}" stroke="${K.ink}" stroke-width="5" paint-order="stroke" stroke-linejoin="round">${v}</text>`;
  const eyes = pieEye(24, 19, 5.600, 7, 1, 1.500) + pieEye(40, 19, 5.600, 7, 1, 1.500);
  return `<clipPath id="bc${skinId}${idx}${p || 'n'}"><rect x="3" y="3" width="58" height="58" rx="14"/></clipPath>
  <rect x="3" y="3" width="58" height="58" rx="14" fill="${col}"/><g clip-path="url(#bc${skinId}${idx}${p || 'n'})"><rect x="3" y="46" width="58" height="15" fill="${dark}"/>${pat}</g>
  <rect x="3" y="3" width="58" height="58" rx="14" fill="none" ${S(4)}/><path d="M9 20Q8 9 20 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".75"/>${eyes}${face}`;
}
const blockSVG = (skinId, idx, p, v) => svgDoc('0 0 64 64', blockArt(skinId, idx, p, v), 'aria-hidden="true"');
