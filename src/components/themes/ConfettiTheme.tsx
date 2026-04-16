import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function ConfettiTheme(props: {
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
  const outerId = `${cardId}-confetti-outer`;
  const panelId = `${cardId}-confetti-panel`;
  const sceneClip = `${cardId}-confetti-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
    const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const colors = [
    enrichColor(mixColors(palette.accent, "#ffbfd8", 0.03), {
      saturationMult: 1.34,
      lightnessShift: -0.01,
    }),
    enrichColor(mixColors(palette.pop, "#ffd788", 0.03), {
      saturationMult: 1.34,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(palette.soft, "#cfeaff", 0.04), {
      saturationMult: 1.22,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(palette.border, "#d2b6ff", 0.06), {
      saturationMult: 1.24,
      lightnessShift: 0.01,
    }),
    enrichColor(mixColors("#bde5cf", palette.soft, 0.12), {
      saturationMult: 1.18,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors("#f7b9a8", palette.pop, 0.08), {
      saturationMult: 1.2,
      lightnessShift: -0.02,
    }),
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fff8fb", palette.paper, 0.04)} />
          <stop offset="56%" stopColor={mixColors(palette.paper, "#fffefd", 0.02)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.24)} />
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
        fill={mixColors(palette.border, palette.soft, 0.7)}
        opacity="0.12"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle
          cx={width * 0.18}
          cy={height * 0.2}
          r={height * 0.18}
          fill={mixColors(colors[0], palette.paper, 0.78)}
          opacity="0.14"
        />
        <circle
          cx={width * 0.8}
          cy={height * 0.18}
          r={height * 0.2}
          fill={mixColors(colors[1], palette.paper, 0.8)}
          opacity="0.12"
        />
        {Array.from({ length: 270 }).map((_, index) => {
          const x = width * (-0.04 + seeded(seed, 2600 + index) * 1.08);
          const y = height * (-0.03 + seeded(seed, 2680 + index) * 1.06);
          const w = 0.18 + seeded(seed, 2760 + index) * 1.02;
          const h = 0.18 + seeded(seed, 2840 + index) * 0.94;
          const rotation = seeded(seed, 2920 + index) * 180 - 90;
          const mode = Math.floor(seeded(seed, 3000 + index) * 4);
          const fill = colors[index % colors.length];
          const opacity = 0.68 + (index % 4) * 0.08;

          if (mode === 0) {
            return (
              <rect
                key={`confetti-piece-${index}`}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={0.14}
                fill={fill}
                opacity={opacity}
                transform={`rotate(${rotation} ${x + w / 2} ${y + h / 2})`}
              />
            );
          }

          if (mode === 1) {
            return (
              <circle
                key={`confetti-piece-${index}`}
                cx={x}
                cy={y}
                r={0.16 + seeded(seed, 3080 + index) * 0.42}
                fill={fill}
                opacity={opacity}
              />
            );
          }

          if (mode === 2) {
            return (
              <path
                key={`confetti-piece-${index}`}
                d={`M ${x} ${y} L ${x + w} ${y + h * 0.16} L ${x + w * 0.24} ${y + h}`}
                fill={fill}
                opacity={opacity}
                transform={`rotate(${rotation} ${x + w / 2} ${y + h / 2})`}
              />
            );
          }

          return (
            <ellipse
              key={`confetti-piece-${index}`}
              cx={x}
              cy={y}
              rx={0.12 + seeded(seed, 3160 + index) * 0.34}
              ry={0.08 + seeded(seed, 3240 + index) * 0.22}
              fill={fill}
              opacity={opacity}
              transform={`rotate(${rotation} ${x} ${y})`}
            />
          );
        })}
        {Array.from({ length: 64 }).map((_, index) => {
          const startX = width * (-0.04 + seeded(seed, 3320 + index) * 1.08);
          const startY = height * (0.04 + seeded(seed, 3380 + index) * 0.88);
          const sweep = width * (0.024 + seeded(seed, 3440 + index) * 0.06);
          const lift = height * (0.022 + seeded(seed, 3500 + index) * 0.07);
          const nearFactor = seeded(seed, 3560 + index);
          const strokeWidth =
            nearFactor > 0.78
              ? 0.9 + seeded(seed, 3620 + index) * 0.22
              : nearFactor > 0.48
                ? 0.42 + seeded(seed, 3680 + index) * 0.22
                : 0.18 + seeded(seed, 3740 + index) * 0.14;
          const opacity = nearFactor > 0.78 ? 0.92 : nearFactor > 0.48 ? 0.82 : 0.66;
          return (
            <path
              key={`confetti-ribbon-${index}`}
              d={`M ${startX} ${startY} q ${sweep * 0.4} -${lift} ${sweep} 0 q ${sweep * 0.35} ${lift} ${sweep * 0.8} 0`}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              opacity={opacity}
            />
          );
        })}
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="0.24" />
      <rect
        x={panel.x + 0.34}
        y={panel.y + 0.42}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={mixColors(palette.border, palette.paper, 0.76)}
        opacity="0.02"
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
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={mixColors(palette.ink, palette.paper, 0.18)}
        lines={lines}
      />
    </g>
  );
}
