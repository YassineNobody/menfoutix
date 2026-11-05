import "../movies/management.css";
import Link from "next/link";
import { AdminShell } from "../movies/AdminShell";
import { normalizeSearch } from "@/lib/server/database";
import { getAdminCollections } from "./collections";

export const metadata = { title: "Collections | Administration MenFouTix" };

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminCollectionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const version = params.version === "VF" || params.version === "VO" ? params.version : "";
  const collections = getAdminCollections();
  const search = normalizeSearch(query);
  const filtered = collections.filter((collection) =>
    (normalizeSearch(collection.nameFr).includes(search)
      || normalizeSearch(collection.nameEn || "").includes(search))
    && (!version || collection[version === "VF" ? "vf" : "vo"] > 0),
  );
  const completeVf = collections.filter((c) => c.total > 0 && c.vf === c.total).length;
  const completeVo = collections.filter((c) => c.total > 0 && c.vo === c.total).length;
  const unavailable = collections.filter((c) => c.vf === 0 && c.vo === 0).length;

  return (
    <AdminShell section="collections">
      <section className="stats-grid" aria-label="Statistiques des collections">
        <article className="stat-card"><div className="stat-label">TOUTES LES COLLECTIONS</div><div className="stat-number">{collections.length}<span>sagas</span></div><div className="stat-foot">Toutes versions confondues</div></article>
        <article className="stat-card"><div className="stat-label">COMPLÈTES EN VF <span className="badge">VF</span></div><div className="stat-number">{completeVf}<span>sagas</span></div><div className="stat-foot">Tous les films ont une vidéo VF</div></article>
        <article className="stat-card"><div className="stat-label">COMPLÈTES EN VO <span className="badge">VO</span></div><div className="stat-number">{completeVo}<span>sagas</span></div><div className="stat-foot">Tous les films ont une vidéo VO</div></article>
        <article className="stat-card attention"><div className="stat-label">SANS VIDÉO</div><div className="stat-number">{unavailable}<span>sagas</span></div><div className="stat-foot">Aucun film disponible en VF ou VO</div></article>
      </section>

      <section className="panel catalogue-panel" aria-labelledby="collections-heading">
        <div className="panel-heading"><div><div className="eyebrow">DISPONIBILITÉ PAR VERSION</div><h2 id="collections-heading">Collections <span className="number-tag">{filtered.length}</span></h2></div><span className="catalogue-note">Cliquez sur une saga pour consulter ses films.</span></div>
        <form action="/admin/collections" method="get" className="table-toolbar page-size-form catalogue-search-form">
          <label className="search-box catalogue-search"><span aria-hidden="true">⌕</span><span className="sr-only">Rechercher une collection</span><input key={query} name="q" type="search" defaultValue={query} placeholder="Rechercher une saga…" /></label>
          <label className="page-size-controls">Version
            <select key={version} name="version" defaultValue={version}>
              <option value="">Toutes les collections</option><option value="VF">Avec au moins un film en VF</option><option value="VO">Avec au moins un film en VO</option>
            </select>
          </label>
          <button type="submit">Filtrer</button>
          {(query || version) && <Link href="/admin/collections" className="clear-search">Réinitialiser</Link>}
        </form>
        <div className="table-scroll">
          <table className="availability-table">
            <caption className="sr-only">Nombre de films présents et manquants par collection et par version. Les statistiques au-dessus concernent toutes les collections.</caption>
            <thead><tr><th scope="col" rowSpan={2}>COLLECTION</th><th scope="col" rowSpan={2}>FILMS</th><th scope="colgroup" colSpan={2} className="version-group">VF · FRANÇAIS</th><th scope="colgroup" colSpan={2} className="version-group vo-group">VO · ORIGINAL</th></tr><tr><th scope="col" className="version-start">PRÉSENTS</th><th scope="col">MANQUANTS</th><th scope="col" className="version-start">PRÉSENTS</th><th scope="col">MANQUANTS</th></tr></thead>
            <tbody>{filtered.length ? filtered.map((collection) => (
              <tr key={collection.id}>
                <th scope="row" className="film-name"><Link className="clear-search" href={`/admin/collections/${collection.tmdbId}`}>{collection.nameFr}</Link></th>
                <td>{collection.total}</td>
                <td className="version-start"><span className="good">{collection.vf} / {collection.total}</span></td><td><span className={collection.total > collection.vf ? "warn" : "good"}>{collection.total - collection.vf}</span></td>
                <td className="version-start"><span className="good">{collection.vo} / {collection.total}</span></td><td><span className={collection.total > collection.vo ? "warn" : "good"}>{collection.total - collection.vo}</span></td>
              </tr>
            )) : <tr><td colSpan={6} className="empty-state">Aucune collection ne correspond à ces critères.</td></tr>}</tbody>
          </table>
        </div>
        <div className="table-footer"><span>Disponibilité calculée à partir des vidéos du catalogue local.</span><span>{filtered.length} collections sur {collections.length}</span></div>
      </section>
    </AdminShell>
  );
}
