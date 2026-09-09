import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function POST(request: NextRequest) {
  const body = await request.text();
  return proxyToBackend("/courses/generate", request, { method: "POST", body });
}
