import WatchMoviePage from "@/components/Pages/WatchMoviePage";
export { metadata } from "@/components/Pages/WatchMoviePage";

interface Props {
  params: Promise<{ idTmdb: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function Page(props: Props) {
  return <WatchMoviePage {...props} />;
}
