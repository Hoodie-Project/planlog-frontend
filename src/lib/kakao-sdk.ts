"use client";

declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: {
          success: () => void;
          fail: (error: unknown) => void;
          throughTalk?: boolean;
        }) => void;
        getAccessToken: () => string | null;
      };
    };
  }
}

const KAKAO_SDK_URL = "https://developers.kakao.com/sdk/js/kakao.min.js";

function loadScript() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Kakao SDK는 브라우저 환경에서만 로드할 수 있습니다."));
      return;
    }

    if (window.Kakao) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-sdk="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Kakao SDK 로드에 실패했습니다.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.dataset.kakaoSdk = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao SDK 로드에 실패했습니다."));
    document.head.appendChild(script);
  });
}

export async function ensureKakaoSdk() {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

  if (!clientId || clientId === "replace-me") {
    throw new Error("NEXT_PUBLIC_KAKAO_CLIENT_ID 값이 설정되어 있지 않습니다.");
  }

  await loadScript();

  if (!window.Kakao) {
    throw new Error("Kakao SDK 초기화 객체를 찾을 수 없습니다.");
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(clientId);
  }

  return window.Kakao;
}

export async function getKakaoAccessToken() {
  const kakao = await ensureKakaoSdk();

  return new Promise<string>((resolve, reject) => {
    kakao.Auth.login({
      throughTalk: false,
      success: () => {
        const accessToken = kakao.Auth.getAccessToken();

        if (!accessToken) {
          reject(new Error("카카오 액세스 토큰을 가져오지 못했습니다."));
          return;
        }

        resolve(accessToken);
      },
      fail: (error) => {
        reject(error instanceof Error ? error : new Error("카카오 로그인에 실패했습니다."));
      },
    });
  });
}
