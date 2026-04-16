import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  cloudPath,
  plaquePath,
  cartouchePath,
  roundedRectPath,
  rollingHillPath,
  sparklePath,
  QuestionText,
  WildflowerSprig,
  MeadowBloom,
} from "./shared";
import { seeded, mixColors } from "../../lib/color";

export function GardenNightTheme(props: {
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
  const outerId = `${cardId}-garden-night-outer`;
  const panelId = `${cardId}-garden-night-panel`;
  const sceneClip = `${cardId}-garden-night-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const panelPath =
    layout.variant === "mood"
      ? roundedRectPath(
          layout.x - 0.4,
          layout.y - 0.38,
          layout.width + 0.8,
          layout.height + 0.76,
          Math.max(2.8, layout.rx - 0.4),
        )
      : cartouchePath(
          layout.x - 0.4,
          layout.y - 0.38,
          layout.width + 0.8,
          layout.height + 0.76,
          1.3,
        );
  const nightSky = mixColors("#182437", palette.paper, 0.08);
  const nightSkyHigh = mixColors("#26374c", palette.soft, 0.1);
  const mountainFar = mixColors("#607294", palette.soft, 0.18);
  const mountainNear = mixColors("#475d72", palette.border, 0.14);
  const meadowFar = mixColors("#3b5560", palette.soft, 0.18);
  const meadowNear = mixColors("#2c4349", palette.border, 0.12);
  const stemColor = mixColors("#8fa3b8", palette.soft, 0.18);
  const centerGlow = mixColors("#ffe1a3", palette.pop, 0.14);
  const firefly = mixColors("#ffe8b7", palette.pop, 0.08);
  const frontSprigs = [
    {
      x: width * 0.14,
      baseY: height - 4.9,
      height: height * 0.24,
      lean: -0.7,
      scale: 0.62,
      style: "cluster" as const,
      petal: mixColors("#c7c5ec", palette.accent, 0.2),
      opacity: 0.62,
    },
    {
      x: width * 0.25,
      baseY: height - 5.1,
      height: height * 0.27,
      lean: 0.84,
      scale: 0.58,
      style: "bell" as const,
      petal: mixColors("#f2d0a5", palette.pop, 0.2),
      opacity: 0.54,
    },
    {
      x: width * 0.78,
      baseY: height - 4.8,
      height: height * 0.31,
      lean: 1.02,
      scale: 0.78,
      style: "daisy" as const,
      petal: mixColors("#d9d8fb", palette.soft, 0.22),
      opacity: 0.86,
    },
    {
      x: width * 0.89,
      baseY: height - 5,
      height: height * 0.25,
      lean: -0.66,
      scale: 0.62,
      style: "cluster" as const,
      petal: mixColors("#dba6bc", palette.accent, 0.22),
      opacity: 0.68,
    },
  ];
  const middleBlooms = [
    {
      x: width * 0.39,
      baseY: height - 4.9,
      height: height * 0.16,
      lean: -0.48,
      scale: 0.5,
      petal: mixColors("#d7d8f5", palette.soft, 0.24),
      opacity: 0.28,
    },
    {
      x: width * 0.56,
      baseY: height - 4.85,
      height: height * 0.18,
      lean: 0.36,
      scale: 0.54,
      petal: mixColors("#f4d8aa", palette.pop, 0.24),
      opacity: 0.34,
    },
  ];

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={nightSkyHigh} />
          <stop offset="55%" stopColor={nightSky} />
          <stop offset="100%" stopColor={mixColors("#16202f", palette.paper, 0.06)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffdf7", palette.paper, 0.08)} />
          <stop offset="100%" stopColor={mixColors("#f6f6ff", palette.paper, 0.14)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.58)}
        opacity="0.14"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle
          cx={width * 0.72}
          cy={height * 0.19}
          r={height * 0.09}
          fill={mixColors("#fff3c8", firefly, 0.18)}
          opacity="0.88"
        />
        <circle
          cx={width * 0.72}
          cy={height * 0.19}
          r={height * 0.14}
          fill={mixColors("#fff2c8", palette.paper, 0.22)}
          opacity="0.1"
        />
        <path
          d={cloudPath(width * 0.5, height * 0.14, width * 0.18, height * 0.11)}
          fill={mixColors("#edf3ff", palette.soft, 0.16)}
          opacity="0.16"
          transform={`scale(0.36) translate(${width * 0.82} ${height * 0.52})`}
        />
        {Array.from({ length: 16 }).map((_, index) => {
          const starX = 7 + seeded(seed, 500 + index) * (width - 14);
          const starY = 4 + seeded(seed, 520 + index) * (height * 0.34);
          const outer = 0.34 + seeded(seed, 540 + index) * 0.5;

          return index % 4 === 0 ? (
            <path
              key={`night-star-${index}`}
              d={sparklePath(starX, starY, outer, outer * 0.34)}
              fill={mixColors("#f9f7ff", palette.paper, 0.08)}
              opacity="0.84"
            />
          ) : (
            <circle
              key={`night-star-${index}`}
              cx={starX}
              cy={starY}
              r={outer}
              fill={mixColors("#f7f4ff", palette.paper, 0.12)}
              opacity={index % 2 === 0 ? 0.74 : 0.58}
            />
          );
        })}
        {Array.from({ length: 6 }).map((_, index) => (
          <path
            key={`night-spark-cluster-${index}`}
            d={sparklePath(
              width * (0.1 + seeded(seed, 900 + index) * 0.8),
              height * (0.08 + seeded(seed, 920 + index) * 0.18),
              0.34 + seeded(seed, 940 + index) * 0.28,
              0.14 + seeded(seed, 960 + index) * 0.08,
            )}
            fill={
              index % 2 === 0
                ? mixColors("#fff8e8", palette.paper, 0.08)
                : mixColors("#dde2ff", palette.paper, 0.14)
            }
            opacity="0.68"
          />
        ))}
        <path
          d={`M -3 ${height * 0.72} L ${width * 0.1} ${height * 0.54} L ${width * 0.21} ${height * 0.72} L ${width * 0.33} ${height * 0.5} L ${width * 0.46} ${height * 0.72} L ${width * 0.62} ${height * 0.55} L ${width * 0.77} ${height * 0.72} L ${width * 0.92} ${height * 0.58} L ${width + 3} ${height * 0.72} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainFar}
          opacity="0.26"
        />
        <path
          d={`M -3 ${height * 0.78} L ${width * 0.16} ${height * 0.64} L ${width * 0.29} ${height * 0.78} L ${width * 0.47} ${height * 0.6} L ${width * 0.66} ${height * 0.78} L ${width * 0.83} ${height * 0.65} L ${width + 3} ${height * 0.78} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainNear}
          opacity="0.22"
        />
        <path
          d={rollingHillPath(width, height, height * 0.82, height * 0.07, seed, 600)}
          fill={mixColors(meadowFar, palette.paper, 0.08)}
          opacity="0.76"
        />
        <path
          d={rollingHillPath(width, height, height * 0.88, height * 0.06, seed, 610)}
          fill={meadowFar}
          opacity="0.58"
        />
        <path
          d={rollingHillPath(width, height, height * 0.93, height * 0.045, seed, 620)}
          fill={meadowNear}
          opacity="0.46"
        />

        <g opacity="0.7">
          <path
            d={`M 1.4 ${height * 0.33} C ${width * 0.07} ${height * 0.308}, ${width * 0.14} ${height * 0.296}, ${width * 0.22} ${height * 0.312}`}
            fill="none"
            stroke={mixColors(stemColor, palette.paper, 0.18)}
            strokeWidth="0.18"
            strokeLinecap="round"
          />
          <g
            transform={`translate(${width * 0.158} ${height * 0.286}) rotate(${seeded(seed, 630) * 6 - 3})`}
          >
            <g transform="translate(0 -1.54) scale(0.72)">
              <path
                d="M -0.95 -1.45 L -0.3 -2.45 L 0.08 -1.28 Z"
                fill={mixColors("#b8bad9", palette.border, 0.18)}
              />
              <path
                d="M 0.95 -1.45 L 0.3 -2.45 L -0.08 -1.28 Z"
                fill={mixColors("#b8bad9", palette.border, 0.18)}
              />
              <ellipse
                cx="0"
                cy="0.02"
                rx="2.05"
                ry="2.28"
                fill={mixColors("#a8acc8", palette.border, 0.16)}
              />
              <ellipse
                cx="0"
                cy="0.44"
                rx="1.42"
                ry="1.38"
                fill={mixColors("#edf2ff", palette.paper, 0.18)}
                opacity="0.72"
              />
              <circle
                cx="-0.72"
                cy="-0.18"
                r="0.62"
                fill={mixColors("#f7f9ff", palette.paper, 0.08)}
              />
              <circle
                cx="0.72"
                cy="-0.18"
                r="0.62"
                fill={mixColors("#f7f9ff", palette.paper, 0.08)}
              />
              <circle
                cx="-0.72"
                cy="-0.18"
                r="0.16"
                fill={mixColors("#1d2838", palette.paper, 0.12)}
              />
              <circle
                cx="0.72"
                cy="-0.18"
                r="0.16"
                fill={mixColors("#1d2838", palette.paper, 0.12)}
              />
              <path
                d="M -0.22 0.44 L 0 0.78 L 0.22 0.44 Z"
                fill={mixColors("#f4d8a6", palette.pop, 0.14)}
              />
              <path
                d="M -0.5 1.82 Q -0.55 2.42 -0.92 2.92"
                fill="none"
                stroke={mixColors(stemColor, palette.paper, 0.18)}
                strokeWidth="0.14"
                strokeLinecap="round"
              />
              <path
                d="M 0.5 1.82 Q 0.55 2.42 0.92 2.92"
                fill="none"
                stroke={mixColors(stemColor, palette.paper, 0.18)}
                strokeWidth="0.14"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>

        {Array.from({ length: 6 }).map((_, index) => (
          <circle
            key={`firefly-${index}`}
            cx={width * (0.12 + seeded(seed, 640 + index) * 0.74)}
            cy={height * (0.28 + seeded(seed, 660 + index) * 0.42)}
            r={0.26 + seeded(seed, 680 + index) * 0.42}
            fill={firefly}
            opacity={0.64 + (index % 2) * 0.14}
          />
        ))}

        {middleBlooms.map((bloom, index) => (
          <MeadowBloom
            key={`night-middle-bloom-${index}`}
            x={bloom.x}
            baseY={bloom.baseY}
            height={bloom.height}
            lean={bloom.lean}
            scale={bloom.scale}
            stem={mixColors(stemColor, palette.paper, 0.24)}
            petal={bloom.petal}
            center={centerGlow}
            opacity={bloom.opacity}
          />
        ))}
        {frontSprigs.map((sprig, index) => (
          <WildflowerSprig
            key={`night-front-sprig-${index}`}
            x={sprig.x}
            baseY={sprig.baseY}
            height={sprig.height}
            lean={sprig.lean}
            scale={sprig.scale}
            stem={mixColors(stemColor, palette.paper, 0.22)}
            petal={sprig.petal}
            center={centerGlow}
            style={sprig.style}
            opacity={sprig.opacity}
          />
        ))}
        <MeadowBloom
          x={width * 0.8}
          baseY={height - 4.55}
          height={height * 0.31}
          lean={1.02}
          scale={0.82}
          stem={mixColors(stemColor, palette.paper, 0.22)}
          petal={mixColors("#d9d8fb", palette.soft, 0.22)}
          center={centerGlow}
          opacity={0.88}
        />
        <g
          transform={`translate(${width - 15.7} ${height * 0.22}) rotate(${seeded(seed, 700) * 18 - 9})`}
          opacity="0.68"
        >
          <ellipse
            cx="-1.3"
            cy="-0.94"
            rx="1.02"
            ry="1.12"
            fill={mixColors("#dad7f5", palette.soft, 0.18)}
            transform="rotate(-28 -1.3 -0.94)"
          />
          <ellipse
            cx="1.28"
            cy="-0.94"
            rx="1.02"
            ry="1.12"
            fill={mixColors("#f3d8a8", palette.pop, 0.18)}
            transform="rotate(28 1.28 -0.94)"
          />
          <ellipse
            cx="-0.9"
            cy="0.88"
            rx="0.66"
            ry="0.86"
            fill={mixColors("#b7b7d9", palette.accent, 0.18)}
            transform="rotate(18 -0.9 0.88)"
          />
          <ellipse
            cx="0.9"
            cy="0.88"
            rx="0.66"
            ry="0.86"
            fill={mixColors("#f0c998", palette.pop, 0.18)}
            transform="rotate(-18 0.9 0.88)"
          />
          <ellipse
            cx="0"
            cy="0.08"
            rx="0.22"
            ry="1.7"
            fill={mixColors("#dcdff0", palette.paper, 0.18)}
            opacity="0.72"
          />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="0.24" />
      <path
        d={panelPath}
        fill={mixColors(palette.paper, "#101827", 0.18)}
        opacity="0.14"
        transform="translate(0.4 0.52)"
      />
      <path
        d={panelPath}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={mixColors(palette.paper, palette.border, 0.18)}
        strokeWidth="0.18"
      />
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={mixColors("#eef4ff", "#566c8e", 0.78)}
        lines={lines}
      />
    </g>
  );
}
