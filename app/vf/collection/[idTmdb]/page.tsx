import CollectionPage from "@/components/Pages/CollectionPage";
export { metadata } from "@/components/Pages/CollectionPage";

interface Props {
  params: Promise<{ idTmdb: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function Page(props: Props) {
  return <CollectionPage {...props} version="VF" />;
}
