"use client";

import { useState, useTransition, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { MovieGridCard } from "@/components/Movie/Grid/MovieGridCard";
import { MovieListCard } from "@/components/Movie/List/MovieListCard";
import { Pagination } from "@/components/Pagination/Pagination";
import type { PaginatedResult } from "@/types/commons";
import type { WorkListItemResponse } from "@/types/work/work";
import type { GenreMovieSort } from "@/lib/services/movies-by-genre";

interface Props {
  result: PaginatedResult<WorkListItemResponse>;
  sort: GenreMovieSort;
  releaseYear?: number;
  minTmdbRating?: number;
  columns: 4 | 5 | 6;
  view: "grid" | "list";
}

export function GenreMoviesResults({ result, sort, releaseYear, minTmdbRating, columns, view }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigate = (query: URLSearchParams, scroll = false) => {
    startTransition(() => router.push(`${pathname}?${query}`, { scroll }));
  };
  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const query = new URLSearchParams(searchParams.toString());
    query.delete("page");
    for (const key of ["sort", "year", "rating"]) {
      const value = String(form.get(key) ?? "");
      if (!value || (key === "sort" && value === "recentlyAdded")) query.delete(key);
      else query.set(key, value);
    }
    navigate(query);
  };
  const changeDisplay = (key: "columns" | "view", value: string) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set(key, value);
    navigate(query);
  };
  const inputClass = "min-h-11 rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-red-500";
  const grid = columns === 4 ? "lg:grid-cols-4" : columns === 5 ? "lg:grid-cols-5" : "lg:grid-cols-6";

  return (
    <div aria-busy={pending}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">{result.total} film{result.total > 1 ? "s" : ""}</p>
        <button type="button" aria-expanded={filtersOpen} aria-controls="genre-movie-filters"
          onClick={() => setFiltersOpen((open) => !open)} className={`${inputClass} inline-flex items-center gap-2`}>
          <SlidersHorizontal size={16} aria-hidden="true" /> Filtres
        </button>
      </div>
      <div id="genre-movie-filters" hidden={!filtersOpen} className="mb-8 rounded-xl border border-white/10 bg-zinc-900/50 p-4">
        <form key={`${sort}-${releaseYear}-${minTmdbRating}`} onSubmit={applyFilters} className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-2 text-xs text-zinc-400">Trier par
            <select name="sort" defaultValue={sort} className={inputClass}>
              <option value="recentlyAdded">Derniers ajouts</option>
              <option value="releaseDate">Date de sortie</option>
              <option value="tmdbRating">Note TMDB</option>
              <option value="title">Titre A–Z</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs text-zinc-400">Année
            <input name="year" type="number" min={1900} max={2100} defaultValue={releaseYear ?? ""} placeholder="Toutes" className={`${inputClass} w-28`} />
          </label>
          <label className="flex flex-col gap-2 text-xs text-zinc-400">Note minimum
            <input name="rating" type="number" min={0} max={10} step={0.1} defaultValue={minTmdbRating ?? ""} placeholder="Toutes" className={`${inputClass} w-28`} />
          </label>
          <button type="submit" disabled={pending} className="min-h-11 rounded-lg bg-red-600 px-4 text-sm font-medium disabled:opacity-50">Appliquer</button>
          <label className="flex flex-col gap-2 text-xs text-zinc-400">Affichage
            <select value={view} onChange={(e) => changeDisplay("view", e.target.value)} className={inputClass}>
              <option value="grid">Grille</option><option value="list">Liste</option>
            </select>
          </label>
          {view === "grid" && <label className="flex flex-col gap-2 text-xs text-zinc-400">Colonnes sur ordinateur
            <select value={columns} onChange={(e) => changeDisplay("columns", e.target.value)} className={inputClass}>
              {[4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>}
        </form>
      </div>
      <p role="status" className="mb-3 text-xs text-zinc-400">{pending ? "Chargement des films…" : ""}</p>
      <div className={pending ? "opacity-50 transition-opacity" : ""}>
        {result.data.length === 0 ? <p className="py-16 text-center text-zinc-400">Aucun film ne correspond à ces filtres.</p>
          : view === "grid" ? <div className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:gap-x-5 ${grid}`}>
            {result.data.map((movie) => <MovieGridCard key={movie.tmdbId} movie={movie} />)}
          </div> : <div className="space-y-3">{result.data.map((movie) => <MovieListCard key={movie.tmdbId} movie={movie} />)}</div>}
      </div>
      <Pagination page={result.page} pages={result.totalPages} onPageChange={(page) => {
        if (pending || page === result.page) return;
        const query = new URLSearchParams(searchParams.toString());
        query.set("page", String(page));
        navigate(query, true);
      }} />
    </div>
  );
}
