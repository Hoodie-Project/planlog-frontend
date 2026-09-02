declare global {
  interface Window {
    navermap_authFailure?: () => void;
    naver?: {
      maps?: Record<string, unknown>;
    };
  }
}

let naverMapPromise: Promise<void> | null = null;

export function loadNaverMapScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("NAVER Map SDK can only be loaded in the browser."));
  }

  if (window.naver?.maps) {
    return Promise.resolve();
  }

  if (naverMapPromise) {
    return naverMapPromise;
  }

  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  if (!clientId) {
    return Promise.reject(new Error("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID is not configured."));
  }

  naverMapPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-naver-map-sdk="true"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load NAVER Map SDK.")), { once: true });
      return;
    }

    window.navermap_authFailure = () => {
      reject(new Error("NAVER Map SDK authentication failed."));
    };

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.defer = true;
    script.dataset.naverMapSdk = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load NAVER Map SDK."));

    document.head.appendChild(script);
  });

  return naverMapPromise;
}
