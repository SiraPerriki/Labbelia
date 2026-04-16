import { UI_COPY } from "../data/content";
import { MOOD_TRACKER_TITLE } from "../data/mood";
import { localize } from "../lib/i18n";
import { CardContentMode, Locale } from "../types";

interface TopbarProps {
  locale: Locale;
  setLocale: (l: Locale) => void;
  uiTheme: "light" | "dark";
  setUiTheme: (t: "light" | "dark") => void;
  contentMode: CardContentMode;
  setContentMode: (m: CardContentMode) => void;
  compactTopbar: boolean;
  brandMenuOpen: boolean;
  setBrandMenuOpen: (o: boolean) => void;
  optionsMenuOpen: boolean;
  setOptionsMenuOpen: (o: boolean) => void;
}

export function Topbar({
  locale,
  setLocale,
  uiTheme,
  setUiTheme,
  contentMode,
  setContentMode,
  compactTopbar,
  brandMenuOpen,
  setBrandMenuOpen,
  optionsMenuOpen,
  setOptionsMenuOpen,
}: TopbarProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function text(locale: Locale, value: any): string {
    return localize(locale, value);
  }

  const modeToggleAria = text(locale, { es: "Modo", en: "Mode", ja: "モード" });
  const themeToggleAria = text(locale, { es: "Apariencia", en: "Appearance", ja: "外観" });
  const languageToggleAria = text(locale, { es: "Idioma", en: "Language", ja: "言語" });
  const lightThemeLabel = text(locale, { es: "Día", en: "Day", ja: "ライト" });
  const darkThemeLabel = text(locale, { es: "Noche", en: "Night", ja: "ダーク" });
  const promptModeLabel = text(locale, { es: "Tiritas", en: "Strips", ja: "ひとこと" });
  const challengeModeLabel = text(locale, { es: "Retos", en: "Challenges", ja: "小さな創作" });

  const brandBlock = (
    <div className="topbar-copy">
      <div className="brand-mark" aria-hidden="true">
        <span className="brand-mark-glyph brand-mark-glyph-heart">♡</span>
        <span className="brand-mark-glyph brand-mark-glyph-letter">L</span>
      </div>
      <div className="brand-lockup">
        <div className="brand-title-row">
          <p className="eyebrow">{text(locale, UI_COPY.appTitle)}</p>
        </div>
        <p className="brand-tagline">{text(locale, UI_COPY.appSubtitle)}</p>
      </div>
    </div>
  );

  const controlsBlock = (
    <div className="topbar-actions">
      <div className="mode-toggle" role="tablist" aria-label={modeToggleAria}>
        <button
          className={contentMode === "prompt" ? "active" : ""}
          onClick={() => setContentMode("prompt")}
          type="button"
        >
          {promptModeLabel}
        </button>
        <button
          className={contentMode === "challenge" ? "active" : ""}
          onClick={() => setContentMode("challenge")}
          type="button"
        >
          {challengeModeLabel}
        </button>
        <button
          className={contentMode === "mood" ? "active" : ""}
          onClick={() => setContentMode("mood")}
          type="button"
        >
          {`☆ ${localize(locale, MOOD_TRACKER_TITLE)}`}
        </button>
      </div>
      <span className="topbar-separator" aria-hidden="true" />
      <div className="theme-toggle" role="tablist" aria-label={themeToggleAria}>
        <button
          className={uiTheme === "light" ? "active" : ""}
          onClick={() => setUiTheme("light")}
          type="button"
        >
          {lightThemeLabel}
        </button>
        <button
          className={uiTheme === "dark" ? "active" : ""}
          onClick={() => setUiTheme("dark")}
          type="button"
        >
          {darkThemeLabel}
        </button>
      </div>
      <span className="topbar-separator" aria-hidden="true" />
      <div
        className="language-toggle language-toggle-compact"
        role="tablist"
        aria-label={languageToggleAria}
      >
        <button
          className={locale === "es" ? "active" : ""}
          onClick={() => setLocale("es")}
          type="button"
        >
          ES
        </button>
        <button
          className={locale === "en" ? "active" : ""}
          onClick={() => setLocale("en")}
          type="button"
        >
          EN
        </button>
        <button
          className={locale === "ja" ? "active" : ""}
          onClick={() => setLocale("ja")}
          type="button"
        >
          日本語
        </button>
      </div>
    </div>
  );

  return (
    <header className={`app-header ${compactTopbar ? "app-header-compact" : ""}`} data-nosnippet>
      {compactTopbar ? (
        <div className="topbar">
          <div className="topbar-mobile-row">
            <button className="button button-ghost" onClick={() => setBrandMenuOpen(true)}>
              {text(locale, { es: "Acerca de", en: "About", ja: "情報" })}
            </button>
            <div className="language-toggle" role="tablist" aria-label={languageToggleAria}>
              <button
                className={locale === "es" ? "active" : ""}
                onClick={() => setLocale("es")}
                type="button"
              >
                ES
              </button>
              <button
                className={locale === "en" ? "active" : ""}
                onClick={() => setLocale("en")}
                type="button"
              >
                EN
              </button>
              <button
                className={locale === "ja" ? "active" : ""}
                onClick={() => setLocale("ja")}
                type="button"
              >
                日本語
              </button>
            </div>
            <button className="button button-ghost" onClick={() => setOptionsMenuOpen(true)}>
              {text(locale, { es: "Opciones", en: "Options", ja: "設定" })}
            </button>
          </div>
          <div className="topbar-mobile-row">
            <div
              className="mode-toggle mode-toggle-full"
              role="tablist"
              aria-label={modeToggleAria}
            >
              <button
                className={contentMode === "prompt" ? "active" : ""}
                onClick={() => setContentMode("prompt")}
                type="button"
              >
                {promptModeLabel}
              </button>
              <button
                className={contentMode === "challenge" ? "active" : ""}
                onClick={() => setContentMode("challenge")}
                type="button"
              >
                {challengeModeLabel}
              </button>
              <button
                className={contentMode === "mood" ? "active" : ""}
                onClick={() => setContentMode("mood")}
                type="button"
              >
                {`☆ ${localize(locale, MOOD_TRACKER_TITLE)}`}
              </button>
            </div>
          </div>

          {brandMenuOpen && (
            <div className="topbar-mobile-overlay" onClick={() => setBrandMenuOpen(false)}>
              <div className="topbar-mobile-menu" onClick={(e) => e.stopPropagation()}>
                {brandBlock}
              </div>
            </div>
          )}

          {optionsMenuOpen && (
            <div className="topbar-mobile-overlay" onClick={() => setOptionsMenuOpen(false)}>
              <div className="topbar-mobile-menu" onClick={(e) => e.stopPropagation()}>
                <div
                  className="theme-toggle theme-toggle-full"
                  role="tablist"
                  aria-label={themeToggleAria}
                >
                  <button
                    className={uiTheme === "light" ? "active" : ""}
                    onClick={() => setUiTheme("light")}
                    type="button"
                  >
                    {lightThemeLabel}
                  </button>
                  <button
                    className={uiTheme === "dark" ? "active" : ""}
                    onClick={() => setUiTheme("dark")}
                    type="button"
                  >
                    {darkThemeLabel}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="topbar">
          {brandBlock}
          {controlsBlock}
        </div>
      )}
    </header>
  );
}
