import { PALETTES, THEMES } from "../data/design";
import { MOOD_TRACKER_CARD_QUESTION, MOOD_TRACKER_TEMPLATES } from "../data/mood";
import { CardContentMode, CategoryId, LabelCard, LabelSizeId, Question, ThemeId } from "../types";

export const ALL_CATEGORIES = "all";

interface BatchOptions {
  questions: Question[];
  count: number;
  categoryId: CategoryId | typeof ALL_CATEGORIES;
  sizeId: LabelSizeId;
  excludeQuestionIds?: string[];
}

const themeDecks = new Map<string, ThemeId[]>();
const paletteDecks = new Map<string, number[]>();
const moodTemplateDecks = new Map<string, string[]>();
const questionDecks = new Map<string, string[]>();
const recentSelections = new Map<string, string[]>();

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function rememberRecent(key: string, value: string, limit: number): void {
  if (limit <= 0) {
    return;
  }

  const current = recentSelections.get(key) ?? [];
  const next = [value, ...current.filter((item) => item !== value)].slice(0, limit);
  recentSelections.set(key, next);
}

function getRecent(key: string): string[] {
  return recentSelections.get(key) ?? [];
}

function drawFromDeck<T extends string | number>(options: {
  store: Map<string, T[]>;
  deckKey: string;
  source: T[];
  blocked?: Array<T | string>;
  recentKey?: string;
  recentLimit?: number;
}): T | null {
  const { store, deckKey, source, blocked = [], recentKey, recentLimit = 0 } = options;

  if (source.length === 0) {
    return null;
  }

  const allowedKeys = new Set(source.map((item) => String(item)));
  const blockedKeys = new Set(blocked.map((item) => String(item)));
  const pickFromDeck = (deck: T[], avoidRecent: boolean): T | null => {
    const recentKeys = avoidRecent && recentKey ? new Set(getRecent(recentKey)) : null;
    const pickIndex = deck.findIndex((item) => {
      const itemKey = String(item);

      if (!allowedKeys.has(itemKey) || blockedKeys.has(itemKey)) {
        return false;
      }

      if (recentKeys?.has(itemKey)) {
        return false;
      }

      return true;
    });

    if (pickIndex === -1) {
      return null;
    }

    const [picked] = deck.splice(pickIndex, 1);
    return picked ?? null;
  };

  let deck = (store.get(deckKey) ?? []).filter((item) => allowedKeys.has(String(item)));
  let picked = pickFromDeck(deck, true) ?? pickFromDeck(deck, false);

  if (!picked) {
    deck = shuffle(source);
    picked = pickFromDeck(deck, true) ?? pickFromDeck(deck, false);
  }

  if (!picked) {
    return null;
  }

  store.set(deckKey, deck);

  if (recentKey) {
    rememberRecent(recentKey, String(picked), recentLimit);
  }

  return picked;
}

function buildCardId(questionId: string, seed: number, suffix: string): string {
  return `${questionId}-${seed}-${suffix}`;
}

function drawTheme(
  sizeId: LabelSizeId,
  contentMode: CardContentMode,
  blockedThemeIds: ThemeId[] = [],
): ThemeId {
  const scope = `${contentMode}:${sizeId}:theme`;
  return (
    drawFromDeck({
      store: themeDecks,
      deckKey: scope,
      source: THEMES.map((theme) => theme.id),
      blocked: blockedThemeIds,
      recentKey: `${scope}:recent`,
      recentLimit: Math.min(6, Math.max(3, Math.floor(THEMES.length / 4))),
    }) ??
    THEMES[0]?.id ??
    "postage"
  );
}

function drawPaletteIndex(
  sizeId: LabelSizeId,
  contentMode: CardContentMode,
  blockedPaletteIndices: number[] = [],
): number {
  const scope = `${contentMode}:${sizeId}:palette`;
  const indices = PALETTES.map((_, index) => index);

  return (
    drawFromDeck({
      store: paletteDecks,
      deckKey: scope,
      source: indices,
      blocked: blockedPaletteIndices,
      recentKey: `${scope}:recent`,
      recentLimit: Math.min(6, Math.max(3, Math.floor(indices.length / 2))),
    }) ?? 0
  );
}

function drawMoodTemplateId(
  sizeId: LabelSizeId,
  blockedTemplateIds: string[] = [],
): string | undefined {
  const scope = `mood:${sizeId}:template`;

  return (
    drawFromDeck({
      store: moodTemplateDecks,
      deckKey: scope,
      source: MOOD_TRACKER_TEMPLATES.map((template) => template.id),
      blocked: blockedTemplateIds,
      recentKey: `${scope}:recent`,
      recentLimit: Math.min(2, Math.max(1, MOOD_TRACKER_TEMPLATES.length - 1)),
    }) ?? MOOD_TRACKER_TEMPLATES[0]?.id
  );
}

