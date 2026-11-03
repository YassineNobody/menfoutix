import { Film } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  year: number | null;
  posterUrl: string | null;
  actions: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/** Cadre commun aux fiches film et série, sans logique métier. */
export function DetailLayout({ title, year, posterUrl, actions, children, footer }: Props) {
  return (
    <div className="mx-auto w-full">
      <header className="mb-8">
        <h1 className="font-montserrat py-1 text-2xl font-bold uppercase tracking-wide text-zinc-300 md:text-3xl">
          {title}{year !== null && <> ({year})</>}
        </h1>
        <span aria-hidden="true" className="mt-2 block h-1 w-11 rounded-full bg-linear-to-r from-red-600 to-red-800/80" />
      </header>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-106">
          {posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={posterUrl} alt={`Poster for ${title}`} className="w-full rounded-lg object-contain" />
          ) : (
            <div className="flex aspect-2/3 flex-col items-center justify-center gap-3 rounded-lg bg-zinc-900 text-sm text-zinc-500">
              <Film size={36} aria-hidden="true" />No poster available
            </div>
          )}
          {actions}
        </aside>
        {children}
      </div>
      {footer}
    </div>
  );
}
