import { CollectionHeader } from "@/components/Collections/CollectionHeader";
import { CollectionGrid } from "@/components/Collections/Grid/CollectionGrid";
import { getCollection } from "@/lib/services/collections";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ idTmdb: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ idTmdb }] = await Promise.all([params, searchParams]);

  const tmdbId = Number(idTmdb);

  if (!Number.isSafeInteger(tmdbId) || tmdbId < 1) {
    notFound();
  }

  const collection = getCollection(tmdbId);

  if (!collection) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-black">
      <div
        className="
        container mx-auto px-4 pt-24 pb-8"
      >
        <div className="mb-8">
          <Link
            href={"/collections"}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group/icon"
          >
            <ArrowLeft size={20} />
            Back to collections
          </Link>
        </div>
        <CollectionHeader collection={collection} />
      </div>
      <div className="container mx-auto px-4 pb-12">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Films in the collection
            </h2>
          </div>
          <CollectionGrid collection={collection} />
        </div>
      </div>
    </div>
  );
}
