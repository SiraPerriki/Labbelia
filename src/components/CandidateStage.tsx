import { CandidateCard } from "./CandidateCard";
import { LabelCard, CardContentMode, LabelSize, Locale, LabelTypefaceId } from "../types";
import { UI_COPY } from "../data/content";
import { localize } from "../lib/i18n";
import { downloadCardSvg } from "../lib/export";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function text(locale: Locale, value: any): string {
  return localize(locale, value);
}

const LABEL_TYPEFACE_OPTIONS: Array<{
  id: LabelTypefaceId;
  label: { es: string; en: string; ja: string };
}> = [
  { id: "gochi", label: { es: "Gochi", en: "Gochi", ja: "ゴチ (手書き)" } },
  { id: "indie", label: { es: "Indie", en: "Indie", ja: "インディー (細字)" } },
  { id: "walter", label: { es: "Walter", en: "Walter", ja: "ウォルター (太字)" } },
];

export interface CandidateStageProps {
  currentCard: LabelCard | undefined;
  contentMode: CardContentMode;
  locale: Locale;
  size: LabelSize;
  
  sheetCards: LabelCard[];
  capacity: number;
  labelTypeface: LabelTypefaceId;
  setLabelTypeface: (t: LabelTypefaceId) => void;
  undoCardByMode: Record<CardContentMode, LabelCard | null>;
  undoLastChange: () => void;
  regenerateBatch: () => void;
  addToSheet: (c: LabelCard) => void;
  sheetFullToast: string | null;
  rerollCurrentLook: () => void;
  rerollCurrentMoodTemplate: () => void;
  rerollCurrentQuestion: () => void;
}

export function CandidateStage({
  currentCard,
  contentMode,
  locale,
  size,
  
  sheetCards,
  capacity,
  labelTypeface,
  setLabelTypeface,
  undoCardByMode,
  undoLastChange,
  regenerateBatch,
  addToSheet,
  sheetFullToast,
  rerollCurrentLook,
  rerollCurrentMoodTemplate,
  rerollCurrentQuestion,
}: CandidateStageProps) {
  const showTypefacePicker = contentMode !== "mood";

  if (!currentCard) {
    return (
      <p className="empty-sheet">
        {contentMode === "challenge"
          ? text(locale, { es: "No quedan retos creativos ahora mismo.", en: "No creative challenges left right now.", ja: "今はもう残りの創作課題がありません。" })
          : text(locale, { es: "No quedan más preguntas en este filtro.", en: "No prompts left in this filter.", ja: "このフィルタにはもう残りの質問がありません。" })}
      </p>
    );
  }

  const isAlreadyOnSheet =
    (currentCard.contentMode === "prompt" || currentCard.contentMode === "challenge") &&
    sheetCards.some(
      (selected) =>
        selected.contentMode === currentCard.contentMode &&
        selected.question.id === currentCard.question.id,
    );

  return (
    <div className="focus-stage">
      <div className="focus-caption">
        <div className="focus-heading">
          <span className="focus-kicker">
            {contentMode === "mood"
              ? text(locale, { es: "Tracker", en: "Tracker", ja: "メモ" })
              : contentMode === "challenge"
                ? text(locale, { es: "Tirita creativa", en: "Creative strip", ja: "小さな創作" })
                : text(locale, { es: "Tirita", en: "Strip", ja: "ひとこと" })}
          </span>
        </div>
        <div className="focus-status-strip">
          {showTypefacePicker && (
            <label className="mini-select" htmlFor="label-typeface-select">
              <span>{text(locale, { es: "Tipografía", en: "Font", ja: "フォント" })}</span>
              <select
                id="label-typeface-select"
                value={labelTypeface}
                onChange={(event) => setLabelTypeface(event.target.value as LabelTypefaceId)}
              >
                {LABEL_TYPEFACE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {text(locale, option.label)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <span className="mini-stat mini-stat-soft">
            {text(locale, UI_COPY.selected)} {sheetCards.length}/{capacity}
          </span>
        </div>
      </div>
      <div className="focus-actions">
        <button
          className="button button-ghost"
          disabled={!undoCardByMode[contentMode]}
          onClick={undoLastChange}
          type="button"
        >
          {text(locale, { es: "↶ Deshacer", en: "↶ Undo", ja: "↶ やり直す" })}
        </button>
        <button
          className="button button-secondary"
          onClick={regenerateBatch}
          type="button"
        >
          {contentMode === "mood"
            ? text(locale, { es: "↻ Otro tracker", en: "↻ Another tracker", ja: "↻ 別のメモ" })
            : contentMode === "challenge"
              ? text(locale, { es: "↻ Otro reto", en: "↻ Another challenge", ja: "↻ 別の創作" })
              : text(locale, { es: "↻ Siguiente", en: "↻ Next", ja: "↻ 次へ" })}
        </button>
        <button
          className="button button-primary"
          disabled={sheetCards.length >= capacity || isAlreadyOnSheet}
          onClick={() => addToSheet(currentCard)}
          type="button"
        >
          {isAlreadyOnSheet
            ? text(locale, { es: "En hoja", en: "On sheet", ja: "シートに追加済み" })
            : contentMode === "challenge"
              ? text(locale, { es: "＋ Guardar reto", en: "＋ Keep challenge", ja: "＋ 創作を保存" })
              : text(locale, { es: "＋ Guardar en hoja", en: "＋ Keep on sheet", ja: "＋ シートに保存" })}
        </button>
      </div>
      {sheetFullToast && (
        <div className="mini-toast" aria-live="polite" role="status">
          <span className="mini-toast-heart" aria-hidden="true">
            ♡
          </span>
          <span>{sheetFullToast}</span>
          <span className="mini-toast-heart" aria-hidden="true">
            ♡
          </span>
        </div>
      )}
      <CandidateCard
        key={currentCard.id}
        card={currentCard}
        size={size}
        locale={locale}
        typeface={labelTypeface}
        onDownload={(item) => downloadCardSvg(item, size, locale, labelTypeface)}
        onRefreshLook={rerollCurrentLook}
        onRefreshQuestion={
          currentCard.contentMode === "mood" ? rerollCurrentMoodTemplate : rerollCurrentQuestion
        }
        downloadLabel={text(locale, { es: "↓ SVG individual", en: "↓ Single SVG", ja: "↓ 個別 SVG" })}
        refreshLookLabel={text(locale, { es: "◌ Fondo", en: "◌ Background", ja: "◌ 背景" })}
        refreshQuestionLabel={
          currentCard.contentMode === "mood"
            ? text(locale, { es: "☆ Tracker", en: "☆ Tracker", ja: "☆ メモ" })
            : currentCard.contentMode === "prompt"
              ? text(locale, { es: "✎ Frase", en: "✎ Phrase", ja: "✎ ひとこと" })
              : currentCard.contentMode === "challenge"
                ? text(locale, { es: "✎ Reto", en: "✎ Challenge", ja: "✎ 創作" })
                : undefined
        }
      />
    </div>
  );
}
