import { catalogueHref, type CatalogueVersion } from "@/lib/catalogue";
import Link from "@/components/Catalogue/CatalogueLink";
import { redirect } from "next/navigation";
import { ArrowLeft, Library, Search } from "lucide-react";
import { CollectionCard } from "@/components/Collections/CollectionCard";
import { CollectionsPagination } from "@/components/Collections/CollectionsPagination";
import { getPreviewCollections, getPreviewCollectionsVo } from "@/lib/services/collections";

export const metadata = { title: "Collections | MenFouTix" };

interface Props {
  version?: CatalogueVersion;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CollectionsPage({ searchParams, version = "VO" }: Props) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const requestedPage = typeof params.page === "string" ? Number(params.page) : 1;
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    && Number.isSafeInteger((requestedPage - 1) * 12) ? requestedPage : 1;
  const result = version === "VF"
    ? getPreviewCollectionsVo(page, 12, query, version)
    : getPreviewCollections(page, 12, query);
  const lastPage = Math.max(1, result.totalPages);

  if (page > lastPage) {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    search.set("page", String(lastPage));
    redirect(catalogueHref(`/collections?${search}`, version));
  }

  return (
    <div className="relative min-h-screen bg-black">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group/icon">
            <ArrowLeft size={20} aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-4 inline-flex items-center gap-3">
            <Library aria-hidden="true" />
            Collections
          </h1>
          <p className="text-lg lg:text-xl text-white/60 leading-relaxed max-w-3xl mb-6">
            Explore your favourite sagas and discover the films in each collection.
          </p>
          <form action={catalogueHref("/collections", version)} method="get" className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <label htmlFor="collection-search" className="sr-only">Search collections</label>
            <input
              key={query}
              id="collection-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search for a saga…"
              className="min-w-0 flex-1 bg-white/[0.03] rounded-xl border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-red-500"
            />
            <button type="submit" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 rounded-xl px-5 py-3 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <Search size={18} aria-hidden="true" />
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">{query ? "Search results" : "All collections"}</h2>
          <span className="text-sm text-gray-400">{result.total} {result.total === 1 ? "collection" : "collections"}</span>
        </div>

        {result.data.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {result.data.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.03] rounded-xl border border-white/10 p-8 text-gray-400">
            {query ? `No collections found for “${query}”.` : "No collections available yet."}
          </div>
        )}

        <CollectionsPagination page={result.page} pages={result.totalPages} query={query} />
      </div>
    </div>
  );
}
