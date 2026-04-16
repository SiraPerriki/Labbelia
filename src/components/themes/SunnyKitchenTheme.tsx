import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  rollingHillPath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors } from "../../lib/color";

export function SunnyKitchenTheme(props: {
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
  const outerId = `${cardId}-kitchen-outer`;
  const panelId = `${cardId}-kitchen-panel`;
  const tileId = `${cardId}-kitchen-tile`;
  const steamId = `${cardId}-kitchen-steam`;
  const sceneClip = `${cardId}-kitchen-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
    const panel = {
    x: layout.x - 0.42,
    y: layout.y - 0.42,
    width: layout.width + 0.84,
    height: layout.height + 0.84,
    rx: Math.max(2.8, layout.rx - 0.38),
  };
  const wallTop = mixColors("#fff7ed", palette.paper, 0.08);
  const wallLow = mixColors("#ffe7d6", palette.pop, 0.18);
  const tileA = mixColors("#f4f0ff", palette.soft, 0.14);
  const tileB = mixColors("#fff9f4", palette.paper, 0.04);
  const grout = mixColors("#d8c4ba", palette.border, 0.18);
  const table = mixColors("#ddb692", palette.pop, 0.28);
  const tableShadow = mixColors("#b98971", palette.border, 0.24);
  const kettleBody = mixColors("#f4bda8", palette.pop, 0.14);
  const kettleLid = mixColors("#ef9fb2", palette.accent, 0.16);
  const cupBody = mixColors("#fffdf6", palette.paper, 0.02);
  const cupShade = mixColors("#efcf8d", palette.pop, 0.18);
  const saucer = mixColors("#f2d8cf", palette.soft, 0.18);
  const handle = mixColors("#c88f8f", palette.border, 0.18);
  const spoon = mixColors("#d7bfd5", palette.accent, 0.22);
  const lemon = mixColors("#ffd677", palette.pop, 0.08);
  const leaf = mixColors("#acd6b0", palette.soft, 0.14);
  const panelInk = mixColors("#685660", palette.ink, 0.16);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={wallTop} />
          <stop offset="62%" stopColor={mixColors(wallTop, wallLow, 0.28)} />
          <stop offset="100%" stopColor={wallLow} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8f1", palette.paper, 0.12)} />
        </linearGradient>
        <linearGradient id={tileId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={tileA} />
          <stop offset="100%" stopColor={tileB} />
        </linearGradient>
        <linearGradient id={steamId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            stopColor={mixColors("#ffffff", palette.paper, 0.02)}
            stopOpacity="0.92"
          />
          <stop
            offset="100%"
            stopColor={mixColors("#ffffff", palette.paper, 0.18)}
            stopOpacity="0"
          />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.72)}
        opacity="0.14"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 10 }).map((__, column) => {
            const tileWidth = width / 9.2;
            const tileHeight = height * 0.14;
            const x = -2 + column * tileWidth;
            const y = 2 + row * tileHeight;
            return (
              <rect
                key={`kitchen-tile-${row}-${column}`}
                x={x}
                y={y}
                width={tileWidth + 0.5}
                height={tileHeight + 0.4}
                rx="0.6"
                fill={`url(#${tileId})`}
                stroke={grout}
                strokeWidth="0.12"
                opacity={0.48 + ((row + column) % 2) * 0.08}
              />
            );
          }),
        )}
        <circle
          cx={width * 0.78}
          cy={height * 0.18}
          r={height * 0.12}
          fill={mixColors("#fff2b7", lemon, 0.16)}
          opacity="0.86"
        />
        <circle
          cx={width * 0.78}
          cy={height * 0.18}
          r={height * 0.18}
          fill={mixColors("#fff6d7", palette.paper, 0.12)}
          opacity="0.2"
        />
        <path
          d={rollingHillPath(width, height, height * 0.82, height * 0.03, seed, 8200)}
          fill={table}
          opacity="0.96"
        />
        <path
          d={rollingHillPath(width, height, height * 0.88, height * 0.025, seed, 8230)}
          fill={tableShadow}
          opacity="0.42"
        />

        <g transform={`translate(${width * 0.22} ${height * 0.74})`} opacity="0.96">
          <ellipse
            cx="0"
            cy="2.4"
            rx="7.1"
            ry="1.52"
            fill={mixColors(saucer, tableShadow, 0.2)}
            opacity="0.42"
          />
          <ellipse cx="0" cy="1.35" rx="5.9" ry="1.55" fill={saucer} />
          <path
            d="M -3.8 1.05 L -3.4 -4.95 q 0.2 -1.1 1.18 -1.1 H 2.3 q 1 0 1.14 1.12 L 3.82 1.05 q -0.26 0.78 -1.12 0.78 H -2.72 q -0.86 0 -1.08 -0.78 Z"
            fill={cupBody}
            stroke={mixColors(handle, palette.paper, 0.16)}
            strokeWidth="0.24"
          />
          <path d="M -2.55 -3.5 H 2.15" stroke={cupShade} strokeWidth="0.18" opacity="0.58" />
          <path
            d="M -2.1 -2.4 H 1.8"
            stroke={mixColors(cupShade, palette.paper, 0.12)}
            strokeWidth="0.12"
            opacity="0.5"
          />
          <path
            d="M 3.35 -3.95 q 2.45 0.22 2.4 2.55 q -0.04 2.18 -2.42 2.28"
            fill="none"
            stroke={handle}
            strokeWidth="0.36"
            strokeLinecap="round"
          />
          <path
            d="M -1.3 1.85 q 0.95 0.58 2.62 0"
            fill="none"
            stroke={mixColors("#ffffff", palette.paper, 0.08)}
            strokeWidth="0.16"
            opacity="0.7"
          />
          {[0, 1, 2].map((steam, index) => (
            <path
              key={`kitchen-steam-${index}`}
              d={`M ${-1.65 + index * 1.55} -6.1 q ${0.62 + index * 0.12} -1.7 ${0.18 + index * 0.12} -3.62 q -0.5 -1.1 0.34 -2.38`}
              fill="none"
              stroke={`url(#${steamId})`}
              strokeWidth="0.38"
              strokeLinecap="round"
              opacity="0.8"
            />
          ))}
        </g>

        <g transform={`translate(${width * 0.78} ${height * 0.74})`} opacity="0.95">
          <ellipse
            cx="0.2"
            cy="2.55"
            rx="7.9"
            ry="1.48"
            fill={mixColors(tableShadow, palette.border, 0.18)}
            opacity="0.34"
          />
          <path
            d="M -3.1 -8.2 H 2.5 L 4 -5.6 H 3.15 L 4.2 -0.15 q 0.18 1.1 -0.82 1.26 H -4.08 q -1.04 -0.14 -0.84 -1.28 L -3.95 -5.6 H -4.75 Z"
            fill={kettleBody}
            stroke={mixColors(handle, palette.paper, 0.16)}
            strokeWidth="0.26"
            strokeLinejoin="round"
          />
          <path
            d="M -3.72 -5.6 H 3.05"
            fill="none"
            stroke={mixColors(handle, palette.paper, 0.18)}
            strokeWidth="0.22"
            opacity="0.58"
          />
          <path d="M -2.4 -8.2 L -2.4 -9.45 H 1.8 L 1.8 -8.2" fill={kettleLid} />
          <ellipse
            cx="-0.3"
            cy="-9.92"
            rx="0.82"
            ry="0.42"
            fill={mixColors(kettleLid, palette.border, 0.18)}
          />
          <path
            d="M 4.02 -5.25 q 3.65 0.2 3.72 3.28 q 0.08 2.58 -2.38 3.16"
            fill="none"
            stroke={mixColors(handle, palette.paper, 0.12)}
            strokeWidth="0.18"
            strokeLinecap="round"
          />
          <path
            d="M -4.25 -4.68 q -2.88 0 -4.82 -1.34 q 2.25 -1.8 4.58 -1.18"
            fill="none"
            stroke={mixColors(handle, palette.paper, 0.14)}
            strokeWidth="0.5"
            strokeLinecap="round"
          />
          <path
            d="M -1.6 -6.82 H 0.9"
            stroke={mixColors("#ffffff", palette.paper, 0.08)}
            strokeWidth="0.16"
            opacity="0.56"
          />
        </g>

        <g transform={`translate(${width * 0.54} ${height * 0.86}) rotate(-10)`} opacity="0.84">
          <ellipse
            cx="0"
            cy="0.2"
            rx="4.6"
            ry="0.78"
            fill={mixColors(spoon, palette.border, 0.14)}
          />
          <ellipse
            cx="4.2"
            cy="0.2"
            rx="1.36"
            ry="0.92"
            fill={mixColors(spoon, palette.paper, 0.08)}
          />
        </g>

        <g transform={`translate(${width * 0.15} ${height * 0.88}) rotate(-14)`} opacity="0.86">
          <circle cx="0" cy="0" r="1.76" fill={lemon} />
          <path
            d="M -1.1 0 q 1.1 -1.1 2.2 0 q -1.1 1.1 -2.2 0 Z"
            fill={mixColors("#fff6d8", palette.paper, 0.06)}
            opacity="0.86"
          />
        </g>

        <g transform={`translate(${width * 0.89} ${height * 0.84}) rotate(18)`} opacity="0.82">
          <path d="M -1.2 0 q 0.9 -1.2 2.4 -0.6 q -0.7 1.5 -2.4 0.6 Z" fill={leaf} />
          <path
            d="M 1.1 0.28 q 0.8 -1 2 -0.42 q -0.6 1.25 -2 0.42 Z"
            fill={mixColors(leaf, palette.paper, 0.1)}
          />
        </g>

        {Array.from({ length: 12 }).map((_, index) => (
          <circle
            key={`kitchen-crumb-${index}`}
            cx={width * (0.08 + seeded(seed, 8260 + index) * 0.84)}
            cy={height * (0.66 + seeded(seed, 8300 + index) * 0.22)}
            r={0.1 + seeded(seed, 8340 + index) * 0.2}
            fill={
              index % 2 === 0
                ? mixColors(tableShadow, palette.paper, 0.14)
                : mixColors(lemon, palette.paper, 0.1)
            }
            opacity={0.4 + (index % 3) * 0.1}
          />
        ))}

        <path
          d={sparklePath(width * 0.36, height * 0.14, 1.16, 0.42)}
          fill={mixColors(lemon, palette.paper, 0.08)}
          opacity="0.72"
        />
        <path
          d={sparklePath(width * 0.62, height * 0.2, 0.98, 0.34)}
          fill={mixColors(kettleLid, palette.paper, 0.16)}
          opacity="0.62"
        />
      </g>
      <path
        d={outerPath}
        fill="none"
        stroke={mixColors(palette.border, tableShadow, 0.18)}
        strokeWidth="0.24"
      />
      <rect
        x={panel.x + 0.35}
        y={panel.y + 0.45}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={mixColors(tableShadow, palette.border, 0.2)}
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
        stroke={mixColors(palette.border, palette.paper, 0.18)}
        strokeWidth="0.18"
      />
      <QuestionText clipId={clipId} layout={layout} ink={panelInk} lines={lines} />
    </g>
  );
}
