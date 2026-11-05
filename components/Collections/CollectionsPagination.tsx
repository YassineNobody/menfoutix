"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination/Pagination";

interface Props {
  page: number;
  pages: number;
  query: string;
}

export function CollectionsPagination({ page, pages, query }: Props) {
  const router = useRouter();

  function changePage(nextPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", String(nextPage));
    router.push(`/collections?${params}`);
  }

  return <Pagination page={page} pages={pages} onPageChange={changePage} />;
}
