"use client";

import { useId, useState, type ReactNode } from "react";

export function DetailTabs({ overview, details, label }: {
  overview: ReactNode;
  details: ReactNode;
  label: string;
}) {
  const [tab, setTab] = useState<"overview" | "details">("overview");
  const id = useId();
  return (
    <section className="min-w-0 flex-1" aria-label={label}>
      <div className="mb-6 flex gap-6 border-b border-white/10">
        {(["overview", "details"] as const).map((name) => (
          <button key={name} type="button" aria-pressed={tab === name} aria-controls={`${id}-content`}
            onClick={() => setTab(name)}
            className={`relative min-h-11 border-b-2 pb-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-red-500 ${tab === name ? "border-red-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>
            {name === "overview" ? "Overview" : "Details"}
          </button>
        ))}
      </div>
      <div id={`${id}-content`}>{tab === "overview" ? overview : details}</div>
    </section>
  );
}
