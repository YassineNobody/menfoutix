import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/server/database";
import { getMoviesByGenre, type GenreMovieSort } from "@/lib/services/movies-by-genre";
import { GenreMoviesResults } from "@/components/Genres/GenreMoviesResults";

interface Props {
  params: Promise<{ idGenre: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function GenreMoviesPage({ params, searchParams }: Props) {
  const [{ idGenre }, query] = await Promise.all([params, searchParams]);
  const genreId = Number(idGenre);
  if (!Number.isSafeInteger(genreId) || genreId < 1) notFound();
  const genre = db.prepare("SELECT name FROM genres WHERE tmdb_genre_id=?").get(genreId) as { name: string } | undefined;
  if (!genre) notFound();
  const sorts: GenreMovieSort[] = ["recentlyAdded", "releaseDate", "tmdbRating", "title"];
  const sort = sorts.find((value) => value === query.sort) ?? "recentlyAdded";
  const number = (key: string) => typeof query[key] === "string" && query[key] !== "" ? Number(query[key]) : NaN;
  const requestedPage = number("page");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const year = number("year");
  const releaseYear = Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : undefined;
  const rating = number("rating");
  const minTmdbRating = Number.isFinite(rating) && rating >= 0 && rating <= 10 ? rating : undefined;
  const columnCount = number("columns");
  const columns = columnCount === 4 || columnCount === 5 ? columnCount : 6;
  const view = query.view === "list" ? "list" : "grid";
  const result = getMoviesByGenre(genreId, page, 18, { sort, releaseYear, minTmdbRating });
  if (result.page !== page) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) value.forEach((item) => search.append(key, item));
      else if (value !== undefined) search.set(key, value);
    }
    search.set("page", String(result.page));
    redirect(`/genre/movie/${genreId}?${search}`);
  }
  return (
    <div className="relative min-h-screen bg-black pt-20 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_50%_0%,rgba(95,15,15,0.16),transparent_65%)]" />
      <div className="relative mx-auto max-w-[1700px] px-4 py-10 sm:px-6 lg:px-16">
        <header className="mb-8 flex items-center gap-4">
          <Link href="/movies" aria-label="Retour aux films" className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-zinc-950 text-zinc-300 hover:text-white">
            <ArrowLeft size={19} aria-hidden="true" />
          </Link>
          <h1 className="truncate text-2xl font-bold sm:text-3xl lg:text-4xl">{genre.name}</h1>
          <span className="rounded-full border border-white/15 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">Films</span>
        </header>
        <GenreMoviesResults result={result} sort={sort} releaseYear={releaseYear} minTmdbRating={minTmdbRating} columns={columns} view={view} />
      </div>
    </div>
  );
}

export const metadata = { title: "MenFouTix" };
