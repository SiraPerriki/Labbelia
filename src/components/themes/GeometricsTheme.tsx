import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors } from "../../lib/color";

export function GeometricsTheme(props: {
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
  const outerId = `${cardId}-geom-outer`;
  const panelId = `${cardId}-geom-panel`;
  const sceneClip = `${cardId}-geom-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
    const panel = {
    x: layout.x - 0.4,
    y: layout.y - 0.38,
    width: layout.width + 0.8,
    height: layout.height + 0.76,
    rx: Math.max(2.6, layout.rx - 0.44),
  };
  const stripeA = mixColors(palette.soft, "#fff8fb", 0.04);
  const stripeB = mixColors(palette.accent, palette.paper, 0.08);
  const stripeC = mixColors(palette.pop, palette.paper, 0.1);
  const gridTone = mixColors(palette.border, palette.paper, 0.08);
  const dotTone = mixColors(palette.pop, "#fff4d8", 0.08);
  const wovenA = mixColors(palette.accent, palette.paper, 0.1);
  const wovenB = mixColors(palette.soft, palette.paper, 0.06);
  const tileTone = mixColors(palette.pop, palette.paper, 0.14);
  const stitchTone = mixColors(palette.border, palette.paper, 0.04);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffaf7", palette.paper, 0.04)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.34)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fa", palette.paper, 0.12)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.68)}
        opacity="0.12"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        {Array.from({ length: 14 }).map((_, index) => (
          <rect
            key={`geom-stripe-v-${index}`}
            x={index * (width / 14)}
            y="0"
            width={width / 18}
            height={height}
            fill={index % 3 === 0 ? stripeA : index % 3 === 1 ? stripeB : stripeC}
            opacity={0.54 + (index % 2) * 0.1}
          />
        ))}
        {Array.from({ length: 12 }).map((_, index) => (
          <rect
            key={`geom-stripe-h-${index}`}
            x="0"
            y={index * (height / 12)}
            width={width}
            height={height / 34}
            fill={index % 2 === 0 ? wovenA : wovenB}
            opacity={0.24 + (index % 3) * 0.1}
          />
        ))}
        {Array.from({ length: 14 }).map((_, column) =>
          Array.from({ length: 9 }).map((_, row) => {
            const x = width * (0.03 + column * 0.068);
            const y = height * (0.07 + row * 0.098);
            const w = width * (0.038 + seeded(seed, 1750 + column * 20 + row) * 0.02);
            const h = height * (0.045 + seeded(seed, 1800 + column * 20 + row) * 0.024);
            const mode = Math.floor(seeded(seed, 1850 + column * 20 + row) * 4);
            const fill = [tileTone, stripeB, stripeA, stripeC][(column + row) % 4];

            return mode === 0 ? (
              <rect
                key={`geom-tile-${column}-${row}`}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={0.45}
                fill={fill}
                opacity="0.58"
              />
            ) : mode === 1 ? (
              <circle
                key={`geom-tile-${column}-${row}`}
                cx={x + w * 0.5}
                cy={y + h * 0.5}
                r={Math.min(w, h) * 0.26}
                fill={mode === 1 && (column + row) % 2 === 0 ? dotTone : fill}
                opacity="0.76"
              />
            ) : mode === 2 ? (
              <path
                key={`geom-tile-${column}-${row}`}
                d={`M ${x} ${y + h * 0.5} H ${x + w}`}
                fill="none"
                stroke={stitchTone}
                strokeWidth="0.28"
                strokeLinecap="round"
                opacity="0.9"
              />
            ) : (
              <path
                key={`geom-tile-${column}-${row}`}
                d={`M ${x + w * 0.5} ${y} V ${y + h}`}
                fill="none"
                stroke={stitchTone}
                strokeWidth="0.26"
                strokeLinecap="round"
                opacity="0.84"
              />
            );
          }),
        )}
        {Array.from({ length: 16 }).map((_, index) => (
          <path
            key={`geom-grid-v-${index}`}
            d={`M ${width * (0.02 + index * 0.064)} 0 V ${height}`}
            fill="none"
            stroke={gridTone}
            strokeWidth="0.18"
            opacity="0.42"
          />
        ))}
        {Array.from({ length: 11 }).map((_, index) => (
          <path
            key={`geom-grid-h-${index}`}
            d={`M 0 ${height * (0.06 + index * 0.09)} H ${width}`}
            fill="none"
            stroke={gridTone}
            strokeWidth="0.18"
            opacity="0.38"
          />
        ))}
        <path
          d={`M ${width * 0.06} ${height * 0.28} q ${width * 0.08} -${height * 0.03} ${width * 0.18} 0`}
          fill="none"
          stroke={mixColors(palette.pop, palette.paper, 0.1)}
          strokeWidth="0.34"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d={`M ${width * 0.62} ${height * 0.74} q ${width * 0.08} -${height * 0.026} ${width * 0.16} 0`}
          fill="none"
          stroke={mixColors(palette.accent, palette.paper, 0.1)}
          strokeWidth="0.32"
          strokeLinecap="round"
          opacity="0.68"
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
