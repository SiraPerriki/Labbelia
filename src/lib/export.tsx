import { renderToStaticMarkup } from "react-dom/server";
import { SheetSvg } from "../components/SheetSvg";
import { LabelSvg } from "../components/LabelSvg";
import { localize } from "./i18n";
import { LabelCard, LabelSize, Locale } from "../types";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const EXPORT_DPI = 300;

function mmToPixels(mm: number): number {
  return Math.round((mm / 25.4) * EXPORT_DPI);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function svgDocument(markup: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>${markup}`;
}

function exportName(card: LabelCard, locale: Locale): string {
  if (card.contentMode === "mood") {
    return `mood-tracker-${card.themeId}`;
  }

  return slugify(localize(locale, card.question.text)) || "label";
}

export function downloadCardSvg(card: LabelCard, size: LabelSize, locale: Locale): void {
  const markup = renderToStaticMarkup(
    <LabelSvg
      card={card}
      locale={locale}
      size={size}
    />,
  );

  downloadBlob(
    new Blob([svgDocument(markup)], { type: "image/svg+xml;charset=utf-8" }),
    `${exportName(card, locale)}.svg`,
  );
}

export function downloadSheetSvg(cards: LabelCard[], size: LabelSize, locale: Locale): void {
  const markup = renderToStaticMarkup(
    <SheetSvg
      cards={cards}
      locale={locale}
      size={size}
      showPlaceholders={cards.length === 0}
    />,
  );

  downloadBlob(
    new Blob([svgDocument(markup)], { type: "image/svg+xml;charset=utf-8" }),
    `labbelia-sheet-${size.id}.svg`,
  );
}

export async function downloadSheetPng(
  cards: LabelCard[],
  size: LabelSize,
  locale: Locale,
): Promise<void> {
  const markup = renderToStaticMarkup(
    <SheetSvg
      cards={cards}
      locale={locale}
      size={size}
      showPlaceholders={cards.length === 0}
    />,
  );
  const svgText = svgDocument(markup);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.decoding = "sync";

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not load the generated SVG."));
    image.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = mmToPixels(A4_WIDTH_MM);
  canvas.height = mmToPixels(A4_HEIGHT_MM);
  const context = canvas.getContext("2d");

  if (!context) {
    URL.revokeObjectURL(url);
    throw new Error("Could not get a canvas rendering context.");
  }

  context.fillStyle = "#fcf6ed";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  URL.revokeObjectURL(url);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) {
    throw new Error("Could not create the PNG file.");
  }

  downloadBlob(blob, `labbelia-sheet-${size.id}.png`);
}
