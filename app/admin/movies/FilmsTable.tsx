import type { CatalogueType } from "./film-types";
import { FilmSearchControls } from "./FilmSearchControls";
import Link from "next/link";
import { searchFilms } from "./films";
import { groupFilmAvailability } from "./film-availability";

type Props = {
  type?: CatalogueType;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function positiveInteger(value: string | string[] | undefined, fallback: number) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function Status({ yes }: { yes: boolean }) {
  return <span className={`availability ${yes ? "is-yes" : "is-no"}`}>
    <span aria-hidden="true">{yes ? "●" : "—"}</span> {yes ? "Oui" : "Non"}
  </span>;
}

export async function FilmsTable({ searchParams, type = "film" }: Props) {
  const isSeries = type === "série";
  const label = isSeries ? "séries" : "films";
  const anchor = isSeries ? "series" : "films";
  const path = isSeries ? "/admin/series" : "/admin/movies";
  const params = await searchParams;
  const requestedLimit = positiveInteger(params.limit, 10);
  const limit = [10, 25, 50].includes(requestedLimit) ? requestedLimit : 10;
  const search = (Array.isArray(params.q) ? params.q[0] : params.q ?? "").trim();
  const result = searchFilms(search, positiveInteger(params.page, 1), limit, type);
  const films = groupFilmAvailability(result.data);
  const { page, total, totalPages } = result;
  const href = (number: number) => {
    const query = new URLSearchParams({ page: String(number), limit: String(limit) });
    if (search) query.set("q", search);
    return `${path}?${query.toString()}#${anchor}`;
  };
  const pageNumbers = Array.from(new Set([1, page - 1, page, page + 1, totalPages]))
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((a, b) => a - b);

  return (
    <section className="panel catalogue-panel" id={anchor} aria-labelledby={`${anchor}-heading`}>
      <div className="panel-heading">
        <div><div className="eyebrow">DISPONIBILITÉ PAR VERSION</div>
          <h2 id={`${anchor}-heading`}>Catalogue des {label} <span className="number-tag">{total}</span></h2>
        </div>
        <span className="catalogue-note">{isSeries ? "Une ligne par série" : "Une ligne par film"}</span>
      </div>
      <div className="table-toolbar">
        <FilmSearchControls search={search} limit={limit} type={type} />
      </div>
      <div className="table-scroll">
        <table className="availability-table">
          <caption className="sr-only">{isSeries ? "Séries" : "Films"} : présence d’une vidéo et d’une playlist en VF et en VO. {search && `Recherche : ${search}.`} Page {page}.</caption>
          <thead>
            <tr><th scope="col" rowSpan={2}>ID ŒUVRE</th><th scope="col" rowSpan={2}>{isSeries ? "TITRE DE LA SÉRIE" : "TITRE DU FILM"}</th>
              <th scope="colgroup" colSpan={2} className="version-group">VF · FRANÇAIS</th>
              <th scope="colgroup" colSpan={2} className="version-group vo-group">VO · ORIGINAL</th>
            </tr>
            <tr><th scope="col" className="version-start">VIDÉO</th><th scope="col">PLAYLIST</th>
              <th scope="col" className="version-start">VIDÉO</th><th scope="col">PLAYLIST</th></tr>
          </thead>
          <tbody>
            {films.length ? films.map((film) => <tr key={film.id}>
              <td className="id-cell">#{film.id}</td><th scope="row" className="film-name">{film.titleFr}{film.titleEn && film.titleEn !== film.titleFr ? ` — ${film.titleEn}` : ""}</th>
              <td className="version-start"><Status yes={film.versions.VF.video} /></td>
              <td><Status yes={film.versions.VF.playlist} /></td>
              <td className="version-start"><Status yes={film.versions.VO.video} /></td>
              <td><Status yes={film.versions.VO.playlist} /></td>
            </tr>) : <tr><td colSpan={6} className="empty-state">{search ? `Aucun résultat pour « ${search} ».` : `Aucun élément dans le catalogue des ${label}.`}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-footer catalogue-pagination">
        <span>{total ? (page - 1) * limit + 1 : 0}–{Math.min(page * limit, total)} sur <strong>{total}</strong> {label}{search ? " trouvés" : ""} · {limit} par page</span>
        <nav aria-label="Pagination du catalogue" className="pagination-controls">
          {page > 1 ? <Link href={href(page - 1)} aria-label="Page précédente">‹</Link> : <span aria-disabled="true" aria-label="Page précédente">‹</span>}
          {pageNumbers.map((number, index) => <span className="page-number-group" key={number}>
            {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="page-gap">…</span>}
            <Link href={href(number)} aria-current={number === page ? "page" : undefined} aria-label={`Page ${number}`}>{number}</Link>
          </span>)}
          {page < totalPages ? <Link href={href(page + 1)} aria-label="Page suivante">›</Link> : <span aria-disabled="true" aria-label="Page suivante">›</span>}
        </nav>
        <span>Page {totalPages ? page : 0} / {totalPages}</span>
      </div>
    </section>
  );
}
