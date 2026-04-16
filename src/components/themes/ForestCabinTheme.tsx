import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  roundedRectPath,
  rollingHillPath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function ForestCabinTheme(props: {
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
  const outerId = `${cardId}-forest-outer`;
  const panelId = `${cardId}-forest-panel`;
  const sceneClip = `${cardId}-forest-scene`;
  const outerPath = roundedRectPath(1.2, 1.2, width - 2.4, height - 2.4, 5.6);
  const panelPath = roundedRectPath(
    layout.x - 0.5,
    layout.y - 0.5,
    layout.width + 1,
    layout.height + 1,
    Math.max(2.6, layout.rx - 0.18),
  );
  const hueDrift = (seeded(seed, 6100) - 0.5) * 56;
  const skyTop = enrichColor(mixColors(palette.border, palette.soft, 0.16), {
    hueShift: hueDrift - 18,
    saturationMult: 1.22,
    lightnessShift: -0.08,
  });
  const skyMid = enrichColor(mixColors(palette.soft, palette.accent, 0.2), {
    hueShift: hueDrift + 6,
    saturationMult: 1.2,
    lightnessShift: -0.02,
  });
  const skyBottom = enrichColor(mixColors(palette.pop, palette.paper, 0.16), {
    hueShift: hueDrift + 16,
    saturationMult: 1.16,
    lightnessShift: 0.04,
  });
  const hillFar = enrichColor(mixColors(palette.soft, palette.accent, 0.34), {
    hueShift: hueDrift - 8,
    saturationMult: 1.18,
    lightnessShift: -0.1,
  });
  const hillNear = enrichColor(mixColors(palette.border, palette.accent, 0.26), {
    hueShift: hueDrift - 22,
    saturationMult: 1.18,
    lightnessShift: -0.18,
  });
  const pinePalette = [
    enrichColor(mixColors(palette.soft, palette.accent, 0.1), {
      hueShift: -26 + seeded(seed, 6110) * 34,
      saturationMult: 1.24,
      lightnessShift: -0.08,
    }),
    enrichColor(mixColors(palette.pop, palette.soft, 0.42), {
      hueShift: 12 + seeded(seed, 6112) * 30,
      saturationMult: 1.26,
      lightnessShift: -0.06,
    }),
    enrichColor(mixColors(palette.border, palette.accent, 0.18), {
      hueShift: -12 + seeded(seed, 6114) * 44,
      saturationMult: 1.2,
      lightnessShift: -0.12,
    }),
    enrichColor(mixColors(palette.accent, palette.paper, 0.08), {
      hueShift: -34 + seeded(seed, 6116) * 52,
      saturationMult: 1.18,
      lightnessShift: -0.08,
    }),
  ];
  const cabinWall = enrichColor(mixColors(palette.pop, palette.accent, 0.34), {
    hueShift: 4 + seeded(seed, 6120) * 34,
    saturationMult: 1.3,
    lightnessShift: -0.02,
  });
  const cabinRoof = enrichColor(mixColors(palette.border, palette.accent, 0.2), {
    hueShift: -22 + seeded(seed, 6122) * 44,
    saturationMult: 1.16,
    lightnessShift: -0.18,
  });
  const cabinTrim = enrichColor(mixColors(cabinWall, palette.paper, 0.26), {
    saturationMult: 1.08,
    lightnessShift: 0.02,
  });
  const cabinGlow = enrichColor(mixColors(palette.pop, "#ffe6a4", 0.2), {
    saturationMult: 1.26,
    lightnessShift: 0.06,
  });

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="58%" stopColor={skyMid} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.26)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.18)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.62)}
        opacity="0.15"
        transform="translate(0.7 0.85)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <circle
          cx={width * 0.78}
          cy={height * 0.2}
          r={height * 0.1}
          fill={mixColors("#fff3c8", palette.pop, 0.12)}
          opacity="0.9"
        />
        {Array.from({ length: 15 }).map((_, index) =>
          index % 4 === 0 ? (
            <path
              key={`forest-star-${index}`}
              d={sparklePath(
                width * (0.08 + seeded(seed, 1500 + index) * 0.84),
                height * (0.08 + seeded(seed, 1520 + index) * 0.24),
                0.22 + seeded(seed, 1540 + index) * 0.34,
                0.08 + seeded(seed, 1560 + index) * 0.12,
              )}
              fill={mixColors("#fff9eb", palette.paper, 0.08)}
              opacity="0.78"
            />
          ) : (
            <circle
              key={`forest-dot-${index}`}
              cx={width * (0.08 + seeded(seed, 1500 + index) * 0.84)}
              cy={height * (0.08 + seeded(seed, 1520 + index) * 0.24)}
              r={0.16 + seeded(seed, 1540 + index) * 0.18}
              fill={mixColors("#fffaf2", palette.paper, 0.12)}
              opacity="0.64"
            />
          ),
        )}
        <path
          d={rollingHillPath(width, height, height * 0.72, height * 0.08, seed, 1570)}
          fill={hillFar}
          opacity="0.72"
        />
        <path
          d={rollingHillPath(width, height, height * 0.84, height * 0.07, seed, 1580)}
          fill={hillNear}
          opacity="0.82"
        />
        {Array.from({ length: 9 }).map((_, index) => {
          const x = width * (0.05 + index * 0.11 + seeded(seed, 1600 + index) * 0.03);
          const baseY = height * (0.78 + seeded(seed, 1620 + index) * 0.08);
          const treeHeight = height * (0.14 + seeded(seed, 1640 + index) * 0.12);
          const treeWidth = treeHeight * (0.22 + seeded(seed, 1660 + index) * 0.08);
          const crown = pinePalette[index % pinePalette.length] ?? hillFar;
          const crownHighlight = enrichColor(mixColors(crown, palette.paper, 0.14), {
            saturationMult: 1.08,
            lightnessShift: 0.05,
          });
          const trunk = enrichColor(mixColors(cabinRoof, crown, 0.32), {
            saturationMult: 1.04,
            lightnessShift: -0.04,
          });

          return (
            <g key={`pine-${index}`} transform={`translate(${x} ${baseY})`}>
              <rect
                x={-0.18}
                y={-treeHeight * 0.1}
                width={0.36}
                height={treeHeight * 0.18}
                rx={0.12}
                fill={trunk}
              />
              <path
                d={`M 0 ${-treeHeight} L ${treeWidth} ${-treeHeight * 0.32} L ${-treeWidth} ${-treeHeight * 0.32} Z`}
                fill={crown}
              />
              <path
                d={`M 0 ${-treeHeight * 0.74} L ${treeWidth * 0.86} ${-treeHeight * 0.12} L ${-treeWidth * 0.86} ${-treeHeight * 0.12} Z`}
                fill={crownHighlight}
              />
            </g>
          );
        })}
        <g transform={`translate(${width * 0.16} ${height * 0.71})`}>
          <rect x={-4.6} y={-3.3} width={9.2} height={5.8} rx={0.9} fill={cabinWall} />
          <path d="M -5.2 -3.05 L 0 -6.3 L 5.2 -3.05 Z" fill={cabinRoof} />
          <rect
            x={-1.15}
            y={-1.95}
            width={2.3}
            height={2.3}
            rx={0.5}
            fill={cabinGlow}
            opacity="0.96"
          />
          <rect
            x={-0.95}
            y={-1.75}
            width={1.9}
            height={1.9}
            rx={0.34}
            fill={mixColors("#fff8d6", palette.paper, 0.08)}
          />
          <path
            d="M -0.02 -1.75 V 0.15 M -0.95 -0.8 H 0.95"
            stroke={cabinTrim}
            strokeWidth="0.16"
            opacity="0.68"
          />
        </g>
        <path
          d={`M ${width * 0.12} ${height * 0.2} C ${width * 0.2} ${height * 0.17}, ${width * 0.28} ${height * 0.15}, ${width * 0.34} ${height * 0.12}`}
          fill="none"
          stroke={mixColors("#fff6e0", palette.paper, 0.12)}
          strokeWidth="0.3"
          opacity="0.5"
          strokeLinecap="round"
        />
      </g>
      <path
        d={outerPath}
        fill="none"
        stroke={mixColors(palette.border, palette.paper, 0.12)}
        strokeWidth="0.24"
      />
      <path
        d={roundedRectPath(4.1, 4.1, width - 8.2, height - 8.2, 4.6)}
        fill="none"
        stroke={mixColors(palette.border, palette.paper, 0.22)}
        strokeWidth="0.68"
        opacity="0.74"
      />
      <path
        d={panelPath}
        fill={mixColors(palette.border, palette.paper, 0.92)}
        opacity="0.08"
        transform="translate(0.45 0.56)"
      />
      <path
        d={panelPath}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={mixColors(palette.border, palette.paper, 0.22)}
        strokeWidth="0.5"
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
