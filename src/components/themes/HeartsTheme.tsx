import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  heartPath,
  QuestionText,
} from "./shared";
import { seeded, mixColors } from "../../lib/color";

export function HeartsTheme(props: {
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
  const outerId = `${cardId}-hearts-outer`;
  const panelId = `${cardId}-hearts-panel`;
  const sceneClip = `${cardId}-hearts-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const panel = {
    x: layout.x,
    y: layout.y,
    width: layout.width,
    height: layout.height,
    rx: Math.max(2.8, layout.rx - 0.38),
  };
  const heartColors = [
    mixColors(palette.accent, palette.paper, 0.12),
    mixColors(palette.pop, palette.paper, 0.16),
    mixColors(palette.soft, palette.paper, 0.08),
    mixColors(palette.border, palette.paper, 0.2),
  ];
  const tinyDots = [palette.pop, palette.accent, mixColors("#ffffff", palette.paper, 0.08)];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.4)} />
          <stop offset="54%" stopColor={palette.paper} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.6)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefd", palette.paper, 0.02)} />
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
          fill={mixColors("#ffeef3", palette.accent, 0.2)}
          opacity="0.22"
        />
        <circle
          cx={width * 0.76}
          cy={height * 0.18}
          r={height * 0.2}
          fill={mixColors("#fff4e8", palette.pop, 0.22)}
          opacity="0.18"
        />
        {Array.from({ length: 120 }).map((_, index) => {
          const x = width * (0.08 + seeded(seed, 1400 + index) * 0.84);
          const y = height * (0.1 + seeded(seed, 1450 + index) * 0.78);
          const size = 0.26 + seeded(seed, 1500 + index) * 1.92;
          const rotation = seeded(seed, 1550 + index) * 38 - 19;
          const fill = heartColors[index % heartColors.length];
          const opacity = 0.38 + (index % 4) * 0.12;

          return (
            <g
              key={`heart-pattern-${index}`}
              transform={`rotate(${rotation} ${x} ${y})`}
              opacity={opacity}
            >
              <path d={heartPath(x, y, size)} fill={fill} />
              <path
                d={heartPath(x, y, size)}
                fill="none"
                stroke={mixColors(fill, palette.border, 0.16)}
                strokeWidth="0.08"
                opacity="0.4"
              />
            </g>
          );
        })}
        {Array.from({ length: 85 }).map((_, index) => (
          <circle
            key={`hearts-dot-${index}`}
            cx={width * (0.06 + seeded(seed, 1600 + index) * 0.88)}
            cy={height * (0.08 + seeded(seed, 1650 + index) * 0.82)}
            r={0.14 + seeded(seed, 1700 + index) * 0.18}
            fill={tinyDots[index % tinyDots.length]}
            opacity={0.38 + (index % 2) * 0.14}
          />
        ))}
        <path
          d={`M ${width * 0.06} ${height * 0.3} q ${width * 0.1} -${height * 0.04} ${width * 0.2} 0 q ${width * 0.08} ${height * 0.03} ${width * 0.18} -${height * 0.01}`}
          fill="none"
          stroke={mixColors(palette.soft, palette.paper, 0.16)}
          strokeWidth="0.36"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d={`M ${width * 0.56} ${height * 0.74} q ${width * 0.08} -${height * 0.03} ${width * 0.16} 0`}
          fill="none"
          stroke={mixColors(palette.pop, palette.paper, 0.2)}
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity="0.54"
        />
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="0.24" />
      <rect
        x={panel.x}
        y={panel.y}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={mixColors(palette.border, palette.paper, 0.92)}
        opacity="0.08"
        transform="translate(0 0.3)"
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
