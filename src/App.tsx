import { startTransition, useEffect, useState } from "react";
import { CandidateCard } from "./components/CandidateCard";
import { SheetSvg } from "./components/SheetSvg";
import { UI_COPY } from "./data/content";
import { LABEL_SIZES } from "./data/design";
import { MOOD_TRACKER_ROWS, MOOD_TRACKER_TITLE } from "./data/mood";
import { QUESTION_BANK } from "./data/questions";
import { downloadCardSvg, downloadSheetPng, downloadSheetSvg } from "./lib/export";
import { ALL_CATEGORIES, createBatch, createMoodBatch } from "./lib/generator";
import { LabelCard, LabelSizeId, Locale } from "./types";

const BATCH_SIZE = 1;

function text(locale: Locale, value: { es: string; en: string }): string {
  return value[locale];
}

function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = window.localStorage.getItem("paper-hearts-locale");
    return stored === "en" ? "en" : "es";
  });
  const [sizeId, setSizeId] = useState<LabelSizeId>("classic");
  const [contentMode, setContentMode] = useState<"prompt" | "mood">("prompt");
  const [candidates, setCandidates] = useState<LabelCard[]>([]);
  const [sheetCards, setSheetCards] = useState<LabelCard[]>([]);
  const [exportingPng, setExportingPng] = useState(false);

  const size = LABEL_SIZES.find((option) => option.id === sizeId) ?? LABEL_SIZES[0];
  const capacity = size.columns * size.rows;

  useEffect(() => {
    window.localStorage.setItem("paper-hearts-locale", locale);
  }, [locale]);

  useEffect(() => {
    startTransition(() => {
      setCandidates(contentMode === "mood"
        ? createMoodBatch({
            count: BATCH_SIZE,
            sizeId,
          })
        : createBatch({
            questions: QUESTION_BANK,
            count: BATCH_SIZE,
            categoryId: ALL_CATEGORIES,
            sizeId,
            excludeQuestionIds: sheetCards
              .filter((card) => card.contentMode === "prompt")
              .map((card) => card.question.id),
          }));
    });
  }, [contentMode, sizeId, sheetCards]);

  function regenerateBatch(): void {
    startTransition(() => {
      setCandidates(contentMode === "mood"
        ? createMoodBatch({
            count: BATCH_SIZE,
            sizeId,
          })
        : createBatch({
            questions: QUESTION_BANK,
            count: BATCH_SIZE,
            categoryId: ALL_CATEGORIES,
            sizeId,
            excludeQuestionIds: sheetCards
              .filter((card) => card.contentMode === "prompt")
              .map((card) => card.question.id),
          }));
    });
  }

  function addToSheet(card: LabelCard): void {
    if (sheetCards.length >= capacity) {
      return;
    }

    if (card.contentMode === "prompt" && sheetCards.some((item) => item.contentMode === "prompt" && item.question.id === card.question.id)) {
      return;
    }

    setSheetCards([...sheetCards, card]);
  }

  function removeFromSheet(cardId: string): void {
    setSheetCards(sheetCards.filter((card) => card.id !== cardId));
  }

  async function handleSheetPng(): Promise<void> {
    setExportingPng(true);

    try {
      await downloadSheetPng(sheetCards, size, locale);
    } finally {
      setExportingPng(false);
    }
  }

  function printSheet(): void {
    window.print();
  }

  function cardLabel(card: LabelCard): string {
    return card.contentMode === "mood"
      ? MOOD_TRACKER_TITLE[locale]
      : card.question.text[locale];
  }

  const currentCard = candidates[0];

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <header className="topbar card-surface">
        <div className="topbar-copy">
          <div className="brand-mark" aria-hidden="true">L</div>
          <div className="brand-lockup">
            <p className="eyebrow">{text(locale, UI_COPY.appTitle)}</p>
            <p className="brand-tagline">{text(locale, UI_COPY.appSubtitle)}</p>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="mini-stat">
            {contentMode === "mood"
              ? `${MOOD_TRACKER_ROWS.length} ${locale === "es" ? "pistas" : "tracks"}`
              : QUESTION_BANK.length}
          </span>
          <div className="mode-toggle" role="tablist" aria-label={locale === "es" ? "Modo de etiqueta" : "Label mode"}>
            <button
              className={contentMode === "prompt" ? "active" : ""}
              onClick={() => setContentMode("prompt")}
              type="button"
            >
              {locale === "es" ? "Preguntas" : "Prompts"}
            </button>
            <button
              className={contentMode === "mood" ? "active" : ""}
              onClick={() => setContentMode("mood")}
              type="button"
            >
              Mood tracker
            </button>
          </div>
          <div className="language-toggle" role="tablist" aria-label="Language switcher">
            <button
              className={locale === "es" ? "active" : ""}
              onClick={() => setLocale("es")}
              type="button"
            >
              ES
            </button>
            <button
              className={locale === "en" ? "active" : ""}
              onClick={() => setLocale("en")}
              type="button"
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main className="main-grid">
        <section className="focus-panel card-surface">
          <div className="atelier-layout">
            <div className="candidate-grid">
              {currentCard ? (
                <div className="focus-stage">
                  <div className="focus-caption">
                    <span className="focus-kicker">
                      {contentMode === "mood"
                        ? "Mood tracker"
                        : locale === "es"
                          ? "Etiqueta del momento"
                          : "Current label"}
                    </span>
                    <span className="mini-stat">
                      {text(locale, UI_COPY.selected)} {sheetCards.length}/{capacity}
                    </span>
                  </div>
                  <div className="focus-actions">
                    <button
                      className="button button-secondary"
                      onClick={regenerateBatch}
                      type="button"
                    >
                      {locale === "es" ? "Siguiente" : "Next"}
                    </button>
                    <button
                      className="button button-primary"
                      disabled={
                        sheetCards.length >= capacity ||
                        (currentCard.contentMode === "prompt" &&
                          sheetCards.some((selected) => selected.contentMode === "prompt" && selected.question.id === currentCard.question.id))
                      }
                      onClick={() => addToSheet(currentCard)}
                      type="button"
                    >
                      {currentCard.contentMode === "prompt" &&
                      sheetCards.some((selected) => selected.contentMode === "prompt" && selected.question.id === currentCard.question.id)
                        ? locale === "es"
                          ? "En hoja"
                          : "On sheet"
                        : locale === "es"
                          ? "Guardar en hoja"
                          : "Keep on sheet"}
                    </button>
                  </div>
                  <CandidateCard
                    key={currentCard.id}
                    card={currentCard}
                    size={size}
                    locale={locale}
                    onDownload={(item) => downloadCardSvg(item, size, locale)}
                    downloadLabel={text(locale, UI_COPY.downloadSvg)}
                  />
                </div>
              ) : (
                <p className="empty-sheet">{locale === "es" ? "No quedan mas preguntas en este filtro." : "No prompts left in this filter."}</p>
              )}
            </div>

            <aside className="orbit-panel orbit-panel-right">
              <div className="orbit-card orbit-card-soft">
                <span className="control-label">
                  {locale === "es" ? "Hoja actual" : "Current sheet"}
                </span>
                <span className="mini-stat">
                  {sheetCards.length}/{capacity}
                </span>
              </div>
            </aside>
          </div>
        </section>

        <section className="sheet-panel card-surface">
          <div className="section-header section-header-inline">
            <div>
              <h2>{text(locale, UI_COPY.sheetTitle)}</h2>
              <p>{text(locale, UI_COPY.sheetSubtitle)}</p>
            </div>
            <div className="toolbar">
              <button
                className="button button-secondary"
                onClick={() => setSheetCards([])}
                type="button"
              >
                {text(locale, UI_COPY.clear)}
              </button>
            </div>
          </div>

          <div className="sheet-settings orbit-card">
            <span className="control-label">
              {locale === "es" ? "Formato de la hoja" : "Sheet format"}
            </span>
            <div className="size-grid size-grid-compact">
              {LABEL_SIZES.map((option) => (
                <button
                  key={option.id}
                  className={`size-card size-card-compact ${sizeId === option.id ? "size-card-active" : ""}`}
                  onClick={() => setSizeId(option.id)}
                  type="button"
                >
                  <strong>{option.name[locale]}</strong>
                  <span>{option.description[locale]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sheet-meta">
            <span>
              {text(locale, UI_COPY.selected)} {sheetCards.length}/{capacity}
            </span>
            <span>{size.description[locale]}</span>
          </div>

          <div className="print-area">
            <div className="sheet-frame">
              <SheetSvg
                cards={sheetCards}
                locale={locale}
                size={size}
                showPlaceholders
              />
            </div>
          </div>

          <div className="export-row">
            <button
              className="button button-primary"
              disabled={sheetCards.length === 0}
              onClick={() => downloadSheetSvg(sheetCards, size, locale)}
              type="button"
            >
              {text(locale, UI_COPY.exportSvg)}
            </button>
            <button
              className="button button-primary"
              disabled={sheetCards.length === 0 || exportingPng}
              onClick={handleSheetPng}
              type="button"
            >
              {exportingPng ? (locale === "es" ? "Renderizando..." : "Rendering...") : text(locale, UI_COPY.exportPng)}
            </button>
            <button
              className="button button-secondary"
              disabled={sheetCards.length === 0}
              onClick={printSheet}
              type="button"
            >
              {text(locale, UI_COPY.exportPdf)}
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
      </main>
    </div>
  );
}

export default App;
