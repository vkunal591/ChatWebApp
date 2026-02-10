import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: any
) {
  const { path } = context.params as { path: string[] };

  const targetUrl = `http://localhost:8080/${path.join("/")}`;
  const res = await fetch(targetUrl);

  const buffer = await res.arrayBuffer();

  const response = new NextResponse(buffer, {
    status: res.status,
    headers: res.headers,
  });

  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}
