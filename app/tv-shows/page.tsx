import { Suspense } from "react";
import { getSeries } from "@/lib/services/series";
import { GenresCarousel } from "@/components/Genres/GenresCarousel";
import { RecommendedSeriesCarousel } from "@/components/Series/RecommendedSeriesCarousel";
import { RecentSeriesCarousel } from "@/components/Series/RecentSeriesCarousel";
import { HeroCarouselSkeleton } from "@/components/Carousel/HeroCarouselSkeleton";
import { HorizontalCarouselSkeleton } from "@/components/Carousel/HorizontalCarouselSkeleton";

export const metadata = { title: "Series | MenFouTix" };

export default function SeriesPage() {
  const { total } = getSeries("tmdbRating", 1, 1);
  return (
    <div className="relative min-h-screen bg-black pt-20 text-white">
      <h1 className="sr-only">Series</h1>
      <div className="py-6 px-3 md:px-6 flex flex-col gap-10">
        {total === 0 ? (
          <p className="px-6 py-20 text-center text-zinc-400">
            No series available yet.
          </p>
        ) : (
          <>
            <Suspense fallback={<HeroCarouselSkeleton />}>
              <RecommendedSeriesCarousel />
            </Suspense>
            <Suspense fallback={<HorizontalCarouselSkeleton />}>
              <GenresCarousel workType="série" />
            </Suspense>
            <Suspense
              fallback={<HorizontalCarouselSkeleton title="Recent series" />}
            >
              <RecentSeriesCarousel />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
