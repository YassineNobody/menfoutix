# MenFouTix

MenFouTix est une application de découverte et de consultation de films, de séries et de collections. Elle propose deux catalogues, VF et VO, des fiches détaillées, une recherche avec filtres et des lecteurs intégrant les vidéos disponibles sur YouTube.

## Pourquoi Next.js ?

La première version reposait sur deux projets distincts : un frontend React et une API NestJS. Cette séparation nécessitait de maintenir les échanges entre les deux applications, leurs configurations et leurs déploiements.

Le projet ayant évolué vers une application principalement dédiée à la consultation d'un catalogue, une architecture réunie dans Next.js est devenue plus simple à gérer. L'interface et l'accès aux données se trouvent désormais dans un seul projet.

Les composants serveur appellent directement les services qui interrogent SQLite. Pour ces lectures, il n'est plus nécessaire de créer et de maintenir des routes d'API et des contrôleurs intermédiaires. Une route HTTP reste utilisée pour les suggestions de recherche interactives.

Ce choix vise avant tout à simplifier l'organisation du code, la maintenance et le déploiement. Il supprime un échange HTTP intermédiaire pour les lectures serveur, sans constituer à lui seul une garantie de meilleures performances : celles-ci dépendent aussi des requêtes, du cache et du rendu des pages.

## Fonctionnalités

- Catalogue VO à la racine du site et catalogue VF sous `/vf`.
- Accueil avec recommandations et carrousels de films et de séries.
- Fiches détaillées : titres, synopsis, genres, distribution et informations techniques.
- Recherche avec suggestions, filtres et pagination.
- Navigation par genre.
- Collections regroupant les films d'une même saga.
- Lecteurs YouTube pour les films et les épisodes de séries.
- Navigation entre épisodes et saisons, avec traitement des épisodes spéciaux.
- Tableaux de consultation des disponibilités VF/VO, collections et playlists manquantes.

La présence d'une vidéo dans le catalogue ne garantit pas sa lecture : celle-ci dépend de sa disponibilité et des restrictions appliquées sur YouTube.

## Technologies

- **Next.js App Router** pour les routes, le rendu serveur et les composants React.
- **React et TypeScript** pour l'interface et le typage.
- **SQLite et better-sqlite3** pour les données locales, ouvertes en lecture seule.
- **Tailwind CSS** pour les styles.
- **Embla Carousel, Motion et Radix UI** pour les interactions de l'interface.
- **TMDB** pour un enrichissement optionnel des affiches et logos anglais.

## Architecture

```text
app/                    Routes publiques, catalogue VF et pages administrateur
  api/search/suggestions/  Endpoint des suggestions de recherche
components/             Pages partagées et composants d'interface
lib/
  catalogue.ts          Gestion des versions VF/VO et des liens
  server/               Connexion SQLite et enrichissement des images TMDB
  services/             Requêtes métier : films, séries, recherche et collections
hooks/                  Hooks React
types/                 Types des données
utils/                  Fonctions utilitaires
menfoutixDB.db           Base locale nécessaire, exclue du suivi Git
```

Les pages serveur utilisent les fonctions de `lib/services/`, qui interrogent la base via `lib/server/database.ts`. La base et le token TMDB restent côté serveur ; le navigateur reçoit les données nécessaires à l'affichage.

L'application ne dépend pas de l'ancienne API NestJS. Elle ne génère pas non plus la base : un snapshot compatible doit être fourni séparément.

## Installation

### Prérequis

- Un environnement Node.js compatible avec la version de Next.js et `better-sqlite3` du projet.
- npm.
- Un fichier `menfoutixDB.db` compatible avec les requêtes du projet, comprenant notamment les collections et les disponibilités.

### Préparer le projet

```bash
npm ci
```

Placer la base à la racine du dépôt :

```text
menfoutix/
├── app/
├── lib/
├── menfoutixDB.db
└── package.json
```

Le chemin est actuellement fixé dans `lib/server/database.ts`. Un clone du dépôt ne contient pas la base : il faut obtenir le snapshot séparément. Sans ce fichier ou avec un schéma incompatible, les pages qui accèdent au catalogue ne fonctionneront pas.

### Configuration optionnelle

Pour récupérer les affiches et logos anglais depuis TMDB, créer un fichier `.env.local` :

```env
TMDB_TOKEN=remplacer_par_un_token_TMDB
```

Ce token est utilisé uniquement côté serveur. En son absence ou si TMDB ne répond pas, l'application utilise les images disponibles dans SQLite. Ne pas versionner les identifiants réels.

### Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### Compiler et lancer en production

La base doit être accessible pendant la compilation et au lancement du serveur.

```bash
npm run build
npm start
```

Certaines pages sont prérendues à la compilation. Après remplacement du snapshot SQLite, prévoir une reconstruction et un redémarrage pour actualiser les pages concernées. Le déploiement doit permettre l'exécution de Next.js côté serveur et l'accès au fichier SQLite local.

## Routes principales

| Route | Contenu |
| --- | --- |
| `/` | Accueil VO |
| `/vf` | Accueil VF |
| `/movies` | Films VO |
| `/tv-shows` | Séries VO |
| `/search` | Recherche VO |
| `/movie/:idTmdb` | Fiche d'un film |
| `/tv/:idTmdb` | Fiche d'une série |
| `/collections` | Collections |
| `/collection/:idTmdb` | Films d'une collection |
| `/genre/movie/:idGenre` | Films d'un genre |
| `/genre/tv/:idGenre` | Séries d'un genre |
| `/watch/movie/:idTmdb` | Lecteur d'un film |
| `/watch/tv/:idTmdb/s/:season/e/:episode` | Lecteur d'un épisode |

Les routes publiques ci-dessus ont leur équivalent VF en ajoutant le préfixe `/vf`.

Les tableaux de consultation sont accessibles sous `/admin/movies`, `/admin/series`, `/admin/playlists` et `/admin/collections`. Ils sont en lecture seule. Aucune authentification applicative n'est actuellement implémentée pour ces pages ; une restriction d'accès doit être prévue si ces vues doivent rester privées.
