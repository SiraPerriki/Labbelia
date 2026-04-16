import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  ticketPath,
  cartouchePath,
  roundedRectPath,
  sparklePath,
  ribbonPath,
  QuestionText,
} from "./shared";
import { seeded, mixColors } from "../../lib/color";

export function PostageTheme(props: {
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
  const outerId = `${cardId}-post-outer`;
  const panelId = `${cardId}-post-panel`;
  const stampId = `${cardId}-post-stamp`;
  const tapeId = `${cardId}-post-tape`;
  const sealId = `${cardId}-post-seal`;
  const sceneClip = `${cardId}-post-scene`;
  const outerPath = ticketPath(1.2, 1.2, width - 2.4, height - 2.4, 5.8, 2.2);
    const isMood = layout.variant === "mood";
  const panelPath = isMood
    ? roundedRectPath(
        layout.x - 0.42,
        layout.y - 0.42,
        layout.width + 0.84,
        layout.height + 0.84,
        Math.max(2.8, layout.rx - 0.42),
      )
    : cartouchePath(layout.x - 1.3, layout.y - 0.9, layout.width + 2.6, layout.height + 1.8, 3.8);
  const ribbon = ribbonPath(
    layout.x - 4.2,
    layout.y + layout.height * 0.16,
    layout.width + 8.4,
    layout.height * 0.36,
  );
  const cancelCx = width * 0.18;
  const cancelCy = height * 0.36;
  const routeY = height - 9.6;
  const stripeCount = 18;
  const stampA = {
    x: width * 0.08,
    y: height * 0.14,
    w: width * 0.16,
    h: height * 0.2,
    angle: -8 + seeded(seed, 11) * 8,
  };
  const stampB = {
    x: width * 0.75,
    y: height * 0.58,
    w: width * 0.14,
    h: height * 0.18,
    angle: 9 - seeded(seed, 17) * 10,
  };
  const washiA = {
    x: width * 0.08,
    y: height * 0.08,
    w: width * 0.14,
    h: height * 0.042,
    angle: -12,
  };
  const washiB = { x: width * 0.72, y: height * 0.12, w: width * 0.16, h: height * 0.04, angle: 9 };
  const grainDots = Array.from({ length: 24 }).map((_, index) => ({
    x: 7 + seeded(seed, 110 + index) * (width - 14),
    y: 6 + seeded(seed, 150 + index) * (height - 12),
    r: 0.16 + seeded(seed, 190 + index) * 0.28,
    o: 0.1 + seeded(seed, 230 + index) * 0.12,
  }));
  const edgePalette = [
    mixColors(palette.pop, palette.paper, 0.08),
    mixColors(palette.accent, palette.paper, 0.1),
    mixColors(palette.soft, palette.paper, 0.18),
  ];
  const drawMiniStamp = (
    x: number,
    y: number,
    stampWidth: number,
    stampHeight: number,
    angle: number,
    accent: string,
    motifSeed: number,
  ) => {
    const centerX = x + stampWidth / 2;
    const centerY = y + stampHeight / 2;
    const sunX = x + stampWidth * 0.72;
    const sunY = y + stampHeight * 0.28;

    return (
      <g transform={`rotate(${angle} ${centerX} ${centerY})`} opacity="0.72">
        <rect
          x={x}
          y={y}
          width={stampWidth}
          height={stampHeight}
          rx="1.6"
          fill={`url(#${stampId})`}
        />
        <rect
          x={x + 0.86}
          y={y + 0.86}
          width={stampWidth - 1.72}
          height={stampHeight - 1.72}
          rx="1.2"
          fill="none"
          stroke={mixColors(palette.border, palette.paper, 0.16)}
          strokeWidth="0.28"
          strokeDasharray="0.7 1.1"
        />
        {Array.from({ length: 4 }).map((_, index) => (
          <circle
            key={`mini-stamp-dot-${x}-${index}`}
            cx={x + 1.8 + index * ((stampWidth - 3.6) / 3)}
            cy={y + stampHeight - 2.1}
            r="0.28"
            fill={mixColors(accent, palette.border, 0.32)}
            opacity="0.65"
          />
        ))}
        <circle
          cx={sunX}
          cy={sunY}
          r={Math.min(stampWidth, stampHeight) * 0.12}
          fill={mixColors(palette.pop, "#fff5dc", 0.08)}
          opacity="0.9"
        />
        <path
          d={`M ${x + stampWidth * 0.16} ${y + stampHeight * 0.68} q ${stampWidth * 0.14} -${stampHeight * 0.18} ${stampWidth * 0.3} -${stampHeight * 0.02} q ${stampWidth * 0.12} ${stampHeight * 0.1} ${stampWidth * 0.24} -${stampHeight * 0.08} q ${stampWidth * 0.12} -${stampHeight * 0.06} ${stampWidth * 0.2} ${stampHeight * 0.05}`}
          fill="none"
          stroke={mixColors(accent, palette.border, 0.2)}
          strokeWidth="0.36"
          strokeLinecap="round"
          opacity="0.82"
        />
        <path
          d={`M ${x + stampWidth * 0.18} ${y + stampHeight * 0.36} q ${stampWidth * 0.12} -${stampHeight * 0.16} ${stampWidth * 0.22} 0 q ${stampWidth * 0.1} ${stampHeight * 0.14} ${stampWidth * 0.18} 0`}
          fill="none"
          stroke={mixColors(palette.soft, accent, 0.2)}
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity={0.52 + seeded(seed, motifSeed) * 0.18}
        />
      </g>
    );
  };

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, palette.soft, 0.52)} />
          <stop offset="52%" stopColor={palette.paper} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.22)} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#ffffff", palette.paper, 0.08)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, "#fffefd", 0.16)} />
        </linearGradient>
        <linearGradient id={stampId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.06)} />
          <stop offset="100%" stopColor={mixColors(palette.soft, palette.paper, 0.32)} />
        </linearGradient>
        <linearGradient id={tapeId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={mixColors(palette.pop, palette.paper, 0.3)} />
          <stop offset="100%" stopColor={mixColors(palette.accent, palette.paper, 0.22)} />
        </linearGradient>
        <radialGradient id={sealId} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor={mixColors(palette.pop, "#fff5df", 0.06)} />
          <stop offset="100%" stopColor={mixColors(palette.accent, palette.border, 0.1)} />
        </radialGradient>
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
        <g opacity="0.9">
          {Array.from({ length: stripeCount }).map((_, index) => {
            const stripeWidth = (width - 8) / stripeCount;
            const fill = edgePalette[index % edgePalette.length] ?? edgePalette[0];
            return (
              <g key={`post-stripe-${index}`}>
                <rect
                  x={4 + index * stripeWidth}
                  y="1.5"
                  width={stripeWidth * 0.78}
                  height="1.8"
                  rx="0.4"
                  fill={fill}
                  opacity={0.76}
                />
                <rect
                  x={4 + index * stripeWidth}
                  y={height - 3.3}
                  width={stripeWidth * 0.78}
                  height="1.8"
                  rx="0.4"
                  fill={fill}
                  opacity={0.62}
                />
              </g>
            );
          })}
        </g>
        <g opacity="0.22">
          {grainDots.map((dot, index) => (
            <circle
              key={`post-grain-${index}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill={palette.border}
              opacity={dot.o}
            />
          ))}
        </g>
        <g transform={`rotate(${seeded(seed, 3) * 5 - 2.5} ${width / 2} ${height / 2})`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <rect
              key={`paper-band-${index}`}
              x={-10 + index * 22}
              y={-2}
              width="10"
              height={height + 6}
              fill={
                index % 2 === 0
                  ? mixColors(palette.soft, "#ffffff", 0.18)
                  : mixColors(palette.accent, palette.paper, 0.82)
              }
              opacity={index % 2 === 0 ? 0.16 : 0.08}
            />
          ))}
        </g>
        <g opacity="0.24">
          {Array.from({ length: 6 }).map((_, index) => {
            const y = height * 0.26 + index * (height * 0.095);
            return (
              <path
                key={`postcard-line-${index}`}
                d={`M ${width * 0.3} ${y} H ${width - 8.2}`}
                fill="none"
                stroke={mixColors(palette.border, palette.paper, 0.18)}
                strokeWidth="0.22"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        <g
          transform={`rotate(${washiA.angle} ${washiA.x + washiA.w / 2} ${washiA.y + washiA.h / 2})`}
          opacity="0.72"
        >
          <rect
            x={washiA.x}
            y={washiA.y}
            width={washiA.w}
            height={washiA.h}
            rx="0.7"
            fill={`url(#${tapeId})`}
          />
          <path
            d={`M ${washiA.x + 1} ${washiA.y + washiA.h / 2} H ${washiA.x + washiA.w - 1}`}
            stroke={mixColors(palette.paper, palette.border, 0.28)}
            strokeWidth="0.22"
            strokeDasharray="0.4 0.8"
            opacity="0.55"
          />
        </g>
        <g
          transform={`rotate(${washiB.angle} ${washiB.x + washiB.w / 2} ${washiB.y + washiB.h / 2})`}
          opacity="0.64"
        >
          <rect
            x={washiB.x}
            y={washiB.y}
            width={washiB.w}
            height={washiB.h}
            rx="0.7"
            fill={`url(#${tapeId})`}
          />
          <path
            d={`M ${washiB.x + 1} ${washiB.y + washiB.h / 2} H ${washiB.x + washiB.w - 1}`}
            stroke={mixColors(palette.paper, palette.border, 0.28)}
            strokeWidth="0.22"
            strokeDasharray="0.4 0.8"
            opacity="0.55"
          />
        </g>
        {drawMiniStamp(stampA.x, stampA.y, stampA.w, stampA.h, stampA.angle, palette.accent, 61)}
        {drawMiniStamp(stampB.x, stampB.y, stampB.w, stampB.h, stampB.angle, palette.pop, 67)}
        <circle
          cx={cancelCx}
          cy={cancelCy}
          r={height * 0.21}
          fill="none"
          stroke={mixColors(palette.border, palette.paper, 0.14)}
          strokeWidth="0.78"
          opacity="0.54"
        />
        <circle
          cx={cancelCx}
          cy={cancelCy}
          r={height * 0.145}
          fill="none"
          stroke={mixColors(palette.border, palette.paper, 0.18)}
          strokeWidth="0.24"
          opacity="0.46"
        />
        <path
          d={`M ${cancelCx - 6.8} ${cancelCy + 1.3} q 3 -1.8 6.2 0 q 3.1 1.7 6.2 0 q 3 -1.8 6.2 0`}
          fill="none"
          stroke={mixColors(palette.accent, palette.border, 0.24)}
          strokeWidth="0.24"
          strokeLinecap="round"
          opacity="0.58"
        />
        <path
          d={`M ${cancelCx - 8.2} ${cancelCy + 4.6} q 3.6 -1.9 7.2 0 q 3.4 1.7 7 0 q 3.5 -1.7 7 0`}
          fill="none"
          stroke={mixColors(palette.accent, palette.paper, 0.22)}
          strokeWidth="0.18"
          strokeLinecap="round"
          opacity="0.54"
        />
        <path
          d={`M 8 ${routeY} C ${width * 0.22} ${routeY - 5.8}, ${width * 0.33} ${routeY + 1.8}, ${width * 0.48} ${routeY - 2.4} S ${width * 0.8} ${routeY + 2.8}, ${width - 10} ${routeY - 4}`}
          fill="none"
          stroke={mixColors(palette.border, palette.accent, 0.42)}
          strokeWidth="0.72"
          strokeDasharray="1.2 1.8"
          strokeLinecap="round"
          opacity="0.8"
        />
        {Array.from({ length: 5 }).map((_, index) => (
          <circle
            key={`route-dot-${index}`}
            cx={12 + index * ((width - 22) / 4)}
            cy={routeY + (seeded(seed, 20 + index) - 0.5) * 3}
            r="0.72"
            fill={index === 4 ? palette.pop : palette.accent}
            opacity={0.88 - index * 0.1}
          />
        ))}
        <path d={sparklePath(width - 11, 8.8, 2.6, 1.02)} fill={palette.pop} opacity="0.8" />
        <path d={sparklePath(10.5, 9.7, 1.9, 0.75)} fill={palette.accent} opacity="0.64" />
        <g transform={`rotate(${seeded(seed, 50) * 20 - 10} ${width - 8.8} ${height - 9.2})`}>
          <circle
            cx={width - 8.8}
            cy={height - 9.2}
            r="3.9"
            fill={mixColors(palette.border, palette.paper, 0.88)}
            opacity="0.08"
          />
          <circle
            cx={width - 8.8}
            cy={height - 9.2}
            r="3.28"
            fill={`url(#${sealId})`}
            opacity="0.9"
          />
          {Array.from({ length: 9 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 9;
            return (
              <ellipse
                key={`seal-${index}`}
                cx={width - 8.8 + Math.cos(angle) * 1.55}
                cy={height - 9.2 + Math.sin(angle) * 1.55}
                rx="0.7"
                ry="1.3"
                fill={mixColors(palette.accent, palette.border, 0.08)}
                transform={`rotate(${(angle * 180) / Math.PI} ${width - 8.8 + Math.cos(angle) * 1.55} ${height - 9.2 + Math.sin(angle) * 1.55})`}
              />
            );
          })}
          <circle
            cx={width - 8.8}
            cy={height - 9.2}
            r="1.68"
            fill="none"
            stroke={mixColors(palette.paper, palette.border, 0.24)}
            strokeWidth="0.3"
            opacity="0.7"
          />
          <circle cx={width - 8.8} cy={height - 9.2} r="1.18" fill={palette.pop} />
          <path
            d={sparklePath(width - 8.8, height - 9.2, 1.18, 0.42)}
            fill={mixColors(palette.paper, "#fffef9", 0.08)}
            opacity="0.5"
          />
        </g>
        {Array.from({ length: 6 }).map((_, index) => (
          <g key={`ticket-mark-${index}`} opacity="0.42">
            <rect
              x={width - 19.2 + (index % 3) * 2.4}
              y={10 + Math.floor(index / 3) * 2.4}
              width="1.4"
              height="0.34"
              rx="0.17"
              fill={mixColors(palette.border, palette.paper, 0.16)}
            />
          </g>
        ))}
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="1.1" />
      {!isMood ? (
        <path d={ribbon} fill={mixColors(palette.soft, palette.paper, 0.24)} opacity="0.76" />
      ) : null}
      {!isMood ? (
        <path
          d={ribbon}
          fill="none"
          stroke={mixColors(palette.border, palette.paper, 0.16)}
          strokeWidth="0.24"
          opacity="0.4"
        />
      ) : null}
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
      {Array.from({ length: 4 }).map((_, index) => (
        <rect
          key={`panel-mark-left-${index}`}
          x={layout.x - 2.65}
          y={layout.y + 2.8 + index * 1.55}
          width="0.7"
          height="0.26"
          rx="0.13"
          fill={mixColors(palette.border, palette.paper, 0.18)}
          opacity="0.5"
        />
      ))}
      {Array.from({ length: 4 }).map((_, index) => (
        <rect
          key={`panel-mark-right-${index}`}
          x={layout.x + layout.width + 1.95}
          y={layout.y + 2.8 + index * 1.55}
          width="0.7"
          height="0.26"
          rx="0.13"
          fill={mixColors(palette.border, palette.paper, 0.18)}
          opacity="0.5"
        />
      ))}
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={mixColors(palette.ink, palette.paper, 0.18)}
        lines={lines}
      />
    </g>
  );
}
