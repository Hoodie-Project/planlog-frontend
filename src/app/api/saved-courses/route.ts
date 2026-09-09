import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(request: NextRequest) {
  return proxyToBackend("/saved-courses", request, { method: "GET" });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  return proxyToBackend("/saved-courses", request, { method: "POST", body });
}
