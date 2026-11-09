/* The ful cart (kiosk) with a steaming pot. 170 x 130. The steam classes animate in style.css. */
function cartArt() {
  return `<ellipse cx="85" cy="125" rx="58" ry="5" fill="${K.ink}" opacity=".25"/>
  <path class="steam" d="M78 22q-8-8 0-14t0-10" fill="none" stroke="${K.white}" stroke-width="4.5" stroke-linecap="round"/>
  <path class="steam s2" d="M92 22q-8-8 0-14t0-10" fill="none" stroke="${K.white}" stroke-width="4.5" stroke-linecap="round"/>
  <path class="steam s3" d="M106 22q-8-8 0-14t0-10" fill="none" stroke="${K.white}" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M62 40Q62 66 92 66Q122 66 122 40Z" fill="#cfd6df" ${S(4)}/>
  <ellipse cx="92" cy="40" rx="33" ry="10" fill="#e6ebf1" ${S(4)}/><circle cx="92" cy="30" r="5" fill="#cfd6df" ${S(3)}/>
  <rect x="38" y="60" width="108" height="42" rx="7" fill="#f0a030" ${S(4.5)}/>
  <rect x="38" y="60" width="108" height="9" rx="4" fill="#c97a12"/><rect x="38" y="60" width="108" height="42" rx="7" fill="none" ${S(4.5)}/>
  <rect x="62" y="72" width="60" height="25" rx="5" fill="#fff4cf" ${S(3)}/>
  <text x="92" y="92" text-anchor="middle" font-family="Lalezar,Cairo,sans-serif" font-size="23" fill="${K.tomato}" stroke="${K.ink}" stroke-width="1.2">فول</text>
  <path d="M146 76L166 62" fill="none" stroke="${K.ink}" stroke-width="9" stroke-linecap="round"/><path d="M146 76L166 62" fill="none" stroke="${K.owlD}" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M60 102L54 120" fill="none" stroke="${K.ink}" stroke-width="9" stroke-linecap="round"/><path d="M60 102L54 120" fill="none" stroke="${K.owlD}" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="44" cy="104" r="20" fill="#f4e8cc" ${S(4.5)}/><circle cx="44" cy="104" r="5" fill="${K.ink}"/>
  <path d="M44 86V122M26 104H62M31 91L57 117M57 91L31 117" stroke="${K.ink}" stroke-width="2" opacity=".55"/>`;
}
const cartSVG = () => svgDoc('0 0 170 130', cartArt(), 'aria-hidden="true"');
