import { catalogueText, type CatalogueVersion } from "@/lib/catalogue";
import { CollectionDetails } from "@/types/collections/collections";
import type { ReactNode } from "react";
import { CollectionImage } from "../CollectionImage";
import { Calendar, Info, Star } from "lucide-react";
import Link from "@/components/Catalogue/CatalogueLink";

interface Props {
  collection: CollectionDetails;
  version?: CatalogueVersion;
}
export function CollectionGrid({ collection, version = "VO" }: Props) {
  if (collection.movies.length === 0) {
    return <p>Aucun film dans cette collection.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collection.movies.map((element) => (
        <div key={element.id} className="">
          <div className="bg-white/[0.03] rounded-xl overflow-hidden border border-white/10 hover:border-red-500/30 transition-all duration-300 group cursor-pointer hover:bg-white/[0.06]">
            <MovieLink tmdbId={element.tmdbId} available={version === "VF" ? element.vf : element.vo}>
              <div className="relative">
                <CollectionImage
                  key={element.posterUrl || "missing"}
                  src={element.posterUrl}
                  alt={catalogueText(version, element.titleFr, element.titleEn, element.originalTitle || "Sans titre")}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-red-600 hover:bg-red-700 rounded-full p-3 transition-colors">
                    <Info size={20} />
                  </div>
                </div>
                {element.tmdbRating !== null && Number.isFinite(element.tmdbRating) && (
                <div className="absolute top-4 right-4 bg-black/70 rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={14} />
                  <span className="text-sm font-medium">
                    {element.tmdbRating.toFixed(1)}
                  </span>
                </div>
                )}
                <div className="absolute top-4 left-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {element.position}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {catalogueText(version, element.titleFr, element.titleEn, element.originalTitle || "Sans titre")}
                </h3>
                {element.releaseYear !== null && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <Calendar size={14} />
                  <span>{element.releaseYear}</span>
                </div>
                )}
                {(catalogueText(version, element.synopsisFr, element.synopsisEn)) && (
                <p className="text-gray-400 text-sm line-clamp-3">
                  {catalogueText(version, element.synopsisFr, element.synopsisEn)}
                </p>
                )}
              </div>
            </MovieLink>
          </div>
        </div>
      ))}
    </div>
  );
}

function MovieLink({ tmdbId, available, children }: {
  tmdbId: number;
  available: boolean;
  children: ReactNode;
}) {
  return available ? (
    <Link href={`/movie/${tmdbId}`} className="block">{children}</Link>
  ) : (
    <div className="block" aria-label="Film unavailable in this version">{children}</div>
  );
}
