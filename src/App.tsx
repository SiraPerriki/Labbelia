import { startTransition, useEffect, useRef, useState } from "react";
import { CandidateCard } from "./components/CandidateCard";
import { SheetSvg } from "./components/SheetSvg";
import { CREATIVE_CHALLENGE_BANK } from "./data/challenges";
import { UI_COPY } from "./data/content";
import { LABEL_SIZES } from "./data/design";
import { getMoodTrackerTitle, MOOD_TRACKER_TEMPLATES, MOOD_TRACKER_TITLE } from "./data/mood";
import { QUESTION_BANK } from "./data/questions";
import { setAnalyticsConsent } from "./lib/analytics";
import { downloadCardSvg, downloadSheetPng, downloadSheetSvg } from "./lib/export";
import { ALL_CATEGORIES, createChallengeCard, createMoodBatch, createPromptCard, rerollCardLook } from "./lib/generator";
import { localize } from "./lib/i18n";
import { CardContentMode, LabelCard, LabelSizeId, Locale } from "./types";

const BATCH_SIZE = 1;
const UI_THEME_STORAGE_KEY = "labbelia-ui-theme-v2";
const COOKIE_CONSENT_STORAGE_KEY = "labbelia-cookie-consent-v1";

type CookieConsent = "unknown" | "accepted" | "rejected";

function text(locale: Locale, value: { es: string; en: string }): string {
  return localize(locale, value);
}

function getStoredCookieConsent(): CookieConsent {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  return stored === "accepted" || stored === "rejected" ? stored : "unknown";
}

