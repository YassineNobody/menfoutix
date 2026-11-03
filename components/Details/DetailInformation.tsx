import { Star } from "lucide-react";
import type { ActorResponse, GenreResponse } from "@/types/movies/movies";

export function formatCertification(value: string | null): string {
  if (!value) return "Not specified";
  if (["TP", "U"].includes(value)) return "All ages";
  if (value === "NR") return "Not rated";
  return /^\d+$/.test(value) ? `Ages ${value}+` : value;
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", {
    dateStyle: "long", timeZone: "UTC",
  }).format(date);
}

interface Information {
  synopsis: string | null;
  rating: number | null;
  certification: string | null;
  peopleLabel: string;
  people: string[];
  genres: GenreResponse[];
  runtimeMinutes?: number | null;
}

export function DetailOverview({ synopsis, rating, certification, peopleLabel, people, genres, runtimeMinutes }: Information) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="mb-2 font-montserrat text-xl font-semibold">Synopsis</h2>
        <p className="text-sm leading-6 text-zinc-300">{synopsis || "No synopsis available."}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {rating !== null && <div>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">TMDB rating</h2>
          <p className="flex items-center gap-2 text-sm text-zinc-200"><Star size={18} className="fill-current text-amber-400" aria-hidden="true" />
            {rating.toFixed(1)}<span className="text-zinc-500">/10</span>
          </p>
        </div>}
        {runtimeMinutes != null && <DetailField label="Runtime" value={`${runtimeMinutes} min`} />}
        <DetailField label="French age rating" value={formatCertification(certification)} />
        {people.length > 0 && <DetailField label={peopleLabel} value={people.join(", ")} />}
      </div>
      {genres.length > 0 && <div>
        <h2 className="mb-3 text-lg font-semibold">Genres</h2>
        <div className="flex flex-wrap gap-2">{genres.map((genre) => (
          <span key={genre.id ?? genre.name} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">{genre.name}</span>
        ))}</div>
      </div>}
      <p className="border-t border-white/10 pt-4 text-xs leading-5 text-zinc-500">
        Information provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 underline hover:text-white">TMDB</a>. Some information may vary by country.
      </p>
    </div>
  );
}

export function DetailFacts({ originalTitle, releaseDate, releaseLabel, certification, runtimeMinutes, companies, rating, voteCount, peopleLabel, people, actors }: {
  originalTitle: string | null;
  releaseDate: string | null;
  releaseLabel: string;
  certification: string | null;
  runtimeMinutes?: number | null;
  companies: string[];
  rating: number | null;
  voteCount: number | null;
  peopleLabel: string;
  people: string[];
  actors: ActorResponse[];
}) {
  return (
    <div className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <DetailField label="Original title" value={originalTitle} />
        <DetailField label={releaseLabel} value={formatDate(releaseDate)} />
        {runtimeMinutes != null && <DetailField label="Runtime" value={`${runtimeMinutes} min`} />}
        <DetailField label="Production" value={companies.join(", ")} />
        <DetailField label={peopleLabel} value={people.join(", ")} />
        <DetailField label="French age rating" value={formatCertification(certification)} />
        <DetailField label="TMDB rating" value={rating !== null ? `${rating.toFixed(1)}/10` : null} />
        <DetailField label="TMDB votes" value={voteCount?.toLocaleString("en-US")} />
      </div>
      {actors.length > 0 && <div>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Cast</h2>
        <ul className="flex flex-wrap gap-2">{actors.map((actor, index) => (
          <li key={`${actor.id}-${index}`} title={actor.character ?? undefined} className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">{actor.name}</li>
        ))}</ul>
      </div>}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  return <div><h2 className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</h2>
    <p className="text-sm text-zinc-200">{value || "Not specified"}</p></div>;
}
