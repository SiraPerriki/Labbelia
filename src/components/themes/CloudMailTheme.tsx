import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  cloudPath,
  plaquePath,
  sparklePath,
  heartPath,
  QuestionText,
} from "./shared";
import { seeded, mixColors } from "../../lib/color";

export function CloudMailTheme(props: {
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
  const outerId = `${cardId}-cloud-outer`;
  const panelId = `${cardId}-cloud-panel`;
  const stripeId = `${cardId}-cloud-stripe`;
  const sceneClip = `${cardId}-cloud-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
  const panel = {
    x: layout.x,
    y: layout.y,
    width: layout.width,
    height: layout.height,
    rx: Math.max(2.8, layout.rx - 0.38),
  };
  const skyTop = mixColors(palette.soft, palette.paper, 0.5);
  const skyMid = mixColors(palette.paper, palette.soft, 0.2);
  const skyLow = mixColors(palette.pop, palette.paper, 0.2);
  const cloudA = mixColors(palette.paper, "#ffffff", 0.6);
  const cloudB = mixColors(palette.soft, palette.paper, 0.4);
  const airmailBlue = palette.accent;
  const airmailRed = palette.pop;
  const route = palette.border;
  const envelopePaper = mixColors(palette.paper, "#ffffff", 0.7);
  const envelopeLine = palette.border;
  const heartPink = palette.accent;
  const starGold = palette.pop;

  const drawEnvelope = (
    x: number,
    y: number,
    scale: number,
    angle: number,
    accent: string,
    opacity: number,
  ) => (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`} opacity={opacity}>
      <rect x="-2.4" y="-1.5" width="4.8" height="3" rx="0.36" fill={envelopePaper} />
      <path
        d="M -2.2 -1.2 L 0 0.2 L 2.2 -1.2"
        fill="none"
        stroke={envelopeLine}
        strokeWidth="0.22"
        strokeLinecap="round"
      />
      <path
        d="M -2.15 1.1 L -0.2 -0.05"
        fill="none"
        stroke={mixColors(accent, envelopeLine, 0.2)}
        strokeWidth="0.18"
        strokeLinecap="round"
      />
      <path
        d="M 2.15 1.1 L 0.2 -0.05"
        fill="none"
        stroke={mixColors(accent, envelopeLine, 0.2)}
        strokeWidth="0.18"
        strokeLinecap="round"
      />
      <circle cx="1.2" cy="-0.48" r="0.28" fill={accent} opacity="0.8" />
    </g>
  );

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="62%" stopColor={skyMid} />
          <stop offset="100%" stopColor={skyLow} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.03)} />
          <stop offset="100%" stopColor={mixColors("#fff8fd", palette.paper, 0.14)} />
        </linearGradient>
        <linearGradient id={stripeId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={airmailBlue} />
          <stop offset="50%" stopColor={mixColors("#ffffff", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={airmailRed} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.7)}
        opacity="0.14"
        transform="translate(0.7 0.9)"
      />
      <g clipPath={`url(#${sceneClip})`}>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${outerId})`} />
        <g opacity="0.92">
          {Array.from({ length: 15 }).map((_, index) => {
            const stripeWidth = (width - 12) / 15;
            return (
              <rect
                key={`cloud-mail-top-${index}`}
                x={6 + index * stripeWidth}
                y="1.5"
                width={stripeWidth * 0.68}
                height="1.7"
                rx="0.3"
                fill={index % 2 === 0 ? airmailRed : airmailBlue}
                opacity="0.82"
              />
            );
          })}
        </g>
        <g opacity="0.56">
          <path
            d={cloudPath(width * 0.12, height * 0.22, width * 0.28, height * 0.18)}
            fill={cloudA}
            transform="scale(0.26)"
          />
          <path
            d={cloudPath(width * 0.58, height * 0.16, width * 0.34, height * 0.2)}
            fill={cloudB}
            transform="scale(0.24)"
          />
          <path
            d={cloudPath(width * 0.8, height * 0.3, width * 0.32, height * 0.18)}
            fill={cloudA}
            transform="scale(0.22)"
          />
          <path
            d={cloudPath(width * 0.22, height * 0.62, width * 0.4, height * 0.22)}
            fill={cloudB}
            transform="scale(0.25)"
          />
          <path
            d={cloudPath(width * 0.7, height * 0.72, width * 0.44, height * 0.24)}
            fill={cloudA}
            transform="scale(0.24)"
          />
        </g>
        {drawEnvelope(width * 0.18, height * 0.28, 0.82, -14, airmailRed, 0.82)}
        {drawEnvelope(width * 0.78, height * 0.22, 0.66, 11, airmailBlue, 0.68)}
        {drawEnvelope(
          width * 0.82,
          height * 0.68,
          0.74,
          -8,
          mixColors(airmailBlue, airmailRed, 0.4),
          0.72,
        )}
        {drawEnvelope(width * 0.16, height * 0.72, 0.62, 12, airmailRed, 0.62)}
        {drawEnvelope(width * 0.35, height * 0.18, 0.5, -7, heartPink, 0.58)}
        {drawEnvelope(width * 0.65, height * 0.77, 0.54, 9, airmailBlue, 0.56)}
        {drawEnvelope(width * 0.9, height * 0.44, 0.46, -11, starGold, 0.52)}
        <path
          d={`M ${width * 0.12} ${height * 0.56} C ${width * 0.22} ${height * 0.44}, ${width * 0.28} ${height * 0.72}, ${width * 0.42} ${height * 0.5} S ${width * 0.7} ${height * 0.64}, ${width * 0.84} ${height * 0.48}`}
          fill="none"
          stroke={route}
          strokeWidth="0.24"
          strokeDasharray="1 1.5"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d={`M ${width * 0.7} ${height * 0.38} q ${width * 0.08} -${height * 0.03} ${width * 0.14} ${height * 0.02} q -${width * 0.05} ${height * 0.04} -${width * 0.12} ${height * 0.02} Z`}
          fill={mixColors("#fffdf6", palette.paper, 0.03)}
          opacity="0.84"
        />
        <path
          d={`M ${width * 0.74} ${height * 0.392} L ${width * 0.71} ${height * 0.365} L ${width * 0.712} ${height * 0.404}`}
          fill={mixColors("#fffdf6", palette.paper, 0.03)}
          opacity="0.84"
        />
        {Array.from({ length: 5 }).map((_, index) => {
          const x = width * (0.16 + index * 0.16);
          const y = height * (0.53 + Math.sin(index * 0.7) * 0.03);
          return (
            <circle
              key={`cloud-mail-route-dot-${index}`}
              cx={x}
              cy={y}
              r="0.26"
              fill={mixColors(route, palette.paper, 0.16)}
              opacity="0.46"
            />
          );
        })}
        {Array.from({ length: 24 }).map((_, index) => {
          const x = 8 + seeded(seed, 6100 + index) * (width - 16);
          const y = 7 + seeded(seed, 6140 + index) * (height * 0.36);
          const outer = 0.3 + seeded(seed, 6180 + index) * 0.6;
          return index % 3 === 0 ? (
            <path
              key={`cloud-mail-spark-${index}`}
              d={sparklePath(x, y, outer, outer * 0.34)}
              fill={index % 2 === 0 ? airmailBlue : airmailRed}
              opacity="0.74"
            />
          ) : (
            <circle
              key={`cloud-mail-spark-${index}`}
              cx={x}
              cy={y}
              r={outer * 0.44}
              fill={mixColors("#ffffff", palette.paper, 0.04)}
              opacity="0.66"
            />
          );
        })}
        {Array.from({ length: 10 }).map((_, index) => {
          const x = width * (0.12 + seeded(seed, 6250 + index) * 0.76);
          const y = height * (0.14 + seeded(seed, 6280 + index) * 0.58);
          const size = 0.7 + seeded(seed, 6310 + index) * 0.5;
          return (
            <path
              key={`cloud-mail-star-${index}`}
              d={sparklePath(x, y, size, size * 0.34)}
              fill={index % 2 === 0 ? starGold : mixColors(airmailBlue, palette.paper, 0.12)}
              opacity={0.62 + (index % 3) * 0.08}
            />
          );
        })}
        {Array.from({ length: 7 }).map((_, index) => {
          const x = width * (0.22 + seeded(seed, 6340 + index) * 0.56);
          const y = height * (0.24 + seeded(seed, 6370 + index) * 0.42);
          const size = 0.9 + seeded(seed, 6400 + index) * 0.42;
          return (
            <path
              key={`cloud-mail-heart-${index}`}
              d={heartPath(x, y, size)}
              fill={index % 2 === 0 ? heartPink : mixColors(airmailRed, palette.paper, 0.08)}
              opacity={0.42 + (index % 2) * 0.12}
            />
          );
        })}
        <g transform={`translate(${width * 0.86} ${height * 0.17}) rotate(9)`} opacity="0.68">
          <rect x="-3.1" y="-2.2" width="6.2" height="4.4" rx="0.6" fill={envelopePaper} />
          <rect
            x="-2.3"
            y="-1.4"
            width="4.6"
            height="2.8"
            rx="0.42"
            fill="none"
            stroke={airmailBlue}
            strokeWidth="0.24"
            strokeDasharray="0.5 0.7"
          />
          <circle cx="1.4" cy="-0.8" r="0.42" fill={airmailRed} opacity="0.82" />
        </g>
        <g transform={`translate(${width * 0.08} ${height * 0.14}) rotate(-10)`} opacity="0.44">
          <rect x="-2.5" y="-1.7" width="5" height="3.4" rx="0.46" fill={envelopePaper} />
          <path
            d="M -2.15 -1.1 L 0 0.15 L 2.15 -1.1"
            fill="none"
            stroke={airmailRed}
            strokeWidth="0.2"
          />
          <path
            d="M -1.6 0.9 H 1.35"
            stroke={airmailBlue}
            strokeWidth="0.18"
            strokeDasharray="0.45 0.5"
          />
        </g>
      </g>
      <path d={outerPath} fill="none" stroke={palette.border} strokeWidth="0.24" />
      <rect
        x={panel.x}
        y={panel.y}
        width={panel.width}
        height={panel.height}
        rx={panel.rx}
        fill={mixColors(palette.border, airmailBlue, 0.92)}
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
