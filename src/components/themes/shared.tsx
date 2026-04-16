import { createContext, useContext } from "react";
import {
  seeded,
  mixColors,
} from "../../lib/color";
import {
  QuestionLayout,
} from "../../lib/measure";
import { LabelCard, LabelSize, LabelTypefaceId, Locale } from "../../types";

export interface SharedProps {
  card: LabelCard;
  locale: Locale;
  size: LabelSize;
  typeface?: LabelTypefaceId;
}

export interface ArtProps extends SharedProps {
  width: number;
  height: number;
}

export const LabelTypefaceContext = createContext<LabelTypefaceId>("gochi");

export function handwritingFontFamily(typeface: LabelTypefaceId): string {
  switch (typeface) {
    case "indie":
      return "'Indie Flower', 'Yomogi', 'Zen Maru Gothic', 'Gochi Hand', 'Quicksand', 'Nunito', cursive";
    case "walter":
      return "'Walter Turncoat', 'Yusei Magic', 'Zen Maru Gothic', 'Gochi Hand', 'Indie Flower', 'Quicksand', cursive";
    case "gochi":
    default:
      return "'Gochi Hand', 'Zen Maru Gothic', 'Indie Flower', 'Quicksand', 'Nunito', cursive";
  }
}

export function ticketPath(
  x: number,
  y: number,
  width: number,
  height: number,
  corner: number,
  notch: number,
): string {
  const midY = y + height / 2;

  return [
    `M ${x + corner} ${y}`,
    `H ${x + width - corner}`,
    `Q ${x + width} ${y} ${x + width} ${y + corner}`,
    `V ${midY - notch}`,
    `Q ${x + width - notch * 1.3} ${midY} ${x + width} ${midY + notch}`,
    `V ${y + height - corner}`,
    `Q ${x + width} ${y + height} ${x + width - corner} ${y + height}`,
    `H ${x + corner}`,
    `Q ${x} ${y + height} ${x} ${y + height - corner}`,
    `V ${midY + notch}`,
    `Q ${x + notch * 1.3} ${midY} ${x} ${midY - notch}`,
    `V ${y + corner}`,
    `Q ${x} ${y} ${x + corner} ${y}`,
    "Z",
  ].join(" ");
}

export function cloudPath(x: number, y: number, width: number, height: number): string {
  return [
    `M ${x + width * 0.16} ${y + height * 0.18}`,
    `C ${x + width * 0.07} ${y + height * 0.02} ${x + width * 0.26} ${y - height * 0.01} ${x + width * 0.37} ${y + height * 0.12}`,
    `C ${x + width * 0.48} ${y - height * 0.02} ${x + width * 0.67} ${y + height * 0.01} ${x + width * 0.74} ${y + height * 0.15}`,
    `C ${x + width * 0.9} ${y + height * 0.08} ${x + width} ${y + height * 0.23} ${x + width} ${y + height * 0.39}`,
    `C ${x + width} ${y + height * 0.61} ${x + width * 0.89} ${y + height * 0.78} ${x + width * 0.72} ${y + height * 0.76}`,
    `C ${x + width * 0.64} ${y + height * 0.94} ${x + width * 0.39} ${y + height} ${x + width * 0.28} ${y + height * 0.83}`,
    `C ${x + width * 0.1} ${y + height * 0.9} ${x} ${y + height * 0.73} ${x} ${y + height * 0.56}`,
    `C ${x} ${y + height * 0.36} ${x + width * 0.06} ${y + height * 0.22} ${x + width * 0.16} ${y + height * 0.18}`,
    "Z",
  ].join(" ");
}

export function plaquePath(x: number, y: number, width: number, height: number): string {
  return [
    `M ${x + 10} ${y}`,
    `H ${x + width - 10}`,
    `Q ${x + width - 2} ${y} ${x + width - 2} ${y + 9}`,
    `V ${y + height - 9}`,
    `Q ${x + width - 2} ${y + height} ${x + width - 10} ${y + height}`,
    `H ${x + 10}`,
    `Q ${x + 2} ${y + height} ${x + 2} ${y + height - 9}`,
    `V ${y + 9}`,
    `Q ${x + 2} ${y} ${x + 10} ${y}`,
    "Z",
  ].join(" ");
}

