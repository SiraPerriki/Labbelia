import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  plaquePath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function DeskTreasuresTheme(props: {
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
  const outerId = `${cardId}-desk-outer`;
  const panelId = `${cardId}-desk-panel`;
  const noteId = `${cardId}-desk-note`;
  const tapeId = `${cardId}-desk-tape`;
  const sceneClip = `${cardId}-desk-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);
    const panel = {
    x: layout.x - 0.42,
    y: layout.y - 0.42,
    width: layout.width + 0.84,
    height: layout.height + 0.84,
    rx: Math.max(2.8, layout.rx - 0.38),
  };
  const deskBase = mixColors("#f4dcc6", palette.pop, 0.34);
  const deskWarm = mixColors("#e9c9b4", palette.paper, 0.22);
  const deskCool = mixColors("#eadfef", palette.soft, 0.28);
  const notePaper = mixColors("#fffdf8", palette.paper, 0.02);
  const noteShadow = mixColors("#aa94a7", palette.border, 0.18);
  const frameBorder = enrichColor(mixColors(deskCool, palette.border, 0.48), {
    hueShift: -8 + seeded(seed, 7110) * 16,
    saturationMult: 1.08,
    lightnessShift: -0.03,
  });
    const panelStroke = mixColors(frameBorder, palette.paper, 0.18);
  const washiA = mixColors(palette.accent, palette.paper, 0.18);
  const washiB = mixColors(palette.pop, palette.paper, 0.22);
  const pencilBodies = [
    mixColors("#f3c98d", palette.pop, 0.12),
    mixColors("#9fd9c7", palette.soft, 0.14),
    mixColors("#d9b6f3", palette.accent, 0.16),
    mixColors("#f4b8a3", palette.pop, 0.16),
  ];
  const pencilTip = mixColors("#d79a65", palette.pop, 0.22);
  const pencilLead = mixColors("#5b5f72", palette.ink, 0.08);

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={deskBase} />
          <stop offset="52%" stopColor={deskWarm} />
          <stop offset="100%" stopColor={deskCool} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors("#fffefe", palette.paper, 0.02)} />
          <stop offset="100%" stopColor={mixColors("#fff8fb", palette.paper, 0.14)} />
        </linearGradient>
        <linearGradient id={noteId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={notePaper} />
          <stop offset="100%" stopColor={mixColors("#fff4ef", palette.paper, 0.1)} />
        </linearGradient>
        <linearGradient id={tapeId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={washiA} />
          <stop offset="100%" stopColor={washiB} />
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
        <g opacity="0.16">
          {Array.from({ length: 8 }).map((_, index) => {
            const x = 6 + index * ((width - 12) / 7);
            return (
              <path
                key={`desk-stripe-${index}`}
                d={`M ${x} 2 V ${height - 2}`}
                stroke={mixColors(deskWarm, palette.paper, 0.18)}
                strokeWidth="0.5"
              />
            );
          })}
        </g>

        <g transform={`translate(${width * 0.18} ${height * 0.23}) rotate(-8)`} opacity="0.94">
          <rect x="-8.2" y="-4.7" width="16.4" height="10.4" rx="1.2" fill={`url(#${noteId})`} />
          <path
            d="M -5.8 -2.1 H 4.6"
            stroke={mixColors(frameBorder, palette.paper, 0.24)}
            strokeWidth="0.24"
            opacity="0.58"
          />
          <path
            d="M -5.8 -0.2 H 5.4"
            stroke={mixColors(frameBorder, palette.paper, 0.24)}
            strokeWidth="0.24"
            opacity="0.58"
          />
          <path
            d="M -5.8 1.7 H 4.1"
            stroke={mixColors(frameBorder, palette.paper, 0.24)}
            strokeWidth="0.24"
            opacity="0.58"
          />
          <rect
            x="-6.4"
            y="-5.5"
            width="4.8"
            height="1.8"
            rx="0.4"
            fill={`url(#${tapeId})`}
            opacity="0.8"
          />
          <circle
            cx="5.7"
            cy="4.1"
            r="0.6"
            fill={mixColors(palette.pop, "#fff4cf", 0.12)}
            opacity="0.86"
          />
        </g>

        <g transform={`translate(${width * 0.83} ${height * 0.22}) rotate(9)`} opacity="0.88">
          <rect
            x="-6.4"
            y="-4.1"
            width="12.8"
            height="8.8"
            rx="1"
            fill={mixColors("#fffef7", palette.paper, 0.04)}
          />
          <rect
            x="-5"
            y="-2.9"
            width="10.2"
            height="6.2"
            rx="0.8"
            fill="none"
            stroke={mixColors(palette.accent, palette.paper, 0.18)}
            strokeWidth="0.28"
            strokeDasharray="0.5 0.7"
          />
          <circle cx="3.5" cy="-1.8" r="0.72" fill={mixColors(palette.pop, "#fff4da", 0.1)} />
        </g>

        <g transform={`translate(${width * 0.12} ${height * 0.77}) rotate(-10)`} opacity="0.86">
          <rect x="-5.8" y="-3.8" width="11.6" height="7.2" rx="0.9" fill={`url(#${noteId})`} />
          <path
            d="M -4.2 -1.6 H 3.8"
            stroke={mixColors(frameBorder, palette.paper, 0.24)}
            strokeWidth="0.22"
            opacity="0.54"
          />
          <path
            d="M -4.2 0 H 3.2"
            stroke={mixColors(frameBorder, palette.paper, 0.24)}
            strokeWidth="0.22"
            opacity="0.54"
          />
          <rect
            x="-4.8"
            y="-4.45"
            width="3.8"
            height="1.25"
            rx="0.3"
            fill={`url(#${tapeId})`}
            opacity="0.78"
          />
        </g>

        {[
          { x: width * 0.82, y: height * 0.8, angle: -18, length: 10.2, body: pencilBodies[0] },
          { x: width * 0.24, y: height * 0.85, angle: 14, length: 8.8, body: pencilBodies[1] },
          { x: width * 0.67, y: height * 0.16, angle: 32, length: 8.2, body: pencilBodies[2] },
          { x: width * 0.34, y: height * 0.76, angle: -34, length: 9.1, body: pencilBodies[3] },
        ].map((pencil, index) => {
          const bodyLength = pencil.length;
          return (
            <g
              key={`desk-pencil-${index}`}
              transform={`translate(${pencil.x} ${pencil.y}) rotate(${pencil.angle})`}
              opacity={index < 2 ? 0.9 : 0.76}
            >
              <rect
                x={-bodyLength * 0.78}
                y="-0.48"
                width={bodyLength}
                height="0.96"
                rx="0.34"
                fill={pencil.body}
              />
              <path
                d={`M ${bodyLength * 0.22} -0.48 L ${bodyLength * 0.44} 0 L ${bodyLength * 0.22} 0.48 Z`}
                fill={pencilTip}
              />
              <path
                d={`M ${bodyLength * 0.44} 0 L ${bodyLength * 0.52} 0.02`}
                stroke={pencilLead}
                strokeWidth="0.15"
                strokeLinecap="round"
              />
              <rect
                x={-bodyLength * 0.88}
                y="-0.48"
                width={bodyLength * 0.1}
                height="0.96"
                rx="0.16"
                fill={mixColors("#f4d6d9", palette.accent, 0.08)}
              />
            </g>
          );
        })}

        <g transform={`translate(${width * 0.5} ${height * 0.2})`} opacity="0.76">
          <path
            d={sparklePath(-10, -1.2, 1.2, 0.42)}
            fill={mixColors(palette.pop, "#fff1c6", 0.1)}
          />
          <path
            d={sparklePath(9, 0.4, 1.05, 0.38)}
            fill={mixColors(palette.accent, "#fff6ff", 0.12)}
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
        fill={noteShadow}
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
        ink={mixColors("#665561", palette.ink, 0.16)}
        lines={lines}
      />
    </g>
  );
}
