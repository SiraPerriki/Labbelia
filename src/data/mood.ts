import { LocalizedText, MoodTrackerTemplate, Question } from "../types";

export const MOOD_TRACKER_TITLE: LocalizedText = {
  es: "Mood tracker",
  en: "Mood tracker",
  ga: "Mood tracker",
};

export const MOOD_TRACKER_TEMPLATES: MoodTrackerTemplate[] = [
  {
    id: "daily-state",
    title: {
      es: "Estado del día",
      en: "Daily state",
      ga: "Estado do dia",
    },
    rows: [
      { es: "Energía", en: "Energy", ga: "Enerxia" },
      { es: "Ánimo", en: "Mood", ga: "Animo" },
      { es: "Estrés", en: "Stress", ga: "Estres" },
      { es: "Enfoque", en: "Focus", ga: "Enfoque" },
      { es: "Motivación", en: "Motivation", ga: "Motivacion" },
      { es: "Disfrute", en: "Joy", ga: "Disfrute" },
      { es: "Social", en: "Social", ga: "Social" },
      { es: "Cansancio", en: "Fatigue", ga: "Cansazo" },
    ],
  },
  {
    id: "body-check",
    title: {
      es: "Cuerpo",
      en: "Body check",
      ga: "Corpo",
    },
    rows: [
      { es: "Sueño", en: "Sleep", ga: "Sono" },
      { es: "Tensión", en: "Tension", ga: "Tension" },
      { es: "Hambre", en: "Hunger", ga: "Fame" },
      { es: "Movimiento", en: "Movement", ga: "Movemento" },
      { es: "Calma", en: "Calm", ga: "Calma" },
      { es: "Dolor", en: "Pain", ga: "Dor" },
      { es: "Descanso", en: "Rest", ga: "Descanso" },
      { es: "Respiración", en: "Breath", ga: "Respiracion" },
    ],
  },
  {
    id: "creative-pulse",
    title: {
      es: "Pulso creativo",
      en: "Creative pulse",
      ga: "Pulso creativo",
    },
    rows: [
      { es: "Chispa", en: "Spark", ga: "Chispa" },
      { es: "Curiosidad", en: "Curiosity", ga: "Curiosidade" },
      { es: "Juego", en: "Play", ga: "Xogo" },
      { es: "Claridad", en: "Clarity", ga: "Claridade" },
      { es: "Frustración", en: "Frustration", ga: "Frustracion" },
      { es: "Flujo", en: "Flow", ga: "Fluxo" },
      { es: "Impulso", en: "Drive", ga: "Impulso" },
      { es: "Satisfacción", en: "Satisfaction", ga: "Satisfaccion" },
    ],
  },
];

export const MOOD_TRACKER_DEFAULT_TEMPLATE_ID = MOOD_TRACKER_TEMPLATES[0]?.id ?? "daily-state";

export function getMoodTrackerTemplate(templateId?: string): MoodTrackerTemplate {
  return (
    MOOD_TRACKER_TEMPLATES.find((template) => template.id === templateId) ??
    MOOD_TRACKER_TEMPLATES[0]
  );
}

export function getMoodTrackerRows(templateId?: string): LocalizedText[] {
  return getMoodTrackerTemplate(templateId).rows;
}

export function getMoodTrackerTitle(templateId?: string): LocalizedText {
  return getMoodTrackerTemplate(templateId).title;
}

export const MOOD_TRACKER_CARD_QUESTION: Question = {
  id: "mood-tracker",
  category: "care",
  text: MOOD_TRACKER_TITLE,
};
