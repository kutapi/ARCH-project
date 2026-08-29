"use client";

import { useState } from "react";
import { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import ProjectOverlay from "./ProjectOverlay";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 w-full max-w-7xl mx-auto py-6 md:py-8 justify-items-center">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelected(project)}
          />
        ))}
      </div>

      {/* Overlay — rendered at the top of the DOM stack */}
      {selected && (
        <ProjectOverlay
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