function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = window.localStorage.getItem("paper-hearts-locale");
    return stored === "en" ? "en" : "es";
  });
  const [uiTheme, setUiTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const stored = window.localStorage.getItem(UI_THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    // Migrate old sessions to dark once, then keep respecting future user choices.
    window.localStorage.setItem(UI_THEME_STORAGE_KEY, "dark");
    window.localStorage.setItem("labbelia-ui-theme", "dark");
    return "dark";
  });
  const [contentMode, setContentMode] = useState<CardContentMode>("prompt");
  const [candidates, setCandidates] = useState<LabelCard[]>([]);
  const [sheetCardsByMode, setSheetCardsByMode] = useState<Record<CardContentMode, LabelCard[]>>({
    prompt: [],
    challenge: [],
    mood: [],
  });
  const [exportingPng, setExportingPng] = useState(false);
  const [compactTopbar, setCompactTopbar] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 1120 : false,
  );
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [undoCardByMode, setUndoCardByMode] = useState<Record<CardContentMode, LabelCard | null>>({
    prompt: null,
    challenge: null,
    mood: null,
  });
  const [cookieConsent, setCookieConsent] = useState<CookieConsent>(() => getStoredCookieConsent());
  const [cookieBannerOpen, setCookieBannerOpen] = useState(() => getStoredCookieConsent() === "unknown");
  const [cookiePreferencesOpen, setCookiePreferencesOpen] = useState(false);
  const [analyticsCookiesEnabled, setAnalyticsCookiesEnabled] = useState(
    () => getStoredCookieConsent() === "accepted",
  );
  const seenQuestionIdsRef = useRef<Record<"prompt" | "challenge", string[]>>({
    prompt: [],
    challenge: [],
  });

  const promptSize = LABEL_SIZES.find((option) => option.id === "mini") ?? LABEL_SIZES[0];
  const moodSize = LABEL_SIZES.find((option) => option.id === "square") ?? LABEL_SIZES[0];
  const size = contentMode === "mood" ? moodSize : promptSize;
  const sizeId: LabelSizeId = size.id;
  const sheetCards = sheetCardsByMode[contentMode];
  const capacity = size.columns * size.rows;

  useEffect(() => {
    window.localStorage.setItem("paper-hearts-locale", locale);
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(UI_THEME_STORAGE_KEY, uiTheme);
    window.localStorage.setItem("labbelia-ui-theme", uiTheme);
  }, [uiTheme]);

  useEffect(() => {
    if (cookieConsent === "unknown") {
      return;
    }

    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, cookieConsent);
    setAnalyticsConsent(cookieConsent === "accepted");
  }, [cookieConsent]);

  useEffect(() => {
    function syncTopbarMode() {
      const nextCompact = window.innerWidth <= 1120;
      setCompactTopbar(nextCompact);

      if (!nextCompact) {
        setBrandMenuOpen(false);
        setOptionsMenuOpen(false);
      }
    }

    syncTopbarMode();
    window.addEventListener("resize", syncTopbarMode);
    return () => window.removeEventListener("resize", syncTopbarMode);
  }, []);

  function idsOnSheet(mode: "prompt" | "challenge"): string[] {
    return sheetCardsByMode[mode]
      .filter((card) => card.contentMode === mode)
      .map((card) => card.question.id);
  }

  function markQuestionSeen(mode: "prompt" | "challenge", questionId: string): void {
    if (!seenQuestionIdsRef.current[mode].includes(questionId)) {
      seenQuestionIdsRef.current = {
        ...seenQuestionIdsRef.current,
        [mode]: [...seenQuestionIdsRef.current[mode], questionId],
      };
    }
  }

  function nextTextCard(mode: "prompt" | "challenge", extraExcludedIds: string[] = []): LabelCard | null {
    const source = mode === "challenge" ? CREATIVE_CHALLENGE_BANK : QUESTION_BANK;
    const create = mode === "challenge" ? createChallengeCard : createPromptCard;
    const sheetIds = idsOnSheet(mode);
    const strictExcluded = [...new Set([...sheetIds, ...seenQuestionIdsRef.current[mode], ...extraExcludedIds])];
    let next =
      create({
        questions: source,
        categoryId: ALL_CATEGORIES,
        sizeId,
        excludeQuestionIds: strictExcluded,
      }) ??
      create({
        questions: source,
        categoryId: ALL_CATEGORIES,
        sizeId,
        excludeQuestionIds: [...new Set([...sheetIds, ...extraExcludedIds])],
      }) ??
      create({
        questions: source,
        categoryId: ALL_CATEGORIES,
        sizeId,
        excludeQuestionIds: sheetIds,
      });

    if (next) {
      markQuestionSeen(mode, next.question.id);
    }

    return next;
  }

  function refillCandidate(): void {
    startTransition(() => {
      const next =
        contentMode === "mood"
          ? createMoodBatch({
              count: BATCH_SIZE,
              sizeId,
            })
          : (() => {
              const card = nextTextCard(contentMode);
              return card ? [card] : [];
            })();
      setCandidates(next);
    });
  }

  useEffect(() => {
    refillCandidate();
  }, [contentMode, sizeId]);

  function regenerateBatch(): void {
    const current = candidates[0];

    startTransition(() => {
      const next =
        contentMode === "mood"
          ? createMoodBatch({
              count: BATCH_SIZE,
              sizeId,
            })
          : (() => {
              const card = nextTextCard(contentMode, current ? [current.question.id] : []);
              return card ? [card] : [];
            })();

      if (current && next[0]) {
        setUndoCardByMode((value) => ({ ...value, [contentMode]: current }));
      }

      setCandidates(next);
    });
  }

  function rerollCurrentLook(): void {
    const current = candidates[0];

    if (!current) {
      return;
    }

    startTransition(() => {
      setUndoCardByMode((value) => ({ ...value, [contentMode]: current }));
      setCandidates([rerollCardLook(current, sizeId)]);
    });
  }

  function rerollCurrentQuestion(): void {
    const current = candidates[0];

    if (!current || current.contentMode !== "prompt") {
      if (!current || current.contentMode !== "challenge") {
        return;
      }
    }

    const next = nextTextCard(current.contentMode, [current.question.id]);

    if (!next) {
      return;
    }

    startTransition(() => {
      setUndoCardByMode((value) => ({ ...value, [contentMode]: current }));
      setCandidates([
        {
          ...current,
          id: next.id,
          question: next.question,
        },
      ]);
    });
  }

  function rerollCurrentMoodTemplate(): void {
    const current = candidates[0];

    if (!current || current.contentMode !== "mood") {
      return;
    }

    const availableTemplates = MOOD_TRACKER_TEMPLATES.filter(
      (template) => template.id !== current.moodTemplateId,
    );
    const nextTemplate =
      availableTemplates[Math.floor(Math.random() * availableTemplates.length)] ??
      MOOD_TRACKER_TEMPLATES[0];

    if (!nextTemplate) {
      return;
    }

    startTransition(() => {
      setUndoCardByMode((value) => ({ ...value, [contentMode]: current }));
      setCandidates([
        {
          ...current,
          id: `mood-template-${nextTemplate.id}-${Math.floor(Math.random() * 100_000_000)}`,
          moodTemplateId: nextTemplate.id,
        },
      ]);
    });
  }

  function undoLastChange(): void {
    const previous = undoCardByMode[contentMode];

    if (!previous || !currentCard) {
      return;
    }

    startTransition(() => {
      setUndoCardByMode((value) => ({ ...value, [contentMode]: currentCard }));
      setCandidates([previous]);
    });
  }

  function addToSheet(card: LabelCard): void {
    if (sheetCards.length >= capacity) {
      return;
    }

    if (
      (card.contentMode === "prompt" || card.contentMode === "challenge") &&
      sheetCards.some(
        (item) =>
          item.contentMode === card.contentMode &&
          item.question.id === card.question.id,
      )
    ) {
      return;
    }

    setSheetCardsByMode((current) => ({
      ...current,
      [contentMode]: [...current[contentMode], card],
    }));

    if (sheetCards.length + 1 < capacity) {
      startTransition(() => {
        const next =
          contentMode === "mood"
            ? createMoodBatch({
                count: BATCH_SIZE,
                sizeId,
              })
            : (() => {
                const cardMode = contentMode === "challenge" ? "challenge" : "prompt";
                const nextCard = nextTextCard(cardMode, [card.question.id]);
                return nextCard ? [nextCard] : [];
              })();

        setCandidates(next);
      });
    }
  }

  function removeFromSheet(cardId: string): void {
    setSheetCardsByMode((current) => ({
      ...current,
      [contentMode]: current[contentMode].filter((card) => card.id !== cardId),
    }));
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
      ? localize(locale, getMoodTrackerTitle(card.moodTemplateId))
      : localize(locale, card.question.text);
  }

  function acceptAnalyticsCookies(): void {
    setAnalyticsCookiesEnabled(true);
    setCookieConsent("accepted");
    setCookiePreferencesOpen(false);
    setCookieBannerOpen(false);
  }

  function rejectOptionalCookies(): void {
    setAnalyticsCookiesEnabled(false);
    setCookieConsent("rejected");
    setCookiePreferencesOpen(false);
    setCookieBannerOpen(false);
  }

  function saveCookiePreferences(): void {
    setCookieConsent(analyticsCookiesEnabled ? "accepted" : "rejected");
    setCookiePreferencesOpen(false);
    setCookieBannerOpen(false);
  }

  function openCookiePreferences(): void {
    setCookieBannerOpen(true);
    setCookiePreferencesOpen(false);
  }

  function closeCookieBanner(): void {
    setCookiePreferencesOpen(false);
    setCookieBannerOpen(false);
  }

  const currentCard = candidates[0];
  const brandBlock = (
    <div className="topbar-copy">
      <div className="brand-mark" aria-hidden="true">
        <span className="brand-mark-glyph brand-mark-glyph-heart">♥</span>
        <span className="brand-mark-glyph brand-mark-glyph-letter">L</span>
      </div>
      <div className="brand-lockup">
        <div className="brand-title-row">
          <p className="eyebrow">{text(locale, UI_COPY.appTitle)}</p>
        </div>
        <p className="brand-tagline">{text(locale, UI_COPY.appSubtitle)}</p>
      </div>
    </div>
  );
  const controlsBlock = (
    <div className="topbar-actions">
      <div className="mode-toggle" role="tablist" aria-label={locale === "en" ? "Label mode" : "Modo de etiqueta"}>
        <button
          className={contentMode === "prompt" ? "active" : ""}
          onClick={() => setContentMode("prompt")}
          type="button"
        >
          {locale === "en" ? "♡ Strips" : "♡ Tiritas"}
        </button>
        <button
          className={contentMode === "challenge" ? "active" : ""}
          onClick={() => setContentMode("challenge")}
          type="button"
        >
          {locale === "en" ? "✦ Creative challenges" : "✦ Retos creativos"}
        </button>
        <button
          className={contentMode === "mood" ? "active" : ""}
          onClick={() => setContentMode("mood")}
          type="button"
        >
          {`☆ ${localize(locale, MOOD_TRACKER_TITLE)}`}
        </button>
      </div>
      <span className="topbar-separator" aria-hidden="true" />
      <div
        className="theme-toggle"
        role="tablist"
        aria-label={locale === "en" ? "Interface theme" : "Tema de interfaz"}
      >
        <button
          className={uiTheme === "light" ? "active" : ""}
          onClick={() => setUiTheme("light")}
          type="button"
        >
          {locale === "en" ? "☀ Light" : "☀ Claro"}
        </button>
        <button
          className={uiTheme === "dark" ? "active" : ""}
          onClick={() => setUiTheme("dark")}
          type="button"
        >
          {locale === "en" ? "☾ Dark" : "☾ Oscuro"}
        </button>
      </div>
      <span className="topbar-separator" aria-hidden="true" />
      <div className="language-toggle language-toggle-compact" role="tablist" aria-label={locale === "en" ? "Language switcher" : "Selector de idioma"}>
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
  );

  return (
    <div className="app-shell" data-ui-theme={uiTheme}>
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <header className={`topbar card-surface ${compactTopbar ? "topbar-compact" : ""}`}>
        {compactTopbar ? (
          <>
            <div className="topbar-compact-row">
              <button
                className={`topbar-compact-trigger ${brandMenuOpen ? "active" : ""}`}
                onClick={() => setBrandMenuOpen((open) => !open)}
                type="button"
              >
                Labbelia
              </button>
              <button
                className={`topbar-compact-trigger ${optionsMenuOpen ? "active" : ""}`}
                onClick={() => setOptionsMenuOpen((open) => !open)}
                type="button"
              >
                {locale === "en" ? "Options" : "Opciones"}
              </button>
            </div>
            {brandMenuOpen ? (
              <div className="topbar-compact-panel">
                {brandBlock}
              </div>
            ) : null}
            {optionsMenuOpen ? (
              <div className="topbar-compact-panel">
                {controlsBlock}
              </div>
            ) : null}
          </>
        ) : (
          <>
            {brandBlock}
            {controlsBlock}
          </>
        )}
      </header>

      <main className="main-grid">
        <section className="focus-panel card-surface">
          <div className="atelier-layout">
            <div className="candidate-grid">
              {currentCard ? (
                <div className="focus-stage">
                  <div className="focus-caption">
                    <div className="focus-heading">
                      <span className="focus-kicker">
                        {contentMode === "mood"
                          ? locale === "en"
                            ? "Tracker"
                            : "Tracker"
                          : contentMode === "challenge"
                            ? locale === "en"
                              ? "Creative strip"
                              : "Tirita creativa"
                          : locale === "en"
                            ? "Strip"
                            : "Tirita"}
                      </span>
                    </div>
                    <div className="focus-status-strip">
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
                      {locale === "en" ? "↶ Undo" : "↶ Deshacer"}
                    </button>
                    <button
                      className="button button-secondary"
                      onClick={regenerateBatch}
                      type="button"
                    >
                      {contentMode === "mood"
                        ? locale === "en"
                          ? "↻ Another tracker"
                          : "↻ Otro tracker"
                        : contentMode === "challenge"
                          ? locale === "en"
                            ? "↻ Another challenge"
                            : "↻ Otro reto"
                          : locale === "en"
                            ? "↻ Next"
                            : "↻ Siguiente"}
                    </button>
                    <button
                      className="button button-primary"
                      disabled={
                        sheetCards.length >= capacity ||
                        ((currentCard.contentMode === "prompt" || currentCard.contentMode === "challenge") &&
                          sheetCards.some((selected) => selected.contentMode === currentCard.contentMode && selected.question.id === currentCard.question.id))
                      }
                      onClick={() => addToSheet(currentCard)}
                      type="button"
                    >
                      {(currentCard.contentMode === "prompt" || currentCard.contentMode === "challenge") &&
                      sheetCards.some((selected) => selected.contentMode === currentCard.contentMode && selected.question.id === currentCard.question.id)
                        ? locale === "en"
                          ? "On sheet"
                          : "En hoja"
                        : locale === "en"
                          ? contentMode === "challenge"
                            ? "＋ Keep challenge"
                            : "＋ Keep on sheet"
                          : contentMode === "challenge"
                            ? "＋ Guardar reto"
                            : "＋ Guardar en hoja"}
                    </button>
                  </div>
                  <CandidateCard
                    key={currentCard.id}
                    card={currentCard}
                    size={size}
                    locale={locale}
                    onDownload={(item) => downloadCardSvg(item, size, locale)}
                    onRefreshLook={rerollCurrentLook}
                    onRefreshQuestion={currentCard.contentMode === "mood" ? rerollCurrentMoodTemplate : rerollCurrentQuestion}
                    downloadLabel={locale === "en" ? "↓ Single SVG" : "↓ SVG individual"}
                    refreshLookLabel={locale === "en" ? "◌ Background" : "◌ Fondo"}
                    refreshQuestionLabel={
                      currentCard.contentMode === "mood"
                        ? locale === "en"
                          ? "☆ Tracker"
                          : "☆ Tracker"
                        : currentCard.contentMode === "prompt"
                        ? locale === "en"
                          ? "✎ Phrase"
                          : "✎ Frase"
                        : currentCard.contentMode === "challenge"
                          ? locale === "en"
                            ? "✎ Challenge"
                            : "✎ Reto"
                          : undefined
                    }
                  />
                </div>
              ) : (
                <p className="empty-sheet">
                  {contentMode === "challenge"
                    ? locale === "en"
                      ? "No creative challenges left right now."
                      : "No quedan retos creativos ahora mismo."
                    : locale === "en"
                      ? "No prompts left in this filter."
                      : "No quedan más preguntas en este filtro."}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="sheet-panel card-surface">
          <div className="section-header section-header-inline">
            <div>
              <h2>{text(locale, UI_COPY.sheetTitle)}</h2>
              <p>
                {contentMode === "mood"
                  ? locale === "en"
                    ? "Build a compact mood sheet ready to print."
                    : "Compón una hoja de seguimiento."
                  : contentMode === "challenge"
                    ? locale === "en"
                      ? "Fill the page with creative challenges."
                      : "Llena la página con retos creativos."
                    : text(locale, UI_COPY.sheetSubtitle)}
              </p>
            </div>
            <div className="toolbar">
              <button
                className="button button-secondary"
                onClick={() =>
                  setSheetCardsByMode((current) => ({
                    ...current,
                    [contentMode]: [],
                  }))
                }
                type="button"
              >
                {locale === "en" ? "⌫ Clear sheet" : "⌫ Vaciar hoja"}
              </button>
            </div>
          </div>

          <div className="sheet-settings orbit-card">
            <div className="sheet-format-summary">
              <strong>
                {contentMode === "mood"
                  ? locale === "en"
                    ? "Compact square mood tracker"
                    : "Mood tracker cuadrado compacto"
                  : contentMode === "challenge"
                    ? locale === "en"
                      ? "Mini creative challenge strips"
                      : "Tiritas mini de retos creativos"
                  : locale === "en"
                    ? "Mini journaling strips"
                    : "Tiritas mini para journaling"}
              </strong>
            </div>
          </div>

          <div className="sheet-meta">
            <span>
              {text(locale, UI_COPY.selected)} {sheetCards.length}/{capacity}
            </span>
            <span>{localize(locale, size.description)}</span>
          </div>

          <div className="print-area">
            <div className={`sheet-frame sheet-frame-${size.id}`}>
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
              {locale === "en" ? "↓ Download A4 SVG" : "↓ Descargar A4 SVG"}
            </button>
            <button
              className="button button-primary"
              disabled={sheetCards.length === 0 || exportingPng}
              onClick={handleSheetPng}
              type="button"
            >
              {exportingPng
                ? locale === "en"
                  ? "… Rendering"
                  : "… Renderizando"
                : locale === "en"
                  ? "↓ Download A4 PNG"
                  : "↓ Descargar A4 PNG"}
            </button>
            <button
              className="button button-secondary"
              disabled={sheetCards.length === 0}
              onClick={printSheet}
              type="button"
            >
              {locale === "en" ? "⎙ Print / PDF" : "⎙ Imprimir / PDF"}
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

      <footer className="site-footer card-surface">
        <div className="site-footer-copy">
          <p className="site-footer-title">Labbelia</p>
          <p className="site-footer-note">
            Pequeñas tiritas desarrolladas con cariño por <strong>Sira Perriki</strong>.
          </p>
        </div>
        <nav className="site-footer-links" aria-label="Enlaces de Labbelia">
          <a href="https://x.com/SiraPerriki" target="_blank" rel="noreferrer">
            <span className="site-footer-link-symbol site-footer-link-symbol-x">✦</span>
            <span>X · @SiraPerriki</span>
          </a>
          <a href="https://github.com/SiraPerriki" target="_blank" rel="noreferrer">
            <span className="site-footer-link-symbol site-footer-link-symbol-github">⌘</span>
            <span>GitHub · @SiraPerriki</span>
          </a>
          <a href="mailto:Sira.Perriki@proton.me">
            <span className="site-footer-link-symbol site-footer-link-symbol-mail">✉</span>
            <span>Correo · Sira.Perriki@proton.me</span>
          </a>
          <button
            className="site-footer-link-button"
            onClick={openCookiePreferences}
            type="button"
          >
            <span className="site-footer-link-symbol site-footer-link-symbol-settings">⚙</span>
            <span>{locale === "en" ? "Cookies" : "Cookies"}</span>
          </button>
        </nav>
      </footer>

      {cookieConsent === "unknown" || cookieBannerOpen ? (
        <aside className="cookie-banner card-surface" aria-live="polite">
          <div className="cookie-banner-copy">
            <div className="cookie-banner-header">
              <p className="cookie-banner-title">
                {locale === "en" ? "Cookies and analytics" : "Cookies y analítica"}
              </p>
              {cookieConsent !== "unknown" ? (
                <button className="cookie-banner-close" onClick={closeCookieBanner} type="button">
                  {locale === "en" ? "Close" : "Cerrar"}
                </button>
              ) : null}
            </div>
            <p className="cookie-banner-text">
              {locale === "en"
                ? "Labbelia uses only essential storage and optional analytics. If you accept analytics, Google Analytics will collect aggregated data about visits, viewed pages, device, language and basic navigation actions."
                : "Labbelia usa solo almacenamiento esencial y analítica opcional. Si aceptas la analítica, Google Analytics recogerá datos agregados sobre visitas, páginas vistas, dispositivo, idioma y acciones básicas de navegación."}
            </p>
            <p className="cookie-banner-status">
              {cookieConsent === "unknown"
                ? locale === "en"
                  ? "Analytics stays blocked until you choose."
                  : "La analítica permanece bloqueada hasta que elijas."
                : analyticsCookiesEnabled
                  ? locale === "en"
                    ? "Current setting: analytics accepted."
                    : "Estado actual: analítica aceptada."
                  : locale === "en"
                    ? "Current setting: only essential storage."
                    : "Estado actual: solo almacenamiento esencial."}
            </p>
          </div>

          <div className="cookie-banner-actions">
            <button className="button button-secondary cookie-choice-reject" onClick={rejectOptionalCookies} type="button">
              {locale === "en" ? "Reject analytics" : "Rechazar analítica"}
            </button>
            <button
              className="button button-ghost cookie-choice-configure"
              onClick={() => setCookiePreferencesOpen((open) => !open)}
              type="button"
            >
              {cookiePreferencesOpen
                ? locale === "en"
                  ? "Hide options"
                  : "Ocultar opciones"
                : locale === "en"
                  ? "Customize"
                  : "Personalizar"}
            </button>
            <button className="button button-secondary cookie-choice-accept" onClick={acceptAnalyticsCookies} type="button">
              {locale === "en" ? "Accept analytics" : "Aceptar analítica"}
            </button>
          </div>

          {cookiePreferencesOpen ? (
            <div className="cookie-preferences">
              <label className="cookie-toggle">
                <div>
                  <span className="cookie-toggle-title">
                    {locale === "en" ? "Analytics cookies" : "Cookies analíticas"}
                  </span>
                  <span className="cookie-toggle-note">
                    {locale === "en"
                      ? "They help us understand which views and actions are useful."
                      : "Nos ayudan a entender qué vistas y acciones resultan útiles."}
                  </span>
                </div>
                <input
                  checked={analyticsCookiesEnabled}
                  onChange={(event) => setAnalyticsCookiesEnabled(event.target.checked)}
                  type="checkbox"
                />
              </label>

              <div className="cookie-preferences-actions">
                <button className="button button-ghost" onClick={closeCookieBanner} type="button">
                  {locale === "en" ? "Close" : "Cerrar"}
                </button>
                <button className="button button-primary" onClick={saveCookiePreferences} type="button">
                  {locale === "en" ? "Save selection" : "Guardar selección"}
                </button>
              </div>
            </div>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}

export default App;
