import { CatalogueProvider } from "@/components/Catalogue/CatalogueProvider";

export default function VfLayout({ children }: { children: React.ReactNode }) {
  return <CatalogueProvider version="VF">{children}</CatalogueProvider>;
}
