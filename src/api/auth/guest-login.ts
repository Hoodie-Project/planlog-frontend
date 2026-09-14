import { apiFetch } from "@/api/client";
import type { AuthResponseDto } from "@/types/auth";

export async function guestLogin() {
  return apiFetch<AuthResponseDto>("/api/auth/guest", {
    method: "POST",
  });
}
