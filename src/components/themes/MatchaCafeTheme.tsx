import { Palette } from "../../types";
import { QuestionLayout } from "../../lib/measure";
import { QuestionText, roundedRectPath, plaquePath } from "./shared";
import { seeded } from "../../lib/color";

export function MatchaCafeTheme(props: {
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
  // Theme colors
  const primaryLeaf = "#aecaab";
  const darkLeaf = "#7d9e79";
  const matchaCrema = "#f0efe4";
  const coffeeBrown = "#7c6858";
  const warmBeige = "#e3dcc8";
  const popCoral = "#eba696";

  const numLeaves = Math.floor(3 + seeded(seed, 4) * 4);
  const leaves = Array.from({ length: numLeaves }).map((_, i) => {
    const x = seeded(seed, i * 3) * width;
    const y = seeded(seed, i * 3 + 1) * height;
    const scale = 0.5 + seeded(seed, i * 3 + 2) * 0.8;
    const rotation = seeded(seed, i * 3 + 3) * 360;
    const type = seeded(seed, i * 3 + 4) > 0.5 ? "solid" : "outline";
    return { x, y, scale, rotation, type };
  });

  const numBeans = Math.floor(2 + seeded(seed, 100) * 3);
  const beans = Array.from({ length: numBeans }).map((_, i) => {
    const x = 10 + seeded(seed, i * 2 + 100) * (width - 20);
    const y = 10 + seeded(seed, i * 2 + 101) * (height - 20);
    const rotation = seeded(seed, i * 2 + 102) * 360;
    return { x, y, rotation };
  });

  const sceneClip = `${cardId}-matcha-scene`;
  const outerPath = plaquePath(1.2, 1.2, width - 2.4, height - 2.4);

  return (
    <g>
      <defs>
        <clipPath id={sceneClip}>
          <path d={outerPath} />
        </clipPath>
      </defs>
      
      <g clipPath={`url(#${sceneClip})`}>
        {/* Base background to prevent dark-mode transparency bleed */}
        <rect x={0} y={0} width={width} height={height} fill={palette.paper} />
        <rect x={0} y={0} width={width} height={height} fill={primaryLeaf} opacity="0.04" />
        
        <g opacity="0.3">
        {/* Soft abstract blobs as table stains or light */}
        <ellipse
          cx={width * 0.15}
          cy={height * 0.8}
          rx={Math.max(10, width * 0.25)}
          ry={Math.max(10, height * 0.3)}
          fill={warmBeige}
          transform={`rotate(-15 ${width * 0.15} ${height * 0.8})`}
        />
        <ellipse
          cx={width * 0.85}
          cy={height * 0.15}
          rx={Math.max(10, width * 0.3)}
          ry={Math.max(10, height * 0.35)}
          fill={primaryLeaf}
          opacity="0.5"
          transform={`rotate(25 ${width * 0.85} ${height * 0.15})`}
        />
        <circle
          cx={width * 0.7}
          cy={height * 0.85}
          r={Math.max(5, height * 0.4)}
          fill={popCoral}
          opacity="0.3"
        />
      </g>

      <g>
        {/* Scattered Matcha Leaves */}
        {leaves.map((leaf, i) => (
          <g key={i} transform={`translate(${leaf.x} ${leaf.y}) scale(${leaf.scale}) rotate(${leaf.rotation})`}>
            {leaf.type === "solid" ? (
              <path
                d="M 0 -8 C 5 -8 8 -3 8 0 C 8 4 4 8 0 8 C -4 8 -8 4 -8 0 C -8 -3 -5 -8 0 -8 Z"
                fill={primaryLeaf}
                opacity="0.75"
              />
            ) : (
              <path
                d="M 0 -8 C 5 -8 8 -3 8 0 C 8 4 4 8 0 8 C -4 8 -8 4 -8 0 C -8 -3 -5 -8 0 -8 Z"
                fill="none"
                stroke={darkLeaf}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
            )}
            {/* Center vein */}
            <path d="M 0 -7 V 7" stroke={matchaCrema} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          </g>
        ))}

        {/* Scattered Coffee Beans / Seeds */}
        {beans.map((bean, i) => (
          <g key={i} transform={`translate(${bean.x} ${bean.y}) rotate(${bean.rotation})`}>
            <ellipse cx="0" cy="0" rx="3.5" ry="5" fill={coffeeBrown} opacity="0.6" />
            <path d="M -1 -4 Q 1 0 -1 4" stroke={warmBeige} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.8" />
          </g>
        ))}
      </g>

      <g>
        {/* Cute Matcha Cup on the bottom right */}
        <g transform={`translate(${width * 0.82} ${height * 0.72}) rotate(5)`}>
          <path d="M -12 -10 L 12 -10 L 9 10 Q 8 13 0 13 Q -8 13 -9 10 Z" fill={matchaCrema} />
          {/* Cup handle */}
          <path d="M 11 -4 Q 18 -4 16 2 Q 13 6 10 3" fill="none" stroke={matchaCrema} strokeWidth="3" strokeLinecap="round" />
          {/* Matcha liquid inside */}
          <path d="M -10 -9 Q 0 -6 10 -9 Q 0 -12 -10 -9 Z" fill={darkLeaf} opacity="0.8" />
          {/* Cup details */}
          <path d="M -6 2 Q 0 5 6 2" fill="none" stroke={coffeeBrown} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </g>
        
        {/* Steam coming out of the cup */}
        <g transform={`translate(${width * 0.82} ${height * 0.72 - 16})`}>
          <path d="M -3 0 Q -8 -8 0 -12 T 0 -22" fill="none" stroke={matchaCrema} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <path d="M 4 2 Q 8 -4 2 -9 T 4 -16" fill="none" stroke={warmBeige} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        </g>
      </g>
      </g>

      {/* Frame / Text bounding rect */}
      <rect
        x={layout.x}
        y={layout.y}
        width={layout.width}
        height={layout.height}
        rx={Math.max(2.8, layout.rx - 0.38)}
        fill="rgba(255, 253, 250, 0.68)"
        stroke={coffeeBrown}
        strokeWidth="0.18"
      />
      
      {/* Outer sticker border */}
      <path d={outerPath} fill="none" stroke={coffeeBrown} strokeWidth="0.6" opacity="0.4" />
      
      <QuestionText
        clipId={clipId}
        layout={layout}
        ink={coffeeBrown}
        lines={lines}
      />
    </g>
  );
}
