/* Al-Ustaz Bouma, the teacher owl: tarboosh (or a bought hat), round glasses, chalk. Moods: idle, cheer, wince. 160 x 180. */
function owlArt(m, hat) {
  const cheer = m === 'cheer', wince = m === 'wince';
  const lensL = 59, lensR = 101, ly = 62;
  let eyes;
  if (wince) {
    eyes = `<circle cx="${lensL}" cy="${ly}" r="20" fill="${K.white}" ${S(4.5)}/><circle cx="${lensR}" cy="${ly}" r="20" fill="${K.white}" ${S(4.5)}/>` +
      `<path d="M51 54 L66 62 L51 70M109 54 L94 62 L109 70" fill="none" ${S(4.5)}/>`;
  } else {
    const py = cheer ? -3 : 2, px = cheer ? 0 : 2;
    eyes = `<circle cx="${lensL}" cy="${ly}" r="20" fill="${K.white}" ${S(4.5)}/><circle cx="${lensR}" cy="${ly}" r="20" fill="${K.white}" ${S(4.5)}/>` +
      pieEye(lensL, ly, 12, 14, px, py) + pieEye(lensR, ly, 12, 14, px - 1, py);
  }
  const brows = wince ? hose('M38 44Q54 46 74 34', 5, '#efe6d2') + hose('M122 44Q106 46 86 34', 5, '#efe6d2')
    : cheer ? hose('M40 32Q58 22 76 32', 5, '#efe6d2') + hose('M120 32Q102 22 84 32', 5, '#efe6d2')
    : hose('M40 38Q58 28 76 38', 5, '#efe6d2') + hose('M120 38Q102 28 84 38', 5, '#efe6d2');
  let arms;
  if (cheer) arms = hose('M42 102Q12 98 18 62', 8, K.owl) + glove(18, 54, 9) + hose('M118 102Q148 98 142 62', 8, K.owl) + glove(142, 54, 9) + spark(150, 30, 8) + spark(8, 34, 6);
  else if (wince) arms = hose('M42 104Q26 100 38 84', 8, K.owl) + glove(40, 80, 9) + hose('M118 104Q134 100 122 84', 8, K.owl) + glove(120, 80, 9) + drop(132, 36);
  else arms = hose('M42 102Q14 106 20 80', 8, K.owl) + `<rect x="13" y="48" width="9" height="26" rx="2.5" fill="${K.white}" ${S(2.5)} transform="rotate(-12 17 61)"/>` + glove(20, 74, 9) + hose('M118 104Q146 112 142 134', 8, K.owl) + glove(142, 138, 9);
  const mouth = cheer ? `<ellipse cx="80" cy="88" rx="7" ry="6" fill="#7a1a1a" ${S(2.5)}/>` : '';
  return `<g transform="translate(0 10)">
  <ellipse cx="80" cy="164" rx="38" ry="6" fill="${K.ink}" opacity=".25"/>
  ${hose('M62 140V154', 7, K.beak)}${hose('M98 140V154', 7, K.beak)}
  <path d="M48 160q2-9 12-9t12 9q-12 4-24 0zM88 160q2-9 12-9t12 9q-12 4-24 0z" fill="${K.beak}" ${S(3.5)}/>
  <ellipse cx="80" cy="108" rx="44" ry="46" fill="${K.owl}" ${S(4.5)}/>
  <ellipse cx="80" cy="116" rx="29" ry="32" fill="${K.belly}" ${S(3)}/>
  <path d="M66 112q5 6 10 0M82 112q5 6 10 0M74 126q5 6 10 0M58 126q5 6 10 0M90 126q5 6 10 0" fill="none" stroke="${K.owlD}" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M88 124q8-2 10 6q-6 4-12-2z" fill="${K.white}" opacity=".7"/>
  <path d="M80 98L64 90V106ZM80 98L96 90V106Z" fill="${K.navy}" ${S(3)}/><circle cx="80" cy="98" r="4.5" fill="${K.navy}" ${S(2.5)}/>
  <path d="M42 46L38 18L64 36ZM118 46L122 18L96 36Z" fill="${K.owlD}" ${S(4)}/>
  <ellipse cx="80" cy="60" rx="46" ry="40" fill="${K.owl}" ${S(4.5)}/>
  <ellipse cx="80" cy="64" rx="39" ry="30" fill="#e8c58d"/>
  ${hatArt(hat)}
  ${eyes}
  <path d="M78 60Q80 55 82 60M39 56L33 50M121 56L127 50" fill="none" ${S(4)}/>
  ${brows}
  <ellipse cx="42" cy="82" rx="8" ry="5" fill="${K.pink}" opacity=".6"/><ellipse cx="118" cy="82" rx="8" ry="5" fill="${K.pink}" opacity=".6"/>
  ${mouth}<path d="M70 74Q80 66 90 74L80 94Z" fill="${K.beak}" ${S(3.5)}/>
  ${arms}</g>`;
}
const owlSVG = (m, hat) => svgDoc('0 0 160 180', owlArt(m, hat), 'aria-hidden="true"');
