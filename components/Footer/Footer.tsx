"use client";

import { usePathname } from "next/navigation";
import { CatalogueProvider } from "@/components/Catalogue/CatalogueProvider";
import { versionFromPath } from "@/lib/catalogue";
import Link from "@/components/Catalogue/CatalogueLink";

export const Footer = () => {
  const version = versionFromPath(usePathname());
  return (<CatalogueProvider version={version}>
  <footer className="relative z-10 mt-16 border-t border-white/10 bg-zinc-950/90 px-5 py-8 text-sm text-zinc-400 md:px-8">
    <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link href="/" className="font-montserrat text-lg font-bold text-white">
          <span className="text-red-500">Movie</span>Fun
        </Link>
        <p className="mt-1 text-xs text-zinc-500">
          Films et séries à découvrir.
        </p>
      </div>

      <nav
        aria-label="Navigation du pied de page"
        className="flex flex-wrap gap-x-5 gap-y-2"
      >
        <Link href="/" className="hover:text-white">
          Accueil
        </Link>
        <Link href="/movies" className="hover:text-white">
          Films
        </Link>
        <Link href="/tv-shows" className="hover:text-white">
          Séries
        </Link>
        <Link href="/catalog" className="hover:text-white">
          Catalogue
        </Link>
        <Link href="/request" className="hover:text-white">
          Demander un film
        </Link>
      </nav>
    </div>

    <div className="mx-auto mt-6 max-w-7xl border-t border-white/10 pt-4 text-xs text-zinc-600">
      Données descriptives fournies par TMDB. Ce site n’est pas affilié à TMDB.
    </div>
  </footer>
  </CatalogueProvider>);
};
