import { SheetSvg } from "./SheetSvg";
import { LabelCard, CardContentMode, LabelSize, Locale, LabelTypefaceId } from "../types";
import { UI_COPY } from "../data/content";
import { localize } from "../lib/i18n";
import { downloadSheetSvg } from "../lib/export";
import { getMoodTrackerTitle } from "../data/mood";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function text(locale: Locale, value: any): string {
  return localize(locale, value);
}

export interface SheetPanelProps {
  contentMode: CardContentMode;
  locale: Locale;
  sheetCards: LabelCard[];
  size: LabelSize;
  capacity: number;
  labelTypeface: LabelTypefaceId;
  exportingPng: boolean;
  clearSheet: () => void;
  removeFromSheet: (id: string) => void;
  handleSheetPng: () => Promise<void>;
  printSheet: () => void;
}

export function SheetPanel({
  contentMode,
  locale,
  sheetCards,
  size,
  capacity,
  labelTypeface,
  exportingPng,
  clearSheet,
  removeFromSheet,
  handleSheetPng,
  printSheet,
}: SheetPanelProps) {
  function cardLabel(card: LabelCard): string {
    return card.contentMode === "mood"
      ? localize(locale, getMoodTrackerTitle(card.moodTemplateId))
      : localize(locale, card.question.text);
  }

  return (
    <section className="sheet-panel card-surface" data-nosnippet>
      <div className="section-header section-header-inline">
        <div>
          <h2>
            {contentMode === "mood"
              ? text(locale, { es: "A4 de mood tracker compacto", en: "A4 of compact mood trackers", ja: "A4気分の記録シート" })
              : contentMode === "challenge"
                ? text(locale, { es: "A4 de tiritas mini de retos creativos", en: "A4 of mini creative challenge strips", ja: "A4の小さな創作メモ" })
                : text(locale, { es: "A4 de tiritas mini para journaling", en: "A4 of mini journaling strips", ja: "A4の小さなジャーナリングメモ" })}
          </h2>
          <p>
            {contentMode === "mood"
              ? text(locale, { es: "Compón una hoja de seguimiento.", en: "Build a compact mood sheet ready to print.", ja: "印刷して使えるまとめシートを作りましょう。" })
              : contentMode === "challenge"
                ? text(locale, { es: "Llena la página con retos creativos.", en: "Fill the page with creative challenges.", ja: "シートを創作メモでいっぱいにしましょう。" })
                : text(locale, UI_COPY.sheetSubtitle)}
          </p>
        </div>
        <div className="toolbar">
          <button
            className="button button-secondary"
            onClick={clearSheet}
            type="button"
          >
            {text(locale, { es: "⌫ Vaciar hoja", en: "⌫ Clear sheet", ja: "⌫ シートを空にする" })}
          </button>
        </div>
      </div>

      <div className="sheet-meta sheet-meta-inline">
        <span>
          {text(locale, UI_COPY.selected)} {sheetCards.length}/{capacity} - {localize(locale, size.description)}
        </span>
      </div>

      <div className="print-area">
        <div className={`sheet-frame sheet-frame-${size.id}`}>
          <SheetSvg
            cards={sheetCards}
            locale={locale}
            size={size}
            typeface={labelTypeface}
            showPlaceholders
          />
        </div>
      </div>

      <div className="export-row">
        <button
          className="button button-primary"
          disabled={sheetCards.length === 0}
          onClick={() => downloadSheetSvg(sheetCards, size, locale, labelTypeface)}
          type="button"
        >
          {text(locale, { es: "↓ Descargar A4 SVG", en: "↓ Download A4 SVG", ja: "↓ A4 SVG ダウンロード" })}
        </button>
        <button
          className="button button-primary"
          disabled={sheetCards.length === 0 || exportingPng}
          onClick={handleSheetPng}
          type="button"
        >
          {exportingPng
            ? text(locale, { es: "… Renderizando", en: "… Rendering", ja: "… レンダリング中" })
            : text(locale, { es: "↓ Descargar A4 PNG", en: "↓ Download A4 PNG", ja: "↓ A4 PNG ダウンロード" })}
        </button>
        <button
          className="button button-secondary"
          disabled={sheetCards.length === 0}
          onClick={printSheet}
          type="button"
        >
          {text(locale, { es: "⎙ Imprimir / PDF", en: "⎙ Print / PDF", ja: "⎙ 印刷 / PDF" })}
        </button>
      </div>

      <p className="print-hint">{text(locale, UI_COPY.printHint)}</p>

      {sheetCards.length === 0 ? (
        <p className="empty-sheet">{text(locale, UI_COPY.emptySheet)}</p>
      ) : (
        <div className="selected-list">
          {sheetCards.map((card, index) => (
            <div key={card.id} className="selected-item">
              <span className="selected-index">{index + 1}</span>
              <span className="selected-question">{cardLabel(card)}</span>
              <button
                className="text-button"
                onClick={() => removeFromSheet(card.id)}
                type="button"
              >
                {text(locale, UI_COPY.remove)}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
