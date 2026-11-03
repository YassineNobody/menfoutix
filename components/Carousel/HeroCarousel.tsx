"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { CalendarDays, Info, Pause, Play, Star } from "lucide-react";

import type { WorkListItemResponse } from "@/types/work/work";
import "./HeroCarousel.css";

const SLIDE_DELAY = 5000;
const MAX_SLIDES = 7;

interface Props {
  movies: WorkListItemResponse[];
}

export function HeroCarousel({ movies }: Props) {
  const slides = movies.slice(0, MAX_SLIDES);
  const canScroll = slides.length > 1;

  const [autoplay] = useState(() =>
    Autoplay({
      delay: SLIDE_DELAY,
      playOnInit: false,
      stopOnFocusIn: true,
      stopOnInteraction: true,
      stopOnMouseEnter: false,
    }),
  );

  const [viewportRef, emblaApi] = useEmblaCarousel(
    {
      loop: canScroll,
      align: "start",
    },
    [autoplay],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressCycle, setProgressCycle] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setProgressCycle((cycle) => cycle + 1);
    };

    const onPlay = () => {
      setIsPlaying(true);
      setProgressCycle((cycle) => cycle + 1);
    };

    const onStop = () => {
      setIsPlaying(false);
    };

    const onMotionChange = () => {
      setReducedMotion(mediaQuery.matches);

      if (mediaQuery.matches) {
        autoplay.stop();
      }
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("autoplay:play", onPlay);
    emblaApi.on("autoplay:stop", onStop);
    mediaQuery.addEventListener("change", onMotionChange);

    const initialSync = requestAnimationFrame(() => {
      onSelect();
      onMotionChange();
      setIsPlaying(autoplay.isPlaying());
    });

    if (canScroll && !mediaQuery.matches) {
      autoplay.play();
    } else {
      autoplay.stop();
    }

    return () => {
      cancelAnimationFrame(initialSync);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("autoplay:play", onPlay);
      emblaApi.off("autoplay:stop", onStop);
      mediaQuery.removeEventListener("change", onMotionChange);
      autoplay.stop();
    };
  }, [autoplay, emblaApi, canScroll]);

  const selectSlide = (index: number) => {
    autoplay.stop();
    emblaApi?.scrollTo(index, reducedMotion);
  };

  const toggleAutoplay = () => {
    if (!canScroll) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
    } else {
      autoplay.play();
    }
  };

  if (slides.length === 0) return null;

  return (
    <section
      aria-label="À la une"
      aria-roledescription="carrousel"
      className="relative mx-auto w-full min-w-0 max-w-[1920px] select-none px-3 sm:px-6 md:px-12 lg:px-20"
    >
      <div className="hero-carousel-frame relative isolate overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40 sm:rounded-3xl">
        <div ref={viewportRef} className="h-full w-full overflow-hidden rounded-[inherit]">
          <div
            className="flex h-full w-full touch-pan-y pinch-zoom"
            aria-live={isPlaying ? "off" : "polite"}
            aria-atomic="false"
          >
            {slides.map((movie, index) => {
              const title =
                movie.displayTitle ||
                movie.titleFr ||
                movie.localTitle ||
                movie.originalTitle ||
                "Sans titre";

              const image = movie.backdropUrl || movie.posterUrl;
              const isSeries = movie.type === "série";
              const isSelected = index === selectedIndex;

              const rating =
                movie.tmdbRating != null && Number.isFinite(movie.tmdbRating)
                  ? movie.tmdbRating.toFixed(1)
                  : null;

              return (
                <article
                  key={`${movie.type}-${movie.tmdbId}`}
                  className="relative h-full w-full min-w-0 flex-[0_0_100%]"
                  aria-roledescription="diapositive"
                  aria-label={`${index + 1} sur ${slides.length} : ${title}`}
                  aria-hidden={!isSelected}
                >
                  <HeroBackground
                    key={image || "no-image"}
                    src={image}
                    eager={index === 0}
                  />

                  <div
                    aria-hidden="true"
                    className="hero-carousel-shade pointer-events-none absolute inset-0 z-10"
                  />

                  <div className="relative z-20 flex h-full w-full flex-col justify-end px-4 pb-20 text-white sm:px-6 md:max-w-2xl md:justify-center md:px-12 md:pb-16">
                    <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[10px] sm:mb-5 sm:gap-2 sm:text-xs">
                      <span className="rounded-full border border-white/30 bg-black/30 px-2.5 py-1 font-semibold uppercase tracking-wide backdrop-blur-sm">
                        {isSeries ? "Série" : "Film"}
                      </span>

                      {movie.releaseDate && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1">
                          <CalendarDays size={14} aria-hidden="true" />
                          {movie.releaseDate.slice(0, 4)}
                        </span>
                      )}

                      {rating && (
                        <span
                          aria-label={`Note TMDB : ${rating} sur 10`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/25 px-2.5 py-1 font-semibold text-yellow-300"
                        >
                          <Star
                            size={14}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                          {rating}/10
                        </span>
                      )}
                    </div>

                    <HeroTitle
                      key={movie.logoUrl || "text-title"}
                      title={title}
                      logoUrl={movie.logoUrl}
                    />

                    {movie.synopsis && (
                      <p className="mt-3 h-[39px] max-w-xl line-clamp-2 text-xs leading-relaxed text-white/80 sm:mt-5 sm:h-[60px] sm:line-clamp-3 sm:text-sm md:h-[72px] md:text-base">
                        {movie.synopsis}
                      </p>
                    )}

                    <Link
                      href={`/${isSeries ? "tv" : "movie"}/${movie.tmdbId}`}
                      tabIndex={isSelected ? 0 : -1}
                      className="mt-3 inline-flex min-h-12 w-fit touch-manipulation items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/15 px-5 py-3 text-sm font-medium transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:mt-5 sm:rounded-2xl sm:px-6 sm:text-base md:px-7"
                    >
                      <Info size={18} aria-hidden="true" />
                      Plus d’informations
                      <span className="sr-only"> sur {title}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {canScroll && (
          <div className="absolute inset-x-0 bottom-3 z-30 flex justify-center px-3 sm:bottom-4 md:bottom-6">
            <div className="flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-black/65 px-2.5 py-0.5 backdrop-blur-md">
              <div
                className="flex items-center"
                role="group"
                aria-label="Choisir une diapositive"
              >
                {slides.map((movie, index) => {
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={`${movie.type}-${movie.tmdbId}`}
                      type="button"
                      onClick={() => selectSlide(index)}
                      aria-label={`Afficher ${
                        movie.displayTitle ||
                movie.titleFr ||
                        movie.localTitle ||
                        movie.originalTitle ||
                        `la diapositive ${index + 1}`
                      }`}
                      aria-current={isSelected ? "true" : undefined}
                      className="flex h-7 w-6 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1 rounded-full transition-all motion-reduce:transition-none ${
                          isSelected
                            ? "w-4 bg-white"
                            : "w-1 bg-white/45 hover:bg-white/80"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div
                className="h-0.5 w-10 overflow-hidden rounded-full bg-white/20 sm:w-14"
                aria-hidden="true"
              >
                <div
                  key={progressCycle}
                  className="hero-carousel-progress h-full rounded-full bg-red-500"
                  style={{
                    animationDuration: `${SLIDE_DELAY}ms`,
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={toggleAutoplay}
                aria-label={
                  isPlaying
                    ? "Mettre le carrousel en pause"
                    : "Démarrer le défilement automatique"
                }
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
              >
                {isPlaying ? (
                  <Pause size={12} fill="currentColor" aria-hidden="true" />
                ) : (
                  <Play size={12} fill="currentColor" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function HeroBackground({
  src,
  eager,
}: {
  src: string | null | undefined;
  eager: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-br from-zinc-700 via-zinc-900 to-black"
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className="hero-carousel-background absolute inset-0 block h-full w-full"
    />
  );
}

function HeroTitle({
  title,
  logoUrl,
}: {
  title: string;
  logoUrl: string | null | undefined;
}) {
  const [failed, setFailed] = useState(false);

  if (logoUrl && !failed) {
    return (
      <h2 className="flex h-16 items-end sm:h-20 md:h-[110px] lg:h-[120px]">
        <img
          src={logoUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="block max-h-16 w-auto max-w-full object-contain object-left drop-shadow-lg sm:max-h-20 md:max-h-[110px]"
        />
      </h2>
    );
  }

  return (
    <h2 className="font-montserrat flex h-16 items-end text-3xl font-bold leading-tight text-balance drop-shadow-lg sm:h-20 sm:text-4xl md:h-[110px] lg:h-[120px] lg:text-5xl">
      {title}
    </h2>
  );
}
