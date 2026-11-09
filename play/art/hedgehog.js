/* Toto the hedgehog: school bag, pencil, sneakers. Moods: idle, cheer, oops. The bag colour and patch come from BAGS in data.js. 160 x 160. */
function bagArt(bag) {
  const b = BAGS.find(x => x.id === bag) || BAGS[0];
  const patch = b.patch === 'star' ? `<path d="M31 111l3 6 6.500.8-4.800 4.500 1.300 6.200-6-3.300-6 3.300 1.300-6.200-4.800-4.500 6.500-.8z" fill="${K.sun}" ${S(2)}/>`
    : b.patch === 'stripe' ? `<path d="M16 126H46M16 132H46" stroke="${K.white}" stroke-width="4" stroke-linecap="round"/>` : `<circle cx="31" cy="118" r="4.5" fill="${K.gold}" ${S(2.5)}/>`;
  return `<g><rect x="14" y="98" width="34" height="40" rx="9" fill="${b.col}" ${S(4)}/><path d="M14 112Q31 124 48 112" fill="none" ${S(3)}/>${patch}</g>
  ${hose('M50 94Q42 100 36 100', 4, b.col)}`;
}
function hogArt(m, bag) {
  const cheer = m === 'cheer', oops = m === 'oops';
  let spikes = '';
  const n = 13;
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (1.04 + 0.92 * i / (n - 1)), d = 0.12;
    const pt = (r, th) => `${(80 + r * Math.cos(th)).toFixed(1)} ${(88 + r * Math.sin(th)).toFixed(1)}`;
    spikes += `<path d="M${pt(40, a - d)}L${pt(68, a)}L${pt(40, a + d)}Z" fill="${i % 2 ? K.spineL : K.spine}" ${S(3)}/>`;
  }
  const eyes = oops
    ? `<path d="M56 54L72 61L56 68M104 54L88 61L104 68" fill="none" ${S(4)}/>`
    : pieEye(65, 62, 9, 11, cheer ? 0 : 1, cheer ? -2 : 2) + pieEye(95, 62, 9, 11, cheer ? 0 : -1, cheer ? -2 : 2);
  const mouth = cheer ? `<path d="M70 84Q80 100 90 84Z" fill="#7a1a1a" ${S(2.5)}/><path d="M75 90Q80 95 85 90" fill="${K.pink}"/>`
    : oops ? `<path d="M72 90Q80 82 88 90" fill="none" ${S(3)}/>` : `<path d="M71 84Q80 92 89 84" fill="none" ${S(3)}/>`;
  let arms;
  if (cheer) arms = hose('M108 102Q134 92 132 60', 8, K.tan) + glove(132, 52, 9) + hose('M52 102Q26 92 28 60', 8, K.tan) + glove(28, 52, 9) + spark(146, 36, 7);
  else if (oops) arms = hose('M108 102Q136 80 112 46', 8, K.tan) + glove(110, 42, 9) + hose('M52 102Q24 80 48 46', 8, K.tan) + glove(50, 42, 9) + drop(128, 40);
  else arms = hose('M108 104Q128 106 126 124', 8, K.tan) + glove(126, 128, 9) + hose('M52 102Q40 98 44 90', 8, K.tan) + glove(44, 86, 9);
  return `<ellipse cx="80" cy="154" rx="36" ry="5" fill="${K.ink}" opacity=".25"/>
  ${spikes}
  <g transform="rotate(25 112 30)"><rect x="104" y="12" width="8" height="28" rx="2" fill="${K.sun}" ${S(2.5)}/><rect x="104" y="7" width="8" height="7" rx="2" fill="${K.pink}" ${S(2.5)}/></g>
  ${hose('M66 140V148', 7, K.tan)}${hose('M94 140V148', 7, K.tan)}
  <ellipse cx="62" cy="150" rx="16" ry="8" fill="${K.tomato}" ${S(3.5)}/><path d="M50 148q12-6 24 0" fill="none" stroke="${K.white}" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="98" cy="150" rx="16" ry="8" fill="${K.tomato}" ${S(3.5)}/><path d="M86 148q12-6 24 0" fill="none" stroke="${K.white}" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="80" cy="114" rx="32" ry="30" fill="${K.sky}" ${S(4.5)}/>
  <path d="M62 92L80 106L98 92L92 86L80 96L68 86Z" fill="${K.white}" ${S(2.5)}/><path d="M80 100l-5 8 5 15 5-15z" fill="${K.tomato}" ${S(2.5)}/>
  <circle cx="54" cy="42" r="11" fill="${K.tan}" ${S(3.5)}/><circle cx="54" cy="42" r="5" fill="${K.pink}"/>
  <circle cx="106" cy="42" r="11" fill="${K.tan}" ${S(3.5)}/><circle cx="106" cy="42" r="5" fill="${K.pink}"/>
  <circle cx="80" cy="68" r="34" fill="${K.tan}" ${S(4.5)}/>
  <path d="M62 38L66 24L76 34L84 22L92 36L100 26L98 40Z" fill="${K.spine}" ${S(3)}/>
  <ellipse cx="80" cy="78" rx="21" ry="16" fill="${K.peach}"/>
  <ellipse cx="80" cy="72" rx="6.5" ry="5" fill="${K.ink}"/>
  <ellipse cx="53" cy="76" rx="7" ry="4.5" fill="${K.pink}" opacity=".65"/><ellipse cx="107" cy="76" rx="7" ry="4.5" fill="${K.pink}" opacity=".65"/>
  ${eyes}${mouth}
  ${bagArt(bag)}
  ${arms}`;
}
const hogSVG = (m, bag) => svgDoc('0 0 160 160', hogArt(m, bag), 'aria-hidden="true"');
