import { PALETTES, THEMES } from "../data/design";
import { MOOD_TRACKER_CARD_QUESTION } from "../data/mood";
import { Question, LabelCard, CategoryId, LabelSizeId, ThemeId } from "../types";

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
    .map((question, index) => {
      const seed = Math.floor(Math.random() * 100_000_000);

      return {
        id: `${question.id}-${seed}-${index}`,
        contentMode: "prompt",
        question,
        themeId: randomTheme(sizeId),
        paletteIndex: Math.floor(Math.random() * PALETTES.length),
        serial: 100 + Math.floor(Math.random() * 900),
        seed,
      };
    });
}

export function createMoodBatch(options: { count: number; sizeId: LabelSizeId }): LabelCard[] {
  const { count, sizeId } = options;

  return Array.from({ length: count }).map((_, index) => {
    const seed = Math.floor(Math.random() * 100_000_000);

    return {
      id: `mood-tracker-${seed}-${index}`,
      contentMode: "mood",
      question: MOOD_TRACKER_CARD_QUESTION,
      themeId: randomTheme(sizeId),
      paletteIndex: Math.floor(Math.random() * PALETTES.length),
      serial: 100 + Math.floor(Math.random() * 900),
      seed,
    };
  });
}
