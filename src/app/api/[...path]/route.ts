import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend-proxy";

type RouteContext = { params: Promise<{ path: string[] }> };

async function forward(request: NextRequest, context: RouteContext, method: string) {
  const { path } = await context.params;
  const body = method === "GET" || method === "DELETE" ? undefined : await request.text();
  return proxyToBackend(`/${path.map(encodeURIComponent).join("/")}`, request, { method, body });
}

export const GET = (request: NextRequest, context: RouteContext) => forward(request, context, "GET");
export const POST = (request: NextRequest, context: RouteContext) => forward(request, context, "POST");
export const PATCH = (request: NextRequest, context: RouteContext) => forward(request, context, "PATCH");
export const DELETE = (request: NextRequest, context: RouteContext) => forward(request, context, "DELETE");
