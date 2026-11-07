import type { CatalogueVersion } from "@/lib/catalogue";
import { HeroCarouselSkeleton } from "@/components/Carousel/HeroCarouselSkeleton";
import { HorizontalCarouselSkeleton } from "@/components/Carousel/HorizontalCarouselSkeleton";
import { CollectionsCarouselHome } from "@/components/Home/CollectionsCarouselHome";
import { RecentlyAddedCarouselMovies } from "@/components/Home/RecentlyAddedCarouselMovies";
import { RecentlyAddedCarouselSeries } from "@/components/Home/RecentlyAddedCarouselSeries";
import { RecommendedCarouselHome } from "@/components/Home/RecommendedCarousel";
import { Suspense } from "react";

export const metadata = { title: "MenFouTix" };
export default function Home({ version = "VO" }: { version?: CatalogueVersion } = {}) {
  return (
    <div className="pt-20">
      <Suspense fallback={<HeroCarouselSkeleton />}>
        <RecommendedCarouselHome version={version} />
      </Suspense>
      <div className="py-6 px-3 md:px-6 flex flex-col gap-10">
        <Suspense fallback={<HorizontalCarouselSkeleton />}>
          <RecentlyAddedCarouselMovies version={version} />
        </Suspense>
        <Suspense fallback={<HorizontalCarouselSkeleton />}>
          <RecentlyAddedCarouselSeries version={version} />
        </Suspense>
        <Suspense fallback={<HorizontalCarouselSkeleton />}>
          <CollectionsCarouselHome version={version} />
        </Suspense>
      </div>
    </div>
  );
}
