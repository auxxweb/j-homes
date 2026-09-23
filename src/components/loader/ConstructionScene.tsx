import { LOADER_COLORS as c } from './loaderData'

function Opening({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g data-part="window">
      <rect data-build data-part="glass" x={x} y={y} width={w} height={h} fill={c.glass} stroke="none" />
      <rect data-part="glow" x={x} y={y} width={w} height={h} fill={c.glow} stroke="none" opacity={0} />
      <rect data-draw x={x} y={y} width={w} height={h} />
      <line data-draw x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} />
      <line data-draw x1={x} y1={y + h * 0.42} x2={x + w} y2={y + h * 0.42} />
      <line
        data-tier="fine"
        data-draw
        x1={x + 7}
        y1={y + 8}
        x2={x + w * 0.36}
        y2={y + h * 0.52}
        stroke={c.paper}
      />
    </g>
  )
}

function DesktopHouse() {
  return (
    <svg viewBox="80 150 940 420" className="h-auto w-full" role="presentation" aria-hidden="true">
      <g data-depth="back" id="site">
        <path data-draw data-part="guide" d="M300 158 V528 M716 158 V528" stroke={c.line} />
        <path
          data-tier="fine"
          data-draw
          data-part="guide"
          d="M248 168 H760 M248 168 V160 M760 168 V160"
          stroke={c.line}
        />
        <ellipse data-build data-part="ground-shadow" cx="560" cy="524" rx="310" ry="11" fill="rgba(22,20,18,0.13)" stroke="none" />
        <path data-draw data-part="ground" d="M64 518 H1016" strokeWidth={1.6} />
        <path
          data-draw
          data-part="site-tick"
          d="M120 518 v12 M200 518 v8 M280 518 v12 M880 518 v12 M960 518 v8"
          stroke={c.line}
        />
        <text
          data-build
          data-part="site-label"
          x="96"
          y="496"
          fill={c.line}
          stroke="none"
          fontSize="12"
          fontFamily="Manrope, sans-serif"
          letterSpacing="2.4"
        >
          SITE 01
        </text>
      </g>

      <g data-depth="mid">
        <g id="foundation">
          <path data-draw data-part="foundation-line" d="M268 486 H910 V514 H268 Z" />
          <path data-draw data-part="foundation-line" d="M268 486 L304 468 H946 L910 486" />
          <path data-tier="fine" data-draw data-part="foundation-line" d="M910 486 L946 468 V496 L910 514" />
          <path data-tier="fine" data-draw data-part="foundation-line" d="M390 486 V514 M520 486 V514 M650 486 V514 M780 486 V514" />
          <polygon data-build data-rise data-part="foundation" points="268,486 910,486 910,514 268,514" fill={c.wall} stroke="none" />
          <polygon data-build data-rise data-part="foundation" points="268,486 304,468 946,468 910,486" fill={c.paper} stroke="none" />
          <polygon data-build data-rise data-part="foundation" points="910,486 946,468 946,496 910,514" fill={c.wallSide} stroke="none" />
        </g>

        <g id="walls">
          <polygon data-build data-wipe data-part="wall-left" points="262,354 300,338 300,486 262,502" fill={c.wallSide} stroke={c.ink} strokeWidth={1} />
          <polygon data-build data-wipe data-part="wall-left" points="274,206 312,190 312,338 274,354" fill={c.stone} stroke={c.ink} strokeWidth={1} />
          <rect data-build data-rise data-part="wall-main" x="300" y="356" width="416" height="130" fill={c.wall} stroke={c.ink} strokeWidth={1.1} />
          <rect data-build data-rise data-part="wall-front" x="312" y="206" width="392" height="132" fill={c.wall} stroke={c.ink} strokeWidth={1.1} />
          <polygon data-build data-wipe-right data-part="wall-right" points="716,364 748,348 748,486 716,486" fill={c.wallSide} stroke={c.ink} strokeWidth={1} />
        </g>

        <g id="structure">
          <rect data-build data-rise data-part="column" x="308" y="356" width="14" height="130" fill={c.stone} />
          <rect data-build data-rise data-part="column" x="430" y="356" width="14" height="130" fill={c.stone} />
          <rect data-build data-rise data-part="column" x="552" y="356" width="14" height="130" fill={c.stone} />
          <rect data-build data-rise data-part="column" x="688" y="356" width="14" height="130" fill={c.stone} />
          <rect data-build data-rise data-part="column" x="848" y="372" width="12" height="114" fill={c.stone} />
          <rect data-build data-rise data-part="column-upper" x="320" y="206" width="12" height="132" fill={c.stone} />
          <rect data-build data-rise data-part="column-upper" x="442" y="206" width="12" height="132" fill={c.stone} />
          <rect data-build data-rise data-part="column-upper" x="564" y="206" width="12" height="132" fill={c.stone} />
          <rect data-build data-rise data-part="column-upper" x="680" y="206" width="12" height="132" fill={c.stone} />
        </g>

        <g id="floor">
          <polygon data-build data-wipe data-part="slab" points="286,356 730,356 748,340 304,340" fill={c.stone} stroke="none" />
          <rect data-build data-wipe data-part="slab" x="286" y="348" width="444" height="10" fill={c.stoneDark} stroke="none" />
          <polygon data-build data-wipe data-part="slab-upper" points="300,206 720,206 736,190 316,190" fill={c.stone} stroke="none" />
          <rect data-build data-wipe data-part="slab" x="716" y="364" width="160" height="10" fill={c.stoneDark} stroke="none" />
        </g>

        <g id="roof">
          <path data-draw data-part="roof-line" d="M250 206 H748 L792 164 H294 Z" />
          <path data-draw data-part="roof-line" d="M716 364 H900 L918 348 H734 Z" />
          <polygon data-build data-drop data-part="roof" points="294,164 792,164 748,206 250,206" fill={c.stone} stroke="none" />
          <polygon data-build data-drop data-part="roof" points="250,206 748,206 748,224 250,224" fill={c.wallSide} stroke="none" />
          <polygon data-build data-drop data-part="roof" points="748,206 792,164 792,182 748,224" fill={c.stoneDark} stroke="none" />
          <polygon data-build data-drop data-part="roof" points="734,348 918,348 900,364 716,364" fill={c.stone} stroke="none" />
          <path data-draw data-part="roof-edge" d="M250 224 H748" stroke={c.crimson} strokeWidth={2.25} />
          <path data-draw data-part="roof-edge" d="M716 374 H900" stroke={c.crimson} strokeWidth={1.75} />
        </g>

        <g id="windows">
          <Opening x={346} y={228} w={96} h={72} />
          <Opening x={468} y={228} w={96} h={72} />
          <Opening x={338} y={382} w={128} h={78} />
        </g>

        <g id="doors">
          <g data-part="door">
            <rect data-build data-part="door-fill" x="590" y="236" width="42" height="78" fill={c.glass} stroke="none" />
            <rect data-part="glow" x="590" y="236" width="42" height="78" fill={c.glow} stroke="none" opacity={0} />
            <rect data-draw x="590" y="236" width="42" height="78" />
            <line data-draw x1="611" y1="236" x2="611" y2="314" />
          </g>
          <g data-part="door">
            <rect data-build data-part="door-fill" x="560" y="390" width="52" height="96" fill={c.crimsonDeep} stroke="none" />
            <rect data-draw x="560" y="390" width="52" height="96" />
            <line data-draw x1="586" y1="390" x2="586" y2="486" />
            <line data-tier="fine" data-draw x1="572" y1="442" x2="578" y2="442" stroke={c.paper} />
          </g>
        </g>

        <g id="balcony">
          <rect data-build data-wipe data-part="balcony" x="330" y="328" width="280" height="10" fill={c.stoneDark} stroke="none" />
          <path data-draw data-part="balcony-rail" d="M336 338 V258 H600 V338" />
          <path
            data-tier="fine"
            data-draw
            data-part="balcony-rail"
            d="M354 338 V258 M372 338 V258 M390 338 V258 M408 338 V258 M426 338 V258 M444 338 V258 M462 338 V258 M480 338 V258 M498 338 V258 M516 338 V258 M534 338 V258 M552 338 V258 M570 338 V258"
          />
        </g>

        <g id="stairs">
          <path data-draw data-part="stairs" d="M548 486 H624" />
          <path data-draw data-part="stairs" d="M538 502 H634" />
          <path data-draw data-part="stairs" d="M528 518 H644" />
        </g>

        <g id="details">
          <rect data-build data-part="boundary" x="108" y="534" width="500" height="16" fill={c.wall} stroke={c.ink} strokeWidth={1} />
          <rect data-build data-part="boundary" x="742" y="534" width="220" height="16" fill={c.wall} stroke={c.ink} strokeWidth={1} />
          <path data-draw data-part="gate" d="M608 534 V506 H628 M722 534 V506 H702 M628 512 H702" />
          <polygon data-build data-wipe data-part="drive" points="628,550 722,550 760,518 676,518" fill={c.drive} stroke="none" />
        </g>

        <g id="lighting">
          <circle data-build data-part="fixture" cx="544" cy="404" r="3.5" fill={c.ink} stroke="none" />
          <circle data-build data-part="fixture" cx="820" cy="390" r="3.5" fill={c.ink} stroke="none" />
          <circle data-tier="fine" data-part="glow" cx="544" cy="404" r="10" fill={c.glow} stroke="none" opacity={0} />
          <circle data-tier="fine" data-part="glow" cx="820" cy="390" r="10" fill={c.glow} stroke="none" opacity={0} />
        </g>
      </g>

      <g data-depth="fore" id="landscape">
        <rect data-build data-wipe data-part="grass" x="72" y="516" width="420" height="7" fill={c.leaf} stroke="none" />
        <rect data-build data-wipe data-part="grass" x="760" y="516" width="240" height="7" fill={c.leaf} stroke="none" />
        <g id="plants">
          <ellipse data-build data-rise data-part="plant" cx="210" cy="508" rx="16" ry="10" fill={c.leafLight} stroke="none" />
          <ellipse data-build data-rise data-part="plant" cx="236" cy="512" rx="12" ry="8" fill={c.leaf} stroke="none" />
          <ellipse data-build data-rise data-part="plant" cx="930" cy="510" rx="14" ry="9" fill={c.leaf} stroke="none" />
        </g>
        <g id="trees">
          <g data-build data-rise data-part="tree">
            <line x1="150" y1="518" x2="150" y2="442" stroke={c.trunk} strokeWidth="3" />
            <ellipse cx="136" cy="430" rx="22" ry="28" fill={c.leaf} stroke="none" />
            <ellipse cx="164" cy="418" rx="24" ry="32" fill={c.leafLight} stroke="none" />
            <ellipse cx="148" cy="404" rx="14" ry="16" fill={c.leaf} stroke="none" />
          </g>
          <g data-build data-rise data-part="tree">
            <line x1="970" y1="518" x2="970" y2="448" stroke={c.trunk} strokeWidth="3" />
            <ellipse cx="956" cy="438" rx="20" ry="26" fill={c.leafLight} stroke="none" />
            <ellipse cx="984" cy="426" rx="22" ry="30" fill={c.leaf} stroke="none" />
          </g>
        </g>
      </g>
    </svg>
  )
}

