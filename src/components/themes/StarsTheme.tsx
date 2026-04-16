import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function StarsTheme(props: {
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
  const outerId = `${cardId}-stars-outer`;
  const panelId = `${cardId}-stars-panel`;
  const sceneClip = `${cardId}-stars-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
    const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const starColors = [
    enrichColor(mixColors(palette.accent, palette.paper, 0.1), {
      saturationMult: 1.3,
      lightnessShift: -0.01,
    }),
    enrichColor(mixColors(palette.pop, palette.paper, 0.1), {
      saturationMult: 1.3,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(palette.soft, palette.paper, 0.1), {
      saturationMult: 1.2,
      lightnessShift: -0.01,
    }),
    enrichColor(mixColors(palette.border, palette.paper, 0.1), {
      saturationMult: 1.2,
      lightnessShift: -0.01,
    }),
  ];
  const dustColors = [
    starColors[0],
    starColors[1],
    starColors[2],
    mixColors("#ffffff", palette.paper, 0.08),
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fff8fb", palette.paper, 0.04)} />
          <stop offset="56%" stopColor={mixColors(palette.paper, "#fffdfb", 0.02)} />
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
          cx={width * 0.16}
          cy={height * 0.2}
          r={height * 0.18}
          fill={mixColors(starColors[0], palette.paper, 0.72)}
          opacity="0.16"
        />
        <circle
          cx={width * 0.78}
          cy={height * 0.18}
          r={height * 0.2}
          fill={mixColors(starColors[1], palette.paper, 0.72)}
          opacity="0.14"
        />
        {Array.from({ length: 134 }).map((_, index) => {
          const x = width * (-0.04 + seeded(seed, 2000 + index) * 1.08);
          const y = height * (-0.03 + seeded(seed, 2060 + index) * 1.06);
          const outer = 0.14 + seeded(seed, 2120 + index) * 1.72;
          const isFivePoint = seeded(seed, 2240 + index) > 0.22;
          const inner =
            outer *
            (isFivePoint
              ? 0.42 + seeded(seed, 2180 + index) * 0.1
              : 0.2 + seeded(seed, 2180 + index) * 0.08);
          const points = isFivePoint ? 5 : 4;
          const rotation = seeded(seed, 2300 + index) * 48 - 24;
          const fill = starColors[index % starColors.length];
          const opacity = isFivePoint ? 0.76 + (index % 3) * 0.08 : 0.5 + (index % 3) * 0.08;

          return (
            <g
              key={`star-pattern-${index}`}
              transform={`rotate(${rotation} ${x} ${y})`}
              opacity={opacity}
            >
              <path d={sparklePath(x, y, outer, inner, points)} fill={fill} />
              <path
                d={sparklePath(x, y, outer, inner, points)}
                fill="none"
                stroke={mixColors(fill, palette.border, 0.1)}
                strokeWidth={isFivePoint ? "0.08" : "0.06"}
                opacity="0.28"
              />
            </g>
          );
        })}
        {Array.from({ length: 116 }).map((_, index) => (
          <circle
            key={`stars-dust-${index}`}
            cx={width * (0.02 + seeded(seed, 2360 + index) * 0.96)}
            cy={height * (0.04 + seeded(seed, 2440 + index) * 0.92)}
            r={0.08 + seeded(seed, 2520 + index) * 0.2}
            fill={dustColors[index % dustColors.length]}
            opacity={0.34 + (index % 3) * 0.14}
          />
        ))}
        <path
          d={`M ${width * 0.08} ${height * 0.3} q ${width * 0.08} -${height * 0.032} ${width * 0.18} 0 q ${width * 0.08} ${height * 0.024} ${width * 0.16} -${height * 0.004}`}
          fill="none"
          stroke={mixColors(starColors[2], palette.paper, 0.66)}
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d={`M ${width * 0.62} ${height * 0.76} q ${width * 0.08} -${height * 0.028} ${width * 0.16} 0`}
          fill="none"
          stroke={mixColors(starColors[1], palette.paper, 0.66)}
          strokeWidth="0.28"
          strokeLinecap="round"
          opacity="0.54"
        />
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
