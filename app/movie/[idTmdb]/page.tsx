import { MovieItem } from "@/components/Movie/MovieItem";
import { getOneMovie } from "@/lib/services/movies";
import { notFound, redirect } from "next/navigation";



interface Props {
  params: Promise<{ idTmdb: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MoviePage({ params, searchParams }: Props) {
  const [{ idTmdb }, query] = await Promise.all([params, searchParams]);

  const tmdbId = Number(idTmdb);

  if (!Number.isSafeInteger(tmdbId) || tmdbId < 1) {
    notFound();
  }

  if (query.version !== undefined) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === "version" || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => search.append(key, item));
      else search.set(key, value);
    }
    redirect(`/movie/${tmdbId}${search.size ? `?${search}` : ""}`);
  }
  const movie = await getOneMovie(tmdbId);
  if (!movie) notFound();

  const backgroundImage = movie.backdropUrl;

  return (
    <div className="relative min-h-screen bg-black pt-20">
      {backgroundImage && (
        <>
          <div
            className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat opacity-50 lg:bg-top lg:bg-size-[100%_auto]"
            style={{
              backgroundImage: `url("${backgroundImage}")`,
            }}
          />

          <div className="pointer-events-none fixed inset-0 bg-linear-to-b from-black/40 via-black/65 to-black" />
        </>
      )}

      <div className="relative z-10 px-4 py-6 md:px-8 lg:px-16">
        <MovieItem movie={movie} />
      </div>
    </div>
  );
}

export const metadata = { title: "MenFouTix" };
