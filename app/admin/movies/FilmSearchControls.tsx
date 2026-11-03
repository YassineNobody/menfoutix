"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = { search: string; limit: number };

export function FilmSearchControls({ search, limit }: Props) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const select = useRef<HTMLSelectElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Répercute notamment les retours dans l'historique, sans interrompre la saisie.
  useEffect(() => {
    if (input.current && document.activeElement !== input.current) input.current.value = search;
    if (select.current) select.current.value = String(limit);
  }, [search, limit]);

  function updateSearch() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const query = new URLSearchParams({ page: "1", limit: select.current?.value ?? String(limit) });
    const value = input.current?.value.trim() ?? "";
    if (value) query.set("q", value);
    startTransition(() => router.replace(`/admin/movies?${query.toString()}#films`, { scroll: false }));
  }

  return (
    <form className="page-size-form catalogue-search-form" role="search" onSubmit={(event) => { event.preventDefault(); updateSearch(); }}>
      <label className="search-box catalogue-search">
        <span aria-hidden="true">⌕</span>
        <span className="sr-only">Rechercher un film dans le catalogue</span>
        <input ref={input} type="text" inputMode="search" name="q" placeholder="Rechercher un film…" defaultValue={search}
          onChange={() => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(updateSearch, 300);
          }} />
      </label>
      <div className="page-size-controls">
        <label htmlFor="films-limit">Films par page</label>
        <select ref={select} id="films-limit" defaultValue={limit} onChange={updateSearch}>
          {[10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </div>
      <button type="button" className="clear-search" onClick={() => {
        if (input.current) input.current.value = "";
        updateSearch();
      }}>Effacer</button>
      <span className="search-progress" role="status">{pending ? "Mise à jour…" : "Recherche instantanée"}</span>
    </form>
  );
}
