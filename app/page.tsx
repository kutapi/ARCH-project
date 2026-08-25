import Navbar from "@/components/Navbar";
import CTASection from "@/components/CTASection";
import ProjectGrid from "@/components/ProjectGrid";
import { getProjects } from "@/lib/projects";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 md:px-8 overflow-y-auto">
        <ProjectGrid projects={projects} />
      </main>
      <CTASection />
    </>
  );
}
