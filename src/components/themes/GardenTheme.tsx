import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  cloudPath,
  plaquePath,
  cartouchePath,
  roundedRectPath,
  rollingHillPath,
  QuestionText,
  WildflowerSprig,
  MeadowBloom,
} from "./shared";
import { seeded, mixColors } from "../../lib/color";

export function GardenTheme(props: {
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
  const outerId = `${cardId}-garden-outer`;
  const panelId = `${cardId}-garden-panel`;
  const sceneClip = `${cardId}-garden-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const isMood = layout.variant === "mood";
  const panelPath = isMood
    ? roundedRectPath(
        layout.x - 0.42,
        layout.y - 0.42,
        layout.width + 0.84,
        layout.height + 0.84,
        Math.max(2.8, layout.rx - 0.42),
      )
    : cartouchePath(layout.x - 0.45, layout.y - 0.45, layout.width + 0.9, layout.height + 0.9, 1.4);
  const meadowDeep = mixColors("#587260", palette.border, 0.52);
  const meadowSoft = mixColors("#8fb093", palette.soft, 0.48);
  const meadowMist = mixColors("#dcead9", palette.paper, 0.38);
  const mountainFar = mixColors("#b8c6d8", palette.soft, 0.44);
  const mountainNear = mixColors("#9db1b6", palette.border, 0.38);
  const stemColor = mixColors("#5f7b68", palette.border, 0.58);
  const centerColor = mixColors(palette.pop, "#fff4c9", 0.2);
  const mouseBase = mixColors("#8e8794", palette.border, 0.22);
  const mouseSoft = mixColors("#f5f0ef", palette.paper, 0.1);
  const frontSprigs = [
    {
      x: width * 0.1,
      baseY: height - 5,
      height: height * 0.21,
      lean: -0.7,
      scale: 0.72,
      style: "cluster" as const,
      petal: palette.accent,
      opacity: 0.78,
    },
    {
      x: width * 0.19,
      baseY: height - 5.2,
      height: height * 0.25,
      lean: 1,
      scale: 0.62,
      style: "bell" as const,
      petal: mixColors(palette.pop, palette.paper, 0.06),
      opacity: 0.54,
    },
    {
      x: width * 0.86,
      baseY: height - 5.1,
      height: height * 0.24,
      lean: -0.9,
      scale: 0.68,
      style: "cluster" as const,
      petal: palette.accent,
      opacity: 0.72,
    },
    {
      x: width * 0.93,
      baseY: height - 5,
      height: height * 0.27,
      lean: 0.72,
      scale: 0.64,
      style: "bell" as const,
      petal: mixColors(palette.pop, palette.paper, 0.04),
      opacity: 0.62,
    },
  ];
  const heroBlooms = [
    {
      x: width * 0.125,
      baseY: height - 4.7,
      height: height * 0.24,
      lean: 0.85,
      scale: 0.72,
      petal: mixColors(palette.pop, "#fff2ea", 0.16),
      opacity: 0.78,
    },
    {
      x: width * 0.8,
      baseY: height - 4.45,
      height: height * 0.32,
      lean: 1.12,
      scale: 0.88,
      style: "daisy" as const,
      petal: mixColors(palette.soft, "#ffffff", 0.08),
      opacity: 0.95,
    },
  ];
  const middleBlooms = [
    {
      x: width * 0.36,
      baseY: height - 4.8,
      height: height * 0.14,
      lean: -0.55,
      scale: 0.56,
      petal: mixColors(palette.soft, "#ffffff", 0.12),
      opacity: 0.42,
    },
    {
      x: width * 0.49,
      baseY: height - 4.9,
      height: height * 0.16,
      lean: 0.18,
      scale: 0.58,
      petal: mixColors(palette.accent, palette.paper, 0.14),
      opacity: 0.48,
    },
    {
      x: width * 0.63,
      baseY: height - 4.75,
      height: height * 0.145,
      lean: 0.72,
      scale: 0.56,
      petal: mixColors(palette.pop, palette.paper, 0.08),
      opacity: 0.44,
    },
  ];
  const backgroundAnchors = [0.11, 0.26, 0.43, 0.58, 0.71, 0.82, 0.92];
  const backgroundSprigs = backgroundAnchors.map((anchor, index) => {
    const stemHeightMultiplier =
      index >= 4 ? 0.3 + seeded(seed, 270 + index) * 0.16 : 0.22 + seeded(seed, 270 + index) * 0.12;
    const styles: Array<"daisy" | "cluster" | "bell"> = ["bell", "cluster", "daisy"];

    return {
      x: width * anchor,
      baseY: height - 5.3 - seeded(seed, 260 + index) * (index >= 4 ? 1.8 : 1.2),
      height: height * stemHeightMultiplier,
      lean: seeded(seed, 280 + index) * (index >= 4 ? 3.6 : 2.6) - (index >= 4 ? 1.8 : 1.3),
      scale: (index >= 4 ? 0.74 : 0.6) + seeded(seed, 290 + index) * 0.18,
      style: styles[index % styles.length],
      petal:
        index % 3 === 0
          ? palette.soft
          : index % 3 === 1
            ? palette.accent
            : mixColors(palette.pop, palette.paper, 0.1),
      opacity: index >= 4 ? 0.46 + (index % 2) * 0.12 : 0.22 + (index % 2) * 0.08,
    };
  });

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#f6fbff", palette.soft, 0.34)} />
          <stop offset="54%" stopColor={mixColors(palette.paper, "#fffdfa", 0.08)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.accent, 0.16)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#ffffff", palette.paper, 0.06)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, "#fffefd", 0.16)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.72)}
        opacity="0.12"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle
          cx={width * 0.2}
          cy={height * 0.18}
          r={height * 0.26}
          fill={mixColors("#f2fff1", palette.soft, 0.48)}
          opacity="0.28"
        />
        <circle
          cx={width * 0.72}
          cy={height * 0.13}
          r={height * 0.23}
          fill={mixColors("#fef4ff", palette.accent, 0.56)}
          opacity="0.16"
        />
        <circle
          cx={width * 0.46}
          cy={height * 0.12}
          r={height * 0.17}
          fill={mixColors("#ffffff", palette.paper, 0.12)}
          opacity="0.18"
        />
        <g opacity="0.72">
          <circle
            cx={width * 0.57}
            cy={height * 0.18}
            r={height * 0.06}
            fill={mixColors(centerColor, "#fff5cf", 0.12)}
          />
          <path
            d={cloudPath(width * 0.47, height * 0.11, width * 0.17, height * 0.11)}
            fill={mixColors("#ffffff", palette.soft, 0.22)}
            opacity="0.62"
            transform={`scale(0.34) translate(${width * 0.88} ${height * 0.58})`}
          />
          <path
            d={`M ${width * 0.49} ${height * 0.188} q ${width * 0.028} -${height * 0.018} ${width * 0.058} 0`}
            fill="none"
            stroke={mixColors("#ffffff", palette.paper, 0.22)}
            strokeWidth="0.34"
            strokeLinecap="round"
            opacity="0.48"
          />
        </g>
        <path
          d={`M -3 ${height * 0.73} L ${width * 0.08} ${height * 0.55} L ${width * 0.19} ${height * 0.73} L ${width * 0.31} ${height * 0.5} L ${width * 0.44} ${height * 0.73} L ${width * 0.61} ${height * 0.53} L ${width * 0.77} ${height * 0.73} L ${width * 0.92} ${height * 0.57} L ${width + 3} ${height * 0.73} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainFar}
          opacity="0.24"
        />
        <path
          d={`M -3 ${height * 0.77} L ${width * 0.16} ${height * 0.61} L ${width * 0.3} ${height * 0.77} L ${width * 0.49} ${height * 0.58} L ${width * 0.67} ${height * 0.77} L ${width * 0.84} ${height * 0.63} L ${width + 3} ${height * 0.77} L ${width + 3} ${height} L -3 ${height} Z`}
          fill={mountainNear}
          opacity="0.18"
        />
        <path
          d={rollingHillPath(width, height, height * 0.8, height * 0.08, seed, 200)}
          fill={meadowMist}
          opacity="0.9"
        />
        <path
          d={rollingHillPath(width, height, height * 0.86, height * 0.07, seed, 210)}
          fill={meadowSoft}
          opacity="0.58"
        />
        <path
          d={rollingHillPath(width, height, height * 0.92, height * 0.05, seed, 220)}
          fill={meadowDeep}
          opacity="0.32"
        />
        <g opacity="0.86">
          <path
            d={`M 1.4 ${height * 0.328} C ${width * 0.07} ${height * 0.304}, ${width * 0.14} ${height * 0.29}, ${width * 0.22} ${height * 0.31}`}
            fill="none"
            stroke={mixColors(stemColor, palette.paper, 0.12)}
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          <path
            d={`M ${width * 0.1} ${height * 0.305} Q ${width * 0.12} ${height * 0.271} ${width * 0.147} ${height * 0.262}`}
            fill="none"
            stroke={mixColors(stemColor, palette.paper, 0.16)}
            strokeWidth="0.24"
            strokeLinecap="round"
          />
          <ellipse
            cx={width * 0.126}
            cy={height * 0.282}
            rx="1.05"
            ry="0.42"
            fill={mixColors(stemColor, palette.soft, 0.42)}
            transform={`rotate(-24 ${width * 0.126} ${height * 0.282})`}
            opacity="0.66"
          />
          <ellipse
            cx={width * 0.168}
            cy={height * 0.287}
            rx="0.88"
            ry="0.32"
            fill={mixColors(stemColor, palette.soft, 0.36)}
            transform={`rotate(22 ${width * 0.168} ${height * 0.287})`}
            opacity="0.54"
          />
          <g
            transform={`translate(${width * 0.158} ${height * 0.298}) rotate(${seeded(seed, 370) * 10 - 5})`}
          >
            <g transform="translate(0 -1.55) scale(0.72)">
              <path
                d="M -2.7 0.18 Q -1.8 -1.25 0.12 -1.25 Q 2.1 -1.2 2.72 0.12 Q 1.7 1.2 -0.1 1.18 Q -1.95 1.16 -2.7 0.18 Z"
                fill={mixColors(palette.pop, palette.paper, 0.05)}
              />
              <path
                d="M -1.02 -0.08 Q 0.22 -1.4 1.5 -0.22 Q 0.7 0.6 -1.02 -0.08 Z"
                fill={mixColors(palette.accent, palette.paper, 0.1)}
                opacity="0.88"
              />
              <circle
                cx="2.2"
                cy="-0.92"
                r="0.72"
                fill={mixColors(palette.pop, palette.paper, 0.02)}
              />
              <path
                d="M 2.72 -0.92 L 3.88 -0.64 L 2.8 -0.32 Z"
                fill={mixColors(centerColor, palette.paper, 0.06)}
              />
              <circle
                cx="2.38"
                cy="-0.98"
                r="0.11"
                fill={mixColors(palette.ink, palette.paper, 0.06)}
              />
              <path
                d="M -2.58 -0.04 L -4.48 -0.92 L -4.02 -0.08 L -4.8 0.32 Z"
                fill={mixColors(palette.accent, palette.paper, 0.22)}
                opacity="0.82"
              />
              <path
                d="M -0.2 1.4 Q -0.35 2.15 -0.78 2.9"
                fill="none"
                stroke={mixColors(stemColor, palette.paper, 0.16)}
                strokeWidth="0.18"
                strokeLinecap="round"
              />
              <path
                d="M 0.7 1.42 Q 0.9 2.08 1.28 2.76"
                fill="none"
                stroke={mixColors(stemColor, palette.paper, 0.16)}
                strokeWidth="0.18"
                strokeLinecap="round"
              />
              <path
                d="M -0.3 1.05 H 0.95"
                fill="none"
                stroke={mixColors(stemColor, palette.paper, 0.16)}
                strokeWidth="0.14"
                strokeLinecap="round"
                opacity="0.56"
              />
            </g>
          </g>
        </g>
        {backgroundSprigs.map((sprig, index) => (
          <WildflowerSprig
            key={`background-sprig-${index}`}
            x={sprig.x}
            baseY={sprig.baseY}
            height={sprig.height}
            lean={sprig.lean}
            scale={sprig.scale}
            stem={mixColors(stemColor, palette.paper, 0.32)}
            petal={sprig.petal}
            center={centerColor}
            style={sprig.style}
            opacity={sprig.opacity}
          />
        ))}
        {middleBlooms.map((bloom, index) => (
          <MeadowBloom
            key={`middle-bloom-${index}`}
            x={bloom.x}
            baseY={bloom.baseY}
            height={bloom.height}
            lean={bloom.lean}
            scale={bloom.scale}
            stem={mixColors(stemColor, palette.paper, 0.28)}
            petal={bloom.petal}
            center={centerColor}
            opacity={bloom.opacity}
          />
        ))}
        {frontSprigs.map((sprig, index) => (
          <WildflowerSprig
            key={`front-sprig-${index}`}
            x={sprig.x}
            baseY={sprig.baseY}
            height={sprig.height}
            lean={sprig.lean}
            scale={sprig.scale}
            stem={mixColors(stemColor, palette.paper, 0.2)}
            petal={sprig.petal}
            center={centerColor}
            style={sprig.style}
            opacity={sprig.opacity}
          />
        ))}
        {heroBlooms.map((bloom, index) => (
          <MeadowBloom
            key={`hero-bloom-${index}`}
            x={bloom.x}
            baseY={bloom.baseY}
            height={bloom.height}
            lean={bloom.lean}
            scale={bloom.scale}
            stem={mixColors(stemColor, palette.paper, 0.18)}
            petal={bloom.petal}
            center={centerColor}
            opacity={bloom.opacity}
          />
        ))}
        <g
          transform={`translate(${width * 0.35} ${height * 0.806}) rotate(${seeded(seed, 390) * 6 - 3})`}
          opacity="0.92"
        >
          <g transform="scale(0.5)">
            <ellipse
              cx="0.15"
              cy="1.88"
              rx="4.05"
              ry="0.4"
              fill={mixColors(meadowDeep, palette.paper, 0.44)}
              opacity="0.22"
            />
            <path
              d="M -3.1 0.58 q -2.2 -0.22 -3.95 -1.32 q -0.86 -0.54 -1.18 -1.18"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.12)}
              strokeWidth="0.16"
              strokeLinecap="round"
            />
            <path
              d="M -3.18 0.42 Q -2.35 -1.3 0.82 -1.46 Q 3.24 -1.5 4.74 -0.62 Q 5.28 -0.28 5.08 0.34 Q 4.4 1.38 2.32 1.72 Q -0.08 2.06 -2.08 1.34 Q -3 1 -3.18 0.42 Z"
              fill={mouseBase}
            />
            <path
              d="M -0.92 0.08 Q 1.12 -0.94 2.92 -0.18 Q 1.42 0.86 -0.92 0.08 Z"
              fill={mouseSoft}
              opacity="0.52"
            />
            <ellipse
              cx="2.42"
              cy="-1.78"
              rx="0.58"
              ry="0.82"
              fill={mixColors(mouseBase, mouseSoft, 0.28)}
              transform="rotate(-12 2.42 -1.78)"
            />
            <ellipse
              cx="3.32"
              cy="-1.54"
              rx="0.46"
              ry="0.7"
              fill={mixColors(mouseSoft, mouseBase, 0.24)}
              transform="rotate(10 3.32 -1.54)"
            />
            <path
              d="M 4.08 -0.84 Q 5.34 -0.66 5.42 -0.08 Q 4.9 0.26 4.1 0.12 Z"
              fill={mixColors(mouseBase, palette.paper, 0.08)}
            />
            <path
              d="M 5.38 -0.14 L 6.02 0.02 L 5.44 0.24 Z"
              fill={mixColors(centerColor, palette.paper, 0.1)}
            />
            <circle
              cx="4.36"
              cy="-0.82"
              r="0.1"
              fill={mixColors(palette.ink, palette.paper, 0.08)}
            />
            <path
              d="M 5.1 -0.14 q 0.86 0.06 1.48 -0.16"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.06)}
              strokeWidth="0.08"
              strokeLinecap="round"
            />
            <path
              d="M 5.1 0.08 q 0.84 0.14 1.46 0.02"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.06)}
              strokeWidth="0.08"
              strokeLinecap="round"
            />
            <path
              d="M -0.82 1.16 q -0.08 0.68 -0.5 1.22"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.1)}
              strokeWidth="0.1"
              strokeLinecap="round"
            />
            <path
              d="M 1.1 1.14 q 0.08 0.66 0.46 1.2"
              fill="none"
              stroke={mixColors(mouseBase, palette.paper, 0.1)}
              strokeWidth="0.1"
              strokeLinecap="round"
            />
          </g>
        </g>
        {Array.from({ length: 6 }).map((_, index) => (
          <circle
            key={`pollen-${index}`}
            cx={8 + seeded(seed, 330 + index) * (width - 16)}
            cy={height * (0.16 + seeded(seed, 340 + index) * 0.46)}
            r={0.22 + seeded(seed, 350 + index) * 0.34}
            fill={index % 2 === 0 ? palette.pop : palette.accent}
            opacity="0.5"
          />
        ))}
        <g
          transform={`translate(${width - 15.7} ${height * 0.22}) rotate(${seeded(seed, 360) * 18 - 9})`}
          opacity="0.82"
        >
          <ellipse
            cx="-1.5"
            cy="-1"
            rx="1.26"
            ry="1.22"
            fill={mixColors(palette.pop, palette.paper, 0.08)}
            transform="rotate(-26 -1.5 -0.95)"
          />
          <ellipse
            cx="1.45"
            cy="-1"
            rx="1.26"
            ry="1.22"
            fill={mixColors(palette.soft, palette.paper, 0.08)}
            transform="rotate(26 1.45 -1)"
          />
          <ellipse
            cx="-1.05"
            cy="0.96"
            rx="0.82"
            ry="0.96"
            fill={mixColors(palette.accent, palette.paper, 0.16)}
            transform="rotate(18 -1.05 0.95)"
          />
          <ellipse
            cx="1.05"
            cy="0.96"
            rx="0.82"
            ry="0.96"
            fill={mixColors(palette.pop, palette.paper, 0.16)}
            transform="rotate(-18 1.05 0.95)"
          />
          <ellipse
            cx="0"
            cy="0.08"
            rx="0.3"
            ry="1.94"
            fill={mixColors(palette.ink, palette.paper, 0.12)}
            opacity="0.72"
          />
          <path
            d="M -0.1 -1.35 Q -0.75 -2.3 -1.45 -2.45"
            fill="none"
            stroke={mixColors(palette.ink, palette.paper, 0.22)}
            strokeWidth="0.18"
            strokeLinecap="round"
          />
          <path
            d="M 0.1 -1.35 Q 0.75 -2.3 1.45 -2.45"
            fill="none"
            stroke={mixColors(palette.ink, palette.paper, 0.22)}
            strokeWidth="0.18"
            strokeLinecap="round"
          />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="0.24" />
      <path
        d={panelPath}
        fill={mixColors(palette.border, palette.paper, 0.9)}
        opacity="0.02"
        transform="translate(0.4 0.52)"
      />
      <path
        d={panelPath}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={mixColors(palette.border, palette.paper, 0.22)}
        strokeWidth="0.18"
      />
      {!isMood ? (
        <path
          d={`M ${layout.x - 3.3} ${layout.y + layout.height * 0.5} q -2.8 1.4 -2.1 4.1 q 2.6 0.1 4.1 -2.6`}
          fill={mixColors(palette.soft, palette.paper, 0.1)}
          opacity="0.74"
        />
      ) : null}
      {!isMood ? (
        <path
          d={`M ${layout.x + layout.width + 3.3} ${layout.y + layout.height * 0.42} q 2.6 -1.2 2.1 -3.9 q -2.8 0.1 -4 2.5`}
          fill={mixColors(palette.accent, palette.paper, 0.14)}
          opacity="0.7"
        />
      ) : null}
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={mixColors(palette.ink, palette.paper, 0.2)}
        lines={lines}
      />
    </g>
  );
}
