import { catalogueText, type CatalogueVersion } from "@/lib/catalogue";
import { CollectionDetails } from "@/types/collections/collections";
import { CollectionImage } from "./CollectionImage";
import { Calendar, Film } from "lucide-react";

interface Props {
  collection: CollectionDetails;
  version?: CatalogueVersion;
}
export function CollectionHeader({ collection, version = "VO" }: Props) {
  const title = catalogueText(version, collection.nameFr, collection.nameEn);
  const synopsis = catalogueText(version, collection.synopsisFr, collection.synopsisEn);
  const years = collection.movies
    .map((movie) => movie.releaseYear)
    .filter((year): year is number => year !== null);

  const firstYear = years.length ? Math.min(...years) : null;
  const lastYear = years.length ? Math.max(...years) : null;
  return (
    <div className="flex flex-col lg:flex-row gap-8 mb-12">
      <div className="shrink-0">
        <CollectionImage
          key={collection.posterUrl || "missing"}
          src={collection.posterUrl}
          alt={title}
          className="w-64 rounded-xl shadow-2xl"
        />
      </div>
      <div className="flex-1">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-4">
          {title}
        </h1>
        <div className="flex items-center gap-6 mb-6 text-gray-300">
          <div className="flex items-center gap-2">
            <Film size={20} />
            <span>{collection.movies.length} films</span>
          </div>
          {firstYear !== null && (
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <span>
              {firstYear === lastYear ? firstYear : `${firstYear} - ${lastYear}`}
            </span>
          </div>
          )}
        </div>
        {synopsis && (
        <p className="text-lg lg:text-xl text-white/60 leading-relaxed max-w-3xl mb-6">
          {synopsis}
        </p>
        )}
      </div>
    </div>
  );
}
