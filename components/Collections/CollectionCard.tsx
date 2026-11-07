"use client";

import { useState } from "react";
import Link from "@/components/Catalogue/CatalogueLink";
import { Library } from "lucide-react";
import type { PreviewCollection } from "@/types/collections/collections";

interface Props {
  collection: PreviewCollection;
  variant?: "carousel" | "grid";
}

export function CollectionCard({ collection, variant = "carousel" }: Props) {
  const title = collection.nameFr || collection.nameEn || "Sans titre";

  return (
    <Link
      href={`/collection/${collection.tmdbId}`}
      aria-label={`${title} — collection`}
      className={`group relative block aspect-2/3 w-[144px] md:w-[192px] overflow-hidden border border-white/10 bg-zinc-900 text-left shadow-black/50 transition duration-200 hover:-translate-y-1 hover:border-white/25 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none ${variant === "grid" ? "rounded-xl" : "rounded-lg"}`}
    >
      <Poster
        key={collection.posterUrl || "missing"}
        src={collection.posterUrl}
      />

      <span className="pointer-events-none absolute left-2 top-2 z-10 rounded border border-white/20 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
        Collection
      </span>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black via-black/85 to-transparent p-3 opacity-100 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:opacity-0 motion-reduce:transition-none">
        <h3 className="text-sm font-semibold leading-snug text-white">
          <span className="line-clamp-2">{title}</span>
        </h3>
      </div>
    </Link>
  );
}

function Poster({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-xs text-zinc-500">
        <Library size={30} aria-hidden="true" />
        Aucune affiche
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
    />
  );
}