export function cartouchePath(
  x: number,
  y: number,
  width: number,
  height: number,
  wing: number,
): string {
  return [
    `M ${x + wing + 4} ${y}`,
    `H ${x + width - wing - 4}`,
    `Q ${x + width - wing} ${y} ${x + width - wing} ${y + 4}`,
    `V ${y + height * 0.28}`,
    `Q ${x + width} ${y + height * 0.35} ${x + width} ${y + height * 0.5}`,
    `Q ${x + width} ${y + height * 0.65} ${x + width - wing} ${y + height * 0.72}`,
    `V ${y + height - 4}`,
    `Q ${x + width - wing} ${y + height} ${x + width - wing - 4} ${y + height}`,
    `H ${x + wing + 4}`,
    `Q ${x + wing} ${y + height} ${x + wing} ${y + height - 4}`,
    `V ${y + height * 0.72}`,
    `Q ${x} ${y + height * 0.65} ${x} ${y + height * 0.5}`,
    `Q ${x} ${y + height * 0.35} ${x + wing} ${y + height * 0.28}`,
    `V ${y + 4}`,
    `Q ${x + wing} ${y} ${x + wing + 4} ${y}`,
    "Z",
  ].join(" ");
}

export function roundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): string {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));

  return [
    `M ${x + r} ${y}`,
    `H ${x + width - r}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `V ${y + height - r}`,
    `Q ${x + width} ${y + height} ${x + width - r} ${y + height}`,
    `H ${x + r}`,
    `Q ${x} ${y + height} ${x} ${y + height - r}`,
    `V ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    "Z",
  ].join(" ");
}

export function rollingHillPath(
  width: number,
  height: number,
  baseY: number,
  amplitude: number,
  seed: number,
  salt: number,
): string {
  const left = baseY + (seeded(seed, salt + 1) - 0.5) * amplitude;
  const c1 = baseY - amplitude * (0.8 + seeded(seed, salt + 2) * 0.6);
  const c2 = baseY + amplitude * (0.1 + seeded(seed, salt + 3) * 0.7);
  const c3 = baseY - amplitude * (0.25 + seeded(seed, salt + 4) * 0.8);
  const c4 = baseY + amplitude * (0.05 + seeded(seed, salt + 5) * 0.75);
  const c5 = baseY - amplitude * (0.22 + seeded(seed, salt + 6) * 0.78);
  const right = baseY + (seeded(seed, salt + 7) - 0.45) * amplitude;

  return [
    `M -4 ${height + 4}`,
    `L -4 ${left}`,
    `C ${width * 0.12} ${c1} ${width * 0.25} ${c2} ${width * 0.42} ${c3}`,
    `C ${width * 0.58} ${c4} ${width * 0.76} ${c5} ${width + 4} ${right}`,
    `L ${width + 4} ${height + 4}`,
    "Z",
  ].join(" ");
}

export function sparklePath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points = 4,
): string {
  const total = points * 2;
  const coordinates = Array.from({ length: total }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / points;
    const radius = index % 2 === 0 ? outer : inner;

    return `${cx + Math.cos(angle) * radius} ${cy + Math.sin(angle) * radius}`;
  });

  return `M ${coordinates.join(" L ")} Z`;
}

export function ribbonPath(x: number, y: number, width: number, height: number): string {
  return [
    `M ${x} ${y + height * 0.18}`,
    `Q ${x + width * 0.18} ${y - height * 0.1} ${x + width * 0.36} ${y + height * 0.18}`,
    `H ${x + width * 0.64}`,
    `Q ${x + width * 0.82} ${y - height * 0.1} ${x + width} ${y + height * 0.18}`,
    `V ${y + height * 0.82}`,
    `Q ${x + width * 0.82} ${y + height * 1.08} ${x + width * 0.64} ${y + height * 0.82}`,
    `H ${x + width * 0.36}`,
    `Q ${x + width * 0.18} ${y + height * 1.08} ${x} ${y + height * 0.82}`,
    "Z",
  ].join(" ");
}

