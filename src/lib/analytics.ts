const GA_MEASUREMENT_ID = "G-MWWHH4KBCK";
const GA_DISABLE_KEY = `ga-disable-${GA_MEASUREMENT_ID}`;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [GA_DISABLE_KEY]?: boolean;
  }
}

let analyticsLoaded = false;

function ensureGtag(): void {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
}

export function loadGoogleAnalytics(): void {
  if (typeof window === "undefined" || analyticsLoaded) {
    return;
  }

  ensureGtag();

  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  analyticsLoaded = true;
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  window[GA_DISABLE_KEY] = !granted;

  if (!granted) {
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
    return;
  }

  loadGoogleAnalytics();
  ensureGtag();
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}
