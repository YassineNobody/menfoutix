import CollectionsPage from "@/components/Pages/CollectionsPage";
export { metadata } from "@/components/Pages/CollectionsPage";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function Page(props: Props) {
  return <CollectionsPage {...props} />;
}
