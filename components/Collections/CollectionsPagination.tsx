"use client";

import { catalogueHref } from "@/lib/catalogue";
import { useCatalogueVersion } from "@/components/Catalogue/CatalogueProvider";

import { useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination/Pagination";

interface Props {
  page: number;
  pages: number;
  query: string;
}

export function CollectionsPagination({ page, pages, query }: Props) {
  const router = useRouter();
  const version = useCatalogueVersion();

  function changePage(nextPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", String(nextPage));
    router.push(catalogueHref(`/collections?${params}`, version));
  }

  return <Pagination page={page} pages={pages} onPageChange={changePage} />;
}
