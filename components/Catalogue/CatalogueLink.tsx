"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { catalogueHref } from "@/lib/catalogue";
import { useCatalogueVersion } from "./CatalogueProvider";

export default function CatalogueLink({ href, ...props }: ComponentProps<typeof Link>) {
  const version = useCatalogueVersion();
  const destination = typeof href === "string"
    ? catalogueHref(href, version)
    : { ...href, pathname: href.pathname ? catalogueHref(href.pathname, version) : href.pathname };
  return <Link {...props} href={destination} />;
}
