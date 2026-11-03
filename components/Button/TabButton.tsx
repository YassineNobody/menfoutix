import { motion } from "motion/react";
import { ReactNode } from "react";

interface TabButtonProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}

export const TabButton = ({ children, active, onClick }: TabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative cursor-pointer pb-3 text-sm font-medium transition-colors ${
      active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
    }`}
  >
    {children}

    {active && (
      <motion.span
        layoutId="movie-tab"
        className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-linear-to-r from-red-600 to-red-400"
      />
    )}
  </button>
);
