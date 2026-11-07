"use client";

import { useState } from "react";
import { normalizeSearch } from "./normalize-search";
import type { FilmPlaylist, WorkVersion } from "../movies/film-types";

type Props = { films: FilmPlaylist[] };

export const FilmsWithoutPlaylist = ({ films }: Props) => {
  const [versionState, setVersionState] = useState<WorkVersion>("VF");
  const [search, setSearch] = useState("");
  const [descending, setDescending] = useState(false);
  const versionFilms = films.filter((film) => film.version === versionState);
  const filteredFilms = versionFilms
    .filter(
      (film) =>
        normalizeSearch(film.titleFr).includes(normalizeSearch(search.trim())) ||
        normalizeSearch(film.titleEn || "").includes(normalizeSearch(search.trim())) ||
        String(film.id).includes(search),
    )
    .sort(
      (a, b) =>
        (descending ? -1 : 1) * a.titleFr.localeCompare(b.titleFr, "fr"),
    );

  return (
    <section
      className="panel"
      id="playlists"
      aria-labelledby="playlist-heading"
    >
      <div className="panel-heading">
        <div>
          <div className="eyebrow">CONTRÔLE DU CATALOGUE</div>
          <h2 id="playlist-heading">
            Films sans playlist{" "}
            <span className="number-tag">{films.length}</span>
          </h2>
        </div>
        <span className="warning-label">
          <span /> Association manquante
        </span>
      </div>
      <div className="table-toolbar">
        <div
          className="version-switch"
          role="group"
          aria-label="Version des films"
        >
          {(["VF", "VO"] as const).map((version) => (
            <button
              type="button"
              key={version}
              aria-pressed={version === versionState}
              className={version === versionState ? "selected" : ""}
              onClick={() => setVersionState(version)}
            >
              {version}
              <span>
                {films.filter((film) => film.version === version).length}
              </span>
            </button>
          ))}
        </div>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">
            Rechercher un film par titre ou identifiant
          </span>
          <input
            type="text"
            inputMode="search"
            placeholder="Rechercher un titre ou un ID…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      <div className="table-scroll">
        <table>
          <caption className="sr-only">
            Films disposant d’une vidéo {versionState} sans playlist associée
            dans cette version
          </caption>
          <thead>
            <tr>
              <th scope="col" className="row-number">
                #
              </th>
              <th scope="col">ID ŒUVRE</th>
              <th
                scope="col"
                aria-sort={descending ? "descending" : "ascending"}
              >
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => setDescending(!descending)}
                >
                  TITRE DU FILM{" "}
                  <span aria-hidden="true">{descending ? "↓" : "↑"}</span>
                  <span className="sr-only"> — inverser le tri</span>
                </button>
              </th>
              <th scope="col">VERSION</th>
              <th scope="col">PLAYLIST</th>
            </tr>
          </thead>
          <tbody>
            {filteredFilms.length ? (
              filteredFilms.map((film, index) => (
                <tr key={`${film.id}-${film.version}`}>
                  <td className="row-number">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="id-cell">#{film.id}</td>
                  <td className="title-cell">{film.titleFr}{film.titleEn && film.titleEn !== film.titleFr ? ` — ${film.titleEn}` : ""}</td>
                  <td>
                    <span
                      className={`version-badge ${film.version.toLowerCase()}`}
                    >
                      {film.version}
                    </span>
                  </td>
                  <td>
                    <span className="missing-status">
                      <span /> Non associée
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty-state">
                  {versionFilms.length
                    ? "Aucun film ne correspond à votre recherche."
                    : "Tous les films de cette version ont une playlist."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer" aria-live="polite">
        <span>
          <strong>{filteredFilms.length}</strong> résultat
          {filteredFilms.length > 1 ? "s" : ""} sur {versionFilms.length} films
          en {versionState}
        </span>
        <span>Tri : titre {descending ? "Z → A" : "A → Z"}</span>
      </div>
    </section>
  );
};
