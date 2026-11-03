import "server-only";
import { cacheLife } from "next/cache";

interface TmdbImage {
  file_path: string;
  iso_639_1: string | null;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

function englishImage(value: unknown): string | null {
  if (!Array.isArray(value)) return null;
  const images = value.filter((image): image is TmdbImage =>
    typeof image === "object" && image !== null &&
    image.iso_639_1 === "en" && typeof image.file_path === "string" &&
    /^\/[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/.test(image.file_path),
  );
  images.sort((a, b) =>
    (b.vote_average || 0) - (a.vote_average || 0) ||
    (b.vote_count || 0) - (a.vote_count || 0) ||
    (b.width || 0) - (a.width || 0),
  );
  return images[0] ? `https://image.tmdb.org/t/p/original${images[0].file_path}` : null;
}

export async function getEnglishMovieImages(tmdbId: number) {
  "use cache";
  cacheLife("hours");

  const fallback = { posterUrl: null, logoUrl: null };
  const token = process.env.TMDB_TOKEN;
  if (!token) return fallback;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/images?include_image_language=en`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) return fallback;
    const images: unknown = await response.json();
    if (typeof images !== "object" || images === null) return fallback;
    return {
      posterUrl: englishImage("posters" in images ? images.posters : null),
      logoUrl: englishImage("logos" in images ? images.logos : null),
    };
  } catch {
    // Réseau indisponible, délai dépassé ou réponse invalide : garder SQLite.
    return fallback;
  }
}
