import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  roundedRectPath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function RibbonsTheme(props: {
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
  const outerId = `${cardId}-ribbons-outer`;
  const panelId = `${cardId}-ribbons-panel`;
  const sceneClip = `${cardId}-ribbons-clip`;
  const outerPath = roundedRectPath(1.15, 1.15, width - 2.3, height - 2.3, 5.3);
    const panelPath = roundedRectPath(
    layout.x - 0.44,
    layout.y - 0.44,
    layout.width + 0.88,
    layout.height + 0.88,
    Math.max(2.4, layout.rx - 0.18),
  );
  const ribbonColors = [
    enrichColor(mixColors("#ffa2bf", palette.accent, 0.08), {
      saturationMult: 1.24,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors("#f9d783", palette.pop, 0.08), {
      saturationMult: 1.18,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors("#9fe0dc", palette.soft, 0.12), {
      saturationMult: 1.08,
      lightnessShift: -0.01,
    }),
    enrichColor(mixColors("#d7b8fb", palette.soft, 0.16), {
      saturationMult: 1.14,
      lightnessShift: 0.02,
    }),
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.2)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.16)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.22)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.18)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.62)}
        opacity="0.12"
        transform="translate(0.68 0.86)"
      />
      <path
        d={outerPath}
        fill={`url(#${outerId})`}
        stroke={mixColors(palette.border, palette.paper, 0.12)}
        strokeWidth="0.24"
      />
      <g clipPath={`url(#${sceneClip})`}>
        {Array.from({ length: 10 }).map((_, index) => {
          const startY = height * (0.14 + index * 0.07 + seeded(seed, 7500 + index) * 0.03);
          const stroke = ribbonColors[index % ribbonColors.length] ?? palette.accent;
          return (
            <path
              key={`ribbon-${index}`}
              d={`M ${-width * 0.02} ${startY} C ${width * 0.16} ${startY - height * (0.12 + seeded(seed, 7510 + index) * 0.04)}, ${width * 0.34} ${startY + height * (0.12 + seeded(seed, 7520 + index) * 0.05)}, ${width * 0.5} ${startY} C ${width * 0.66} ${startY - height * (0.12 + seeded(seed, 7530 + index) * 0.04)}, ${width * 0.84} ${startY + height * (0.12 + seeded(seed, 7540 + index) * 0.05)}, ${width * 1.02} ${startY}`}
              fill="none"
              stroke={stroke}
              strokeWidth={0.36 + seeded(seed, 7550 + index) * 0.24}
              strokeLinecap="round"
              opacity={0.7 + seeded(seed, 7560 + index) * 0.18}
            />
          );
        })}

        {Array.from({ length: 6 }).map((_, index) => {
          const x = width * (0.12 + seeded(seed, 7570 + index) * 0.76);
          const y = height * (0.18 + seeded(seed, 7580 + index) * 0.6);
          const scale = 0.56 + seeded(seed, 7590 + index) * 0.4;
          const color = ribbonColors[(index + 1) % ribbonColors.length] ?? palette.accent;
          return (
            <g
              key={`bow-${index}`}
              transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7600 + index) * 24 - 12})`}
            >
              <ellipse
                cx="-0.92"
                cy="0"
                rx="1.1"
                ry="0.7"
                fill={color}
                transform="rotate(-18 -0.92 0)"
              />
              <ellipse
                cx="0.92"
                cy="0"
                rx="1.1"
                ry="0.7"
                fill={mixColors(color, palette.paper, 0.06)}
                transform="rotate(18 0.92 0)"
              />
              <rect
                x={-0.24}
                y={-0.44}
                width={0.48}
                height={0.88}
                rx={0.18}
                fill={mixColors(palette.border, color, 0.28)}
              />
              <path
                d="M -0.22 0.32 L -0.72 1.46 L -0.08 0.94 Z"
                fill={mixColors(color, palette.pop, 0.2)}
              />
              <path
                d="M 0.22 0.32 L 0.72 1.46 L 0.08 0.94 Z"
                fill={mixColors(color, palette.paper, 0.08)}
              />
            </g>
          );
        })}

        {Array.from({ length: 18 }).map((_, index) =>
          index % 4 === 0 ? (
            <path
              key={`ribbon-star-${index}`}
              d={sparklePath(
                width * (0.08 + seeded(seed, 7610 + index) * 0.84),
                height * (0.08 + seeded(seed, 7620 + index) * 0.76),
                0.2 + seeded(seed, 7630 + index) * 0.18,
                0.08 + seeded(seed, 7640 + index) * 0.08,
              )}
              fill={mixColors("#fff7ec", palette.pop, 0.1)}
              opacity="0.74"
            />
          ) : (
            <circle
              key={`ribbon-dot-${index}`}
              cx={width * (0.08 + seeded(seed, 7610 + index) * 0.84)}
              cy={height * (0.08 + seeded(seed, 7620 + index) * 0.76)}
              r={0.13 + seeded(seed, 7630 + index) * 0.14}
              fill={index % 2 === 0 ? palette.pop : palette.accent}
              opacity="0.5"
            />
          ),
        )}
      </g>
      <path
        d={panelPath}
        fill={mixColors(palette.border, palette.paper, 0.92)}
        opacity="0.06"
        transform="translate(0.4 0.5)"
      />
      <path
        d={panelPath}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={mixColors(palette.border, palette.paper, 0.2)}
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
