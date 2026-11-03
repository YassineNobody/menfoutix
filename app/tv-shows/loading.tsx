import { HeroCarouselSkeleton } from "@/components/Carousel/HeroCarouselSkeleton";
import { HorizontalCarouselSkeleton } from "@/components/Carousel/HorizontalCarouselSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black pt-20 text-white">
      <HeroCarouselSkeleton />
      <div className="mt-8 space-y-8"><HorizontalCarouselSkeleton /><HorizontalCarouselSkeleton title="Recent series" /></div>
    </div>
  );
}
