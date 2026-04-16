import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function FlowersTheme(props: {
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
  const outerId = `${cardId}-flowers-outer`;
  const panelId = `${cardId}-flowers-panel`;
  const sceneClip = `${cardId}-flowers-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
    const panel = {
    x: layout.x - 0.38,
    y: layout.y - 0.36,
    width: layout.width + 0.76,
    height: layout.height + 0.72,
    rx: Math.max(2.6, layout.rx - 0.48),
  };
  const flowerColors = [
    enrichColor(mixColors(palette.accent, "#ffbfd8", 0.02), {
      saturationMult: 1.3,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(palette.pop, "#ffd782", 0.03), {
      saturationMult: 1.28,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors(palette.soft, "#d5fff1", 0.05), {
      saturationMult: 1.18,
      lightnessShift: -0.06,
    }),
    enrichColor(mixColors(palette.border, "#d7c0ff", 0.06), {
      saturationMult: 1.2,
      lightnessShift: 0.02,
    }),
    enrichColor(mixColors("#f6b8a8", palette.pop, 0.08), {
      saturationMult: 1.18,
      lightnessShift: -0.02,
    }),
    enrichColor(mixColors("#bfe3c8", palette.soft, 0.12), {
      saturationMult: 1.14,
      lightnessShift: -0.04,
    }),
  ];
  const centers = [
    mixColors("#fff0a8", palette.pop, 0.04),
    mixColors("#fff7dc", palette.paper, 0.06),
    mixColors("#ffd8a0", palette.pop, 0.12),
  ];
  const leafColors = [
    enrichColor(mixColors("#b7e0b7", palette.soft, 0.14), {
      saturationMult: 1.08,
      lightnessShift: -0.06,
    }),
    enrichColor(mixColors("#9fd2c3", palette.accent, 0.16), {
      saturationMult: 1.06,
      lightnessShift: -0.04,
    }),
    enrichColor(mixColors("#d7efc8", palette.paper, 0.22), {
      saturationMult: 1.04,
      lightnessShift: -0.08,
    }),
  ];
  const frameBorder = enrichColor(mixColors(palette.soft, palette.border, 0.34), {
    hueShift: -12 + seeded(seed, 9000) * 22,
    saturationMult: 1.08,
    lightnessShift: -0.02,
  });
    const panelShadow = mixColors(frameBorder, palette.paper, 0.76);

  const renderFlower = (
    x: number,
    y: number,
    scale: number,
    rotation: number,
    color: string,
    center: string,
    style: number,
    opacity: number,
  ) => {
    if (style === 0) {
      return (
        <g transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
          {Array.from({ length: 6 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 6;
            const px = x + Math.cos(angle) * 1.15 * scale;
            const py = y + Math.sin(angle) * 1.15 * scale;
            return (
              <ellipse
                key={`flower-a-${x}-${y}-${index}`}
                cx={px}
                cy={py}
                rx={0.52 * scale}
                ry={1.08 * scale}
                fill={color}
                transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
              />
            );
          })}
          <circle cx={x} cy={y} r={0.58 * scale} fill={center} />
        </g>
      );
    }

    if (style === 1) {
      return (
        <g transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
          {Array.from({ length: 5 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 5;
            const px = x + Math.cos(angle) * 1.05 * scale;
            const py = y + Math.sin(angle) * 1.05 * scale;
            return (
              <circle
                key={`flower-b-${x}-${y}-${index}`}
                cx={px}
                cy={py}
                r={0.82 * scale}
                fill={color}
              />
            );
          })}
          <circle cx={x} cy={y} r={0.52 * scale} fill={center} />
        </g>
      );
    }

    return (
      <g transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 8;
          const px = x + Math.cos(angle) * 1.26 * scale;
          const py = y + Math.sin(angle) * 1.26 * scale;
          return (
            <ellipse
              key={`flower-c-${x}-${y}-${index}`}
              cx={px}
              cy={py}
              rx={0.38 * scale}
              ry={0.94 * scale}
              fill={color}
              transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
            />
          );
        })}
        <circle cx={x} cy={y} r={0.46 * scale} fill={center} />
      </g>
    );
  };

  const renderLeafSprig = (
    x: number,
    y: number,
    scale: number,
    rotation: number,
    color: string,
    opacity: number,
  ) => (
    <g transform={`rotate(${rotation} ${x} ${y})`} opacity={opacity}>
      <path
        d={`M ${x - 1.9 * scale} ${y + 1.8 * scale} Q ${x - 0.2 * scale} ${y} ${x + 1.6 * scale} ${y - 1.7 * scale}`}
        fill="none"
        stroke={mixColors(color, palette.border, 0.12)}
        strokeWidth={0.14 * scale}
        strokeLinecap="round"
      />
      <ellipse
        cx={x - 0.7 * scale}
        cy={y + 0.64 * scale}
        rx={0.58 * scale}
        ry={0.22 * scale}
        fill={color}
        transform={`rotate(-28 ${x - 0.7 * scale} ${y + 0.64 * scale})`}
      />
      <ellipse
        cx={x + 0.2 * scale}
        cy={y - 0.08 * scale}
        rx={0.66 * scale}
        ry={0.24 * scale}
        fill={color}
        transform={`rotate(22 ${x + 0.2 * scale} ${y - 0.08 * scale})`}
      />
      <ellipse
        cx={x + 1.06 * scale}
        cy={y - 0.8 * scale}
        rx={0.52 * scale}
        ry={0.2 * scale}
        fill={mixColors(color, palette.paper, 0.08)}
        transform={`rotate(-14 ${x + 1.06 * scale} ${y - 0.8 * scale})`}
      />
    </g>
  );

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
        fill={mixColors(frameBorder, palette.soft, 0.78)}
        opacity="0.12"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle
          cx={width * 0.16}
          cy={height * 0.2}
          r={height * 0.18}
          fill={mixColors(flowerColors[0], palette.paper, 0.8)}
          opacity="0.14"
        />
        <circle
          cx={width * 0.82}
          cy={height * 0.2}
          r={height * 0.2}
          fill={mixColors(flowerColors[1], palette.paper, 0.82)}
          opacity="0.12"
        />
        {Array.from({ length: 20 }).map((_, index) => {
          const side = index % 4;
          const x =
            side === 0
              ? width * (-0.04 + seeded(seed, 9010 + index) * 0.12)
              : side === 1
                ? width * (0.88 + seeded(seed, 9010 + index) * 0.16)
                : width * (0.08 + seeded(seed, 9010 + index) * 0.84);
          const y =
            side === 2
              ? height * (-0.06 + seeded(seed, 9050 + index) * 0.18)
              : side === 3
                ? height * (0.84 + seeded(seed, 9050 + index) * 0.18)
                : height * (0.08 + seeded(seed, 9050 + index) * 0.82);
          const scale = 1.16 + seeded(seed, 9090 + index) * 1.2;
          const style = Math.floor(seeded(seed, 9130 + index) * 3);
          const rotation = seeded(seed, 9170 + index) * 90 - 45;
          const color = flowerColors[(index + 2) % flowerColors.length];
          const center = centers[(index + 1) % centers.length];
          return (
            <g key={`flower-edge-${index}`}>
              {renderFlower(x, y, scale, rotation, color, center, style, 0.78)}
            </g>
          );
        })}
        {Array.from({ length: 144 }).map((_, index) => {
          const x = width * (-0.02 + seeded(seed, 9100 + index) * 1.04);
          const y = height * (-0.02 + seeded(seed, 9220 + index) * 1.04);
          const scale = 0.22 + seeded(seed, 9340 + index) * 1.34;
          const style = Math.floor(seeded(seed, 9460 + index) * 3);
          const rotation = seeded(seed, 9580 + index) * 60 - 30;
          const color = flowerColors[index % flowerColors.length];
          const center = centers[index % centers.length];
          const opacity = scale > 1.1 ? 0.86 : scale > 0.7 ? 0.72 : 0.58;
          return (
            <g key={`flower-pattern-${index}`}>
              {renderFlower(x, y, scale, rotation, color, center, style, opacity)}
            </g>
          );
        })}
        {Array.from({ length: 28 }).map((_, index) => {
          const x = width * (0.04 + seeded(seed, 9620 + index) * 0.92);
          const y = height * (0.06 + seeded(seed, 9660 + index) * 0.86);
          const scale = 0.66 + seeded(seed, 9700 + index) * 0.52;
          const rotation = seeded(seed, 9740 + index) * 140 - 70;
          const color = leafColors[index % leafColors.length];
          return (
            <g key={`flower-leaf-${index}`}>
              {renderLeafSprig(x, y, scale, rotation, color, 0.42)}
            </g>
          );
        })}
        {Array.from({ length: 48 }).map((_, index) => {
          const x = width * (0.04 + seeded(seed, 9780 + index) * 0.92);
          const y = height * (0.06 + seeded(seed, 9820 + index) * 0.86);
          const scale = 0.12 + seeded(seed, 9860 + index) * 0.22;
          const rotation = seeded(seed, 9900 + index) * 70 - 35;
          const color = flowerColors[(index + 3) % flowerColors.length];
          const center = centers[(index + 2) % centers.length];
          return (
            <g key={`flower-micro-${index}`}>
              {renderFlower(x, y, scale, rotation, color, center, index % 2, 0.6)}
            </g>
          );
        })}
        {Array.from({ length: 88 }).map((_, index) => (
          <circle
            key={`flowers-dot-${index}`}
            cx={width * (0.02 + seeded(seed, 9700 + index) * 0.96)}
            cy={height * (0.04 + seeded(seed, 9800 + index) * 0.92)}
            r={0.08 + seeded(seed, 9900 + index) * 0.18}
            fill={flowerColors[index % flowerColors.length]}
            opacity={0.22 + (index % 3) * 0.08}
          />
        ))}
      </g>
      <path d={outerPath} fill="none" stroke={frameBorder} strokeWidth="0.24" />
      <rect
        x={panel.x + 0.34}
        y={panel.y + 0.42}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={panelShadow}
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
        stroke={mixColors(frameBorder, palette.paper, 0.18)}
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
