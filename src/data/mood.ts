import { LocalizedText, Question } from "../types";

export const MOOD_TRACKER_TITLE: LocalizedText = {
  es: "Mood tracker",
  en: "Mood tracker",
};

export const MOOD_TRACKER_ROWS: LocalizedText[] = [
  { es: "Energia", en: "Energy" },
  { es: "Animo", en: "Mood" },
  { es: "Estres", en: "Stress" },
  { es: "Enfoque", en: "Focus" },
  { es: "Motivacion", en: "Motivation" },
  { es: "Disfrute", en: "Joy" },
  { es: "Social", en: "Social" },
  { es: "Cansancio", en: "Fatigue" },
];

export const MOOD_TRACKER_CARD_QUESTION: Question = {
  id: "mood-tracker",
  category: "care",
  text: MOOD_TRACKER_TITLE,
};
