import WatchSeriesPage from "@/components/Pages/WatchSeriesPage";
export { metadata } from "@/components/Pages/WatchSeriesPage";

interface Props {
  params: Promise<{ idTmdb: string; season: string; episode: string }>;
}

export default function Page(props: Props) {
  return <WatchSeriesPage {...props} />;
}
