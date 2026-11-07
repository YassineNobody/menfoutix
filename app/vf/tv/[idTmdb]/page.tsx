import SeriesDetailPage from "@/components/Pages/SeriesDetailPage";
export { metadata } from "@/components/Pages/SeriesDetailPage";

interface Props {
  params: Promise<{ idTmdb: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function Page(props: Props) {
  return <SeriesDetailPage {...props} version="VF" />;
}
