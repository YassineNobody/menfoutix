import { HeroCarouselSkeleton } from "@/components/Carousel/HeroCarouselSkeleton";
import { HorizontalCarouselSkeleton } from "@/components/Carousel/HorizontalCarouselSkeleton";
import { RecentlyAddedCarouselMovies } from "@/components/Home/RecentlyAddedCarouselMovies";
import { RecentlyAddedCarouselSeries } from "@/components/Home/RecentlyAddedCarouselSeries";
import { RecommendedCarouselHome } from "@/components/Home/RecommendedCarousel";
import { Suspense } from "react";

export const metadata = { title: "MenFouTix" };
export default function Home() {
  return (
    <div className="pt-20">
      <Suspense fallback={<HeroCarouselSkeleton />}>
        <RecommendedCarouselHome />
      </Suspense>
      <div className="py-6 px-3 md:px-6 flex flex-col gap-10">
        <Suspense fallback={<HorizontalCarouselSkeleton />}>
          <RecentlyAddedCarouselMovies />
        </Suspense>
        <Suspense fallback={<HorizontalCarouselSkeleton />}>
          <RecentlyAddedCarouselSeries />
        </Suspense>
      </div>
    </div>
  );
}
