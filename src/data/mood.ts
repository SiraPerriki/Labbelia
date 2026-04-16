import { LocalizedText, MoodTrackerTemplate, Question } from "../types";

export const MOOD_TRACKER_TITLE: LocalizedText = {
  es: "Mood tracker",
  en: "Mood tracker",
  ga: "Mood tracker",
  ja: "気分メモ",
};

export const MOOD_TRACKER_TEMPLATES: MoodTrackerTemplate[] = [
  {
    id: "daily-state",
    title: {
      es: "Estado del día",
      en: "Daily state",
      ga: "Estado do dia",
      ja: "今日の調子",
    },
    rows: [
      { es: "Energía", en: "Energy", ga: "Enerxia", ja: "気分" },
      { es: "Ánimo", en: "Mood", ga: "Animo", ja: "気力" },
      { es: "Estrés", en: "Stress", ga: "Estres", ja: "落ち着き" },
      { es: "Enfoque", en: "Focus", ga: "Enfoque", ja: "集中" },
      { es: "Motivación", en: "Motivation", ga: "Motivacion", ja: "たのしさ" },
      { es: "Disfrute", en: "Joy", ga: "Disfrute", ja: "人との距離" },
      { es: "Social", en: "Social", ga: "Social", ja: "つかれ" },
      { es: "Cansancio", en: "Fatigue", ga: "Cansazo", ja: "ねむけ" },
    ],
  },
  {
    id: "body-check",
    title: {
      es: "Cuerpo",
      en: "Body check",
      ga: "Corpo",
      ja: "からだのようす",
    },
    rows: [
      { es: "Sueño", en: "Sleep", ga: "Sono", ja: "睡眠" },
      { es: "Tensión", en: "Tension", ga: "Tension", ja: "呼吸" },
      { es: "Hambre", en: "Hunger", ga: "Fame", ja: "緊張" },
      { es: "Movimiento", en: "Movement", ga: "Movemento", ja: "食欲" },
      { es: "Calma", en: "Calm", ga: "Calma", ja: "動きやすさ" },
      { es: "Dolor", en: "Pain", ga: "Dor", ja: "体の重さ" },
      { es: "Descanso", en: "Rest", ga: "Descanso", ja: "痛み" },
      { es: "Respiración", en: "Breath", ga: "Respiracion", ja: "休めた感じ" },
    ],
  },
  {
    id: "creative-pulse",
    title: {
      es: "Pulso creativo",
      en: "Creative pulse",
      ga: "Pulso creativo",
      ja: "創作の温度",
    },
    rows: [
      { es: "Chispa", en: "Spark", ga: "Chispa", ja: "ひらめき" },
      { es: "Curiosidad", en: "Curiosity", ga: "Curiosidade", ja: "好奇心" },
      { es: "Juego", en: "Play", ga: "Xogo", ja: "集中" },
      { es: "Claridad", en: "Clarity", ga: "Claridade", ja: "遊び心" },
      { es: "Frustración", en: "Frustration", ga: "Frustracion", ja: "手を動かす気分" },
      { es: "Flujo", en: "Flow", ga: "Fluxo", ja: "迷い" },
      { es: "Impulso", en: "Drive", ga: "Impulso", ja: "続けたさ" },
      { es: "Satisfacción", en: "Satisfaction", ga: "Satisfaccion", ja: "満足感" },
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
