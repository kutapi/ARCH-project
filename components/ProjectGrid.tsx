"use client";

import { useState, useEffect, useRef } from "react";
import { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import ProjectOverlay from "./ProjectOverlay";
import anime from "animejs";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      anime({
        targets: gridRef.current.children,
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutCubic",
        delay: anime.stagger(150),
      });
    }
  }, [projects]);

  return (
    <>
      <div 
        ref={gridRef}
        className="grid grid-cols-1 gap-4 w-full max-w-7xl mx-auto py-6 md:py-8 justify-items-center"
      >
        {projects.map((project) => (
          <div key={project.id} style={{ opacity: 0 }} className="w-full max-w-[800px]">
            <ProjectCard
              project={project}
              onClick={() => setSelected(project)}
            />
          </div>
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
