import { MovieCardSkeleton } from "@/components/Movie/MovieCardSkeleton";

interface Props {
  title?: string;
  className?: string;
}

export function HorizontalCarouselSkeleton({ title, className = "" }: Props) {
  return (
    <section role="status" aria-label={title ? `Chargement : ${title}` : "Chargement du carrousel"} className={`min-w-0 ${className}`}>
      {title ? (
        <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">{title}</h2>
      ) : (
        <div aria-hidden="true" className="mb-4 h-7 w-48 rounded bg-zinc-800 sm:h-8 motion-safe:animate-pulse" />
      )}
      <div aria-hidden="true" className="overflow-hidden rounded-lg">
        <div className="-ml-3 flex sm:-ml-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="min-w-0 flex-[0_0_50%] pl-3 sm:flex-[0_0_33.333333%] sm:pl-4 md:flex-[0_0_25%] xl:flex-[0_0_16.666667%]">
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Chargement des films et séries…</span>
    </section>
  );
}
