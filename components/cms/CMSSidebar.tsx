"use client";

import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Hero Image", id: "hero", icon: "🖼️" },
  { label: "Projects", id: "projects", icon: "📁" },
  { label: "Employees", id: "employees", icon: "👥" },
];

export default function CMSSidebar({
  active,
  onNav,
}: {
  active: string;
  onNav: (id: string) => void;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <aside className="w-64 shrink-0 bg-[#0d0d0d] border-r border-white/[0.07] flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-7 border-b border-white/[0.07]">
        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/25 mb-1">
          CMS
        </p>
        <h1 className="font-mono text-base font-bold text-white">END Design Lab</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`cms-nav-${item.id}`}
            onClick={() => onNav(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all font-mono text-sm ${
              active === item.id
                ? "bg-white text-black font-bold"
                : "text-white/50 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.07]">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/30 hover:text-white/60 transition-colors font-mono text-xs mb-1"
        >
          ↗ View Website
        </a>
        <button
          id="cms-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all font-mono text-sm"
        >
          <span>⎋</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
