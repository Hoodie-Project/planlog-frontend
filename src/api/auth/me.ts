import { apiFetch } from "@/api/client";
import type { AuthUserDto } from "@/types/auth";

export async function getMe() {
  return apiFetch<AuthUserDto>("/api/auth/me", {
    method: "GET",
  });
}
