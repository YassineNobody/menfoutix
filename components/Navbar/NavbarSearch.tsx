"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Film, LoaderCircle, Search, Tv2, X } from "lucide-react";

interface Suggestion {
  tmdbId: number;
  type: "film" | "série";
  displayTitle: string;
  posterUrl: string | null;
  releaseDate: string | null;
}
interface Results { query: string; items: Suggestion[]; total: number; error?: boolean }

export function NavbarSearch() {
  const router = useRouter();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const mobileInput = useRef<HTMLInputElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [results, setResults] = useState<Results>({ query: "", items: [], total: 0 });
  const query = value.trim();
  const visible = (focused || mobile) && query.length > 0;
  const loading = results.query !== query;
  const close = () => { setFocused(false); setMobile(false); };

  useEffect(() => {
    if (!query || !visible) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/suggestions?${new URLSearchParams({ q: query })}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json() as Omit<Results, "query">;
        if (!controller.signal.aborted) setResults({ ...data, query });
      } catch {
        if (!controller.signal.aborted) setResults({ query, items: [], total: 0, error: true });
      }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, visible]);

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) { setFocused(false); setMobile(false); }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  useEffect(() => { if (mobile) mobileInput.current?.focus(); }, [mobile]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); close();
    router.push(`/search${query ? `?${new URLSearchParams({ q: query })}` : ""}`);
  };
  const inputClass = "h-10 w-full rounded-full border border-white/10 bg-white/5 pl-4 pr-11 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-red-500";
  const inputProps = {
    type: "text", inputMode: "search" as const, name: "q", value, maxLength: 300,
    autoComplete: "off", placeholder: "Search a title…", "aria-label": "Search the catalogue",
    "aria-expanded": visible, "aria-controls": visible ? id : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => { setValue(event.target.value); setFocused(true); },
    onFocus: () => setFocused(true), className: inputClass,
  };

  return <div ref={root} className="relative shrink-0"
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}
    onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); close(); if (mobile) mobileButton.current?.focus(); }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const controls = Array.from(root.current?.querySelectorAll<HTMLElement>("input, [data-suggestion]") ?? []).filter((el) => el.getClientRects().length > 0);
        const index = controls.indexOf(document.activeElement as HTMLElement);
        if (controls.length > 1) { event.preventDefault(); controls[(index + (event.key === "ArrowDown" ? 1 : -1) + controls.length) % controls.length]?.focus(); }
      }
    }}>
    <form role="search" action="/search" onSubmit={submit} className="relative hidden w-48 md:block xl:w-64">
      <input {...inputProps} />
      <button type="submit" aria-label="Search" className="absolute right-0 top-0 flex size-10 items-center justify-center rounded-full text-zinc-400 hover:text-white"><Search size={18} aria-hidden="true" /></button>
    </form>
    <button ref={mobileButton} type="button" aria-label="Open search" aria-expanded={mobile} onClick={() => setMobile((open) => !open)} className="flex size-11 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/5 md:hidden"><Search size={21} /></button>
    {mobile && <div className="fixed inset-x-0 top-16 border-b border-white/10 bg-zinc-950 p-4 md:hidden">
      <form role="search" action="/search" onSubmit={submit} className="flex items-center gap-2">
        <input {...inputProps} ref={mobileInput} />
        <button type="button" aria-label="Close search" onClick={() => { close(); mobileButton.current?.focus(); }} className="flex size-11 shrink-0 items-center justify-center text-zinc-400"><X size={20} /></button>
      </form>
    </div>}
    {visible && <div id={id} aria-label="Search suggestions" className={`${mobile ? "fixed inset-x-4 top-36 md:absolute md:inset-x-auto md:top-full" : "absolute right-0 top-full mt-2"} z-50 max-h-[65dvh] overflow-y-auto rounded-xl border border-white/15 bg-zinc-950 shadow-2xl md:right-0 md:mt-2 md:w-96`}>
      {loading ? <p role="status" className="flex items-center gap-2 px-4 py-5 text-sm text-zinc-400"><LoaderCircle size={16} className="motion-safe:animate-spin" />Searching…</p>
        : results.error ? <p role="status" className="px-4 py-5 text-sm text-red-300">Unable to load suggestions.</p>
        : results.items.length === 0 ? <p role="status" className="px-4 py-5 text-sm text-zinc-400">No titles found.</p>
        : <ul className="py-1">{results.items.map((item) => {
          const Icon = item.type === "film" ? Film : Tv2;
          return <li key={`${item.type}-${item.tmdbId}`}><Link data-suggestion href={`/${item.type === "film" ? "movie" : "tv"}/${item.tmdbId}`} prefetch={false} onClick={close} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 focus-visible:bg-white/10 focus-visible:outline-none">
            <span className="flex h-16 w-11 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-800">{item.posterUrl ? <img src={item.posterUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : <Icon size={19} className="text-zinc-500" />}</span>
            <span className="min-w-0"><span className="block truncate text-sm font-medium text-white">{item.displayTitle}</span><span className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400"><Icon size={12} />{item.type === "film" ? "Movie" : "Series"}{item.releaseDate && ` · ${item.releaseDate.slice(0, 4)}`}</span></span>
          </Link></li>;
        })}</ul>}
      <Link data-suggestion href={`/search?${new URLSearchParams({ q: query })}`} prefetch={false} onClick={close} className="flex min-h-11 items-center justify-center gap-2 border-t border-white/10 px-4 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-red-500">View all results{!loading && !results.error ? ` (${results.total})` : ""}<ArrowRight size={14} /></Link>
    </div>}
  </div>;
}
