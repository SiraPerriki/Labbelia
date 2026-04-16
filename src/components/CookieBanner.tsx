import { useState, useEffect } from "react";
import { localize } from "../lib/i18n";
import { setAnalyticsConsent } from "../lib/analytics";
import { Locale } from "../types";

export const COOKIE_CONSENT_STORAGE_KEY = "labbelia-cookie-consent-v1";
export type CookieConsent = "unknown" | "accepted" | "rejected";

export function getStoredCookieConsent(): CookieConsent {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  return stored === "accepted" || stored === "rejected" ? stored : "unknown";
}

interface CookieBannerProps {
  locale: Locale;
  forceOpen: boolean;
  onClose: () => void;
}

export function CookieBanner({ locale, forceOpen, onClose }: CookieBannerProps) {
  const [cookieConsent, setCookieConsent] = useState<CookieConsent>(() => getStoredCookieConsent());
  const [cookiePreferencesOpen, setCookiePreferencesOpen] = useState(false);
  const [analyticsCookiesEnabled, setAnalyticsCookiesEnabled] = useState(
    () => getStoredCookieConsent() === "accepted",
  );

  useEffect(() => {
    if (cookieConsent !== "unknown") {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, cookieConsent);
      setAnalyticsConsent(cookieConsent === "accepted");
    }
  }, [cookieConsent]);

  const showBanner = cookieConsent === "unknown" || forceOpen;

  function acceptAnalyticsCookies(): void {
    setAnalyticsCookiesEnabled(true);
    setCookieConsent("accepted");
    setCookiePreferencesOpen(false);
    onClose();
  }

  function rejectOptionalCookies(): void {
    setAnalyticsCookiesEnabled(false);
    setCookieConsent("rejected");
    setCookiePreferencesOpen(false);
    onClose();
  }

  function saveCookiePreferences(): void {
    setCookieConsent(analyticsCookiesEnabled ? "accepted" : "rejected");
    setCookiePreferencesOpen(false);
    onClose();
  }

  function handleClose(): void {
    setCookiePreferencesOpen(false);
    onClose();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function text(locale: Locale, value: any): string {
    return localize(locale, value);
  }

  if (!showBanner) {
    return null;
  }

  return (
    <aside className="cookie-banner card-surface" aria-live="polite">
      <div className="cookie-banner-copy">
        <div className="cookie-banner-header">
          <p className="cookie-banner-title">
            {text(locale, {
              es: "Cookies y analítica",
              en: "Cookies and analytics",
              ja: "Cookieと解析",
            })}
          </p>
          {cookieConsent !== "unknown" ? (
            <button className="cookie-banner-close" onClick={handleClose} type="button">
              {text(locale, { es: "Cerrar", en: "Close", ja: "閉じる" })}
            </button>
          ) : null}
        </div>
        <p className="cookie-banner-text">
          {text(locale, {
            es: "Labbelia usa solo almacenamiento esencial y analítica opcional. Si aceptas la analítica, Google Analytics recogerá datos agregados sobre visitas, páginas vistas, dispositivo, idioma y acciones básicas de navegación.",
            en: "Labbelia uses only essential storage and optional analytics. If you accept analytics, Google Analytics will collect aggregated data about visits, viewed pages, device, language and basic navigation actions.",
            ja: "Labbeliaでは必須の保存機能と任意の解析のみを使います。解析を許可すると、Google Analyticsが訪問数、閲覧ページ、端末、言語、基本的な操作に関する集計データを取得します。",
          })}
        </p>
        <p className="cookie-banner-status">
          {cookieConsent === "unknown"
            ? text(locale, {
                es: "La analítica permanece bloqueada hasta que elijas.",
                en: "Analytics stays blocked until you choose.",
                ja: "選ぶまでは解析は無効のままです。",
              })
            : analyticsCookiesEnabled
              ? text(locale, {
                  es: "Estado actual: analítica aceptada.",
                  en: "Current setting: analytics accepted.",
                  ja: "現在の設定：解析を許可しています。",
                })
              : text(locale, {
                  es: "Estado actual: solo almacenamiento esencial.",
                  en: "Current setting: only essential storage.",
                  ja: "現在の設定：必須の保存機能のみです。",
                })}
        </p>
      </div>

      <div className="cookie-banner-actions">
        <button
          className="button button-secondary cookie-choice-reject"
          onClick={rejectOptionalCookies}
          type="button"
        >
          {text(locale, {
            es: "Rechazar analítica",
            en: "Reject analytics",
            ja: "解析を許可しない",
          })}
        </button>
        <button
          className="button button-ghost cookie-choice-configure"
          onClick={() => setCookiePreferencesOpen((open) => !open)}
          type="button"
        >
          {cookiePreferencesOpen
            ? text(locale, { es: "Ocultar opciones", en: "Hide options", ja: "設定を閉じる" })
            : text(locale, { es: "Personalizar", en: "Customize", ja: "設定する" })}
        </button>
        <button
          className="button button-secondary cookie-choice-accept"
          onClick={acceptAnalyticsCookies}
          type="button"
        >
          {text(locale, { es: "Aceptar analítica", en: "Accept analytics", ja: "解析を許可" })}
        </button>
      </div>

      {cookiePreferencesOpen ? (
        <div className="cookie-preferences">
          <label className="cookie-toggle">
            <div>
              <span className="cookie-toggle-title">
                {text(locale, {
                  es: "Cookies analíticas",
                  en: "Analytics cookies",
                  ja: "解析Cookie",
                })}
              </span>
              <span className="cookie-toggle-note">
                {text(locale, {
                  es: "Nos ayudan a entender qué vistas y acciones resultan útiles.",
                  en: "They help us understand which views and actions are useful.",
                  ja: "どの画面や操作が役立っているかを知るために使います。",
                })}
              </span>
            </div>
            <input
              checked={analyticsCookiesEnabled}
              onChange={(event) => setAnalyticsCookiesEnabled(event.target.checked)}
              type="checkbox"
            />
          </label>

          <div className="cookie-preferences-actions">
            <button className="button button-ghost" onClick={handleClose} type="button">
              {text(locale, { es: "Cerrar", en: "Close", ja: "閉じる" })}
            </button>
            <button className="button button-primary" onClick={saveCookiePreferences} type="button">
              {text(locale, { es: "Guardar selección", en: "Save selection", ja: "設定を保存" })}
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
