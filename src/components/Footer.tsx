import { Locale } from "../types";
import { localize } from "../lib/i18n";

interface FooterProps {
  locale: Locale;
  openCookiePreferences: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function text(locale: Locale, value: any): string {
  return localize(locale, value);
}

export function Footer({ locale, openCookiePreferences }: FooterProps) {
  return (
    <footer className="site-footer card-surface" data-nosnippet>
      <div className="site-footer-copy">
        <p className="site-footer-title">Labbelia</p>
        <p className="site-footer-note">
          Pequeñas tiritas desarrolladas con cariño por <strong>Sira Perriki</strong>.
        </p>
      </div>
      <nav className="site-footer-links" aria-label="Enlaces de Labbelia">
        <a href="https://x.com/SiraPerriki" target="_blank" rel="noreferrer">
          <span className="site-footer-link-symbol site-footer-link-symbol-x">✦</span>
          <span>X · @SiraPerriki</span>
        </a>
        <a href="https://github.com/SiraPerriki" target="_blank" rel="noreferrer">
          <span className="site-footer-link-symbol site-footer-link-symbol-github">⌘</span>
          <span>GitHub · @SiraPerriki</span>
        </a>
        <a href="mailto:Sira.Perriki@proton.me">
          <span className="site-footer-link-symbol site-footer-link-symbol-mail">✉</span>
          <span>Correo · Sira.Perriki@proton.me</span>
        </a>
        <a href="https://ko-fi.com/siraperriki" target="_blank" rel="noreferrer">
          <span className="site-footer-link-symbol site-footer-link-symbol-kofi">☕</span>
          <span>
            {text(locale, {
              es: "Ko-fi · Invítame a un café",
              en: "Ko-fi · Buy me a coffee",
              ja: "Ko-fi · コーヒーを奢る",
            })}
          </span>
        </a>
        <button className="site-footer-link-button" onClick={openCookiePreferences} type="button">
          <span className="site-footer-link-symbol site-footer-link-symbol-settings">⚙</span>
          <span>{text(locale, { es: "Cookies", en: "Cookies", ja: "クッキー" })}</span>
        </button>
      </nav>
    </footer>
  );
}
