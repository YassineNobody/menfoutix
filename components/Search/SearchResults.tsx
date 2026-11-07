"use client";

import { catalogueHref } from "@/lib/catalogue";
import { useCatalogueVersion } from "@/components/Catalogue/CatalogueProvider";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Film, Search, SlidersHorizontal, X } from "lucide-react";
import { MovieGridCard } from "@/components/Movie/Grid/MovieGridCard";
import { Pagination } from "@/components/Pagination/Pagination";
import type { PaginatedResult } from "@/types/commons";
import type { WorkListItemResponse } from "@/types/work/work";
import type { SearchFacets, SearchFilters } from "@/lib/services/search";

const fields = ["type", "genreId", "actorId", "releaseYear", "releaseYearFrom", "releaseYearTo", "minTmdbRating", "minOurRating", "sort"] as const;
const control = "mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-zinc-900 px-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-red-500";

export function SearchResults({ result, filters, facets, hasCriteria }: {
  result: PaginatedResult<WorkListItemResponse>;
  filters: SearchFilters;
  facets: SearchFacets;
  hasCriteria: boolean;
}) {
  const router = useRouter();
  const version = useCatalogueVersion();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const params = useRef(searchParams.toString());
  useEffect(() => { params.current = searchParams.toString(); }, [searchParams]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (input.current && document.activeElement !== input.current) input.current.value = filters.q ?? "";
  }, [filters.q]);
  const navigate = (query: URLSearchParams, replace = false, scroll = false) => {
    params.current = query.toString();
    startTransition(() => {
      const url = catalogueHref(`/search${query.size ? `?${query}` : ""}`, version);
      if (replace) router.replace(url, { scroll });
      else router.push(url, { scroll });
    });
  };
  const search = () => {
    if (timer.current) clearTimeout(timer.current);
    const query = new URLSearchParams(params.current);
    const q = input.current?.value.trim() ?? "";
    if (q) query.set("q", q); else query.delete("q");
    query.delete("page"); navigate(query, true);
  };
  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    const form = event.currentTarget;
    const values = new FormData(form);
    const from = String(values.get("releaseYearFrom") ?? "");
    const to = String(values.get("releaseYearTo") ?? "");
    const end = form.elements.namedItem("releaseYearTo") as HTMLInputElement;
    end.setCustomValidity(from && to && Number(from) > Number(to) ? "The end year must be greater than or equal to the start year." : "");
    if (!form.reportValidity()) return;
    const query = new URLSearchParams(params.current);
    for (const field of fields) {
      const value = String(values.get(field) ?? "").trim();
      if (value && !(field === "sort" && value === "title")) query.set(field, value); else query.delete(field);
    }
    const q = input.current?.value.trim() ?? "";
    if (q) query.set("q", q); else query.delete("q");
    query.delete("page"); navigate(query);
  };
  const activeCount = fields.filter((field) => filters[field] !== undefined && !(field === "sort" && filters.sort === "title")).length;

  return (
    <div className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-6 md:gap-8">
      <header>
        <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl lg:text-5xl">Search movies and series</h1>
        <p className="mx-auto mb-8 max-w-3xl text-center text-sm text-zinc-500">Find a title, explore a genre or filter by cast, year and rating.</p>
        <form role="search" onSubmit={(e) => { e.preventDefault(); search(); }} className="relative mx-auto max-w-3xl">
          <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input ref={input} name="q" type="text" inputMode="search" defaultValue={filters.q ?? ""} aria-label="Search movies and series" placeholder="Search a title…" autoComplete="off"
            onChange={() => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(search, 350); }}
            className="h-14 w-full rounded-2xl border border-white/15 bg-zinc-950 pl-12 pr-14 text-white placeholder:text-zinc-600 focus-visible:outline-2 focus-visible:outline-red-500" />
          <button type="button" aria-label="Clear search" onClick={() => { if (input.current) { input.current.value = ""; input.current.focus(); } search(); }} className="absolute right-2 top-2 flex size-10 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white"><X size={18} /></button>
        </form>
      </header>
      <div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" aria-expanded={filtersOpen} aria-controls="search-filters" onClick={() => setFiltersOpen((open) => !open)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm hover:bg-white/10"><SlidersHorizontal size={17} aria-hidden="true" />Filters{activeCount > 0 && ` (${activeCount})`}</button>
          {hasCriteria && <button type="button" onClick={() => { if (timer.current) clearTimeout(timer.current); if (input.current) input.current.value = ""; navigate(new URLSearchParams()); }} className="text-sm text-zinc-500 hover:text-white">Reset all</button>}
        </div>
        {filtersOpen && <form id="search-filters" key={JSON.stringify(filters)} onSubmit={apply} className="mt-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm text-zinc-400">Type<select name="type" defaultValue={filters.type ?? ""} className={control}><option value="">Movies and series</option><option value="film">Movies</option><option value="série">Series</option></select></label>
            <label className="text-sm text-zinc-400">Genre<select name="genreId" defaultValue={filters.genreId ?? ""} className={control}><option value="">All genres</option>{facets.genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></label>
            <label className="text-sm text-zinc-400">Sort by<select name="sort" defaultValue={filters.sort ?? "title"} className={control}><option value="title">Title A–Z</option><option value="recentlyAdded">Recently added</option><option value="releaseDate">Release date</option><option value="tmdbRating">TMDB rating</option><option value="ourRating">Our rating</option></select></label>
            <label className="text-sm text-zinc-400">Actor<select name="actorId" defaultValue={filters.actorId ?? ""} className={control}><option value="">All actors</option>{facets.actors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
            {([["minTmdbRating", "Minimum TMDB rating /10", 10], ["minOurRating", "Minimum personal rating /5", 5]] as const).map(([name,label,max]) => <label key={name} className="text-sm text-zinc-400">{label}<input name={name} type="number" min={0} max={max} step={0.1} defaultValue={filters[name] ?? ""} placeholder="Any" className={control} /></label>)}
            {([["releaseYear", "Exact year"], ["releaseYearFrom", "From year"], ["releaseYearTo", "To year"]] as const).map(([name,label]) => <label key={name} className="text-sm text-zinc-400">{label}<input name={name} type="number" min={1} max={9999} step={1} defaultValue={filters[name] ?? ""} placeholder="Any" className={control} onChange={(e) => { (e.currentTarget.form?.elements.namedItem("releaseYearTo") as HTMLInputElement | null)?.setCustomValidity(""); }} /></label>)}
          </div>
          <button type="submit" disabled={pending} className="mt-5 min-h-11 rounded-xl bg-red-600 px-5 text-sm font-medium hover:bg-red-700 disabled:opacity-50">Apply filters</button>
        </form>}
      </div>
      <div aria-busy={pending} className="flex flex-1 flex-col">
        <p role="status" className="mb-5 text-sm text-zinc-400">{pending ? "Searching…" : hasCriteria ? `${result.total} result${result.total === 1 ? "" : "s"}${filters.q ? ` for “${filters.q}”` : ""}` : ""}</p>
        {!hasCriteria ? <div className="flex flex-1 flex-col items-center justify-center py-20 text-center text-zinc-500"><Film size={56} className="mb-4 opacity-20" aria-hidden="true" /><p>Search the catalogue</p><p className="mt-2 text-sm">Enter a title or choose filters.</p></div>
          : result.data.length === 0 ? <p className="py-20 text-center text-zinc-500">No titles match your search.</p>
          : <div className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-5 lg:gap-x-5 ${pending ? "opacity-50" : ""}`}>{result.data.map((work) => <MovieGridCard key={`${work.type}-${work.tmdbId}`} movie={work} />)}</div>}
        {hasCriteria && <Pagination page={result.page} pages={result.totalPages} onPageChange={(page) => {
          if (pending || page === result.page) return;
          if (timer.current) clearTimeout(timer.current);
          const query = new URLSearchParams(params.current); query.set("page", String(page)); navigate(query, false, true);
        }} />}
      </div>
    </div>
  );
}
