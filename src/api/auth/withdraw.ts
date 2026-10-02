import { apiFetch } from "@/api/client";

export async function withdraw(accessToken: string) {
  return apiFetch<{ withdrawn: true }>("/api/auth/me", {
    method: "DELETE",
    accessToken,
  });
}
