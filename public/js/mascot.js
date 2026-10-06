// น้องจก — the gecko in rubber boots. Pure SVG so it stays crisp at any size
// and can be rasterised onto share cards.

const OL = '#3D2B1F';
const SKIN = '#79C24A';
const SPOT = '#A8DD72';

const FACES = {
  happy: `
    <circle cx="43" cy="33" r="10.5" fill="#fff" stroke="${OL}" stroke-width="2"/>
    <circle cx="77" cy="33" r="10.5" fill="#fff" stroke="${OL}" stroke-width="2"/>
    <circle cx="45" cy="35" r="6" fill="#2B1D14"/><circle cx="79" cy="35" r="6" fill="#2B1D14"/>
    <circle cx="43" cy="32.5" r="2.2" fill="#fff"/><circle cx="77" cy="32.5" r="2.2" fill="#fff"/>
    <path d="M50 60 Q60 69 70 60" fill="none" stroke="${OL}" stroke-width="2.6" stroke-linecap="round"/>`,
  cheer: `
    <path d="M35 36 Q43 26 51 36M69 36 Q77 26 85 36" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
    <path d="M47 57 Q60 76 73 57 Z" fill="#7A2E2E" stroke="${OL}" stroke-width="2.4" stroke-linejoin="round"/>
    <ellipse cx="60" cy="66" rx="5.5" ry="3" fill="#FF8A8A"/>`,
  oops: `
    <circle cx="43" cy="33" r="10.5" fill="#fff" stroke="${OL}" stroke-width="2"/>
    <circle cx="77" cy="33" r="10.5" fill="#fff" stroke="${OL}" stroke-width="2"/>
    <circle cx="42" cy="37" r="5.5" fill="#2B1D14"/><circle cx="76" cy="37" r="5.5" fill="#2B1D14"/>
    <circle cx="40.5" cy="35" r="1.8" fill="#fff"/><circle cx="74.5" cy="35" r="1.8" fill="#fff"/>
    <path d="M33 23 L49 18M87 23 L71 18" stroke="${OL}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M51 63 Q55.5 59 60 63 Q64.5 67 69 63" fill="none" stroke="${OL}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M95 22 Q100.5 31 95 35.5 Q89.5 31 95 22 Z" fill="#7CC8F2" stroke="${OL}" stroke-width="1.6"/>`,
  wow: `
    <circle cx="43" cy="33" r="11" fill="#fff" stroke="${OL}" stroke-width="2"/>
    <circle cx="77" cy="33" r="11" fill="#fff" stroke="${OL}" stroke-width="2"/>
    <circle cx="43" cy="33" r="4" fill="#2B1D14"/><circle cx="77" cy="33" r="4" fill="#2B1D14"/>
    <ellipse cx="60" cy="63" rx="5" ry="6" fill="#7A2E2E" stroke="${OL}" stroke-width="2.2"/>`,
  think: `
    <circle cx="43" cy="33" r="10.5" fill="#fff" stroke="${OL}" stroke-width="2"/>
    <circle cx="77" cy="33" r="10.5" fill="#fff" stroke="${OL}" stroke-width="2"/>
    <circle cx="47" cy="30" r="5.5" fill="#2B1D14"/><circle cx="81" cy="30" r="5.5" fill="#2B1D14"/>
    <circle cx="45.5" cy="28" r="1.8" fill="#fff"/><circle cx="79.5" cy="28" r="1.8" fill="#fff"/>
    <path d="M70 17 Q78 13 86 17" fill="none" stroke="${OL}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M53 62 Q61 60 68 62" fill="none" stroke="${OL}" stroke-width="2.4" stroke-linecap="round"/>`,
};

const ARMS = {
  down: `
    <ellipse cx="38" cy="93" rx="6" ry="10.5" transform="rotate(22 38 93)" fill="${SKIN}" stroke="${OL}" stroke-width="2.4"/>
    <ellipse cx="82" cy="93" rx="6" ry="10.5" transform="rotate(-22 82 93)" fill="${SKIN}" stroke="${OL}" stroke-width="2.4"/>
    <circle cx="33" cy="102" r="2.4" fill="${SPOT}" stroke="${OL}" stroke-width="1.4"/>
    <circle cx="87" cy="102" r="2.4" fill="${SPOT}" stroke="${OL}" stroke-width="1.4"/>`,
  up: `
    <ellipse cx="31" cy="72" rx="6" ry="11" transform="rotate(-38 31 72)" fill="${SKIN}" stroke="${OL}" stroke-width="2.4"/>
    <ellipse cx="89" cy="72" rx="6" ry="11" transform="rotate(38 89 72)" fill="${SKIN}" stroke="${OL}" stroke-width="2.4"/>
    <circle cx="24" cy="63" r="2.6" fill="${SPOT}" stroke="${OL}" stroke-width="1.4"/>
    <circle cx="96" cy="63" r="2.6" fill="${SPOT}" stroke="${OL}" stroke-width="1.4"/>`,
};

