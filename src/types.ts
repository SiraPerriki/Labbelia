export type Locale = "es" | "en";

export type CategoryId =
  | "self"
  | "body"
  | "bonds"
  | "meaning"
  | "time"
  | "future"
  | "creativity"
  | "care";

export type LabelSizeId = "classic" | "wide" | "square";
export type CardContentMode = "prompt" | "mood";

export type ThemeId =
  | "postage"
  | "moon"
  | "garden"
  | "garden-night"
  | "circus-night"
  | "cloud-mail"
  | "sunny-kitchen"
  | "desk-treasures"
  | "flowers"
  | "rainbow"
  | "hearts"
  | "geometrics"
  | "stars"
  | "confetti"
  | "undersea";

export interface LocalizedText {
  es: string;
  en: string;
}

export interface Category {
  id: CategoryId;
  label: LocalizedText;
  accent: string;
}

export interface Question {
  id: string;
  category: CategoryId;
  text: LocalizedText;
}

export interface LabelSize {
  id: LabelSizeId;
  name: LocalizedText;
  description: LocalizedText;
  widthMm: number;
  heightMm: number;
  columns: number;
  rows: number;
  gapMm: number;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: LocalizedText;
}

export interface Palette {
  paper: string;
  border: string;
  ink: string;
  accent: string;
  soft: string;
  pop: string;
}

export interface LabelCard {
  id: string;
  contentMode: CardContentMode;
  question: Question;
  themeId: ThemeId;
  paletteIndex: number;
  serial: number;
  seed: number;
}
