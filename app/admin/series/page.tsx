import "../movies/management.css";
import { Suspense } from "react";
import { AdminShell } from "../movies/AdminShell";
import { FilmsTable } from "../movies/FilmsTable";
import { InfoGeneral } from "../movies/InfoGeneral";

export const metadata = { title: "Séries | Administration MenFouTix" };

export default function SeriesPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <AdminShell section="series">
      <InfoGeneral type="série" />
      <Suspense fallback={<section className="panel catalogue-panel empty-state" role="status" aria-busy="true">Chargement des séries…</section>}>
        <FilmsTable type="série" searchParams={searchParams} />
      </Suspense>
    </AdminShell>
  );
}
