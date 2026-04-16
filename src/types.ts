export type Locale = "es" | "en" | "ga" | "ja";

export type CategoryId =
  | "self"
  | "body"
  | "bonds"
  | "meaning"
  | "time"
  | "future"
  | "creativity"
  | "care";

export type LabelSizeId = "classic" | "mini" | "wide" | "square";
export type CardContentMode = "prompt" | "challenge" | "mood";
export type LabelTypefaceId = "gochi" | "indie" | "walter" | "zen-maru" | "m-plus" | "klee";

export type ThemeId =
  | "postage"
  | "moon"
  | "garden"
  | "garden-night"
  | "circus-night"
  | "cloud-mail"
  | "forest-cabin"
  | "mushrooms"
  | "ribbons"
  | "fruits"
  | "kawaii-clouds"
  | "sunny-kitchen"
  | "desk-treasures"
  | "flowers"
  | "bows"
  | "rainbow"
  | "stripes-vertical"
  | "stripes-horizontal"
  | "hearts"
  | "geometrics"
  | "stars"
  | "confetti"
  | "undersea"
  | "matcha-cafe";

export interface LocalizedText {
  es: string;
  en: string;
  ga?: string;
  ja?: string;
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

export interface MoodTrackerTemplate {
  id: string;
  title: LocalizedText;
  rows: LocalizedText[];
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
  moodTemplateId?: string;
  themeId: ThemeId;
  paletteIndex: number;
  serial: number;
  seed: number;
}
