import { apiFetch } from "@/api/client";
import type { AuthResponseDto } from "@/types/auth";

type GuestLoginDto = {
  guestId: string;
  password: string;
};

export async function guestLogin(payload: GuestLoginDto) {
  return apiFetch<AuthResponseDto>("/api/auth/guest", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
