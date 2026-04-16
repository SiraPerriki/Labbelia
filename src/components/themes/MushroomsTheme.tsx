import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  roundedRectPath,
  rollingHillPath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function MushroomsTheme(props: {
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
  const outerId = `${cardId}-mushroom-outer`;
  const panelId = `${cardId}-mushroom-panel`;
  const sceneClip = `${cardId}-mushroom-clip`;
  const outerPath = roundedRectPath(1.1, 1.1, width - 2.2, height - 2.2, 5.3);
  const panelPath = roundedRectPath(
    layout.x,
    layout.y,
    layout.width,
    layout.height,
    Math.max(2.8, layout.rx - 0.38)
  );
  const skyTop = enrichColor(mixColors(palette.paper, "#fff9ee", 0.16), {
    saturationMult: 0.96,
    lightnessShift: 0.03,
  });
  const skyBottom = enrichColor(mixColors(palette.soft, palette.paper, 0.14), {
    hueShift: -8 + seeded(seed, 7210) * 16,
    saturationMult: 0.92,
    lightnessShift: 0.04,
  });
  const hillFar = enrichColor(mixColors(palette.soft, palette.border, 0.42), {
    hueShift: -18 + seeded(seed, 7220) * 32,
    saturationMult: 0.92,
    lightnessShift: -0.04,
  });
  const hillNear = enrichColor(mixColors(palette.accent, palette.soft, 0.3), {
    hueShift: 16 + seeded(seed, 7230) * 20,
    saturationMult: 0.96,
    lightnessShift: -0.06,
  });
  const soil = enrichColor(mixColors(palette.border, palette.pop, 0.26), {
    hueShift: 10 + seeded(seed, 7240) * 14,
    saturationMult: 1.02,
    lightnessShift: -0.14,
  });
  const farTrunk = enrichColor(mixColors(palette.border, palette.soft, 0.5), {
    hueShift: -10 + seeded(seed, 7245) * 20,
    saturationMult: 0.82,
    lightnessShift: -0.02,
  });
  const midTrunk = enrichColor(mixColors(palette.border, palette.pop, 0.42), {
    hueShift: 6 + seeded(seed, 7246) * 18,
    saturationMult: 0.92,
    lightnessShift: -0.08,
  });
  const caps = [
    mixColors(palette.accent, palette.paper, 0.16),
    mixColors(palette.soft, palette.paper, 0.12),
    mixColors(palette.pop, palette.paper, 0.15),
    mixColors(palette.border, palette.paper, 0.2),
  ];
  const stem = mixColors("#fff7ee", palette.paper, 0.08);
  const dots = mixColors("#fffdf8", palette.paper, 0.02);
  const mushrooms = Array.from({ length: 16 }).map((_, index) => {
    const scale = 0.72 + seeded(seed, 7250 + index) * 0.58;
    return {
      x: width * (0.08 + index * 0.1 + seeded(seed, 7260 + index) * 0.03),
      y: height * (0.8 + seeded(seed, 7270 + index) * 0.08),
      scale,
      cap: caps[index % caps.length],
      lean: seeded(seed, 7280 + index) * 18 - 9,
    };
  });

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.6)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.5)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.24)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.18)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.62)}
        opacity="0.14"
        transform="translate(0.68 0.88)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        {Array.from({ length: 8 }).map((_, index) => {
          const trunkWidth = width * (0.018 + seeded(seed, 7247 + index) * 0.016);
          const trunkHeight = height * (0.56 + seeded(seed, 7257 + index) * 0.18);
          const x = width * (0.04 + index * 0.12 + seeded(seed, 7267 + index) * 0.04);
          const y = height * (0.14 + seeded(seed, 7277 + index) * 0.05);
          return (
            <g
              key={`mushroom-far-trunk-${index}`}
              opacity={0.18 + seeded(seed, 7287 + index) * 0.12}
            >
              <rect
                x={x}
                y={y}
                width={trunkWidth}
                height={trunkHeight}
                rx={trunkWidth * 0.45}
                fill={farTrunk}
              />
              <path
                d={`M ${x + trunkWidth * 0.52} ${y + trunkHeight * (0.22 + seeded(seed, 7297 + index) * 0.12)} C ${x + trunkWidth * 1.2} ${y + trunkHeight * (0.18 + seeded(seed, 7307 + index) * 0.12)}, ${x + trunkWidth * 1.46} ${y + trunkHeight * (0.12 + seeded(seed, 7317 + index) * 0.12)}, ${x + trunkWidth * 1.78} ${y + trunkHeight * (0.08 + seeded(seed, 7327 + index) * 0.12)}`}
                fill="none"
                stroke={mixColors(farTrunk, palette.paper, 0.14)}
                strokeWidth={trunkWidth * 0.14}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        {Array.from({ length: 6 }).map((_, index) => {
          const trunkWidth = width * (0.024 + seeded(seed, 7337 + index) * 0.018);
          const trunkHeight = height * (0.48 + seeded(seed, 7347 + index) * 0.18);
          const x = width * (0.08 + index * 0.15 + seeded(seed, 7357 + index) * 0.05);
          const y = height * (0.24 + seeded(seed, 7367 + index) * 0.06);
          return (
            <g
              key={`mushroom-mid-trunk-${index}`}
              opacity={0.26 + seeded(seed, 7377 + index) * 0.14}
            >
              <rect
                x={x}
                y={y}
                width={trunkWidth}
                height={trunkHeight}
                rx={trunkWidth * 0.46}
                fill={midTrunk}
              />
              <path
                d={`M ${x + trunkWidth * 0.5} ${y + trunkHeight * (0.36 + seeded(seed, 7387 + index) * 0.16)} C ${x + trunkWidth * 1.24} ${y + trunkHeight * (0.34 + seeded(seed, 7397 + index) * 0.12)}, ${x + trunkWidth * 1.6} ${y + trunkHeight * (0.28 + seeded(seed, 7407 + index) * 0.12)}, ${x + trunkWidth * 1.94} ${y + trunkHeight * (0.22 + seeded(seed, 7417 + index) * 0.12)}`}
                fill="none"
                stroke={mixColors(midTrunk, palette.paper, 0.16)}
                strokeWidth={trunkWidth * 0.13}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        <path
          d={rollingHillPath(width, height, height * 0.74, height * 0.08, seed, 7290)}
          fill={hillFar}
          opacity="0.74"
        />
        <path
          d={rollingHillPath(width, height, height * 0.86, height * 0.06, seed, 7300)}
          fill={hillNear}
          opacity="0.88"
        />
        <path
          d={`M 0 ${height * 0.9} C ${width * 0.18} ${height * 0.85}, ${width * 0.36} ${height * 0.95}, ${width * 0.54} ${height * 0.9} C ${width * 0.72} ${height * 0.84}, ${width * 0.9} ${height * 0.95}, ${width} ${height * 0.9} V ${height} H 0 Z`}
          fill={soil}
          opacity="0.86"
        />

        {Array.from({ length: 12 }).map((_, index) => (
          <path
            key={`mushroom-grass-${index}`}
            d={`M ${width * (0.06 + seeded(seed, 7310 + index) * 0.88)} ${height * (0.89 + seeded(seed, 7320 + index) * 0.06)} C ${width * (0.08 + seeded(seed, 7330 + index) * 0.84)} ${height * (0.77 + seeded(seed, 7340 + index) * 0.06)}, ${width * (0.09 + seeded(seed, 7350 + index) * 0.82)} ${height * (0.73 + seeded(seed, 7360 + index) * 0.08)}, ${width * (0.08 + seeded(seed, 7370 + index) * 0.84)} ${height * (0.69 + seeded(seed, 7380 + index) * 0.08)}`}
            fill="none"
            stroke={mixColors(palette.soft, palette.border, 0.34)}
            strokeWidth={0.14 + seeded(seed, 7390 + index) * 0.08}
            strokeLinecap="round"
            opacity="0.52"
          />
        ))}

        {mushrooms.map((mushroom, index) => {
          const capWidth = 3.4 * mushroom.scale;
          const capHeight = 1.7 * mushroom.scale;
          const stemHeight = 2.1 * mushroom.scale;
          const stemWidth = 0.9 * mushroom.scale;
          return (
            <g
              key={`mushroom-${index}`}
              transform={`translate(${mushroom.x} ${mushroom.y}) rotate(${mushroom.lean})`}
            >
              <rect
                x={-stemWidth * 0.5}
                y={-stemHeight}
                width={stemWidth}
                height={stemHeight}
                rx={stemWidth * 0.42}
                fill={stem}
                opacity="0.96"
              />
              <path
                d={`M ${-capWidth} ${-stemHeight + capHeight * 0.9} C ${-capWidth * 0.8} ${-stemHeight - capHeight * 0.92}, ${capWidth * 0.8} ${-stemHeight - capHeight * 0.92}, ${capWidth} ${-stemHeight + capHeight * 0.9} Q 0 ${-stemHeight + capHeight * 0.48} ${-capWidth} ${-stemHeight + capHeight * 0.9} Z`}
                fill={mushroom.cap}
              />
              <ellipse
                cx="0"
                cy={-stemHeight + capHeight * 0.84}
                rx={capWidth * 0.78}
                ry={capHeight * 0.34}
                fill={mixColors(mushroom.cap, stem, 0.44)}
                opacity="0.82"
              />
              {Array.from({ length: 4 }).map((__, dotIndex) => (
                <circle
                  key={`mushroom-dot-${index}-${dotIndex}`}
                  cx={
                    -capWidth * 0.45 +
                    dotIndex * (capWidth * 0.3) +
                    seeded(seed, 7400 + index * 7 + dotIndex) * 0.22
                  }
                  cy={
                    -stemHeight -
                    capHeight * 0.26 +
                    seeded(seed, 7410 + index * 7 + dotIndex) * 0.46
                  }
                  r={0.16 * mushroom.scale + seeded(seed, 7420 + index * 7 + dotIndex) * 0.08}
                  fill={dots}
                  opacity="0.86"
                />
              ))}
            </g>
          );
        })}

        {Array.from({ length: 16 }).map((_, index) =>
          index % 3 === 0 ? (
            <path
              key={`mushroom-sparkle-${index}`}
              d={sparklePath(
                width * (0.08 + seeded(seed, 7430 + index) * 0.84),
                height * (0.08 + seeded(seed, 7440 + index) * 0.34),
                0.22 + seeded(seed, 7450 + index) * 0.24,
                0.08 + seeded(seed, 7460 + index) * 0.1,
              )}
              fill={mixColors("#fff8e9", palette.paper, 0.06)}
              opacity="0.7"
            />
          ) : (
            <circle
              key={`mushroom-dot-air-${index}`}
              cx={width * (0.08 + seeded(seed, 7430 + index) * 0.84)}
              cy={height * (0.08 + seeded(seed, 7440 + index) * 0.34)}
              r={0.14 + seeded(seed, 7450 + index) * 0.12}
              fill={
                index % 2 === 0
                  ? mixColors(palette.pop, palette.paper, 0.18)
                  : mixColors(palette.accent, palette.paper, 0.14)
              }
              opacity="0.48"
            />
          ),
        )}
      </g>
      <path
        d={outerPath}
        fill="none"
        stroke={mixColors(palette.border, palette.paper, 0.12)}
        strokeWidth="0.24"
      />
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
        ink={mixColors(palette.ink, palette.paper, 0.18)}
        lines={lines}
      />
    </g>
  );
}
