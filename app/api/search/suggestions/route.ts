import { searchWorks } from "@/lib/services/search";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return Response.json({ items: [], total: 0 });
  if (q.length > 300) return Response.json({ error: "Query too long." }, { status: 400 });
  const result = searchWorks({ q }, 1, 5);
  return Response.json({
    items: result.data.map(({ tmdbId, type, displayTitle, posterUrl, releaseDate }) => ({ tmdbId, type, displayTitle, posterUrl, releaseDate })),
    total: result.total,
  });
}
