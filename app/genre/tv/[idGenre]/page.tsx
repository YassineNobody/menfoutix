import GenreSeriesPage from "@/components/Pages/GenreSeriesPage";
export { metadata } from "@/components/Pages/GenreSeriesPage";

interface Props {
  params: Promise<{ idGenre: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function Page(props: Props) {
  return <GenreSeriesPage {...props} />;
}
