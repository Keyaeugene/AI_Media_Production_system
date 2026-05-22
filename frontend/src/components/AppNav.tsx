"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Plus, List } from "lucide-react";

const links = [
  { href: "/jobs", label: "Jobs", icon: List },
  { href: "/jobs/new", label: "New Job", icon: Plus },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass-heavy">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center shadow-glow transition-shadow duration-300 group-hover:shadow-[0_0_28px_rgba(139,92,246,0.5)]">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text tracking-tight">
            AI Media
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
