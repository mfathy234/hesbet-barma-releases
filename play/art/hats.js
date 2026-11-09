/* Owl hats. Each returns an SVG fragment drawn on the owl's head (head top at y 20, centred on x 80); the default is the tarboosh. */
function hatFez() {
  return `<path d="M54 32L58 8Q80 0 102 8L106 32Q80 40 54 32Z" fill="${K.fez}" ${S(4)}/>
  <path d="M55.5 25Q80 33 104.5 25" fill="none" stroke="${K.goldD}" stroke-width="3" stroke-linecap="round"/>
  ${hose('M80 3Q106-4 109 17', 3.5, K.ink)}<rect x="104" y="16" width="10" height="17" rx="3" fill="${K.navy}" ${S(3)}/>`;
}
function hatGrad() {
  return `<path d="M58 20V36Q80 46 102 36V20Z" fill="${K.navy}" ${S(4)}/>
  <path d="M80 -2L124 14L80 30L36 14Z" fill="${K.ink}" ${S(4)}/>
  <path d="M80 14L116 20V36" fill="none" stroke="${K.sun}" stroke-width="3" stroke-linecap="round"/><circle cx="116" cy="38" r="5" fill="${K.sun}" ${S(2.5)}/>`;
}
function hatCrown() {
  return `<path d="M52 36L52 10L66 22L80 2L94 22L108 10L108 36Q80 44 52 36Z" fill="${K.gold}" ${S(4)}/>
  <circle cx="66" cy="30" r="4" fill="${K.tomato}" ${S(2.5)}/><circle cx="80" cy="32" r="4.5" fill="${K.sky}" ${S(2.5)}/><circle cx="94" cy="30" r="4" fill="${K.leaf}" ${S(2.5)}/>
  <circle cx="52" cy="10" r="3.5" fill="${K.white}" ${S(2.5)}/><circle cx="80" cy="2" r="3.5" fill="${K.white}" ${S(2.5)}/><circle cx="108" cy="10" r="3.5" fill="${K.white}" ${S(2.5)}/>`;
}
function hatChef() {
  return `<circle cx="60" cy="14" r="15" fill="${K.white}" ${S(4)}/><circle cx="100" cy="14" r="15" fill="${K.white}" ${S(4)}/><circle cx="80" cy="4" r="17" fill="${K.white}" ${S(4)}/>
  <rect x="56" y="20" width="48" height="18" rx="5" fill="${K.white}" ${S(4)}/><path d="M66 24V34M80 24V34M94 24V34" stroke="${K.grid}" stroke-width="3" stroke-linecap="round"/>`;
}
function hatParty() {
  return `<path d="M58 36L80 -14L102 36Q80 44 58 36Z" fill="${K.grape}" ${S(4)}/>
  <path d="M66 24L90 22M72 8L86 6M62 34L98 32" stroke="${K.sun}" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="-14" r="7" fill="${K.sun}" ${S(3)}/>`;
}
function hatNemes() {
  return `<path d="M48 44L54 12Q80-4 106 12L112 44L100 44L98 22Q80 14 62 22L60 44Z" fill="${K.sky}" ${S(4)}/>
  <path d="M52 30H64M52 38H62M108 30H96M108 38H98" stroke="${K.gold}" stroke-width="4" stroke-linecap="round"/>
  <path d="M56 22Q80 12 104 22" fill="none" stroke="${K.gold}" stroke-width="6" stroke-linecap="round"/><path d="M80 12V4" stroke="${K.ink}" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="3" r="4" fill="${K.tomato}" ${S(2.5)}/>`;
}
const HAT_ART = { fez: hatFez, grad: hatGrad, crown: hatCrown, chef: hatChef, party: hatParty, nemes: hatNemes };
const hatArt = id => (HAT_ART[id] || hatFez)();
