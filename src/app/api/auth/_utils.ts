const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function buildCandidateUrls(paths: readonly string[]) {
  const base = API_BASE_URL.replace(/\/$/, "");

  return paths.map((path) => `${base}${path}`);
}

export async function proxyAuthRequest(paths: readonly string[], init: RequestInit) {
  let lastResponse: Response | null = null;
  let lastError: unknown = null;

  for (const url of buildCandidateUrls(paths)) {
    try {
      const response = await fetch(url, {
        ...init,
        cache: "no-store",
      });

      if (response.status === 404) {
        lastResponse = response;
        continue;
      }

      return {
        response,
        upstreamUrl: url,
      };
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResponse) {
    return {
      response: lastResponse,
      upstreamUrl: null,
    };
  }

  throw lastError instanceof Error ? lastError : new Error("인증 프록시 요청에 실패했습니다.");
}
