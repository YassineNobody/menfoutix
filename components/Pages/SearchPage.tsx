import { catalogueHref, type CatalogueVersion } from "@/lib/catalogue";
import { redirect } from "next/navigation";
import { getSearchFacets, searchWorks, type SearchFilters, type SearchSort } from "@/lib/services/search";
import { SearchResults } from "@/components/Search/SearchResults";

export const metadata = { title: "Search | MenFouTix" };

export default async function SearchPage({ searchParams, version = "VO" }: {
  version?: CatalogueVersion;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const text = (key: string) => typeof query[key] === "string" ? query[key].trim() : "";
  const numeric = (key: string, min: number, max: number, integer = false) => {
    const raw = text(key); if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) && n >= min && n <= max && (!integer || Number.isSafeInteger(n)) ? n : undefined;
  };
  const sorts: SearchSort[] = ["title", "recentlyAdded", "releaseDate", "tmdbRating", "ourRating"];
  const type = text("type");
  const filters: SearchFilters = {
    q: text("q") || undefined,
    type: type === "film" || type === "série" ? type : undefined,
    genreId: numeric("genreId", 1, Number.MAX_SAFE_INTEGER, true),
    actorId: numeric("actorId", 1, Number.MAX_SAFE_INTEGER, true),
    releaseYear: numeric("releaseYear", 1, 9999, true),
    releaseYearFrom: numeric("releaseYearFrom", 1, 9999, true),
    releaseYearTo: numeric("releaseYearTo", 1, 9999, true),
    minTmdbRating: numeric("minTmdbRating", 0, 10),
    minOurRating: numeric("minOurRating", 0, 5),
    sort: sorts.find((s) => s === text("sort")),
  };
  if (filters.releaseYearFrom !== undefined && filters.releaseYearTo !== undefined && filters.releaseYearFrom > filters.releaseYearTo) filters.releaseYearTo = undefined;
  const page = numeric("page", 1, Number.MAX_SAFE_INTEGER, true) ?? 1;
  const hasCriteria = Object.values(filters).some((value) => value !== undefined);
  const result = hasCriteria ? searchWorks(filters, page, 20, version) : { data: [], page: 1, limit: 20, total: 0, totalPages: 0 };
  if (page !== result.page) {
    const search = new URLSearchParams();
    for (const [key,value] of Object.entries(query)) {
      if (Array.isArray(value)) value.forEach((v) => search.append(key,v));
      else if (value !== undefined) search.set(key,value);
    }
    search.set("page",String(result.page)); redirect(catalogueHref(`/search?${search}`, version));
  }
  return <div className="flex min-h-dvh flex-col bg-black px-4 pb-20 pt-28 text-white sm:px-6 lg:px-16">
    <SearchResults result={result} filters={filters} facets={getSearchFacets(version)} hasCriteria={hasCriteria} />
  </div>;
}
