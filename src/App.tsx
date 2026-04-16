import { startTransition, useEffect, useRef, useState } from "react";
import { Topbar } from "./components/Topbar";
import { Footer } from "./components/Footer";
import { CandidateStage } from "./components/CandidateStage";
import { SheetPanel } from "./components/SheetPanel";
import { CookieBanner } from "./components/CookieBanner";

import { CREATIVE_CHALLENGE_BANK } from "./data/challenges";
import { LABEL_SIZES } from "./data/design";
import { MOOD_TRACKER_TEMPLATES } from "./data/mood";
import { QUESTION_BANK } from "./data/questions";
import { downloadSheetPng } from "./lib/export";
import {
  ALL_CATEGORIES,
  createChallengeCard,
  createMoodBatch,
  createPromptCard,
  rerollCardLook,
} from "./lib/generator";
import { CardContentMode, LabelCard, LabelSizeId, LabelTypefaceId, Locale } from "./types";

const BATCH_SIZE = 1;
const UI_THEME_STORAGE_KEY = "labbelia-ui-theme-v2";
const COOKIE_CONSENT_STORAGE_KEY = "labbelia-cookie-consent-v1";
const LABEL_TYPEFACE_STORAGE_KEY = "labbelia-label-typeface-v1";





function App() {
  type SheetBucket = "strip" | "mood";
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
  const [labelTypeface, setLabelTypeface] = useState<LabelTypefaceId>(() => {
    if (typeof window === "undefined") {
      return "gochi";
    }

    const stored = window.localStorage.getItem(LABEL_TYPEFACE_STORAGE_KEY);
    return stored === "indie" || stored === "walter" || stored === "gochi" ? stored : "gochi";
  });
  const [candidates, setCandidates] = useState<LabelCard[]>([]);
  const [sheetCardsByMode, setSheetCardsByMode] = useState<Record<SheetBucket, LabelCard[]>>({
    strip: [],
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
  const [sheetFullToast, setSheetFullToast] = useState<string | null>(null);
  const [cookieBannerOpen, setCookieBannerOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return stored === "unknown";
  });
  const seenQuestionIdsRef = useRef<Record<"prompt" | "challenge", string[]>>({
    prompt: [],
    challenge: [],
  });
  const previousSheetCountsRef = useRef<Record<SheetBucket, number>>({
    strip: 0,
    mood: 0,
  });

  const promptSize = LABEL_SIZES.find((option) => option.id === "mini") ?? LABEL_SIZES[0];
  const moodSize = LABEL_SIZES.find((option) => option.id === "square") ?? LABEL_SIZES[0];
  const size = contentMode === "mood" ? moodSize : promptSize;
  const sizeId: LabelSizeId = size.id;
  const sheetBucket: SheetBucket = contentMode === "mood" ? "mood" : "strip";
  const sheetCards = sheetCardsByMode[sheetBucket];
  const capacity = size.columns * size.rows;

  useEffect(() => {
    window.localStorage.setItem("paper-hearts-locale", locale);
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(UI_THEME_STORAGE_KEY, uiTheme);
    window.localStorage.setItem("labbelia-ui-theme", uiTheme);
  }, [uiTheme]);

  useEffect(() => {
    window.localStorage.setItem(LABEL_TYPEFACE_STORAGE_KEY, labelTypeface);
  }, [labelTypeface]);



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

  useEffect(() => {
    const previousCount = previousSheetCountsRef.current[sheetBucket];

    if (sheetCards.length >= capacity && previousCount < capacity) {
      setSheetFullToast(
        sheetBucket === "mood"
          ? locale === "en"
            ? "♡ Full sheet. Your trackers are ready."
            : "♡ Hoja completa. Tus trackers ya están listos."
          : contentMode === "challenge"
            ? locale === "en"
              ? "♡ Full sheet. Your creative strips are ready."
              : "♡ Hoja completa. Tus tiritas creativas ya están listas."
            : locale === "en"
              ? "♡ Full sheet. Your strips are ready."
              : "♡ Hoja completa. Tus tiritas ya están listas.",
      );
    }

    previousSheetCountsRef.current = {
      ...previousSheetCountsRef.current,
      [sheetBucket]: sheetCards.length,
    };
  }, [capacity, contentMode, locale, sheetBucket, sheetCards.length]);

  useEffect(() => {
    if (!sheetFullToast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSheetFullToast(null);
    }, 2800);

    return () => window.clearTimeout(timeout);
  }, [sheetFullToast]);

  function idsOnSheet(mode: "prompt" | "challenge"): string[] {
    return sheetCardsByMode.strip
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

  function nextTextCard(
    mode: "prompt" | "challenge",
    extraExcludedIds: string[] = [],
  ): LabelCard | null {
    const fullSource = mode === "challenge" ? CREATIVE_CHALLENGE_BANK : QUESTION_BANK;
    const source = locale === "ja" ? fullSource.filter((q) => q.text.ja) : fullSource;
    const create = mode === "challenge" ? createChallengeCard : createPromptCard;
    const sheetIds = idsOnSheet(mode);
    const strictExcluded = [
      ...new Set([...sheetIds, ...seenQuestionIdsRef.current[mode], ...extraExcludedIds]),
    ];
    const next =
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentMode, sizeId]);

  useEffect(() => {
    if (locale === "ja") {
      refillCandidate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

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
        (item) => item.contentMode === card.contentMode && item.question.id === card.question.id,
      )
    ) {
      return;
    }

    setSheetCardsByMode((current) => ({
      ...current,
      [sheetBucket]: [...current[sheetBucket], card],
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
      [sheetBucket]: current[sheetBucket].filter((card) => card.id !== cardId),
    }));
  }

  async function handleSheetPng(): Promise<void> {
    setExportingPng(true);

    try {
      await downloadSheetPng(sheetCards, size, locale, labelTypeface);
    } finally {
      setExportingPng(false);
    }
  }

  function printSheet(): void {
    window.print();
  }




  const currentCard = candidates[0];

  return (
    <div className="app-shell" data-ui-theme={uiTheme}>
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <Topbar
        locale={locale}
        setLocale={setLocale}
        uiTheme={uiTheme}
        setUiTheme={setUiTheme}
        contentMode={contentMode}
        setContentMode={setContentMode}
        compactTopbar={compactTopbar}
        brandMenuOpen={brandMenuOpen}
        setBrandMenuOpen={setBrandMenuOpen}
        optionsMenuOpen={optionsMenuOpen}
        setOptionsMenuOpen={setOptionsMenuOpen}
      />

      <main className="main-grid">
        <section className="focus-panel card-surface">
          <div className="atelier-layout">
            <CandidateStage
              currentCard={currentCard}
              contentMode={contentMode}
              locale={locale}
              size={size}
              sheetCards={sheetCards}
              capacity={capacity}
              labelTypeface={labelTypeface}
              setLabelTypeface={setLabelTypeface}
              undoCardByMode={undoCardByMode}
              undoLastChange={undoLastChange}
              regenerateBatch={regenerateBatch}
              addToSheet={addToSheet}
              sheetFullToast={sheetFullToast}
              rerollCurrentLook={rerollCurrentLook}
              rerollCurrentMoodTemplate={rerollCurrentMoodTemplate}
              rerollCurrentQuestion={rerollCurrentQuestion}
            />
          </div>
        </section>

        <SheetPanel
          contentMode={contentMode}
          locale={locale}
          sheetCards={sheetCards}
          size={size}
          capacity={capacity}
          labelTypeface={labelTypeface}
          exportingPng={exportingPng}
          clearSheet={() =>
            setSheetCardsByMode((current) => ({
              ...current,
              [sheetBucket]: [],
            }))
          }
          removeFromSheet={removeFromSheet}
          handleSheetPng={handleSheetPng}
          printSheet={printSheet}
        />
      </main>

      <Footer locale={locale} openCookiePreferences={() => { setCookieBannerOpen(true); }} />
      <CookieBanner locale={locale} forceOpen={cookieBannerOpen} onClose={() => setCookieBannerOpen(false)} />
    </div>
  );
}

export default App;
