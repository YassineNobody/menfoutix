"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import { Clapperboard, Menu, Search, Tv2, X, type LucideIcon } from "lucide-react";

import { NavbarSearch } from "./NavbarSearch";

const links = [
  { href: "/movies", label: "Movies", icon: Clapperboard },
  { href: "/tv-shows", label: "Series", icon: Tv2 },
  { href: "/search", label: "Search", icon: Search },
];

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  mobile?: boolean;
  onClick?: () => void;
}

function NavigationLink({ href, label, icon: Icon, mobile, onClick, active = false }: NavItemProps & { active?: boolean }) {
  return <Link href={href} onClick={onClick} aria-current={active ? "page" : undefined}
    className={mobile
      ? `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm focus-visible:outline-2 focus-visible:outline-red-500 ${active ? "bg-red-600/15 text-white" : "text-zinc-300 hover:bg-white/10"}`
      : `inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-red-500 ${active ? "bg-white/10 font-medium text-white" : "text-zinc-400"}`}>
    <Icon size={mobile ? 17 : 16} aria-hidden="true" />{label}
  </Link>;
}

function ActiveNavigationLink(props: NavItemProps) {
  const pathname = usePathname();
  const active = props.href === "/movies"
    ? ["/movies", "/movie/", "/genre/movie/", "/watch/movie/"].some((path) => pathname === path || pathname.startsWith(path.endsWith("/") ? path : `${path}/`))
    : props.href === "/tv-shows"
      ? pathname === "/tv-shows" || pathname.startsWith("/tv/") || pathname.startsWith("/genre/tv/") || pathname.startsWith("/watch/tv/")
      : pathname === "/search";
  return <NavigationLink {...props} active={active} />;
}

function NavItem(props: NavItemProps) {
  // Seule la surbrillance dépend du chemin ; le reste du header reste stable.
  return <Suspense fallback={<NavigationLink {...props} />}><ActiveNavigationLink {...props} /></Suspense>;
}

function CloseMenuOnNavigation({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  useEffect(() => { onNavigate(); }, [pathname, onNavigate]);
  return null;
}

export function NavbarContent() {
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);
  const menuId = useId();
  const container = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) closeMenu();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { closeMenu(); button.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open, closeMenu]);

  return (
    <nav aria-label="Main navigation" className="relative w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <Suspense fallback={null}><CloseMenuOnNavigation onNavigate={closeMenu} /></Suspense>
      <div className="relative mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:gap-5 lg:px-8">
        <Link href="/" onClick={closeMenu} aria-label="MenFouTix home" className="shrink-0 rounded-md text-xl font-black tracking-tight focus-visible:outline-2 focus-visible:outline-red-500 md:text-2xl">
          <span className="text-red-500">MenFou</span><span className="text-white">Tix</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => <NavItem key={link.href} {...link} />)}
        </div>
        <div className="min-w-0 flex-1" />
        <NavbarSearch />
        <div ref={container} className="relative lg:hidden">
          <button ref={button} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls={menuId}
            onClick={() => setOpen((value) => !value)} className="flex size-11 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-red-500">
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
          {open && <div id={menuId} className="absolute right-0 top-full mt-3 w-48 rounded-xl border border-white/15 bg-zinc-950 p-1 shadow-2xl">
            {links.map((link) => <NavItem key={link.href} {...link} mobile onClick={closeMenu} />)}
          </div>}
        </div>
      </div>
    </nav>
  );
}
