"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Agent", href: "/agent" },
  { name: "Graph", href: "/graph" },
  { name: "Quarantine", href: "/quarantine" },
  { name: "Events", href: "/events" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="relative z-20 w-full">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="h-7 w-7 rounded-md" style={{ background: "var(--mg-gradient)" }} />
          <span className="mg-gradient-text text-lg font-medium tracking-tight">MemGuard</span>
        </Link>

        <nav className="flex min-w-0 flex-1 justify-start sm:justify-center gap-1 overflow-x-auto [scrollbar-width:none] sm:gap-4 lg:gap-10">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative whitespace-nowrap px-2 py-1 text-[13px] transition-colors",
                  active ? "text-white" : "text-white/55 hover:text-white"
                )}
              >
                {item.name}
                {active && (
                  <span
                    className="absolute -bottom-1 left-2 right-2 h-px"
                    style={{ background: "var(--mg-gradient)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/attack-lab"
          className={cn(
            "mg-pill-outline hidden shrink-0 sm:inline-flex",
            pathname.startsWith("/attack-lab") && "border-white/80 bg-white/10"
          )}
        >
          Attack Lab
        </Link>
      </div>
      {/* Attack Lab stays reachable on phones, where the outline pill is hidden */}
      <div className="flex justify-center pb-2 sm:hidden">
        <Link href="/attack-lab" className="mg-pill-outline py-1.5 text-xs">
          Attack Lab
        </Link>
      </div>
    </header>
  );
}
