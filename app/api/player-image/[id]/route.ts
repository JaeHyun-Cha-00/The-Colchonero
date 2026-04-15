import { NextResponse } from "next/server";

const BASE_URL = "https://v2.football.sportsapipro.com";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await fetch(`${BASE_URL}/api/players/${id}/image`, {
    headers: { "x-api-key": process.env.SPORTS_API_KEY ?? "" },
  });

  if (!res.ok) {
    return new NextResponse(null, { status: 404 });
  }

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
