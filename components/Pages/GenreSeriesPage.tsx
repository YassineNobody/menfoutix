import { catalogueHref, type CatalogueVersion } from "@/lib/catalogue";
import Link from "@/components/Catalogue/CatalogueLink";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/server/database";
import { getSeries } from "@/lib/services/series";
import { MovieGridCard } from "@/components/Movie/Grid/MovieGridCard";

interface Props {
  version?: CatalogueVersion;
  params: Promise<{ idGenre: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SeriesGenrePage({ params, searchParams, version = "VO" }: Props) {
  const [{ idGenre }, query] = await Promise.all([params, searchParams]);
  const genreId = Number(idGenre);
  if (!Number.isSafeInteger(genreId) || genreId < 1) notFound();
  const genre = db.prepare("SELECT name FROM genres WHERE tmdb_genre_id=?").get(genreId) as { name: string } | undefined;
  if (!genre) notFound();
  const requested = typeof query.page === "string" ? Number(query.page) : 1;
  const page = Number.isSafeInteger(requested) && requested > 0 ? requested : 1;
  const result = getSeries("recentlyAdded", page, 18, { genreId }, version);
  if (result.page !== page) redirect(catalogueHref(`/genre/tv/${genreId}?page=${result.page}`, version));
  return (
    <div className="relative min-h-screen bg-black px-4 pb-16 pt-28 text-white sm:px-6 lg:px-16">
      <header className="mb-8 flex items-center gap-4">
        <Link href="/tv-shows" aria-label="Back to series" className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-zinc-950 text-zinc-300 hover:text-white"><ArrowLeft size={19} aria-hidden="true" /></Link>
        <h1 className="text-2xl font-bold sm:text-3xl">{genre.name}</h1>
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-400">Series</span>
      </header>
      <p className="mb-5 text-sm text-zinc-400">{result.total} series</p>
      {result.data.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {result.data.map((series) => <MovieGridCard key={series.tmdbId} movie={series} />)}
      </div> : <p className="py-16 text-center text-zinc-400">No series available in this genre yet.</p>}
      {result.totalPages > 1 && <nav aria-label="Pagination" className="mt-10 flex flex-wrap justify-center gap-2">
        {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
          <Link key={p} href={`/genre/tv/${genreId}?page=${p}`} aria-current={p === result.page ? "page" : undefined}
            className={`flex size-10 items-center justify-center rounded-full border text-sm ${p === result.page ? "border-red-900/60 bg-red-950" : "border-white/15 bg-zinc-950 text-zinc-400 hover:text-white"}`}>{p}</Link>
        ))}
      </nav>}
    </div>
  );
}

export const metadata = { title: "MenFouTix" };
