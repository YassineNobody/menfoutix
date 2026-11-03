import "../movies/management.css";
import type { Metadata } from "next";
import { AdminShell } from "../movies/AdminShell";
import { FilmsWithoutPlaylist } from "./FilmsWithoutPlaylist";
import { getFilmsWithoutPlaylist } from "../movies/films";

export const metadata: Metadata = { title: "MenFouTix — Playlists manquantes" };

export default function PlaylistsPage() {
  return (
    <AdminShell section="playlists">
      <FilmsWithoutPlaylist films={getFilmsWithoutPlaylist()} />
    </AdminShell>
  );
}