function drawQuestionFromDeck(
  options: Omit<BatchOptions, "count"> & { deckKeyPrefix: string },
): Question | null {
  const { questions, categoryId, excludeQuestionIds = [], deckKeyPrefix } = options;

  const filtered = questions.filter(
    (question) => categoryId === ALL_CATEGORIES || question.category === categoryId,
  );

  if (filtered.length === 0) {
    return null;
  }

  const byId = new Map(filtered.map((question) => [question.id, question]));
  const questionId = drawFromDeck({
    store: questionDecks,
    deckKey: `${deckKeyPrefix}:${categoryId}`,
    source: filtered.map((question) => question.id),
    blocked: excludeQuestionIds,
    recentKey: `${deckKeyPrefix}:${categoryId}:recent`,
    recentLimit: Math.min(14, Math.max(5, Math.floor(filtered.length / 8))),
  });

  return questionId ? (byId.get(questionId) ?? null) : null;
}

function createDecoratedCard(
  question: Question,
  sizeId: LabelSizeId,
  suffix: string,
  contentMode: CardContentMode = "prompt",
  appearance?: {
    themeId?: ThemeId;
    paletteIndex?: number;
    moodTemplateId?: string;
  },
): LabelCard {
  const seed = Math.floor(Math.random() * 100_000_000);
  const themeId = appearance?.themeId ?? drawTheme(sizeId, contentMode);
  const paletteIndex = appearance?.paletteIndex ?? drawPaletteIndex(sizeId, contentMode);

  return {
    id: buildCardId(question.id, seed, suffix),
    contentMode,
    question,
    moodTemplateId: appearance?.moodTemplateId,
    themeId,
    paletteIndex,
    serial: 100 + Math.floor(Math.random() * 900),
    seed,
  };
}

export function createPromptCard(options: Omit<BatchOptions, "count">): LabelCard | null {
  const question = drawQuestionFromDeck({ ...options, deckKeyPrefix: "prompt" });
  return question ? createDecoratedCard(question, options.sizeId, "single", "prompt") : null;
}

export function createChallengeCard(options: Omit<BatchOptions, "count">): LabelCard | null {
  const question = drawQuestionFromDeck({ ...options, deckKeyPrefix: "challenge" });
  return question ? createDecoratedCard(question, options.sizeId, "challenge", "challenge") : null;
}

export function rerollCardLook(card: LabelCard, sizeId: LabelSizeId): LabelCard {
  const themeId = drawTheme(sizeId, card.contentMode, [card.themeId]);
  const paletteIndex = drawPaletteIndex(sizeId, card.contentMode, [card.paletteIndex]);
  const seed = Math.floor(Math.random() * 100_000_000);

  return {
    ...card,
    id: buildCardId(card.question.id, seed, "look"),
    themeId,
    paletteIndex,
    serial: 100 + Math.floor(Math.random() * 900),
    seed,
  };
}

export function createBatch(options: BatchOptions): LabelCard[] {
  const { count, excludeQuestionIds = [] } = options;
  const usedIds = new Set(excludeQuestionIds);
  const cards: LabelCard[] = [];

  for (let index = 0; index < count; index += 1) {
    const question = drawQuestionFromDeck({
      ...options,
      excludeQuestionIds: [...usedIds],
      deckKeyPrefix: "prompt",
    });

    if (!question) {
      break;
    }

    usedIds.add(question.id);
    cards.push(createDecoratedCard(question, options.sizeId, String(index), "prompt"));
  }

  return cards;
}

export function createMoodBatch(options: { count: number; sizeId: LabelSizeId }): LabelCard[] {
  const { count, sizeId } = options;
  const usedTemplateIds = new Set<string>();

  return Array.from({ length: count }).map((_, index) => {
    const moodTemplateId = drawMoodTemplateId(sizeId, [...usedTemplateIds]);
    const seed = Math.floor(Math.random() * 100_000_000);

    if (moodTemplateId) {
      usedTemplateIds.add(moodTemplateId);
    }

    return {
      id: `mood-tracker-${seed}-${index}`,
      contentMode: "mood",
      question: MOOD_TRACKER_CARD_QUESTION,
      moodTemplateId,
      themeId: drawTheme(sizeId, "mood"),
      paletteIndex: drawPaletteIndex(sizeId, "mood"),
      serial: 100 + Math.floor(Math.random() * 900),
      seed,
    };
  });
}
