import { ApiError } from "@/api/client";
import type { AuthResponseDto } from "@/types/auth";

export async function guestLogin() {
  const response = await fetch("/api/auth/guest", {
    method: "POST",
    cache: "no-store",
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.status}`, response.status, payload);
  }

  return payload as AuthResponseDto;
}
