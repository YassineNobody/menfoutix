import { getPreviewCollectionsVo } from "@/lib/services/collections";
import { HorizontalCarousel } from "../Carousel/HorizontalCarousel";
import { CollectionCard } from "../Collections/CollectionCard";

export function CollectionsCarouselHome() {
  const collections = getPreviewCollectionsVo(1, 20);
  console.log(collections)
  return (
    <HorizontalCarousel title="Les sages incontournables">
      {collections.data.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </HorizontalCarousel>
  );
}
