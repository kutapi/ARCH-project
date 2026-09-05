"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CMSSidebar from "@/components/cms/CMSSidebar";
import HeroImageEditor from "@/components/cms/HeroImageEditor";
import ProjectsEditor from "@/components/cms/ProjectsEditor";
import EmployeesEditor from "@/components/cms/EmployeesEditor";
import type { CmsData } from "@/lib/cms-data";

export default function DashboardPage() {
  const [active, setActive] = useState("hero");
  const [data, setData] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      // Fetch all three in parallel
      const [heroRes, projectsRes, employeesRes] = await Promise.all([
        fetch("/api/admin/hero", { cache: "no-store" }),
        fetch("/api/admin/projects", { cache: "no-store" }),
        fetch("/api/admin/employees", { cache: "no-store" }),
      ]);

      // If any returns 401, session expired — redirect to login
      if (heroRes.status === 401 || projectsRes.status === 401 || employeesRes.status === 401) {
        router.push("/admin");
        return;
      }

      const [heroData, projectsData, employeesData] = await Promise.all([
        heroRes.json(),
        projectsRes.json(),
        employeesRes.json(),
      ]);

      setData({
        heroImage: heroData.heroImage ?? "",
        projects: projectsData.projects ?? [],
        employees: employeesData.employees ?? [],
      });
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          <p className="font-mono text-xs text-white/30">Loading CMS…</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <CMSSidebar active={active} onNav={setActive} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
              {active === "hero" ? "Hero Image" : active === "projects" ? "Projects" : "Employees"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">Live</span>
          </div>
        </div>

        {/* Panel */}
        <div className="px-8 py-8 max-w-4xl">
          {active === "hero" && <HeroImageEditor initialImage={data.heroImage} />}
          {active === "projects" && <ProjectsEditor initialProjects={data.projects} />}
          {active === "employees" && <EmployeesEditor initialEmployees={data.employees} />}
        </div>
      </main>
    </div>
  );
}
