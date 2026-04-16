import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  roundedRectPath,
  heartPath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function FruitsTheme(props: {
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
  const outerId = `${cardId}-fruits-outer`;
  const panelId = `${cardId}-fruits-panel`;
  const sceneClip = `${cardId}-fruits-clip`;
  const outerPath = roundedRectPath(1.15, 1.15, width - 2.3, height - 2.3, 5.3);
  const panelPath = roundedRectPath(
    layout.x,
    layout.y,
    layout.width,
    layout.height,
    Math.max(2.8, layout.rx - 0.38)
  );
  const fruitPalette = [
    enrichColor(mixColors(palette.accent, palette.paper, 0.1), {
      saturationMult: 1.2,
      lightnessShift: 0.01,
    }),
    enrichColor(mixColors(palette.pop, palette.paper, 0.1), {
      saturationMult: 1.2,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors(palette.soft, palette.paper, 0.1), {
      saturationMult: 1.1,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(palette.border, palette.paper, 0.2), {
      saturationMult: 1.1,
      lightnessShift: 0.01,
    }),
  ];
  const leaf = enrichColor(mixColors(palette.soft, palette.paper, 0.1), {
    saturationMult: 1.08,
    lightnessShift: -0.04,
  });
  const stem = mixColors(palette.border, palette.ink, 0.3);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.6)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.3)} />
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
        {Array.from({ length: 65 }).map((_, index) => {
          const x = width * (0.08 + seeded(seed, 7800 + index) * 0.84);
          const y = height * (0.12 + seeded(seed, 7810 + index) * 0.72);
          const scale = 0.52 + seeded(seed, 7820 + index) * 1.18;
          const color = fruitPalette[index % fruitPalette.length] ?? palette.accent;
          const kind = index % 4;
          const outline = mixColors(palette.border, color, 0.22);

          if (kind === 0) {
            return (
              <g
                key={`fruit-apple-${index}`}
                transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7830 + index) * 16 - 8})`}
                opacity={0.86}
              >
                <circle cx="-0.56" cy="0" r="0.9" fill={color} />
                <circle cx="0.56" cy="0" r="0.9" fill={mixColors(color, palette.paper, 0.04)} />
                <path
                  d="M -0.92 0.2 Q 0 1.34 0.92 0.2"
                  fill={mixColors(color, palette.paper, 0.1)}
                  opacity="0.86"
                />
                <path
                  d="M 0 -0.94 Q 0.12 -1.58 0.64 -1.9"
                  fill="none"
                  stroke={stem}
                  strokeWidth="0.12"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="0.84"
                  cy="-1.66"
                  rx="0.54"
                  ry="0.26"
                  fill={leaf}
                  transform="rotate(20 0.84 -1.66)"
                />
                <circle
                  cx="-0.56"
                  cy="0"
                  r="0.9"
                  fill="none"
                  stroke={outline}
                  strokeWidth="0.06"
                  opacity="0.48"
                />
                <circle
                  cx="0.56"
                  cy="0"
                  r="0.9"
                  fill="none"
                  stroke={outline}
                  strokeWidth="0.06"
                  opacity="0.48"
                />
              </g>
            );
          }

          if (kind === 1) {
            return (
              <g
                key={`fruit-cherry-${index}`}
                transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7840 + index) * 14 - 7})`}
                opacity={0.84}
              >
                <circle cx="-0.48" cy="0.36" r="0.62" fill={color} />
                <circle cx="0.52" cy="0.18" r="0.62" fill={mixColors(color, palette.pop, 0.12)} />
                <path
                  d="M -0.48 0.02 Q -0.3 -1.18 0.22 -1.72"
                  fill="none"
                  stroke={stem}
                  strokeWidth="0.11"
                  strokeLinecap="round"
                />
                <path
                  d="M 0.52 -0.16 Q 0.44 -1.26 0.1 -1.78"
                  fill="none"
                  stroke={stem}
                  strokeWidth="0.11"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="0.34"
                  cy="-1.78"
                  rx="0.48"
                  ry="0.22"
                  fill={leaf}
                  transform="rotate(-14 0.34 -1.78)"
                />
                <circle
                  cx="-0.48"
                  cy="0.36"
                  r="0.62"
                  fill="none"
                  stroke={outline}
                  strokeWidth="0.06"
                  opacity="0.44"
                />
                <circle
                  cx="0.52"
                  cy="0.18"
                  r="0.62"
                  fill="none"
                  stroke={outline}
                  strokeWidth="0.06"
                  opacity="0.44"
                />
              </g>
            );
          }

          if (kind === 2) {
            return (
              <g
                key={`fruit-strawberry-${index}`}
                transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7850 + index) * 18 - 9})`}
                opacity={0.86}
              >
                <path
                  d="M 0 -1.24 C 1.08 -1.08 1.22 0.16 0.86 0.98 C 0.48 1.76 -0.48 1.76 -0.86 0.98 C -1.22 0.16 -1.08 -1.08 0 -1.24 Z"
                  fill={color}
                  stroke={outline}
                  strokeWidth="0.06"
                />
                <path d="M -0.92 -1.06 Q -0.4 -1.66 0 -1.42 Q 0.4 -1.66 0.92 -1.06" fill={leaf} />
                {Array.from({ length: 4 }).map((__, dotIndex) => (
                  <circle
                    key={`fruit-seed-${index}-${dotIndex}`}
                    cx={-0.36 + dotIndex * 0.24}
                    cy={-0.2 + (dotIndex % 2) * 0.44}
                    r="0.07"
                    fill={mixColors("#fff4da", palette.paper, 0.08)}
                  />
                ))}
              </g>
            );
          }

          return (
            <g
              key={`fruit-citrus-${index}`}
              transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 7860 + index) * 18 - 9})`}
              opacity={0.82}
            >
              <circle cx="0" cy="0" r="0.96" fill={color} stroke={outline} strokeWidth="0.06" />
              <path
                d="M -0.7 -0.08 L 0.7 -0.08 M -0.6 0.36 L 0.6 0.36"
                stroke={mixColors("#fff8e8", palette.paper, 0.08)}
                strokeWidth="0.08"
                opacity="0.82"
              />
              <ellipse
                cx="0.52"
                cy="-1.08"
                rx="0.42"
                ry="0.2"
                fill={leaf}
                transform="rotate(26 0.52 -1.08)"
              />
            </g>
          );
        })}

        {Array.from({ length: 35 }).map((_, index) =>
          index % 5 === 0 ? (
            <path
              key={`fruit-heart-${index}`}
              d={heartPath(
                width * (0.08 + seeded(seed, 7870 + index) * 0.84),
                height * (0.12 + seeded(seed, 7880 + index) * 0.72),
                0.34 + seeded(seed, 7890 + index) * 0.16,
              )}
              fill={mixColors(palette.accent, palette.paper, 0.2)}
              opacity="0.3"
            />
          ) : (
            <circle
              key={`fruit-dot-${index}`}
              cx={width * (0.08 + seeded(seed, 7870 + index) * 0.84)}
              cy={height * (0.12 + seeded(seed, 7880 + index) * 0.72)}
              r={0.12 + seeded(seed, 7890 + index) * 0.12}
              fill={index % 2 === 0 ? palette.pop : palette.accent}
              opacity="0.34"
            />
          ),
        )}
      </g>
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
