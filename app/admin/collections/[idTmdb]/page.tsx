import "../../movies/management.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "../../movies/AdminShell";
import { getCollection } from "@/lib/services/collections";

export const metadata = { title: "Détail collection | Administration MenFouTix" };

function Status({ available }: { available: boolean }) {
  return <span className={`availability ${available ? "is-yes" : "is-no"}`}><span aria-hidden="true">{available ? "●" : "—"}</span>{available ? "Présent" : "Manquant"}</span>;
}

export default async function AdminCollectionPage({ params }: {
  params: Promise<{ idTmdb: string }>;
}) {
  const { idTmdb } = await params;
  const tmdbId = Number(idTmdb);
  if (!Number.isSafeInteger(tmdbId) || tmdbId < 1) notFound();
  const collection = getCollection(tmdbId);
  if (!collection) notFound();
  const total = collection.movies.length;
  const vf = collection.movies.filter((movie) => movie.vf).length;
  const vo = collection.movies.filter((movie) => movie.vo).length;
  const missingBoth = collection.movies.filter((movie) => !movie.vf && !movie.vo).length;

  return (
    <AdminShell section="collections">
      <section className="stats-grid" aria-label="Statistiques de cette collection">
        <article className="stat-card"><div className="stat-label">FILMS DE LA COLLECTION</div><div className="stat-number">{total}<span>films</span></div><div className="stat-foot">Ordre de sortie</div></article>
        <article className="stat-card"><div className="stat-label">VERSION FRANÇAISE <span className="badge">VF</span></div><div className="stat-number">{vf}<span>présents</span></div><div className="stat-foot"><span className="warn">{total - vf} manquants</span></div></article>
        <article className="stat-card"><div className="stat-label">VERSION ORIGINALE <span className="badge">VO</span></div><div className="stat-number">{vo}<span>présents</span></div><div className="stat-foot"><span className="warn">{total - vo} manquants</span></div></article>
        <article className="stat-card attention"><div className="stat-label">SANS AUCUNE VERSION</div><div className="stat-number">{missingBoth}<span>films</span></div><div className="stat-foot">Ni VF ni VO dans le catalogue</div></article>
      </section>
      <section className="panel catalogue-panel" aria-labelledby="collection-heading">
        <div className="panel-heading"><div><div className="eyebrow">DÉTAIL DE LA SAGA</div><h2 id="collection-heading">{collection.nameFr} <span className="number-tag">{total}</span></h2></div><Link href="/admin/collections" className="clear-search">Toutes les collections</Link></div>
        <div className="table-toolbar"><p className="catalogue-note">Un film manquant ne possède aucune vidéo dans la version indiquée. Les films à venir restent inclus.</p><Link className="clear-search" href={`/collection/${collection.tmdbId}`}>Voir la page publique</Link></div>
        <div className="table-scroll"><table className="availability-table">
          <caption className="sr-only">Disponibilité VF et VO des films de {collection.nameFr}, dans l’ordre de sortie.</caption>
          <thead><tr><th scope="col">ORDRE</th><th scope="col">FILM</th><th scope="col">SORTIE</th><th scope="col">VF · FRANÇAIS</th><th scope="col">VO · ORIGINAL</th><th scope="col">FICHE</th></tr></thead>
          <tbody>{collection.movies.length ? collection.movies.map((movie) => (
            <tr key={movie.id}><td className="row-number">{movie.position}</td><th scope="row" className="film-name">{movie.titleFr || movie.titleEn || movie.originalTitle || "Sans titre"}</th><td>{movie.releaseDate || "Non renseignée"}</td><td><Status available={movie.vf} /></td><td><Status available={movie.vo} /></td><td>{movie.vo ? <Link className="clear-search" href={`/movie/${movie.tmdbId}`}>Voir le film</Link> : <span className="catalogue-note">Indisponible en VO</span>}</td></tr>
          )) : <tr><td colSpan={6} className="empty-state">Aucun film dans cette collection.</td></tr>}</tbody>
        </table></div>
        <div className="table-footer"><span>Collection TMDB #{collection.tmdbId}</span><span>Présence des vidéos · catalogue local</span></div>
      </section>
    </AdminShell>
  );
}
