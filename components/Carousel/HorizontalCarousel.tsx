"use client";

import {
  Children,
  useEffect,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalCarouselProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function HorizontalCarousel({
  title,
  icon,
  children,
  className = "",
}: HorizontalCarouselProps) {
  const titleId = useId();
  const viewportId = useId();
  const slides = Children.toArray(children);
  const [wheelPlugin] = useState(() => WheelGesturesPlugin());
  const [viewportRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      loop: false,
    },
    [wheelPlugin],
  );
  const [navigation, setNavigation] = useState({ previous: false, next: false });

  useEffect(() => {
    if (!emblaApi) return;

    const updateNavigation = () => {
      setNavigation({
        previous: emblaApi.canScrollPrev(),
        next: emblaApi.canScrollNext(),
      });
    };

    emblaApi.on("select", updateNavigation);
    emblaApi.on("reInit", updateNavigation);
    updateNavigation();

    return () => {
      emblaApi.off("select", updateNavigation);
      emblaApi.off("reInit", updateNavigation);
    };
  }, [emblaApi]);

  const scroll = (direction: "previous" | "next") => {
    if (!emblaApi) return;
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (direction === "previous") emblaApi.scrollPrev(instant);
    else emblaApi.scrollNext(instant);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Les liens et boutons des cartes conservent leurs propres interactions.
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      scroll(event.key === "ArrowLeft" ? "previous" : "next");
    }
  };

  if (slides.length === 0) return null;

  const buttonClass =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-950/90 text-white shadow-lg backdrop-blur-sm transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-0 motion-reduce:transition-none";

  return (
    <section
      aria-labelledby={titleId}
      aria-roledescription="carrousel"
      className={`min-w-0 ${className}`}
    >
      <h2 id={titleId} className="mb-4 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
        <span className="inline-flex max-w-full items-center gap-2.5 transition-colors duration-200 hover:text-gray-300 motion-reduce:transition-none">
          {icon && <span aria-hidden="true" className="flex shrink-0 items-center justify-center [&>svg]:size-5 sm:[&>svg]:size-6">{icon}</span>}
          <span>{title}</span>
        </span>
      </h2>

      <div className="relative">
        <div
          id={viewportId}
          ref={viewportRef}
          tabIndex={0}
          role="group"
          aria-label={`${title} : utilisez les flèches gauche et droite pour défiler`}
          onKeyDown={handleKeyDown}
          className="overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <div className="flex touch-pan-y pinch-zoom gap-2">
            {slides.map((slide, index) => (
              <div
                key={typeof slide === "object" && "key" in slide ? slide.key : index}
                role="group"
                aria-roledescription="diapositive"
                aria-label={`${index + 1} sur ${slides.length}`}
                className="min-w-0 flex-[0_0_auto]"
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label={`Élément précédent : ${title}`}
          aria-controls={viewportId}
          disabled={!navigation.previous}
          onClick={() => scroll("previous")}
          className={`${buttonClass} left-2 sm:left-3`}
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={`Élément suivant : ${title}`}
          aria-controls={viewportId}
          disabled={!navigation.next}
          onClick={() => scroll("next")}
          className={`${buttonClass} right-2 sm:right-3`}
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
