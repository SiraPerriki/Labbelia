import { PALETTES, THEMES } from "../data/design";
import { MOOD_TRACKER_CARD_QUESTION, MOOD_TRACKER_TEMPLATES } from "../data/mood";
import { Question, LabelCard, CategoryId, LabelSizeId, ThemeId, CardContentMode } from "../types";

export const ALL_CATEGORIES = "all";

interface BatchOptions {
  questions: Question[];
  count: number;
  categoryId: CategoryId | typeof ALL_CATEGORIES;
  sizeId: LabelSizeId;
  excludeQuestionIds?: string[];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function randomTheme(sizeId: LabelSizeId): ThemeId {
  void sizeId;
  return THEMES[Math.floor(Math.random() * THEMES.length)].id;
}

function buildCardId(questionId: string, seed: number, suffix: string): string {
  return `${questionId}-${seed}-${suffix}`;
}

function createDecoratedCard(
  question: Question,
  sizeId: LabelSizeId,
  suffix: string,
  contentMode: CardContentMode = "prompt",
): LabelCard {
  const seed = Math.floor(Math.random() * 100_000_000);

  return {
    id: buildCardId(question.id, seed, suffix),
    contentMode,
    question,
    themeId: randomTheme(sizeId),
    paletteIndex: Math.floor(Math.random() * PALETTES.length),
    serial: 100 + Math.floor(Math.random() * 900),
    seed,
  };
}

export function createPromptCard(options: Omit<BatchOptions, "count">): LabelCard | null {
  const { questions, categoryId, excludeQuestionIds = [], sizeId } = options;

  const filtered = questions.filter((question) => {
    if (excludeQuestionIds.includes(question.id)) {
      return false;
    }

    return categoryId === ALL_CATEGORIES || question.category === categoryId;
  });

  const question = shuffle(filtered)[0];

  return question ? createDecoratedCard(question, sizeId, "single", "prompt") : null;
}

export function createChallengeCard(options: Omit<BatchOptions, "count">): LabelCard | null {
  const { questions, categoryId, excludeQuestionIds = [], sizeId } = options;

  const filtered = questions.filter((question) => {
    if (excludeQuestionIds.includes(question.id)) {
      return false;
    }

    return categoryId === ALL_CATEGORIES || question.category === categoryId;
  });

  const question = shuffle(filtered)[0];

  return question ? createDecoratedCard(question, sizeId, "challenge", "challenge") : null;
}

export function rerollCardLook(card: LabelCard, sizeId: LabelSizeId): LabelCard {
  let nextThemeId = card.themeId;
  let nextPaletteIndex = card.paletteIndex;
  let attempts = 0;

  while (attempts < 8 && nextThemeId === card.themeId && nextPaletteIndex === card.paletteIndex) {
    nextThemeId = randomTheme(sizeId);
    nextPaletteIndex = Math.floor(Math.random() * PALETTES.length);
    attempts += 1;
  }

  const seed = Math.floor(Math.random() * 100_000_000);

  return {
    ...card,
    id: buildCardId(card.question.id, seed, "look"),
    themeId: nextThemeId,
    paletteIndex: nextPaletteIndex,
    serial: 100 + Math.floor(Math.random() * 900),
    seed,
  };
}

export function createBatch(options: BatchOptions): LabelCard[] {
  const { questions, count, categoryId, excludeQuestionIds = [], sizeId } = options;

  const filtered = questions.filter((question) => {
    if (excludeQuestionIds.includes(question.id)) {
      return false;
    }

    return categoryId === ALL_CATEGORIES || question.category === categoryId;
  });

  return shuffle(filtered)
    .slice(0, count)
    .map((question, index) => createDecoratedCard(question, sizeId, String(index), "prompt"));
}

export function createMoodBatch(options: { count: number; sizeId: LabelSizeId }): LabelCard[] {
  const { count, sizeId } = options;

  return Array.from({ length: count }).map((_, index) => {
    const seed = Math.floor(Math.random() * 100_000_000);
    const moodTemplate = MOOD_TRACKER_TEMPLATES[Math.floor(Math.random() * MOOD_TRACKER_TEMPLATES.length)] ?? MOOD_TRACKER_TEMPLATES[0];

    return {
      id: `mood-tracker-${seed}-${index}`,
      contentMode: "mood",
      question: MOOD_TRACKER_CARD_QUESTION,
      moodTemplateId: moodTemplate?.id,
      themeId: randomTheme(sizeId),
      paletteIndex: Math.floor(Math.random() * PALETTES.length),
      serial: 100 + Math.floor(Math.random() * 900),
      seed,
    };
  });
}
