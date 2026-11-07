import { searchWorks } from "@/lib/services/search";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const q = params.get("q")?.trim() ?? "";
  const version = params.get("version") === "VF" ? "VF" : "VO";
  if (!q) return Response.json({ items: [], total: 0 });
  if (q.length > 300) return Response.json({ error: "Query too long." }, { status: 400 });
  const result = searchWorks({ q }, 1, 5, version);
  return Response.json({
    items: result.data.map(({ tmdbId, type, displayTitle, posterUrl, releaseDate }) => ({ tmdbId, type, displayTitle, posterUrl, releaseDate })),
    total: result.total,
  });
}
