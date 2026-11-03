type PageItem = number | "ellipsis";

interface Props {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

function pageItems(
  page: number,
  pages: number,
  visibleAtEdge: number,
): PageItem[] {
  if (pages <= visibleAtEdge + 1) {
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  if (page < visibleAtEdge) {
    return [
      ...Array.from({ length: visibleAtEdge }, (_, index) => index + 1),
      "ellipsis",
      pages,
    ];
  }

  if (page > pages - visibleAtEdge + 1) {
    return [
      1,
      "ellipsis",
      ...Array.from(
        { length: visibleAtEdge },
        (_, index) => pages - visibleAtEdge + index + 1,
      ),
    ];
  }

  const siblings = visibleAtEdge === 3 ? 0 : 2;
  const middle = Array.from(
    { length: siblings * 2 + 1 },
    (_, index) => page - siblings + index,
  );

  return [1, "ellipsis", ...middle, "ellipsis", pages];
}

function PageButtons({
  page,
  pages,
  onPageChange,
  visibleAtEdge,
  className,
}: Props & { visibleAtEdge: number; className: string }) {
  return (
    <nav aria-label="Pagination" className={className}>
      {pageItems(page, pages, visibleAtEdge).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="flex size-8 items-center justify-center text-xs text-zinc-500 sm:size-10 sm:text-base"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-red-500 sm:size-10 sm:text-sm ${
              item === page
                ? "border-red-900/60 bg-red-950 text-white"
                : "border-white/15 bg-zinc-950 text-zinc-400 hover:border-white/40 hover:text-white"
            }`}
          >
            {item}
          </button>
        ),
      )}
    </nav>
  );
}

export function Pagination({ page, pages, onPageChange }: Props) {
  if (pages <= 1) return null;

  return (
    <div className="mt-10 flex justify-center px-2">
      <PageButtons
        page={page}
        pages={pages}
        onPageChange={onPageChange}
        visibleAtEdge={3}
        className="flex items-center gap-1 sm:hidden"
      />
      <PageButtons
        page={page}
        pages={pages}
        onPageChange={onPageChange}
        visibleAtEdge={6}
        className="hidden items-center gap-2 sm:flex"
      />
    </div>
  );
}
