import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getOneMovie } from "@/lib/services/movies";

interface Props {
  params: Promise<{ idTmdb: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WatchMoviePage({ params, searchParams }: Props) {
  const [{ idTmdb }, query] = await Promise.all([params, searchParams]);
  const tmdbId = Number(idTmdb);

  if (!Number.isSafeInteger(tmdbId) || tmdbId < 1) {
    notFound();
  }

  if (query.version !== undefined) {
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (key === "version" || value === undefined) continue;

      if (Array.isArray(value)) {
        value.forEach((item) => search.append(key, item));
      } else {
        search.set(key, value);
      }
    }

    redirect(`/watch/movie/${tmdbId}${search.size ? `?${search}` : ""}`);
  }

  const movie = await getOneMovie(tmdbId);

  if (!movie) {
    notFound();
  }

  const video = movie.videos.find((item) => item.videoId);
  const title =
    movie.titleEn || movie.originalTitle || movie.titleFr || "Movie";

  const embedParams = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    cc_load_policy: "1",
    cc_lang_pref: "fr",
    hl: "fr",
  });

  return (
    <div className="fixed inset-0 z-[12000] h-dvh overflow-hidden bg-black text-white">
      <nav aria-label="Player navigation">
        <Link
          href={`/movie/${tmdbId}`}
          className="absolute left-4 top-4 z-10 inline-flex min-h-11 items-center gap-2 rounded-lg bg-black/70 px-3 text-sm shadow-lg transition-colors hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-white sm:left-8 sm:top-6"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Link>

        {video && (
          <a
            href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch on YouTube"
            className="absolute right-4 top-4 z-10 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-black/70 px-3 text-sm shadow-lg transition-colors hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-white sm:right-8 sm:top-6"
          >
            <ExternalLink size={16} aria-hidden="true" />
            YouTube
          </a>
        )}
      </nav>

      {video ? (
        <iframe
          src={`https://www.youtube.com/embed/${encodeURIComponent(video.videoId)}?${embedParams}`}
          title={`Watch ${title}`}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <p
          role="status"
          className="flex h-full items-center justify-center px-6 pt-24 text-center text-zinc-400"
        >
          This movie is not available.
        </p>
      )}
    </div>
  );
}

export const metadata = { title: "MenFouTix" };
