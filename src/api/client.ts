type ApiFetchOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined | null>;
  accessToken?: string | null;
};

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function withQuery(path: string, query?: ApiFetchOptions["query"]) {
  if (!query) return path;

  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const search = searchParams.toString();
  return search ? `${path}${path.includes("?") ? "&" : "?"}${search}` : path;
}

function extractErrorMessage(status: number, payload: unknown): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const { message } = payload as { message?: unknown };
    if (typeof message === "string" && message.trim()) return message;
    if (Array.isArray(message) && message.length > 0) {
      return message.filter((item): item is string => typeof item === "string").join(" ");
    }
  }
  return `Request failed: ${status}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(response.status, payload), response.status, payload);
  }

  return payload as T;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const { query, headers, accessToken, body, ...init } = options;
  const response = await fetch(withQuery(path, query), {
    ...init,
    body,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  return parseResponse<T>(response);
}
