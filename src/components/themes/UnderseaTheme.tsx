import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  rollingHillPath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function UnderseaTheme(props: {
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
  const outerId = `${cardId}-undersea-outer`;
  const panelId = `${cardId}-undersea-panel`;
  const rayId = `${cardId}-undersea-ray`;
  const sceneClip = `${cardId}-undersea-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
    const panel = {
    x: layout.x - 0.42,
    y: layout.y - 0.4,
    width: layout.width + 0.84,
    height: layout.height + 0.8,
    rx: Math.max(2.8, layout.rx - 0.44),
  };
  const waterTop = mixColors("#8cd6ea", palette.soft, 0.12);
  const waterMid = mixColors("#5ea8c8", palette.accent, 0.18);
  const waterDeep = mixColors("#2b5d7e", palette.border, 0.12);
  const sand = mixColors("#d7c6a4", palette.pop, 0.32);
  const reef = mixColors("#65769a", palette.border, 0.18);
  const algaeA = mixColors("#6bbfa0", palette.soft, 0.18);
  const algaeB = mixColors("#8fce7f", palette.pop, 0.28);
  const algaeC = mixColors("#6f9ec0", palette.accent, 0.2);
  const frameBorder = enrichColor(mixColors(algaeC, waterDeep, 0.42), {
    hueShift: -8 + seeded(seed, 4450) * 18,
    saturationMult: 1.18,
    lightnessShift: -0.02,
  });
    const panelStroke = mixColors(frameBorder, palette.paper, 0.18);
  const fishColors = [
    enrichColor(mixColors("#ffb578", palette.pop, 0.04), {
      saturationMult: 1.28,
      lightnessShift: -0.05,
    }),
    enrichColor(mixColors("#f092bf", palette.accent, 0.04), {
      saturationMult: 1.26,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors("#8ed5d9", palette.soft, 0.08), {
      saturationMult: 1.18,
      lightnessShift: -0.08,
    }),
    enrichColor(mixColors("#cab6ff", palette.border, 0.08), {
      saturationMult: 1.18,
      lightnessShift: -0.04,
    }),
  ];
  const jellyA = mixColors("#f7c6de", palette.accent, 0.1);
  const jellyB = mixColors("#bddbff", palette.soft, 0.1);
  const bubble = mixColors("#f3fbff", palette.paper, 0.04);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={waterTop} />
          <stop offset="56%" stopColor={waterMid} />
          <stop offset="100%" stopColor={waterDeep} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefd", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#f6fcff", palette.paper, 0.12)} />
        </linearGradient>
        <linearGradient id={rayId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            stopColor={mixColors("#ffffff", palette.paper, 0.02)}
            stopOpacity="0.52"
          />
          <stop
            offset="100%"
            stopColor={mixColors("#ffffff", palette.paper, 0.16)}
            stopOpacity="0"
          />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(frameBorder, palette.soft, 0.78)}
        opacity="0.14"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        {Array.from({ length: 4 }).map((_, index) => {
          const x = width * (0.08 + index * 0.22);
          const topWidth = width * (0.06 + index * 0.012);
          const bottomWidth = width * (0.16 + index * 0.02);
          return (
            <path
              key={`undersea-ray-${index}`}
              d={`M ${x} 0 L ${x + topWidth} 0 L ${x + bottomWidth} ${height * 0.72} L ${x - bottomWidth * 0.24} ${height * 0.72} Z`}
              fill={`url(#${rayId})`}
              opacity={0.22 + index * 0.04}
            />
          );
        })}
        <path
          d={rollingHillPath(width, height, height * 0.92, height * 0.05, seed, 4000)}
          fill={sand}
          opacity="0.88"
        />
        <path
          d={rollingHillPath(width, height, height * 0.87, height * 0.07, seed, 4010)}
          fill={mixColors(reef, waterMid, 0.18)}
          opacity="0.3"
        />
        <path
          d={rollingHillPath(width, height, height * 0.95, height * 0.03, seed, 4020)}
          fill={mixColors(sand, palette.paper, 0.22)}
          opacity="0.26"
        />
        {Array.from({ length: 18 }).map((_, index) => (
          <circle
            key={`bubble-${index}`}
            cx={width * (0.08 + seeded(seed, 4030 + index) * 0.84)}
            cy={height * (0.08 + seeded(seed, 4060 + index) * 0.76)}
            r={0.14 + seeded(seed, 4090 + index) * 0.34}
            fill="none"
            stroke={bubble}
            strokeWidth="0.12"
            opacity={0.34 + (index % 3) * 0.1}
          />
        ))}
        {Array.from({ length: 52 }).map((_, index) => {
          const x = width * (0.04 + seeded(seed, 4120 + index) * 0.92);
          const y = height * (0.12 + seeded(seed, 4160 + index) * 0.64);
          const scale = 0.28 + seeded(seed, 4200 + index) * 0.98;
          const color = fishColors[index % fishColors.length];
          const depth = seeded(seed, 4280 + index);
          const body =
            depth < 0.34
              ? mixColors(color, waterTop, 0.26)
              : depth < 0.58
                ? mixColors(color, waterMid, 0.16)
                : color;
          const outline = mixColors(color, waterDeep, depth < 0.46 ? 0.3 : 0.42);
          return (
            <g
              key={`fish-${index}`}
              transform={`translate(${x} ${y}) scale(${scale}) rotate(${seeded(seed, 4240 + index) > 0.5 ? 0 : 180})`}
            >
              <ellipse
                cx="0"
                cy="0"
                rx="1.7"
                ry="0.9"
                fill={body}
                stroke={outline}
                strokeWidth="0.12"
              />
              <path
                d="M -1.7 0 L -3 1 L -3 -1 Z"
                fill={mixColors(body, outline, 0.26)}
                stroke={outline}
                strokeWidth="0.08"
                strokeLinejoin="round"
              />
              <path
                d="M 0.2 -0.18 q 0.95 -0.38 1.28 0"
                fill="none"
                stroke={mixColors("#fffaf4", body, 0.08)}
                strokeWidth="0.14"
                strokeLinecap="round"
                opacity="0.78"
              />
              <circle
                cx="1.05"
                cy="-0.14"
                r="0.1"
                fill={mixColors("#243b4d", palette.border, 0.06)}
              />
            </g>
          );
        })}
        {Array.from({ length: 36 }).map((_, index) => {
          const x = width * (0.04 + seeded(seed, 4700 + index) * 0.92);
          const y = height * (0.14 + seeded(seed, 4760 + index) * 0.58);
          const scale = 0.16 + seeded(seed, 4820 + index) * 0.24;
          const direction = seeded(seed, 4880 + index) > 0.5 ? 1 : -1;
          const body = mixColors(waterTop, palette.paper, 0.28 + seeded(seed, 4940 + index) * 0.14);

          return (
            <g
              key={`fish-background-${index}`}
              transform={`translate(${x} ${y}) scale(${scale * direction} ${scale})`}
            >
              <ellipse cx="0" cy="0" rx="1.7" ry="0.86" fill={body} />
              <path d="M -1.7 0 L -3 1 L -3 -1 Z" fill={mixColors(body, waterDeep, 0.22)} />
            </g>
          );
        })}
        {Array.from({ length: 2 }).map((_, index) => {
          const x = width * (0.2 + index * 0.5);
          const y = height * (0.34 + index * 0.06);
          const jelly = index % 2 === 0 ? jellyA : jellyB;
          return (
            <g key={`jelly-${index}`} transform={`translate(${x} ${y})`} opacity="0.72">
              <path
                d="M -1.6 0.1 q 0.4 -1.6 1.8 -1.7 q 1.5 0.06 1.88 1.7 q -0.6 0.7 -1.86 0.7 q -1.28 0 -1.82 -0.7 Z"
                fill={jelly}
              />
              {[-1, -0.4, 0.2, 0.8].map((tx, tentacleIndex) => (
                <path
                  key={`jelly-tentacle-${tentacleIndex}`}
                  d={`M ${tx} 0.72 q ${tentacleIndex % 2 === 0 ? -0.18 : 0.18} 0.86 ${tentacleIndex % 2 === 0 ? -0.06 : 0.06} 1.78`}
                  fill="none"
                  stroke={mixColors(jelly, palette.paper, 0.14)}
                  strokeWidth="0.12"
                  strokeLinecap="round"
                  opacity="0.78"
                />
              ))}
            </g>
          );
        })}
        {Array.from({ length: 8 }).map((_, index) => {
          const x = width * (0.06 + index * 0.12);
          const baseY = height * (0.92 + seeded(seed, 4300 + index) * 0.03);
          const tipY = baseY - height * (0.12 + seeded(seed, 4340 + index) * 0.2);
          const bend = (seeded(seed, 4380 + index) - 0.5) * width * 0.06;
          const color = index % 3 === 0 ? algaeA : index % 3 === 1 ? algaeB : algaeC;
          const midY = (baseY + tipY) / 2;
          const bodyWidth = 0.3 + (index % 2) * 0.08;
          const leftBase = x - bodyWidth;
          const rightBase = x + bodyWidth;
          const leftMid = x + bend * 0.36 - bodyWidth * 0.72;
          const rightMid = x + bend * 0.36 + bodyWidth * 0.72;
          const leftTip = x + bend - bodyWidth * 0.26;
          const rightTip = x + bend + bodyWidth * 0.26;
          return (
            <g key={`seaweed-${index}`} opacity={0.82 - (index % 3) * 0.08}>
              <path
                d={`M ${leftBase} ${baseY}
                    Q ${leftMid} ${midY} ${leftTip} ${tipY}
                    Q ${x + bend * 0.62} ${tipY - height * 0.012} ${rightTip} ${tipY + height * 0.01}
                    Q ${rightMid} ${midY + height * 0.01} ${rightBase} ${baseY}
                    Q ${x + bend * 0.1} ${baseY - height * 0.022} ${leftBase} ${baseY} Z`}
                fill={mixColors(color, palette.paper, 0.08)}
                stroke={mixColors(color, waterDeep, 0.16)}
                strokeWidth="0.08"
                strokeLinejoin="round"
              />
              <path
                d={`M ${x + bend * 0.12} ${baseY - height * 0.05}
                    q ${width * 0.014} -${height * 0.016} ${width * 0.028} 0
                    q -${width * 0.01} ${height * 0.016} -${width * 0.028} 0 Z`}
                fill={mixColors(color, palette.paper, 0.22)}
                opacity="0.78"
              />
              <path
                d={`M ${x + bend * 0.34} ${midY + height * 0.02}
                    q ${width * 0.012} -${height * 0.014} ${width * 0.024} 0
                    q -${width * 0.008} ${height * 0.015} -${width * 0.024} 0 Z`}
                fill={mixColors(color, palette.paper, 0.18)}
                opacity="0.7"
              />
              <path
                d={`M ${x + bend * 0.5} ${tipY + height * 0.045}
                    q ${width * 0.014} -${height * 0.018} ${width * 0.026} 0
                    q -${width * 0.009} ${height * 0.017} -${width * 0.026} 0 Z`}
                fill={mixColors(color, palette.paper, 0.14)}
                opacity="0.68"
              />
            </g>
          );
        })}
        <g transform={`translate(${width * 0.86} ${height * 0.86})`} opacity="0.76">
          <path
            d="M -0.8 0 L -0.2 -3.2 L 0.7 0 Z"
            fill={mixColors("#b995f0", palette.accent, 0.16)}
          />
          <path
            d="M 0.2 0.1 L 1.1 -2.6 L 1.8 0.18 Z"
            fill={mixColors("#8fd7d7", palette.soft, 0.14)}
          />
          <path
            d="M -1.5 0.12 L -0.92 -1.9 L -0.3 0.16 Z"
            fill={mixColors("#f4bc88", palette.pop, 0.14)}
          />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={frameBorder} strokeWidth="0.24" />
      <rect
        x={panel.x + 0.35}
        y={panel.y + 0.45}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={mixColors(palette.border, waterDeep, 0.74)}
        opacity="0.1"
      />
      <rect
        x={panel.x}
        y={panel.y}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={panelStroke}
        strokeWidth="0.18"
      />
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={mixColors("#35576f", palette.ink, 0.26)}
        lines={lines}
      />
    </g>
  );
}
