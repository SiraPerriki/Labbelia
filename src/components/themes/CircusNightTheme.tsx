import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  ticketPath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function CircusNightTheme(props: {
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
  const outerId = `${cardId}-circus-outer`;
  const panelId = `${cardId}-circus-panel`;
  const curtainId = `${cardId}-circus-curtain`;
  const tentId = `${cardId}-circus-tent`;
  const lightId = `${cardId}-circus-light`;
  const sceneClip = `${cardId}-circus-scene`;
  const outerPath = ticketPath(1.2, 1.2, width - 2.4, height - 2.4, 5.8, 2.2);
    const panel = {
    x: layout.x - 0.44,
    y: layout.y - 0.4,
    width: layout.width + 0.88,
    height: layout.height + 0.8,
    rx: Math.max(2.8, layout.rx - 0.42),
  };
  const hueDrift = (seeded(seed, 5200) - 0.5) * 52;
  const skyTop = enrichColor(mixColors(palette.border, palette.accent, 0.2), {
    hueShift: hueDrift - 18,
    saturationMult: 1.34,
    lightnessShift: -0.16,
  });
  const skyMid = enrichColor(mixColors(palette.accent, palette.soft, 0.22), {
    hueShift: hueDrift + 4,
    saturationMult: 1.42,
    lightnessShift: -0.08,
  });
  const skyLow = enrichColor(mixColors(palette.pop, palette.accent, 0.24), {
    hueShift: hueDrift + 18,
    saturationMult: 1.28,
    lightnessShift: -0.04,
  });
  const curtain = enrichColor(mixColors(palette.accent, palette.border, 0.2), {
    hueShift: hueDrift - 6,
    saturationMult: 1.54,
    lightnessShift: -0.1,
  });
  const curtainShade = enrichColor(mixColors(curtain, palette.border, 0.44), {
    saturationMult: 1.16,
    lightnessShift: -0.14,
  });
  const gold = enrichColor(mixColors(palette.pop, "#ffd564", 0.22), {
    saturationMult: 1.34,
    lightnessShift: -0.02,
  });
  const tentPink = enrichColor(mixColors(palette.accent, palette.paper, 0.14), {
    hueShift: 6 + seeded(seed, 5204) * 20,
    saturationMult: 1.42,
    lightnessShift: -0.02,
  });
  const tentCream = enrichColor(mixColors(palette.soft, palette.paper, 0.08), {
    hueShift: -10 + seeded(seed, 5206) * 16,
    saturationMult: 1.18,
    lightnessShift: 0.05,
  });
  const stage = enrichColor(mixColors(palette.border, palette.accent, 0.34), {
    hueShift: hueDrift - 10,
    saturationMult: 1.18,
    lightnessShift: -0.18,
  });
  const stageDark = enrichColor(mixColors(stage, curtainShade, 0.38), {
    saturationMult: 1.08,
    lightnessShift: -0.1,
  });
  const lineSoft = mixColors(palette.paper, curtain, 0.22);
  const flagPalette = [
    tentPink,
    gold,
    enrichColor(mixColors(palette.soft, palette.paper, 0.12), {
      hueShift: -24 + seeded(seed, 5210) * 40,
      saturationMult: 1.24,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(palette.border, palette.pop, 0.14), {
      hueShift: 12 + seeded(seed, 5212) * 34,
      saturationMult: 1.3,
      lightnessShift: -0.04,
    }),
    enrichColor(mixColors(palette.accent, palette.pop, 0.34), {
      hueShift: -8 + seeded(seed, 5214) * 28,
      saturationMult: 1.26,
      lightnessShift: -0.02,
    }),
  ];
  const tentStripePalette = [
    enrichColor(mixColors(tentPink, palette.border, 0.1), {
      saturationMult: 1.2,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(gold, palette.paper, 0.2), {
      saturationMult: 1.16,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors(palette.soft, palette.paper, 0.08), {
      hueShift: -18 + seeded(seed, 5216) * 32,
      saturationMult: 1.2,
      lightnessShift: 0.02,
    }),
  ];
  const bulbPalette = [
    gold,
    tentPink,
    enrichColor(mixColors(palette.soft, palette.paper, 0.08), {
      hueShift: -22 + seeded(seed, 5218) * 34,
      saturationMult: 1.26,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors(palette.border, palette.pop, 0.12), {
      hueShift: 10 + seeded(seed, 5220) * 30,
      saturationMult: 1.24,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors(palette.accent, palette.pop, 0.44), {
      hueShift: -6 + seeded(seed, 5222) * 24,
      saturationMult: 1.22,
      lightnessShift: -0.01,
    }),
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="56%" stopColor={skyMid} />
          <stop offset="100%" stopColor={skyLow} />
        </linearGradient>
        <linearGradient id={curtainId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={curtainShade} />
          <stop offset="48%" stopColor={curtain} />
          <stop offset="100%" stopColor={mixColors(curtain, "#d88ba7", 0.22)} />
        </linearGradient>
        <linearGradient id={tentId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={tentCream} />
          <stop offset="100%" stopColor={tentPink} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefc", palette.paper, 0.04)} />
          <stop offset="100%" stopColor={mixColors("#fff7fb", palette.paper, 0.12)} />
        </linearGradient>
        <radialGradient id={lightId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={mixColors("#fff7d5", gold, 0.06)} />
          <stop offset="100%" stopColor={mixColors(gold, palette.paper, 0.34)} />
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
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <path
          d={`M 0 0 H ${width * 0.18} Q ${width * 0.14} ${height * 0.16} ${width * 0.18} ${height * 0.34} Q ${width * 0.13} ${height * 0.52} ${width * 0.18} ${height * 0.72} L 0 ${height} Z`}
          fill={`url(#${curtainId})`}
          opacity="0.88"
        />
        <path
          d={`M ${width} 0 H ${width * 0.82} Q ${width * 0.86} ${height * 0.16} ${width * 0.82} ${height * 0.34} Q ${width * 0.87} ${height * 0.52} ${width * 0.82} ${height * 0.72} L ${width} ${height} Z`}
          fill={`url(#${curtainId})`}
          opacity="0.88"
        />
        <path
          d={`M 0 ${height * 0.84} C ${width * 0.2} ${height * 0.76}, ${width * 0.4} ${height * 0.9}, ${width * 0.56} ${height * 0.82} S ${width * 0.86} ${height * 0.9}, ${width} ${height * 0.8} L ${width} ${height} H 0 Z`}
          fill={stage}
          opacity="0.62"
        />
        <path
          d={`M 0 ${height * 0.9} C ${width * 0.18} ${height * 0.85}, ${width * 0.38} ${height * 0.94}, ${width * 0.58} ${height * 0.88} S ${width * 0.86} ${height * 0.95}, ${width} ${height * 0.9} L ${width} ${height} H 0 Z`}
          fill={stageDark}
          opacity="0.42"
        />
        {Array.from({ length: 4 }).map((_, index) => (
          <path
            key={`circus-curtain-fold-left-${index}`}
            d={`M ${width * (0.04 + index * 0.03)} ${height * 0.02} Q ${width * (0.015 + index * 0.03)} ${height * 0.24} ${width * (0.04 + index * 0.03)} ${height * 0.5}`}
            fill="none"
            stroke={mixColors(curtainShade, palette.paper, 0.16)}
            strokeWidth="0.26"
            opacity="0.34"
          />
        ))}
        {Array.from({ length: 4 }).map((_, index) => (
          <path
            key={`circus-curtain-fold-right-${index}`}
            d={`M ${width * (0.96 - index * 0.03)} ${height * 0.02} Q ${width * (0.985 - index * 0.03)} ${height * 0.24} ${width * (0.96 - index * 0.03)} ${height * 0.5}`}
            fill="none"
            stroke={mixColors(curtainShade, palette.paper, 0.16)}
            strokeWidth="0.26"
            opacity="0.34"
          />
        ))}
        <g opacity="0.92">
          {Array.from({ length: 10 }).map((_, index) => {
            const x = 7 + index * ((width - 14) / 9);
            const y = height * 0.13 + Math.sin(index * 0.55) * 0.24;
            return (
              <g key={`circus-flag-${index}`}>
                <path
                  d={`M ${x} ${y - 1.2} L ${x} ${y + 0.12}`}
                  fill="none"
                  stroke={mixColors(gold, palette.paper, 0.12)}
                  strokeWidth="0.18"
                  opacity="0.84"
                />
                <path
                  d={`M ${x - 1.2} ${y + 0.1} L ${x} ${y + 2.2} L ${x + 1.2} ${y + 0.1} Z`}
                  fill={flagPalette[index % flagPalette.length] ?? tentPink}
                  opacity="0.94"
                />
              </g>
            );
          })}
        </g>
        {[
          { x: width * 0.18, y: height * 0.9, scale: 0.62 },
          { x: width * 0.38, y: height * 0.885, scale: 0.8 },
          { x: width * 0.61, y: height * 0.895, scale: 0.7 },
          { x: width * 0.81, y: height * 0.905, scale: 0.56 },
        ].map((tent, tentIndex) => {
          const tentWidth = width * 0.11 * tent.scale;
          const tentHeight = height * 0.15 * tent.scale;
          return (
            <g key={`circus-mini-tent-${tentIndex}`} transform={`translate(${tent.x} ${tent.y})`}>
              <path
                d={`M -${tentWidth} 0 L 0 -${tentHeight} L ${tentWidth} 0 Z`}
                fill={`url(#${tentId})`}
                opacity="0.96"
              />
              {[-1, 0, 1].map((offset, index) => (
                <path
                  key={`circus-mini-tent-stripe-${tentIndex}-${index}`}
                  d={`M ${offset * tentWidth * 0.42} 0 L ${offset * tentWidth * 0.18} -${tentHeight} L ${offset * tentWidth * 0.18 + tentWidth * 0.22} -${tentHeight} L ${offset * tentWidth * 0.42 + tentWidth * 0.34} 0 Z`}
                  fill={
                    tentStripePalette[(tentIndex + index) % tentStripePalette.length] ?? tentPink
                  }
                  opacity="0.94"
                />
              ))}
              <path
                d={`M 0 -${tentHeight} L 0 -${tentHeight * 1.18}`}
                stroke={mixColors(gold, palette.paper, 0.08)}
                strokeWidth="0.22"
                strokeLinecap="round"
              />
              <path
                d={`M -${tentWidth * 0.12} -${tentHeight * 1.18} L 0 -${tentHeight * 1.28} L ${tentWidth * 0.12} -${tentHeight * 1.18} Z`}
                fill={gold}
              />
              <rect
                x={-tentWidth * 0.16}
                y={-tentHeight * 0.24}
                width={tentWidth * 0.32}
                height={tentHeight * 0.24}
                rx="0.28"
                fill={mixColors("#fff7ea", palette.paper, 0.08)}
                opacity="0.62"
              />
            </g>
          );
        })}
        {Array.from({ length: 16 }).map((_, index) => {
          const bulbX = 8 + index * ((width - 16) / 15);
          const bulbY = height * 0.235 + Math.sin(index * 0.62) * 0.95;
          const bulbFill = bulbPalette[index % bulbPalette.length] ?? gold;
          return (
            <g key={`circus-bulb-${index}`}>
              <rect
                x={bulbX - 0.18}
                y={bulbY - 1.05}
                width="0.36"
                height="0.34"
                rx="0.08"
                fill={lineSoft}
                opacity="0.9"
              />
              <circle
                cx={bulbX}
                cy={bulbY}
                r={0.78 + (index % 4) * 0.06}
                fill={bulbFill}
                opacity="0.96"
              />
              <circle
                cx={bulbX}
                cy={bulbY}
                r={1.18 + (index % 3) * 0.08}
                fill={`url(#${lightId})`}
                opacity="0.06"
              />
            </g>
          );
        })}
        <path d={sparklePath(width * 0.16, height * 0.26, 1.5, 0.56)} fill={gold} opacity="0.7" />
        <path
          d={sparklePath(width * 0.84, height * 0.28, 1.25, 0.48)}
          fill={mixColors(palette.soft, palette.paper, 0.08)}
          opacity="0.66"
        />
        <path d={sparklePath(width * 0.72, height * 0.14, 1.05, 0.4)} fill={gold} opacity="0.6" />
        <g transform={`translate(${width * 0.15} ${height * 0.72})`} opacity="0.74">
          <path
            d={`M -${width * 0.06} -0.08 H 0.2`}
            stroke={mixColors(curtainShade, palette.paper, 0.18)}
            strokeWidth="0.36"
            strokeLinecap="round"
          />
          <circle cx="0.9" cy="0" r="1.12" fill={mixColors(gold, palette.paper, 0.18)} />
          <circle cx="0.9" cy="0" r="0.44" fill={mixColors(tentPink, palette.border, 0.1)} />
        </g>
        <g transform={`translate(${width * 0.85} ${height * 0.7})`} opacity="0.72">
          <path
            d={`M -0.2 -0.08 H ${width * 0.06}`}
            stroke={mixColors(curtainShade, palette.paper, 0.18)}
            strokeWidth="0.36"
            strokeLinecap="round"
          />
          <circle cx="-0.9" cy="0" r="1.12" fill={mixColors(gold, palette.paper, 0.18)} />
          <circle cx="-0.9" cy="0" r="0.44" fill={mixColors(tentPink, palette.border, 0.1)} />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="0.24" />
      <rect
        x={panel.x + 0.38}
        y={panel.y + 0.46}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={mixColors("#261727", palette.border, 0.3)}
        opacity="0.12"
      />
      <rect
        x={panel.x}
        y={panel.y}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={mixColors(gold, palette.paper, 0.18)}
        strokeWidth="0.18"
      />
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={mixColors("#51333e", palette.ink, 0.2)}
        lines={lines}
      />
    </g>
  );
}
