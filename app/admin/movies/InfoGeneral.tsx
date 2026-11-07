import type { CatalogueType } from "./film-types";
import { getCountFilms, getCountVersion, getCountVersionWithPlaylist, getCountVersionWithoutPlaylist } from "./films";

export const InfoGeneral = ({ type = "film" }: { type?: CatalogueType }) => {
  const label = type === "série" ? "séries" : "films";
  const { total } = getCountFilms(type);
  const versions = getCountVersion(type);
  const withPlaylist = getCountVersionWithPlaylist(type);
  const withoutPlaylist = getCountVersionWithoutPlaylist(type);
  const count = (rows: { version: string; total: number }[], version: string) => rows.find((row) => row.version === version)?.total ?? 0;
  const missing = withoutPlaylist.reduce((sum, row) => sum + row.total, 0);
  return (
    <section aria-label="Statistiques du catalogue" className="stats-grid">
      <article className="stat-card"><div className="stat-label">CATALOGUE GLOBAL <span>01</span></div><div className="stat-number">{total}<span>{label}</span></div><div className="stat-foot">Œuvres distinctes · toutes versions</div></article>
      {(["VF", "VO"] as const).map((version) => (
        <article className="stat-card" key={version}><div className="stat-label">{version === "VF" ? "VERSION FRANÇAISE" : "VERSION ORIGINALE"}<span className="badge">{version}</span></div><div className="stat-number">{count(versions, version)}<span>{label}</span></div><div className="stat-foot"><span className="good">{count(withPlaylist, version)} avec playlist</span><span className="warn">{count(withoutPlaylist, version)} sans</span></div></article>
      ))}
      <article className="stat-card attention"><div className="stat-label">PLAYLISTS MANQUANTES <span>!</span></div><div className="stat-number">{missing}<span>associations</span></div><div className="stat-foot">{type === "série" ? "Séries" : "Films"} / versions à vérifier</div></article>
    </section>
  );
};
