"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CatalogueVersion } from "@/lib/catalogue";

const CatalogueContext = createContext<CatalogueVersion>("VO");

export function CatalogueProvider({ version, children }: { version: CatalogueVersion; children: ReactNode }) {
  return <CatalogueContext.Provider value={version}>{children}</CatalogueContext.Provider>;
}

export function useCatalogueVersion() {
  return useContext(CatalogueContext);
}