export function heartPath(cx: number, cy: number, size: number): string {
  return [
    `M ${cx} ${cy + size * 0.92}`,
    `C ${cx - size * 0.92} ${cy + size * 0.34} ${cx - size * 1.3} ${cy - size * 0.38} ${cx - size * 0.56} ${cy - size * 0.62}`,
    `C ${cx - size * 0.1} ${cy - size * 0.82} ${cx + size * 0.02} ${cy - size * 0.28} ${cx} ${cy - size * 0.02}`,
    `C ${cx - size * 0.02} ${cy - size * 0.28} ${cx + size * 0.1} ${cy - size * 0.82} ${cx + size * 0.56} ${cy - size * 0.62}`,
    `C ${cx + size * 1.3} ${cy - size * 0.38} ${cx + size * 0.92} ${cy + size * 0.34} ${cx} ${cy + size * 0.92}`,
    "Z",
  ].join(" ");
}

export function QuestionText(props: {
  clipId: string;
  layout: QuestionLayout;
  ink: string;
  lines: string[];
}) {
  const { clipId, layout, ink, lines } = props;
  const typeface = useContext(LabelTypefaceContext);

  if (layout.variant === "mood") {
    const rows = lines.slice(1);
    const rowFontSize = layout.rowFontSize ?? layout.fontSize;
    const starSize = layout.starSize ?? rowFontSize * 0.48;
    const labelWidth = layout.trackerLabelWidth ?? rowFontSize * 7.2;
    const starGap = starSize * 0.54;
    const starsWidth = starSize * 2 * 5 + starGap * 4;
    const columnGap = rowFontSize * 0.66;
    const innerPadding = rowFontSize * 0.34;
    const contentWidth = labelWidth + columnGap + starsWidth + innerPadding * 2;
    const blockX = layout.x + (layout.width - contentWidth) / 2;
    const labelX = blockX + innerPadding;
    const starStartX = labelX + labelWidth + columnGap;
    const contentHeight = rowFontSize + Math.max(0, rows.length - 1) * layout.lineHeight;
    const baselineLift = rowFontSize * 0.76;
    const firstRowY = layout.y + layout.height / 2 - contentHeight / 2 + baselineLift;

    return (
      <>
        <clipPath id={clipId}>
          <rect
            x={layout.x + 1.1}
            y={layout.y + 1}
            width={layout.width - 2.2}
            height={layout.height - 2}
            rx={Math.max(1, layout.rx - 0.7)}
          />
        </clipPath>
        {rows.map((row, index) => {
          const y = firstRowY + index * layout.lineHeight;
          return (
            <g key={`${clipId}-mood-row-${index}`} clipPath={`url(#${clipId})`}>
              <text
                x={labelX}
                y={y}
                fontFamily="'Quicksand', 'Nunito', 'Segoe UI', sans-serif"
                fontSize={rowFontSize}
                fontWeight="600"
                letterSpacing="0.01em"
                fill={ink}
              >
                {row}
              </text>
              {Array.from({ length: 5 }).map((_, starIndex) => {
                const cx = starStartX + starIndex * (starSize * 2 + starGap) + starSize;
                const cy = y - rowFontSize * 0.3;
                return (
                  <path
                    key={`${clipId}-star-${index}-${starIndex}`}
                    d={sparklePath(cx, cy, starSize, starSize * 0.44, 5)}
                    fill="none"
                    stroke={mixColors(ink, "#ffffff", 0.18)}
                    strokeWidth={starSize * 0.14}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          );
        })}
      </>
    );
  }

  const baselineLift = layout.fontSize * 0.3;
  const firstLineY =
    layout.y + layout.height / 2 - ((lines.length - 1) * layout.lineHeight) / 2 + baselineLift;

  return (
    <>
      <clipPath id={clipId}>
        <rect
          x={layout.x + 1.1}
          y={layout.y + 1}
          width={layout.width - 2.2}
          height={layout.height - 2}
          rx={Math.max(1, layout.rx - 0.7)}
        />
      </clipPath>
      <text
        x={layout.x + layout.width / 2}
        y={firstLineY}
        textAnchor="middle"
        fontFamily={handwritingFontFamily(typeface)}
        fontSize={layout.fontSize * 1.03}
        fontWeight="400"
        letterSpacing="0.004em"
        fill={ink}
        clipPath={`url(#${clipId})`}
      >
        {lines.map((line, index) => (
          <tspan
            key={`${clipId}-line-${index}`}
            x={layout.x + layout.width / 2}
            dy={index === 0 ? 0 : layout.lineHeight}
          >
            {line}
          </tspan>
        ))}
      </text>
    </>
  );
}

export function Flower(props: {
  x: number;
  y: number;
  scale: number;
  petal: string;
  center: string;
  stem: string;
  rotation?: number;
}) {
  const { x, y, scale, petal, center, stem, rotation = 0 } = props;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <path
        d={`M 0 0 Q ${0.2 * scale} ${2.4 * scale} ${0.1 * scale} ${6.8 * scale}`}
        fill="none"
        stroke={stem}
        strokeWidth={0.42 * scale}
        strokeLinecap="round"
      />
      {Array.from({ length: 5 }).map((_, index) => {
        const angle = (Math.PI * 2 * index) / 5;
        const px = Math.cos(angle) * 1.55 * scale;
        const py = Math.sin(angle) * 1.55 * scale - 2.15 * scale;

        return (
          <ellipse
            key={`petal-${index}`}
            cx={px}
            cy={py}
            rx={0.9 * scale}
            ry={1.45 * scale}
            fill={petal}
            transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
          />
        );
      })}
      <circle cx="0" cy={-2.05 * scale} r={0.85 * scale} fill={center} />
    </g>
  );
}

export function WildflowerSprig(props: {
  x: number;
  baseY: number;
  height: number;
  lean: number;
  scale: number;
  stem: string;
  petal: string;
  center: string;
  style: "daisy" | "cluster" | "bell";
  opacity?: number;
}) {
  const { x, baseY, height, lean, scale, stem, petal, center, style, opacity = 1 } = props;
  const topX = x + lean * scale;
  const topY = baseY - height;
  const controlX = x + lean * scale * 0.45;
  const controlY = baseY - height * 0.52;
  const leafColor = mixColors(stem, petal, 0.28);

  return (
    <g opacity={opacity}>
      <path
        d={`M ${x} ${baseY} Q ${controlX} ${controlY} ${topX} ${topY}`}
        fill="none"
        stroke={stem}
        strokeWidth={0.42 * scale}
        strokeLinecap="round"
      />
      <ellipse
        cx={x + lean * scale * 0.28 - 0.6 * scale}
        cy={baseY - height * 0.4}
        rx={0.95 * scale}
        ry={0.42 * scale}
        fill={leafColor}
        transform={`rotate(${-30 + lean * 8} ${x + lean * scale * 0.28 - 0.6 * scale} ${baseY - height * 0.4})`}
      />
      <ellipse
        cx={x + lean * scale * 0.55 + 0.55 * scale}
        cy={baseY - height * 0.62}
        rx={0.88 * scale}
        ry={0.38 * scale}
        fill={leafColor}
        transform={`rotate(${34 + lean * 10} ${x + lean * scale * 0.55 + 0.55 * scale} ${baseY - height * 0.62})`}
      />
      {style === "daisy" ? (
        <g transform={`translate(${topX} ${topY}) rotate(${lean * 9})`}>
          {Array.from({ length: 6 }).map((_, index) => {
            const angle = (Math.PI * 2 * index) / 6;
            const px = Math.cos(angle) * 1.28 * scale;
            const py = Math.sin(angle) * 1.28 * scale;

            return (
              <ellipse
                key={`daisy-${index}`}
                cx={px}
                cy={py}
                rx={0.7 * scale}
                ry={1.18 * scale}
                fill={petal}
                transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
              />
            );
          })}
          <circle cx="0" cy="0" r={0.72 * scale} fill={center} />
        </g>
      ) : null}
      {style === "cluster" ? (
        <g transform={`translate(${topX} ${topY}) rotate(${lean * 8})`}>
          <circle cx={-0.95 * scale} cy={-0.6 * scale} r={0.9 * scale} fill={petal} />
          <circle
            cx={0.9 * scale}
            cy={-0.52 * scale}
            r={0.92 * scale}
            fill={mixColors(petal, center, 0.22)}
          />
          <circle
            cx="0"
            cy={0.5 * scale}
            r={0.98 * scale}
            fill={mixColors(petal, "#ffffff", 0.12)}
          />
          <circle cx="0" cy="0" r={0.44 * scale} fill={center} />
        </g>
      ) : null}
      {style === "bell" ? (
        <g transform={`translate(${topX} ${topY}) rotate(${lean * 10})`}>
          <path
            d={`M 0 0 q ${1.4 * scale} ${0.6 * scale} ${1.05 * scale} ${2.1 * scale} q ${-1.35 * scale} ${0.25 * scale} ${-2.1 * scale} ${-0.78 * scale} q ${0.04 * scale} ${-1.1 * scale} ${1.05 * scale} ${-1.32 * scale}`}
            fill={petal}
          />
          <circle
            cx={-0.08 * scale}
            cy={1.1 * scale}
            r={0.36 * scale}
            fill={center}
            opacity="0.68"
          />
        </g>
      ) : null}
    </g>
  );
}

export function MeadowBloom(props: {
  x: number;
  baseY: number;
  height: number;
  lean: number;
  scale: number;
  stem: string;
  petal: string;
  center: string;
  opacity?: number;
}) {
  const { x, baseY, height, lean, scale, stem, petal, center, opacity = 1 } = props;
  const topX = x + lean * scale;
  const topY = baseY - height;
  const leafColor = mixColors(stem, petal, 0.26);

  return (
    <g opacity={opacity}>
      <path
        d={`M ${x} ${baseY} Q ${x + lean * scale * 0.4} ${baseY - height * 0.45} ${topX} ${topY}`}
        fill="none"
        stroke={stem}
        strokeWidth={0.36 * scale}
        strokeLinecap="round"
      />
      <ellipse
        cx={x + lean * scale * 0.22 - 0.48 * scale}
        cy={baseY - height * 0.38}
        rx={0.82 * scale}
        ry={0.32 * scale}
        fill={leafColor}
        transform={`rotate(${-28 + lean * 8} ${x + lean * scale * 0.22 - 0.48 * scale} ${baseY - height * 0.38})`}
      />
      <ellipse
        cx={x + lean * scale * 0.54 + 0.42 * scale}
        cy={baseY - height * 0.58}
        rx={0.7 * scale}
        ry={0.28 * scale}
        fill={leafColor}
        transform={`rotate(${26 + lean * 8} ${x + lean * scale * 0.54 + 0.42 * scale} ${baseY - height * 0.58})`}
      />
      <g transform={`translate(${topX} ${topY}) rotate(${lean * 10})`}>
        {Array.from({ length: 7 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 7;
          const px = Math.cos(angle) * 1.22 * scale;
          const py = Math.sin(angle) * 1.22 * scale;

          return (
            <ellipse
              key={`meadow-petal-${index}`}
              cx={px}
              cy={py}
              rx={0.48 * scale}
              ry={1.18 * scale}
              fill={petal}
              transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
            />
          );
        })}
        <circle cx="0" cy="0" r={0.62 * scale} fill={center} />
      </g>
      <g
        transform={`translate(${topX - 1.55 * scale} ${topY + 1.7 * scale}) rotate(${-16 + lean * 10})`}
        opacity="0.78"
      >
        <path
          d={`M 0 0 q ${0.95 * scale} ${0.4 * scale} ${0.7 * scale} ${1.4 * scale} q ${-0.92 * scale} ${0.18 * scale} ${-1.36 * scale} ${-0.46 * scale} q 0 ${-0.82 * scale} ${0.66 * scale} ${-0.94 * scale}`}
          fill={mixColors(petal, center, 0.18)}
        />
      </g>
    </g>
  );
}
