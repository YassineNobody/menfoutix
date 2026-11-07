import SearchPage from "@/components/Pages/SearchPage";
export { metadata } from "@/components/Pages/SearchPage";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function Page(props: Props) {
  return <SearchPage {...props} version="VF" />;
}
