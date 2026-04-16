import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function RainbowTheme(props: {
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
  const outerId = `${cardId}-rainbow-outer`;
  const panelId = `${cardId}-rainbow-panel`;
  const sceneClip = `${cardId}-rainbow-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
    const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const rainbow = [
    enrichColor("#ff8c8c", { saturationMult: 1.16, lightnessShift: -0.02 }),
    enrichColor("#ffb866", { saturationMult: 1.16, lightnessShift: -0.02 }),
    enrichColor("#ffd74f", { saturationMult: 1.14, lightnessShift: -0.01 }),
    enrichColor("#92d884", { saturationMult: 1.12, lightnessShift: -0.02 }),
    enrichColor("#72d6d9", { saturationMult: 1.14, lightnessShift: -0.02 }),
    enrichColor("#86afff", { saturationMult: 1.16, lightnessShift: -0.01 }),
    enrichColor("#bf95f1", { saturationMult: 1.14, lightnessShift: -0.01 }),
  ];
  const frameBorder = mixColors(palette.border, rainbow[5], 0.18);
    const panelShadow = mixColors(frameBorder, palette.paper, 0.74);
  const rainbowSweeps = [
    {
      x1: width * -0.18,
      x2: width * 0.38,
      y: height * (0.26 + seeded(seed, 10900) * 0.06),
      lift: height * (0.18 + seeded(seed, 10910) * 0.08),
      spread: 0.84,
      widthScale: 1,
      opacity: 0.84,
    },
    {
      x1: width * 0.28,
      x2: width * 0.98,
      y: height * (0.2 + seeded(seed, 10920) * 0.08),
      lift: height * (0.16 + seeded(seed, 10930) * 0.08),
      spread: 0.78,
      widthScale: 0.94,
      opacity: 0.8,
    },
    {
      x1: width * 0.62,
      x2: width * 1.12,
      y: height * (0.62 + seeded(seed, 10940) * 0.08),
      lift: height * (0.16 + seeded(seed, 10950) * 0.06),
      spread: 0.82,
      widthScale: 1.04,
      opacity: 0.88,
    },
    {
      x1: width * -0.1,
      x2: width * 0.56,
      y: height * (0.8 + seeded(seed, 10960) * 0.06),
      lift: height * (0.18 + seeded(seed, 10970) * 0.07),
      spread: 0.8,
      widthScale: 1.08,
      opacity: 0.86,
    },
    {
      x1: width * 0.18,
      x2: width * 1.08,
      y: height * (0.9 + seeded(seed, 10980) * 0.04),
      lift: height * (0.24 + seeded(seed, 10990) * 0.08),
      spread: 0.92,
      widthScale: 1.12,
      opacity: 0.8,
    },
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fff8fb", palette.paper, 0.03)} />
          <stop offset="100%" stopColor={mixColors("#fffef9", palette.paper, 0.08)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fb", palette.paper, 0.12)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(frameBorder, palette.soft, 0.78)}
        opacity="0.14"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle
          cx={width * 0.16}
          cy={height * 0.24}
          r={height * 0.2}
          fill={mixColors(rainbow[0], palette.paper, 0.88)}
          opacity="0.11"
        />
        <circle
          cx={width * 0.84}
          cy={height * 0.72}
          r={height * 0.2}
          fill={mixColors(rainbow[5], palette.paper, 0.88)}
          opacity="0.11"
        />
        {rainbowSweeps.map((sweep, sweepIndex) => {
          const bandThickness = height * 0.018 * sweep.widthScale;
          const bandGap = bandThickness * 0.66;
          const control1X = sweep.x1 + (sweep.x2 - sweep.x1) * 0.3;
          const control2X = sweep.x1 + (sweep.x2 - sweep.x1) * 0.72;
          return (
            <g key={`rainbow-sweep-${sweepIndex}`} opacity={sweep.opacity}>
              {rainbow.map((color, bandIndex) => {
                const offset = bandIndex * bandGap;
                const y = sweep.y + offset;
                const lift = Math.max(2.2, sweep.lift - offset * sweep.spread);
                return (
                  <path
                    key={`rainbow-sweep-band-${sweepIndex}-${bandIndex}`}
                    d={`M ${sweep.x1} ${y} C ${control1X} ${y - lift} ${control2X} ${y - lift * 0.92} ${sweep.x2} ${y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={bandThickness}
                    strokeLinecap="round"
                    opacity={0.96 - bandIndex * 0.02}
                  />
                );
              })}
            </g>
          );
        })}
        {Array.from({ length: 44 }).map((_, index) => {
          const x = width * (0.02 + seeded(seed, 10500 + index) * 0.96);
          const y = height * (0.04 + seeded(seed, 10560 + index) * 0.92);
          const size = 0.52 + seeded(seed, 10620 + index) * 1.46;
          const color = rainbow[index % rainbow.length];
          return index % 2 === 0 ? (
            <path
              key={`rainbow-star-${index}`}
              d={sparklePath(x, y, size, size * 0.38)}
              fill={color}
              opacity={0.58 + (index % 3) * 0.12}
            />
          ) : (
            <circle
              key={`rainbow-dot-${index}`}
              cx={x}
              cy={y}
              r={size * 0.28}
              fill={color}
              opacity={0.52 + (index % 4) * 0.08}
            />
          );
        })}
        {Array.from({ length: 18 }).map((_, index) => {
          const x = width * (0.06 + seeded(seed, 10680 + index) * 0.88);
          const y = height * (0.08 + seeded(seed, 10720 + index) * 0.84);
          const w = 2.8 + seeded(seed, 10760 + index) * 5.2;
          const h = 0.58 + seeded(seed, 10800 + index) * 0.76;
          const color = rainbow[(index + 2) % rainbow.length];
          return (
            <rect
              key={`rainbow-bar-${index}`}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={h / 2}
              fill={color}
              opacity={0.74}
              transform={`rotate(${seeded(seed, 10840 + index) * 80 - 40} ${x + w / 2} ${y + h / 2})`}
            />
          );
        })}
      </g>
      <path d={outerPath} fill="none" stroke={frameBorder} strokeWidth="0.24" />
      <rect
        x={panel.x + 0.34}
        y={panel.y + 0.42}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={panelShadow}
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
        stroke={mixColors(frameBorder, palette.paper, 0.18)}
        strokeWidth="0.18"
      />
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={mixColors(palette.ink, palette.paper, 0.18)}
        lines={lines}
      />
    </g>
  );
}
