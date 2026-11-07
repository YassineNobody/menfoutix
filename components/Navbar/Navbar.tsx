"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { CatalogueProvider } from "@/components/Catalogue/CatalogueProvider";
import { versionFromPath } from "@/lib/catalogue";
import { NavbarContent } from "./NavbarContent";

function PublicNavbar() {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return null;
  }

  return <CatalogueProvider version={versionFromPath(pathname)}><NavbarContent key={versionFromPath(pathname)} /></CatalogueProvider>;
}

export function Navbar() {
  return (
    <Suspense fallback={null}>
      <PublicNavbar />
    </Suspense>
  );
}
