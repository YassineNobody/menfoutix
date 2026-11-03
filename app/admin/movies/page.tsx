import "./management.css";
import { Suspense } from "react";
import { AdminShell } from "./AdminShell";
import { FilmsTable } from "./FilmsTable";
import { InfoGeneral } from "./InfoGeneral";

export default function Home({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <AdminShell section="catalogue">
      <InfoGeneral />
      <Suspense fallback={<section className="panel catalogue-panel empty-state" aria-busy="true">Chargement des films…</section>}>
        <FilmsTable searchParams={searchParams} />
      </Suspense>
    </AdminShell>
  );
}
