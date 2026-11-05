import Link from "next/link";

type Props = { section: "catalogue" | "playlists" | "collections"; children: React.ReactNode };

export function AdminShell({ section, children }: Props) {
  const isCatalogue = section === "catalogue";
  const isPlaylists = section === "playlists";
  const isCollections = section === "collections";
  const headings = {
    catalogue: { label: "Catalogue", title: "Catalogue des films", description: "Disponibilité des films et de leurs playlists en VF et VO." },
    playlists: { label: "Playlists", title: "Playlists manquantes", description: "Retrouvez les films dont les vidéos n’ont pas de playlist associée." },
    collections: { label: "Collections", title: "Collections et disponibilités", description: "Suivez les films présents et manquants dans chaque saga, en VF et en VO." },
  };
  const heading = headings[section];
  return (
    <div className="admin-shell">
      <header className="masthead">
        <Link href="/" className="brand"><span className="brand-mark">M</span><span>MENFOUTIX<small>CATALOGUE MANAGER</small></span></Link>
        <span className="connection"><span className="status-dot" /> BASE LOCALE · SQLITE</span>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-label">ESPACE DE GESTION</div>
          <nav aria-label="Navigation principale">
            <Link className={`nav-item ${isCatalogue ? "active" : ""}`} href="/admin/movies" aria-current={isCatalogue ? "page" : undefined}><span aria-hidden="true">▤</span> Catalogue des films</Link>
            <Link className={`nav-item ${isPlaylists ? "active" : ""}`} href="/admin/playlists" aria-current={isPlaylists ? "page" : undefined}><span aria-hidden="true">≡</span> Playlists manquantes</Link>
            <Link className={`nav-item ${isCollections ? "active" : ""}`} href="/admin/collections" aria-current={isCollections ? "page" : undefined}><span aria-hidden="true">▦</span> Collections</Link>
          </nav>
          <div className="sidebar-note"><span className="status-dot" /> LECTURE SEULE<small>Catalogue VF / VO<br />Aucune modification des données.</small></div>
        </aside>
        <div className="main-content">
          <div className="breadcrumb">Administration <span>/</span> {heading.label}</div>
          <div className="page-heading"><div><div className="eyebrow">TABLEAU DE BORD</div><h1>{heading.title}<span>.</span></h1><p>{heading.description}</p></div><span className="mode-label">CONSULTATION</span></div>
          {children}
          <footer className="page-footer"><span>MENFOUTIX / ADMINISTRATION</span><span>SQLite · VF + VO</span></footer>
        </div>
      </div>
    </div>
  );
}
