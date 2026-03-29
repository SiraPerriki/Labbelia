import { LabelCard, LabelSize, Locale } from "../types";
import { LabelGroup } from "./LabelSvg";

interface SheetSvgProps {
  cards: LabelCard[];
  locale: Locale;
  size: LabelSize;
  showPlaceholders?: boolean;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

function slotPosition(index: number, size: LabelSize) {
  const totalWidth = size.columns * size.widthMm + (size.columns - 1) * size.gapMm;
  const totalHeight = size.rows * size.heightMm + (size.rows - 1) * size.gapMm;
  const startX = (A4_WIDTH_MM - totalWidth) / 2;
  const startY = (A4_HEIGHT_MM - totalHeight) / 2;
  const column = index % size.columns;
  const row = Math.floor(index / size.columns);

  return {
    x: startX + column * (size.widthMm + size.gapMm),
    y: startY + row * (size.heightMm + size.gapMm),
  };
}

export function SheetSvg(props: SheetSvgProps) {
  const { cards, locale, size, showPlaceholders = false } = props;
  const capacity = size.columns * size.rows;
  const ariaLabel =
    locale === "en"
      ? "Printable A4 label sheet"
      : locale === "ga"
        ? "Folla A4 imprimible de etiquetas"
        : "Hoja A4 imprimible de etiquetas";

  return (
    <svg
      viewBox={`0 0 ${A4_WIDTH_MM} ${A4_HEIGHT_MM}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <rect width={A4_WIDTH_MM} height={A4_HEIGHT_MM} fill="#ffffff" />
      <rect
        x={2.5}
        y={2.5}
        width={A4_WIDTH_MM - 5}
        height={A4_HEIGHT_MM - 5}
        rx={3.2}
        fill="none"
        stroke="#d9c8b7"
        strokeWidth="0.7"
      />
      <text
        x={A4_WIDTH_MM - 5}
        y={A4_HEIGHT_MM - 3.4}
        textAnchor="end"
        fontFamily="Nunito, Segoe UI, sans-serif"
        fontSize="2.4"
        fontWeight="700"
        letterSpacing="0.08"
        fill="#b49e8f"
      >
        @SiraPerriki
      </text>
      {Array.from({ length: capacity }).map((_, index) => {
        const position = slotPosition(index, size);
        const card = cards[index];

        if (card) {
          return (
            <LabelGroup
              key={card.id}
              card={card}
              locale={locale}
              size={size}
              x={position.x}
              y={position.y}
            />
          );
        }

        if (!showPlaceholders) {
          return null;
        }

        return (
          <g
            key={`placeholder-${index}`}
            transform={`translate(${position.x} ${position.y})`}
          >
            <rect
              width={size.widthMm}
              height={size.heightMm}
              rx={5}
              fill="#ffffff"
              stroke="#dbc9b8"
              strokeDasharray="2.2 2.6"
              strokeWidth="0.8"
            />
          </g>
        );
      })}
    </svg>
  );
}
