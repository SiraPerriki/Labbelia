import { LocalizedText, Locale } from "../types";

export function localize(locale: Locale, value: LocalizedText): string {
  return value[locale] ?? value.es;
}
