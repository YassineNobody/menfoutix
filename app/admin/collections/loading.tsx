import "../movies/management.css";
import { AdminShell } from "../movies/AdminShell";

export default function Loading() {
  return (
    <AdminShell section="collections">
      <section className="panel catalogue-panel empty-state" role="status" aria-busy="true">
        Chargement des collections et de leurs disponibilités…
      </section>
    </AdminShell>
  );
}