function MobileHouse() {
  return (
    <svg viewBox="40 80 640 560" className="h-auto w-full" role="presentation" aria-hidden="true">
      <g id="site">
        <ellipse data-build data-part="ground-shadow" cx="360" cy="500" rx="180" ry="10" fill="rgba(22,20,18,0.13)" stroke="none" />
        <path data-draw data-part="ground" d="M70 494 H650" strokeWidth={1.7} />
        <text
          data-build
          data-part="site-label"
          x="86"
          y="478"
          fill={c.line}
          stroke="none"
          fontSize="13"
          fontFamily="Manrope, sans-serif"
          letterSpacing="2"
        >
          SITE
        </text>
      </g>

      <g id="foundation">
        <path data-draw data-part="foundation-line" d="M168 458 H552 V490 H168 Z" />
        <polygon data-build data-rise data-part="foundation" points="168,458 552,458 552,490 168,490" fill={c.wall} stroke="none" />
      </g>

      <g id="walls">
        <rect data-build data-wipe data-part="wall-left" x="176" y="300" width="22" height="158" fill={c.wallSide} stroke="none" />
        <rect data-build data-rise data-part="wall-main" x="198" y="318" width="312" height="140" fill={c.wall} stroke="none" />
        <rect data-build data-wipe-right data-part="wall-right" x="510" y="300" width="22" height="158" fill={c.wallSide} stroke="none" />
        <rect data-build data-rise data-part="wall-front" x="210" y="176" width="288" height="124" fill={c.paper} stroke="none" />
      </g>

      <g id="structure">
        <rect data-build data-rise data-part="column" x="206" y="318" width="12" height="140" fill={c.stone} />
        <rect data-build data-rise data-part="column" x="348" y="318" width="12" height="140" fill={c.stone} />
        <rect data-build data-rise data-part="column" x="490" y="318" width="12" height="140" fill={c.stone} />
        <rect data-build data-rise data-part="column-upper" x="218" y="176" width="11" height="124" fill={c.stone} />
        <rect data-build data-rise data-part="column-upper" x="348" y="176" width="11" height="124" fill={c.stone} />
        <rect data-build data-rise data-part="column-upper" x="478" y="176" width="11" height="124" fill={c.stone} />
      </g>

      <g id="floor">
        <rect data-build data-wipe data-part="slab" x="190" y="308" width="340" height="12" fill={c.stoneDark} stroke="none" />
        <rect data-build data-wipe data-part="slab-upper" x="202" y="166" width="312" height="12" fill={c.stone} stroke="none" />
      </g>

      <g id="roof">
        <path data-draw data-part="roof-line" d="M186 166 H530 L548 128 H204 Z" />
        <polygon data-build data-drop data-part="roof" points="204,128 548,128 530,166 186,166" fill={c.stone} stroke="none" />
        <polygon data-build data-drop data-part="roof" points="186,166 530,166 530,182 186,182" fill={c.wallSide} stroke="none" />
        <path data-draw data-part="roof-edge" d="M186 182 H530" stroke={c.crimson} strokeWidth={2.4} />
      </g>

      <g id="windows">
        <Opening x={236} y={196} w={78} h={58} />
        <Opening x={360} y={196} w={78} h={58} />
        <Opening x={230} y={348} w={100} h={72} />
      </g>

      <g id="doors">
        <g data-part="door">
          <rect data-build data-part="door-fill" x="400" y="352" width="48" height="106" fill={c.crimsonDeep} stroke="none" />
          <rect data-draw x="400" y="352" width="48" height="106" />
          <line data-draw x1="424" y1="352" x2="424" y2="458" />
        </g>
      </g>

      <g id="lighting">
        <circle data-build data-part="fixture" cx="384" cy="372" r="3" fill={c.ink} stroke="none" />
        <circle data-part="glow" cx="384" cy="372" r="9" fill={c.glow} stroke="none" opacity={0} />
      </g>

      <g id="landscape">
        <rect data-build data-wipe data-part="grass" x="80" y="492" width="220" height="7" fill={c.leaf} stroke="none" />
        <rect data-build data-wipe data-part="grass" x="420" y="492" width="210" height="7" fill={c.leaf} stroke="none" />
        <g id="plants">
          <ellipse data-build data-rise data-part="plant" cx="140" cy="488" rx="14" ry="8" fill={c.leafLight} stroke="none" />
        </g>
        <g id="trees">
          <g data-build data-rise data-part="tree">
            <line x1="112" y1="494" x2="112" y2="430" stroke={c.trunk} strokeWidth="3" />
            <ellipse cx="100" cy="418" rx="18" ry="24" fill={c.leaf} stroke="none" />
            <ellipse cx="124" cy="408" rx="18" ry="26" fill={c.leafLight} stroke="none" />
          </g>
          <g data-build data-rise data-part="tree">
            <line x1="600" y1="494" x2="600" y2="436" stroke={c.trunk} strokeWidth="3" />
            <ellipse cx="586" cy="424" rx="16" ry="22" fill={c.leafLight} stroke="none" />
            <ellipse cx="612" cy="414" rx="16" ry="24" fill={c.leaf} stroke="none" />
          </g>
        </g>
      </g>
    </svg>
  )
}

export function ConstructionScene({ variant }: { variant: 'desktop' | 'mobile' }) {
  return variant === 'mobile' ? <MobileHouse /> : <DesktopHouse />
}
