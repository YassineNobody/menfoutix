import GenreMoviesPage from "@/components/Pages/GenreMoviesPage";
export { metadata } from "@/components/Pages/GenreMoviesPage";

interface Props {
  params: Promise<{ idGenre: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function Page(props: Props) {
  return <GenreMoviesPage {...props} version="VF" />;
}
