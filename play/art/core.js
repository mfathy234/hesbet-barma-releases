/* Hesbet Barma art core: palette K, ink stroke S(), hose limbs, pie-cut eyes, gloves, sparkles. Rubber-hose style on notebook paper. */
const K = {
  ink: '#14213d', paper: '#fbf8ee', grid: '#c4dcee', margin: '#e5675f', white: '#fffaf0', chalk: '#f7f5ea', chalkY: '#ffe27a',
  board: '#1e5a45', boardD: '#154534', frame: '#a5703f', frameD: '#7a4d27',
  red: '#e0301e', redDark: '#9e2620', gold: '#f5b800', goldD: '#b98400', tomato: '#ee5a45', sun: '#ffcb2e', sky: '#4aa8e8', leaf: '#55b948', grape: '#9b62d0',
  owl: '#c58b4e', owlD: '#9a6736', belly: '#f6e3b8', beak: '#f2a81d', fez: '#d63a2f', navy: '#2d4a8a',
  tan: '#d9a56b', peach: '#f7d3b0', spine: '#4a3b5c', spineL: '#6a5780', pink: '#f08a8a', wood: '#b07a45', woodD: '#7d5230'
};

const S = (w = 4) => `stroke="${K.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

const hose = (d, w, col) => `<path d="${d}" fill="none" stroke="${K.ink}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;

function pieEye(cx, cy, rx, ry, px = 2, py = 2) {
  const pr = rx * 0.56, pry = ry * 0.62, x = cx + px, y = cy + py;
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${K.white}" ${S(3)}/><ellipse cx="${x}" cy="${y}" rx="${pr}" ry="${pry}" fill="${K.ink}"/><path d="M${x} ${y - pry} L${x + pr * 0.15} ${y - pry * 0.1} L${x + pr} ${y - pry * 0.35}Z" fill="${K.white}"/>`;
}

function glove(x, y, r) {
  return `<rect x="${x - r * 0.65}" y="${y + r * 0.55}" width="${r * 1.3}" height="${r * 0.55}" rx="${r * 0.2}" fill="${K.white}" ${S(2.5)}/><circle cx="${x}" cy="${y}" r="${r}" fill="${K.white}" ${S(2.5)}/><path d="M${x - r * 0.32} ${y - r * 0.5}V${y + r * 0.1}M${x} ${y - r * 0.6}V${y + r * 0.1}M${x + r * 0.32} ${y - r * 0.5}V${y + r * 0.1}" stroke="${K.ink}" stroke-width="1.6" stroke-linecap="round"/>`;
}

const spark = (x, y, s) => `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${K.sun}" ${S(2)}/>`;
const drop = (x, y) => `<path d="M${x} ${y - 9}Q${x + 8} ${y + 2} ${x} ${y + 6}Q${x - 8} ${y + 2} ${x} ${y - 9}Z" fill="#bfe6fa" ${S(2.5)}/>`;

const svgDoc = (vb, inner, attrs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${attrs}>${inner}</svg>`;
