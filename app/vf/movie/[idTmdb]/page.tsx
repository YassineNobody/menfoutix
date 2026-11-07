import MoviePage from "@/components/Pages/MoviePage";
export { metadata } from "@/components/Pages/MoviePage";

interface Props {
  params: Promise<{ idTmdb: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function Page(props: Props) {
  return <MoviePage {...props} version="VF" />;
}