// Small accessories per mode: a rain hood before the flood, a torch after.
const PROPS = {
  none: '',
  hood: `
    <path d="M24 44 Q24 6 60 6 Q96 6 96 44 L90 46 Q88 18 60 18 Q32 18 30 46 Z" fill="#2E9BDB" stroke="${OL}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M44 9 Q60 4 76 9" fill="none" stroke="#8FD0F5" stroke-width="2.4" stroke-linecap="round"/>`,
  torch: `
    <g transform="rotate(28 30 101)">
      <rect x="10" y="96" width="22" height="11" rx="3" fill="#FFC83D" stroke="${OL}" stroke-width="2.2"/>
      <rect x="4" y="94" width="7" height="15" rx="2" fill="#FFF3C4" stroke="${OL}" stroke-width="2.2"/>
    </g>`,
};

export function geckoSVG({ face = 'happy', arms, prop = 'none', title = '' } = {}) {
  arms = arms || (face === 'cheer' ? 'up' : 'down');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 130" class="gecko-svg"${title ? ` role="img" aria-label="${title}"` : ' aria-hidden="true"'}>
  <path d="M74 101 C96 106 113 93 108 77 C105 67 94 69 97 78" fill="none" stroke="${OL}" stroke-width="13" stroke-linecap="round"/>
  <path d="M74 101 C96 106 113 93 108 77 C105 67 94 69 97 78" fill="none" stroke="${SKIN}" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="60" cy="93" rx="23" ry="20" fill="${SKIN}" stroke="${OL}" stroke-width="2.6"/>
  <ellipse cx="60" cy="97" rx="14" ry="13" fill="#E7F6C5"/>
  <circle cx="47" cy="84" r="2.2" fill="${SPOT}"/><circle cx="73" cy="83" r="1.8" fill="${SPOT}"/>
  <g class="gk-boots">
    <rect x="40" y="103" width="17" height="19" rx="5" fill="#FFC83D" stroke="${OL}" stroke-width="2.4"/>
    <rect x="63" y="103" width="17" height="19" rx="5" fill="#FFC83D" stroke="${OL}" stroke-width="2.4"/>
    <rect x="38" y="117" width="21" height="7" rx="3.5" fill="#D99A12" stroke="${OL}" stroke-width="2.2"/>
    <rect x="61" y="117" width="21" height="7" rx="3.5" fill="#D99A12" stroke="${OL}" stroke-width="2.2"/>
    <rect x="41" y="102" width="15" height="5" rx="2.5" fill="#FFE08A" stroke="${OL}" stroke-width="1.8"/>
    <rect x="64" y="102" width="15" height="5" rx="2.5" fill="#FFE08A" stroke="${OL}" stroke-width="1.8"/>
  </g>
  <g class="gk-arms">${ARMS[arms] || ARMS.down}</g>
  <circle cx="43" cy="32" r="14" fill="${SKIN}" stroke="${OL}" stroke-width="2.6"/>
  <circle cx="77" cy="32" r="14" fill="${SKIN}" stroke="${OL}" stroke-width="2.6"/>
  <ellipse cx="60" cy="51" rx="38" ry="30" fill="${SKIN}" stroke="${OL}" stroke-width="2.6"/>
  <path d="M30 38 Q60 27 90 38" fill="none" stroke="${SKIN}" stroke-width="7"/>
  <circle cx="60" cy="27" r="3.2" fill="${SPOT}"/><circle cx="51" cy="25" r="1.9" fill="${SPOT}"/><circle cx="69" cy="25" r="2.3" fill="${SPOT}"/>
  <ellipse cx="33" cy="59" rx="6.5" ry="4" fill="#FF9F9F" opacity=".75"/>
  <ellipse cx="87" cy="59" rx="6.5" ry="4" fill="#FF9F9F" opacity=".75"/>
  <circle cx="55.5" cy="51" r="1.3" fill="${OL}"/><circle cx="64.5" cy="51" r="1.3" fill="${OL}"/>
  <g class="gk-prop">${PROPS[prop] || ''}</g>
  <g class="gk-face">${FACES[face] || FACES.happy}</g>
</svg>`;
}

// Live mascot element with expression changes and little hops.
export class Gecko {
  constructor(host, { prop = 'none', title = '' } = {}) {
    this.host = host;
    this.prop = prop;
    host.innerHTML = geckoSVG({ prop, title });
    this.svg = host.querySelector('svg');
    this.timer = 0;
  }

  setProp(prop) {
    this.prop = prop;
    const g = this.svg.querySelector('.gk-prop');
    if (g) g.innerHTML = PROPS[prop] || '';
  }

  set(face = 'happy', { arms, hold = 0, anim } = {}) {
    clearTimeout(this.timer);
    this.svg.querySelector('.gk-face').innerHTML = FACES[face] || FACES.happy;
    const armsMode = arms || (face === 'cheer' ? 'up' : 'down');
    this.svg.querySelector('.gk-arms').innerHTML = ARMS[armsMode];
    if (anim) {
      this.host.classList.remove('hop', 'wobble', 'nod');
      void this.host.offsetWidth; // restart the CSS animation
      this.host.classList.add(anim);
    }
    if (hold) this.timer = setTimeout(() => this.set('happy'), hold);
  }
}
