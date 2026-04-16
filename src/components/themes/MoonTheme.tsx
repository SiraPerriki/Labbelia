import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  rollingHillPath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors } from "../../lib/color";

export function MoonTheme(props: {
  width: number;
  height: number;
  palette: Palette;
  layout: QuestionLayout;
  clipId: string;
  lines: string[];
  seed: number;
  cardId: string;
}) {
  const { width, height, palette, layout, clipId, lines, seed, cardId } = props;
  const skyId = `${cardId}-moon-sky`;
  const panelId = `${cardId}-moon-panel`;
  const moonId = `${cardId}-moon-disc`;
  const saturnId = `${cardId}-moon-saturn`;
  const planetId = `${cardId}-moon-planet`;
  const nebulaAId = `${cardId}-moon-nebula-a`;
  const nebulaBId = `${cardId}-moon-nebula-b`;
  const sceneClip = `${cardId}-moon-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
    const panel = {
    x: layout.x - 0.44,
    y: layout.y - 0.42,
    width: layout.width + 0.88,
    height: layout.height + 0.84,
    rx: Math.max(2.8, layout.rx - 0.45),
  };
  const saturnX = width * 0.18;
  const saturnY = height * 0.22;
  const moonX = width * 0.79;
  const moonY = height * 0.2;
  const farPlanetX = width * 0.47;
  const farPlanetY = height * 0.13;
  const tinyPlanetX = width * 0.61;
  const tinyPlanetY = height * 0.1;
  const galaxyPath = `M -4 ${height * 0.35} C ${width * 0.14} ${height * 0.16}, ${width * 0.32} ${height * 0.48}, ${width * 0.52} ${height * 0.24} S ${width * 0.84} ${height * 0.42}, ${width + 4} ${height * 0.22}`;
  const galaxyPathSoft = `M -4 ${height * 0.41} C ${width * 0.18} ${height * 0.26}, ${width * 0.34} ${height * 0.5}, ${width * 0.56} ${height * 0.32} S ${width * 0.86} ${height * 0.45}, ${width + 4} ${height * 0.29}`;
  const cometPath = `M ${width * 0.79} ${height * 0.28} q ${width * 0.08} -${height * 0.05} ${width * 0.14} -${height * 0.01}`;
  const deepSpace = mixColors("#1d2543", palette.border, 0.18);
  const midSpace = mixColors("#39426c", palette.accent, 0.24);
  const lowSpace = mixColors("#554b75", palette.accent, 0.28);
  const nebulaPink = mixColors("#f1bfd9", palette.accent, 0.14);
  const nebulaLilac = mixColors("#d1c7ff", palette.soft, 0.18);
  const nebulaGold = mixColors("#ffe0a5", palette.pop, 0.12);
  const starlight = mixColors("#fffaf1", palette.paper, 0.04);
  const coolStar = mixColors("#dce6ff", palette.soft, 0.06);
  const ringRose = mixColors("#f5bfd8", palette.accent, 0.14);
  const ringLilac = mixColors("#ddd0ff", palette.soft, 0.16);
  const moonLight = mixColors("#fff3d0", palette.pop, 0.08);
  const moonShade = mixColors(midSpace, "#ece7ff", 0.16);
  const saturnGold = mixColors("#f7c87d", palette.pop, 0.1);
  const saturnShadow = mixColors("#d99f6b", palette.border, 0.1);
  const farPlanet = mixColors("#c7cff6", palette.soft, 0.16);
  const farPlanetShadow = mixColors("#8ba4d2", palette.border, 0.22);
  const tinyPlanet = mixColors("#cbe4dd", palette.soft, 0.12);
  const mountainFar = mixColors("#6d729f", palette.accent, 0.3);
  const mountainMid = mixColors("#505c84", palette.border, 0.24);
  const mountainNear = mixColors("#343f62", palette.border, 0.16);
  const mist = mixColors("#f8f4ff", palette.paper, 0.08);
  const ink = mixColors("#685d76", palette.ink, 0.18);
  const alienMint = mixColors("#b9f0cf", palette.soft, 0.12);
  const ufoBody = mixColors("#f6d6ef", palette.accent, 0.16);
  const ufoShadow = mixColors("#caa5d2", palette.border, 0.16);
  const beamGlow = mixColors("#fff1b8", palette.pop, 0.08);
  const groundGlow = mixColors("#b2b0d8", palette.accent, 0.22);
  const crystalA = mixColors("#d5bfff", palette.accent, 0.12);
  const crystalB = mixColors("#a9d6f3", palette.soft, 0.16);
  const rockTone = mixColors("#6e6c8d", palette.border, 0.22);

  return (
    <g>
      <defs>
        <linearGradient id={skyId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={deepSpace} />
          <stop offset="56%" stopColor={midSpace} />
          <stop offset="100%" stopColor={lowSpace} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffdf9", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#f8f4ff", palette.paper, 0.14)} />
        </linearGradient>
        <radialGradient id={nebulaAId} cx="28%" cy="22%" r="54%">
          <stop offset="0%" stopColor={nebulaPink} stopOpacity="0.68" />
          <stop offset="42%" stopColor={nebulaLilac} stopOpacity="0.28" />
          <stop offset="100%" stopColor={nebulaPink} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={nebulaBId} cx="77%" cy="18%" r="46%">
          <stop offset="0%" stopColor={nebulaGold} stopOpacity="0.54" />
          <stop offset="48%" stopColor={nebulaLilac} stopOpacity="0.18" />
          <stop offset="100%" stopColor={nebulaGold} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={moonId} cx="35%" cy="32%" r="74%">
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="100%" stopColor={moonLight} />
        </radialGradient>
        <linearGradient id={saturnId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={saturnGold} />
          <stop offset="100%" stopColor={saturnShadow} />
        </linearGradient>
        <radialGradient id={planetId} cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor={mixColors("#fdfcff", farPlanet, 0.12)} />
          <stop offset="100%" stopColor={farPlanetShadow} />
        </radialGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.7)}
        opacity="0.14"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${skyId})`} />
        <ellipse
          cx={width * 0.25}
          cy={height * 0.22}
          rx={width * 0.32}
          ry={height * 0.28}
          fill={`url(#${nebulaAId})`}
          opacity="0.78"
        />
        <ellipse
          cx={width * 0.78}
          cy={height * 0.18}
          rx={width * 0.28}
          ry={height * 0.24}
          fill={`url(#${nebulaBId})`}
          opacity="0.74"
        />
        <path
          d={galaxyPath}
          fill="none"
          stroke={ringRose}
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.28"
        />
        <path
          d={galaxyPath}
          fill="none"
          stroke={coolStar}
          strokeWidth="0.78"
          strokeLinecap="round"
          opacity="0.36"
        />
        <path
          d={galaxyPathSoft}
          fill="none"
          stroke={ringLilac}
          strokeWidth="0.92"
          strokeLinecap="round"
          opacity="0.3"
        />
        {Array.from({ length: 14 }).map((_, index) => (
          <circle
            key={`galaxy-dust-${index}`}
            cx={width * (0.08 + index * 0.068) + (seeded(seed, 810 + index) - 0.5) * 1.8}
            cy={height * (0.29 + seeded(seed, 830 + index) * 0.12)}
            r={0.2 + seeded(seed, 850 + index) * 0.22}
            fill={index % 3 === 0 ? nebulaGold : index % 3 === 1 ? starlight : coolStar}
            opacity={0.48 + (index % 2) * 0.14}
          />
        ))}
        <g transform={`translate(${saturnX} ${saturnY}) rotate(-12)`} opacity="0.98">
          <path
            d="M -5.6 0 A 5.6 1.52 0 0 1 5.6 0"
            fill="none"
            stroke={ringRose}
            strokeWidth="0.64"
            opacity="0.72"
          />
          <path
            d="M -4.52 0 A 4.52 1.14 0 0 1 4.52 0"
            fill="none"
            stroke={coolStar}
            strokeWidth="0.32"
            opacity="0.6"
          />
          <circle cx="0" cy="0" r="2.3" fill={`url(#${saturnId})`} />
          <path
            d="M -1.9 -0.92 q 1.5 -0.56 3.16 0"
            fill="none"
            stroke={mixColors("#fff6df", saturnGold, 0.16)}
            strokeWidth="0.22"
            strokeLinecap="round"
            opacity="0.64"
          />
          <path
            d="M -2.02 0.08 q 1.6 0.44 3.32 0"
            fill="none"
            stroke={mixColors(saturnShadow, deepSpace, 0.14)}
            strokeWidth="0.18"
            strokeLinecap="round"
            opacity="0.48"
          />
          <path
            d="M -5.6 0 A 5.6 1.52 0 0 0 5.6 0"
            fill="none"
            stroke={ringRose}
            strokeWidth="0.64"
          />
          <path
            d="M -4.52 0 A 4.52 1.14 0 0 0 4.52 0"
            fill="none"
            stroke={coolStar}
            strokeWidth="0.32"
            opacity="0.72"
          />
        </g>
        <g transform={`translate(${farPlanetX} ${farPlanetY}) rotate(14)`} opacity="0.94">
          <circle cx="0" cy="0" r="1.62" fill={`url(#${planetId})`} />
          <ellipse
            cx="0"
            cy="0"
            rx="2.9"
            ry="0.72"
            fill="none"
            stroke={ringLilac}
            strokeWidth="0.28"
            opacity="0.74"
          />
        </g>
        <g transform={`translate(${tinyPlanetX} ${tinyPlanetY})`} opacity="0.82">
          <circle cx="0" cy="0" r="0.8" fill={tinyPlanet} />
          <circle
            cx="-0.18"
            cy="-0.18"
            r="0.16"
            fill={mixColors("#fffefe", tinyPlanet, 0.18)}
            opacity="0.72"
          />
        </g>
        <g opacity="0.98">
          <circle cx={moonX} cy={moonY} r="6.9" fill={nebulaGold} opacity="0.16" />
          <circle cx={moonX} cy={moonY} r="5.04" fill={`url(#${moonId})`} />
          <circle cx={moonX + 2.24} cy={moonY + 0.12} r="4.56" fill={moonShade} />
          <circle
            cx={moonX - 1.24}
            cy={moonY - 1.06}
            r="0.24"
            fill={mixColors("#fffdf7", moonLight, 0.08)}
            opacity="0.72"
          />
          <circle
            cx={moonX - 1.72}
            cy={moonY + 0.94}
            r="0.34"
            fill={mixColors(moonShade, moonLight, 0.24)}
            opacity="0.34"
          />
          <circle
            cx={moonX - 0.44}
            cy={moonY + 1.46}
            r="0.2"
            fill={mixColors(moonShade, moonLight, 0.18)}
            opacity="0.26"
          />
        </g>
        {Array.from({ length: 30 }).map((_, index) => {
          const starX = 5 + seeded(seed, 900 + index) * (width - 10);
          const starY = 3.2 + seeded(seed, 930 + index) * (height * 0.58);
          const outer = 0.42 + seeded(seed, 960 + index) * 0.88;
          const inner = outer * 0.36;

          if (index % 6 === 0) {
            return (
              <path
                key={`moon-star-${index}`}
                d={sparklePath(starX, starY, outer + 0.24, inner)}
                fill={nebulaGold}
                opacity="0.88"
              />
            );
          }

          if (index % 4 === 0) {
            return (
              <path
                key={`moon-star-${index}`}
                d={sparklePath(starX, starY, outer, inner * 0.9)}
                fill={coolStar}
                opacity="0.76"
              />
            );
          }

          return (
            <circle
              key={`moon-star-${index}`}
              cx={starX}
              cy={starY}
              r={outer * 0.36}
              fill={index % 2 === 0 ? starlight : coolStar}
              opacity={0.56 + (index % 3) * 0.12}
            />
          );
        })}
        <g opacity="0.42">
          <path
            d={`M ${width * 0.1} ${height * 0.17} L ${width * 0.16} ${height * 0.11} L ${width * 0.22} ${height * 0.15} L ${width * 0.29} ${height * 0.09}`}
            fill="none"
            stroke={coolStar}
            strokeWidth="0.22"
            strokeLinecap="round"
          />
          {[0.1, 0.16, 0.22, 0.29].map((anchor, index) => (
            <circle
              key={`moon-constellation-${index}`}
              cx={width * anchor}
              cy={height * ([0.17, 0.11, 0.15, 0.09][index] as number)}
              r={index === 1 ? 0.4 : 0.28}
              fill={index % 2 === 0 ? starlight : nebulaGold}
            />
          ))}
        </g>
        <path
          d={cometPath}
          fill="none"
          stroke={nebulaGold}
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.72"
        />
        <circle cx={width * 0.79} cy={height * 0.28} r="0.34" fill={starlight} opacity="0.9" />
        <path
          d={`M -3 ${height * 0.78} L ${width * 0.08} ${height * 0.58} L ${width * 0.18} ${height * 0.78} L ${width * 0.3} ${height * 0.54} L ${width * 0.43} ${height * 0.78} L ${width * 0.59} ${height * 0.57} L ${width * 0.74} ${height * 0.78} L ${width * 0.9} ${height * 0.61} L ${width + 3} ${height * 0.78} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainFar}
          opacity="0.44"
        />
        <path
          d={`M -3 ${height * 0.84} L ${width * 0.14} ${height * 0.7} L ${width * 0.26} ${height * 0.84} L ${width * 0.42} ${height * 0.64} L ${width * 0.56} ${height * 0.84} L ${width * 0.72} ${height * 0.68} L ${width * 0.88} ${height * 0.84} L ${width + 3} ${height * 0.72} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainMid}
          opacity="0.48"
        />
        <path
          d={rollingHillPath(width, height, height * 0.9, height * 0.06, seed, 100)}
          fill={mountainNear}
          opacity="0.72"
        />
        <path
          d={rollingHillPath(width, height, height * 0.94, height * 0.04, seed, 120)}
          fill={mist}
          opacity="0.14"
        />
        <path
          d={`M -3 ${height * 0.9} C ${width * 0.08} ${height * 0.87}, ${width * 0.18} ${height * 0.93}, ${width * 0.3} ${height * 0.88} S ${width * 0.58} ${height * 0.93}, ${width * 0.74} ${height * 0.88} S ${width * 0.92} ${height * 0.91}, ${width + 3} ${height * 0.87} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={groundGlow}
          opacity="0.18"
        />
        <g opacity="0.66">
          <ellipse
            cx={width * 0.25}
            cy={height * 0.89}
            rx={width * 0.12}
            ry={height * 0.028}
            fill={mixColors(rockTone, mist, 0.22)}
          />
          <ellipse
            cx={width * 0.72}
            cy={height * 0.87}
            rx={width * 0.09}
            ry={height * 0.022}
            fill={mixColors(rockTone, mist, 0.18)}
            opacity="0.78"
          />
          <ellipse
            cx={width * 0.48}
            cy={height * 0.91}
            rx={width * 0.14}
            ry={height * 0.026}
            fill={mixColors(mountainNear, mist, 0.18)}
            opacity="0.54"
          />
        </g>
        <g opacity="0.74">
          <path
            d={`M ${width * 0.08} ${height * 0.7} q ${width * 0.08} -${height * 0.025} ${width * 0.18} 0 q ${width * 0.08} ${height * 0.022} ${width * 0.16} -${height * 0.006}`}
            fill="none"
            stroke={ringLilac}
            strokeWidth="0.34"
            strokeLinecap="round"
          />
          <path
            d={`M ${width * 0.67} ${height * 0.76} q ${width * 0.06} -${height * 0.02} ${width * 0.13} 0`}
            fill="none"
            stroke={nebulaGold}
            strokeWidth="0.32"
            strokeLinecap="round"
          />
          <g transform={`translate(${width * 0.83} ${height * 0.74}) rotate(14)`} opacity="0.88">
            <circle cx="0" cy="0" r="1.26" fill={mixColors("#f3e7ff", farPlanet, 0.16)} />
            <ellipse
              cx="0"
              cy="0"
              rx="2.14"
              ry="0.5"
              fill="none"
              stroke={coolStar}
              strokeWidth="0.22"
              opacity="0.76"
            />
          </g>
          <g transform={`translate(${width * 0.36} ${height * 0.82})`} opacity="0.74">
            <path d={sparklePath(0, 0, 0.82, 0.3)} fill={nebulaGold} />
            <path d={sparklePath(2.2, -0.7, 0.56, 0.2)} fill={coolStar} opacity="0.86" />
            <circle cx="-1.7" cy="-0.5" r="0.24" fill={starlight} />
          </g>
          {Array.from({ length: 8 }).map((_, index) => (
            <circle
              key={`lower-dust-${index}`}
              cx={width * (0.08 + seeded(seed, 1200 + index) * 0.84)}
              cy={height * (0.66 + seeded(seed, 1220 + index) * 0.22)}
              r={0.18 + seeded(seed, 1240 + index) * 0.2}
              fill={index % 3 === 0 ? nebulaGold : index % 3 === 1 ? starlight : coolStar}
              opacity={0.42 + (index % 2) * 0.16}
            />
          ))}
        </g>
        <g transform={`translate(${width * 0.2} ${height * 0.79}) rotate(-6)`} opacity="0.96">
          <path
            d={`M -1.1 0 L 1.1 0 L 3.2 ${height * 0.11} L -3.2 ${height * 0.11} Z`}
            fill={beamGlow}
            opacity="0.18"
          />
          <ellipse cx="0" cy={height * 0.09} rx="2.55" ry="0.44" fill={beamGlow} opacity="0.12" />
          <ellipse cx="0" cy="0.9" rx="3.48" ry="1.18" fill={ufoBody} />
          <ellipse
            cx="0"
            cy="1.08"
            rx="3.48"
            ry="1.18"
            fill="none"
            stroke={ufoShadow}
            strokeWidth="0.22"
            opacity="0.78"
          />
          <ellipse
            cx="0"
            cy="-0.08"
            rx="1.58"
            ry="1.14"
            fill={mixColors("#f7fbff", palette.paper, 0.08)}
            opacity="0.88"
          />
          <ellipse
            cx="0"
            cy="-0.18"
            rx="1.2"
            ry="0.86"
            fill={mixColors("#edf8ff", palette.paper, 0.12)}
            opacity="0.72"
          />
          <circle cx="0" cy="-0.46" r="0.52" fill={alienMint} />
          <ellipse
            cx="-0.52"
            cy="-0.94"
            rx="0.18"
            ry="0.48"
            fill={alienMint}
            transform="rotate(-28 -0.52 -0.94)"
          />
          <ellipse
            cx="0.52"
            cy="-0.94"
            rx="0.18"
            ry="0.48"
            fill={alienMint}
            transform="rotate(28 0.52 -0.94)"
          />
          <circle
            cx="-0.18"
            cy="-0.48"
            r="0.06"
            fill={mixColors("#2b3147", palette.border, 0.18)}
          />
          <circle cx="0.18" cy="-0.48" r="0.06" fill={mixColors("#2b3147", palette.border, 0.18)} />
          <path
            d="M -0.16 -0.2 q 0.16 0.12 0.32 0"
            fill="none"
            stroke={mixColors("#2b3147", palette.border, 0.22)}
            strokeWidth="0.08"
            strokeLinecap="round"
          />
          {[-2.2, -0.9, 0.45, 1.9].map((lightX, index) => (
            <circle
              key={`ufo-light-${index}`}
              cx={lightX}
              cy="1.38"
              r="0.16"
              fill={index % 2 === 0 ? nebulaGold : coolStar}
              opacity="0.92"
            />
          ))}
        </g>
        <g opacity="0.76">
          <g transform={`translate(${width * 0.12} ${height * 0.88}) rotate(-8)`}>
            <path d="M 0 0 L 0.8 -2.4 L 1.58 -0.08 Z" fill={crystalA} opacity="0.82" />
            <path d="M 1.1 0.1 L 2.02 -1.72 L 2.72 0.18 Z" fill={crystalB} opacity="0.74" />
          </g>
          <g transform={`translate(${width * 0.83} ${height * 0.9}) rotate(7)`}>
            <path d="M 0 0 L 0.88 -2.2 L 1.64 0.02 Z" fill={crystalB} opacity="0.8" />
            <path d="M -0.72 0.06 L -0.08 -1.38 L 0.38 0.14 Z" fill={crystalA} opacity="0.68" />
          </g>
          <g transform={`translate(${width * 0.56} ${height * 0.89})`} opacity="0.72">
            <ellipse cx="0" cy="0" rx="1.4" ry="0.56" fill={rockTone} />
            <ellipse
              cx="0.44"
              cy="-0.12"
              rx="0.72"
              ry="0.24"
              fill={mixColors(rockTone, mist, 0.2)}
              opacity="0.74"
            />
          </g>
          <path
            d={`M ${width * 0.24} ${height * 0.86} q ${width * 0.04} -${height * 0.018} ${width * 0.09} 0`}
            fill="none"
            stroke={coolStar}
            strokeWidth="0.22"
            strokeLinecap="round"
          />
          <path
            d={`M ${width * 0.54} ${height * 0.84} q ${width * 0.03} -${height * 0.012} ${width * 0.07} 0`}
            fill="none"
            stroke={ringRose}
            strokeWidth="0.2"
            strokeLinecap="round"
          />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="0.24" />
      <rect
        x={panel.x + 0.35}
        y={panel.y + 0.45}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={mixColors(palette.border, deepSpace, 0.74)}
        opacity="0.1"
      />
      <rect
        x={panel.x}
        y={panel.y}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={mixColors(palette.border, palette.paper, 0.18)}
        strokeWidth="0.18"
      />
      <path
        d={`M ${panel.x + panel.width * 0.12} ${panel.y - 1.14} q ${panel.width * 0.12} -1.8 ${panel.width * 0.24} 0`}
        fill="none"
        stroke={ringLilac}
        strokeWidth="0.18"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        d={`M ${panel.x + panel.width * 0.72} ${panel.y + panel.height + 0.9} q ${panel.width * 0.09} 1.28 ${panel.width * 0.2} 0`}
        fill="none"
        stroke={nebulaGold}
        strokeWidth="0.3"
        strokeLinecap="round"
        opacity="0.64"
      />
      <QuestionText clipId={clipId} layout={layout} ink={ink} lines={lines} />
    </g>
  );
}
