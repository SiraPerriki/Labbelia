import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import {
  cloudPath,
  roundedRectPath,
  sparklePath,
  QuestionText,
} from "./shared";
import { seeded, mixColors, enrichColor } from "../../lib/color";

export function KawaiiCloudsTheme(props: {
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
  const outerId = `${cardId}-clouds-outer`;
  const midId = `${cardId}-clouds-mid`;
  const panelId = `${cardId}-clouds-panel`;
  const sceneClip = `${cardId}-clouds-clip`;
  
  const outerPath = roundedRectPath(1.15, 1.15, width - 2.3, height - 2.3, 5.3);
  const panelPath = roundedRectPath(
    layout.x,
    layout.y,
    layout.width,
    layout.height,
    Math.max(2.4, layout.rx - 0.18)
  );

  // Magical Sunset/Dawn Sky
  const skyTop = enrichColor(mixColors("#aac7f2", palette.paper, 0.05), { saturationMult: 1.1 });
  const skyMid = enrichColor(mixColors("#f8d3e6", palette.soft, 0.1), { saturationMult: 1.05 });
  const skyBottom = enrichColor(mixColors("#fdf2d0", palette.paper, 0.02), { saturationMult: 1.1 });

  // Clouds layering
  const cloudFill = mixColors("#ffffff", palette.paper, 0.01);
  const cloudHighlight = mixColors("#ffffff", palette.paper, 0.03);
  const cloudShadow = mixColors("#d9c8e8", palette.soft, 0.14); // Soft lavender shadow
  
  const blush = mixColors("#ffb5cf", palette.accent, 0.08);
  const inkColor = mixColors(palette.ink, palette.paper, 0.18);
  
  // Custom Cloud Component for 3D Fluffiness
  const CloudSilhouette = ({ x, y, scale, index, hasFace = false, op = 1 }: { x: number, y: number, scale: number, index: number, hasFace?: boolean, op?: number }) => (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={op}>
      {/* Soft Drop Shadow for Depth */}
      <path d={cloudPath(-2.6, -1.5, 5.6, 3.6)} fill={mixColors(cloudShadow, skyMid, 0.2)} opacity="0.35" transform="translate(0 0.4)" />
      
      {/* Cloud Base */}
      <path d={cloudPath(-2.8, -1.8, 5.8, 3.8)} fill={cloudFill} opacity="0.95" />
      
      {/* Cloud 3D Core / Shading */}
      <path d={cloudPath(-2.8, -1.5, 5.8, 3.5)} fill={cloudShadow} opacity="0.16" />
      
      {/* Cloud Highlight Rim */}
      <path d={cloudPath(-2.6, -1.9, 5.2, 3.6)} fill={cloudHighlight} opacity="0.7" />

      {hasFace && index % 2 === 0 ? (
        <g transform="translate(0 -0.2)">
          {/* Eyes */}
          <circle cx="-0.65" cy="0" r="0.12" fill={inkColor} opacity="0.9" />
          <circle cx="0.65" cy="0" r="0.12" fill={inkColor} opacity="0.9" />
          
          {/* Smile */}
          <path
            d="M -0.42 0.35 Q 0 0.7 0.42 0.35"
            fill="none"
            stroke={inkColor}
            strokeWidth="0.11"
            strokeLinecap="round"
            opacity="0.8"
          />
          
          {/* Soft Blush */}
          <circle cx="-1.1" cy="0.25" r="0.22" fill={blush} opacity="0.85" />
          <circle cx="1.1" cy="0.25" r="0.22" fill={blush} opacity="0.85" />
        </g>
      ) : null}
    </g>
  );

  return (
    <g>
      <defs>
        <linearGradient id={outerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="45%" stopColor={skyMid} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
        <linearGradient id={panelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mixColors(palette.paper, "#ffffff", 0.22)} />
          <stop offset="100%" stopColor={mixColors(palette.paper, palette.soft, 0.18)} />
        </linearGradient>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      {/* Subtle outer drop shadow for the whole card */}
      <path
        d={outerPath}
        fill={mixColors(palette.border, palette.soft, 0.62)}
        opacity="0.1"
        transform="translate(0.6 0.8)"
      />
      
      {/* Background Gradient */}
      <path d={outerPath} fill={`url(#${outerId})`} />
      
      <g clipPath={`url(#${sceneClip})`}>
        {/* Soft Sun/Moon Glow */}
        <circle
          cx={width * 0.22}
          cy={height * 0.25}
          r={height * 0.35}
          fill={mixColors("#fff9dc", palette.paper, 0.12)}
          opacity="0.25"
        />
        <circle
          cx={width * 0.22}
          cy={height * 0.25}
          r={height * 0.12}
          fill={mixColors("#fffce8", palette.pop, 0.08)}
          opacity="0.6"
        />

        {/* --- LAYER 1: Deep Background Clouds (Small, Faint) --- */}
        {Array.from({ length: 8 }).map((_, index) => {
          const x = width * (0.1 + seeded(seed, 6100 + index) * 0.8);
          const y = height * (0.1 + seeded(seed, 6110 + index) * 0.7);
          const scale = 0.35 + seeded(seed, 6120 + index) * 0.2;
          return <CloudSilhouette key={`bg-cloud-${index}`} x={x} y={y} scale={scale} index={index + 1} op={0.25} />;
        })}

        {/* Magic Dust / Sparkles in the air */}
        {Array.from({ length: 12 }).map((_, index) =>
          index % 3 === 0 ? (
            <path
              key={`cloud-star-${index}`}
              d={sparklePath(
                width * (0.05 + seeded(seed, 6130 + index) * 0.9),
                height * (0.05 + seeded(seed, 6140 + index) * 0.85),
                0.25 + seeded(seed, 6150 + index) * 0.3,
                0.08 + seeded(seed, 6160 + index) * 0.08,
              )}
              fill={mixColors("#fffde2", palette.pop, 0.1)}
              opacity="0.85"
            />
          ) : (
            <circle
              key={`cloud-dot-${index}`}
              cx={width * (0.05 + seeded(seed, 6130 + index) * 0.9)}
              cy={height * (0.05 + seeded(seed, 6140 + index) * 0.85)}
              r={0.12 + seeded(seed, 6150 + index) * 0.15}
              fill={index % 2 === 0 ? mixColors("#ffffff", palette.paper, 0.1) : mixColors(skyMid, palette.accent, 0.2)}
              opacity="0.6"
            />
          ),
        )}

        {/* Magical Air Currents */}
        {Array.from({ length: 5 }).map((_, index) => (
          <path
            key={`wind-${index}`}
            d={`M ${width * (0.1 + seeded(seed, 6170 + index) * 0.8)} ${height * (0.2 + seeded(seed, 6180 + index) * 0.6)} q ${1.5 + seeded(seed, 6190 + index)} ${0.8 + seeded(seed, 6200 + index) * 0.5} ${3 + seeded(seed, 6210 + index)} 0`}
            fill="none"
            stroke={mixColors("#ffffff", palette.paper, 0.1)}
            strokeWidth="0.18"
            strokeLinecap="round"
            opacity="0.4"
          />
        ))}

        {/* --- LAYER 2: Midground Clouds --- */}
        {Array.from({ length: 6 }).map((_, index) => {
          const x = width * (0.1 + seeded(seed, 6220 + index) * 0.8);
          const y = height * (0.3 + seeded(seed, 6230 + index) * 0.6);
          const scale = 0.6 + seeded(seed, 6240 + index) * 0.3;
          return <CloudSilhouette key={`mid-cloud-${index}`} x={x} y={y} scale={scale} index={index + 1} op={0.65} />;
        })}

        {/* --- LAYER 3: Main Foreground Character Clouds --- */}
        {Array.from({ length: 7 }).map((_, index) => {
          // Keep foreground clouds mostly at the bottom edges or framing the text
          const x = width * (0.05 + seeded(seed, 6250 + index) * 0.9);
          const y = height * (0.65 + seeded(seed, 6260 + index) * 0.35); // Lower half
          const scale = 1.1 + seeded(seed, 6270 + index) * 0.6; // Large
          return <CloudSilhouette key={`fg-cloud-${index}`} x={x} y={y} scale={scale} index={index} hasFace={true} op={0.96} />;
        })}
        
        {/* Additional top character cloud */}
        <CloudSilhouette x={width * 0.85} y={height * 0.15} scale={1.2} index={0} hasFace={true} op={0.9} />
        <CloudSilhouette x={width * 0.15} y={height * 0.25} scale={0.9} index={2} hasFace={true} op={0.9} />
      </g>

      {/* Frame / Text bounding rect using premium minimalism */}
      <rect
        x={layout.x}
        y={layout.y}
        width={layout.width}
        height={layout.height}
        rx={Math.max(2.8, layout.rx - 0.38)}
        fill={`url(#${panelId})`}
        fillOpacity="0.68"
        stroke={mixColors(palette.border, palette.paper, 0.18)}
        strokeWidth="0.18"
      />
      
      {/* Outer elegant stroke */}
      <path d={outerPath} fill="none" stroke={mixColors(palette.border, palette.paper, 0.12)} strokeWidth="0.24" />
      
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={inkColor}
        lines={lines}
      />
    </g>
  );
}
