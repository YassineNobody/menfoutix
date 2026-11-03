"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { NavbarContent } from "./NavbarContent";

function PublicNavbar() {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return null;
  }

  return <NavbarContent />;
}

export function Navbar() {
  return (
    <Suspense fallback={null}>
      <PublicNavbar />
    </Suspense>
  );
}
