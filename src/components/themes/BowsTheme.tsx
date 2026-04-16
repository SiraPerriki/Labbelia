import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  roundedRectPath,
  heartPath,
  QuestionText,
} from "./shared";
import { seeded, mixColors } from "../../lib/color";

export function BowsTheme(props: {
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
  const outerId = `${cardId}-bows-outer`;
  const panelId = `${cardId}-bows-panel`;
  const outerPath = roundedRectPath(1.2, 1.2, width - 2.4, height - 2.4, 5.4);
  const panelPath = roundedRectPath(
    layout.x,
    layout.y,
    layout.width,
    layout.height,
    Math.max(2.8, layout.rx - 0.38)
  );
  const butterflyColors = [
    mixColors(palette.accent, palette.paper, 0.14),
    mixColors(palette.soft, palette.paper, 0.18),
    mixColors(palette.pop, palette.paper, 0.12),
    mixColors(palette.border, palette.paper, 0.2),
    mixColors(palette.accent, palette.pop, 0.16),
  ];
  const butterflies = Array.from({ length: 32 }).map((_, index) => ({
    x: width * (0.1 + seeded(seed, 1800 + index) * 0.8),
    y: height * (0.14 + seeded(seed, 1820 + index) * 0.7),
    scale: 0.42 + seeded(seed, 1840 + index) * 0.58,
    angle: seeded(seed, 1860 + index) * 34 - 17,
    color: butterflyColors[index % butterflyColors.length],
    opacity: 0.42 + seeded(seed, 1880 + index) * 0.22,
  }));

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.5)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.4)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.18)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.16)} />
        </linearGradient>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.64)}
        opacity="0.12"
        transform="translate(0.68 0.9)"
      />
      <path
        d={outerPath}
        fill={`url(#${outerId})`}
        stroke={mixColors(palette.border, palette.paper, 0.14)}
        strokeWidth="0.24"
      />
      {butterflies.map((butterfly, index) => (
        <g
          key={`butterfly-${index}`}
          transform={`translate(${butterfly.x} ${butterfly.y}) rotate(${butterfly.angle}) scale(${butterfly.scale})`}
          opacity={butterfly.opacity}
        >
          <ellipse
            cx="-1.36"
            cy="-0.98"
            rx="1.18"
            ry="1.64"
            fill={butterfly.color}
            transform="rotate(-24 -1.36 -0.98)"
          />
          <ellipse
            cx="1.36"
            cy="-0.98"
            rx="1.18"
            ry="1.64"
            fill={mixColors(butterfly.color, palette.paper, 0.04)}
            transform="rotate(24 1.36 -0.98)"
          />
          <ellipse
            cx="-0.96"
            cy="1.02"
            rx="0.84"
            ry="1.08"
            fill={mixColors(butterfly.color, palette.soft, 0.12)}
            transform="rotate(18 -0.96 1.02)"
          />
          <ellipse
            cx="0.96"
            cy="1.02"
            rx="0.84"
            ry="1.08"
            fill={mixColors(butterfly.color, palette.paper, 0.08)}
            transform="rotate(-18 0.96 1.02)"
          />
          <rect
            x={-0.24}
            y={-1.68}
            width={0.48}
            height={3.5}
            rx={0.2}
            fill={mixColors(palette.border, butterfly.color, 0.28)}
          />
          <circle
            cx="0"
            cy="-1.86"
            r="0.24"
            fill={mixColors(palette.border, palette.paper, 0.12)}
          />
          <path
            d="M -0.08 -1.86 Q -0.58 -2.74 -1.12 -2.78"
            fill="none"
            stroke={mixColors(palette.border, palette.paper, 0.2)}
            strokeWidth="0.09"
            strokeLinecap="round"
          />
          <path
            d="M 0.08 -1.86 Q 0.58 -2.74 1.12 -2.78"
            fill="none"
            stroke={mixColors(palette.border, palette.paper, 0.2)}
            strokeWidth="0.09"
            strokeLinecap="round"
          />
          <path
            d="M -0.7 -0.8 C -1.02 -0.66 -1.18 -0.26 -1.1 0.12"
            fill="none"
            stroke={mixColors(palette.paper, butterfly.color, 0.14)}
            strokeWidth="0.08"
            opacity="0.54"
          />
          <path
            d="M 0.7 -0.8 C 1.02 -0.66 1.18 -0.26 1.1 0.12"
            fill="none"
            stroke={mixColors(palette.paper, butterfly.color, 0.14)}
            strokeWidth="0.08"
            opacity="0.54"
          />
        </g>
      ))}
      {Array.from({ length: 35 }).map((_, index) => (
        <circle
          key={`butterfly-dot-${index}`}
          cx={width * (0.06 + seeded(seed, 1900 + index) * 0.88)}
          cy={height * (0.1 + seeded(seed, 1920 + index) * 0.8)}
          r={0.14 + seeded(seed, 1940 + index) * 0.18}
          fill={
            index % 3 === 0
              ? palette.pop
              : index % 2 === 0
                ? palette.accent
                : mixColors(palette.soft, palette.paper, 0.06)
          }
          opacity={0.56}
        />
      ))}
      {Array.from({ length: 8 }).map((_, index) => (
        <path
          key={`butterfly-trail-${index}`}
          d={`M ${width * (0.08 + seeded(seed, 2010 + index) * 0.82)} ${height * (0.14 + seeded(seed, 2030 + index) * 0.7)} C ${width * (0.14 + seeded(seed, 2050 + index) * 0.74)} ${height * (0.2 + seeded(seed, 2070 + index) * 0.56)}, ${width * (0.18 + seeded(seed, 2090 + index) * 0.7)} ${height * (0.12 + seeded(seed, 2110 + index) * 0.66)}, ${width * (0.22 + seeded(seed, 2130 + index) * 0.66)} ${height * (0.18 + seeded(seed, 2150 + index) * 0.54)}`}
          fill="none"
          stroke={mixColors(palette.soft, palette.paper, 0.12)}
          strokeWidth="0.16"
          strokeLinecap="round"
          strokeDasharray="0.48 0.64"
          opacity="0.34"
        />
      ))}
      {Array.from({ length: 6 }).map((_, index) => (
        <path
          key={`butterfly-heart-${index}`}
          d={heartPath(
            width * (0.12 + seeded(seed, 1960 + index) * 0.76),
            height * (0.16 + seeded(seed, 1980 + index) * 0.68),
            0.42 + seeded(seed, 2000 + index) * 0.22,
          )}
          fill={mixColors("#ffd7df", palette.accent, 0.1)}
          opacity="0.28"
        />
      ))}
      <path
        d={panelPath}
        fill={mixColors(palette.border, palette.paper, 0.92)}
        opacity="0.08"
        transform="translate(0 0.3)"
      />
      <path
        d={panelPath}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={mixColors(palette.border, palette.paper, 0.18)}
        strokeWidth="0.18"
      />
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={mixColors(palette.ink, palette.paper, 0.2)}
        lines={lines}
      />
    </g>
  );
}
