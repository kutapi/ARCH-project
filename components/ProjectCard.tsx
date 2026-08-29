"use client";

import Image from "next/image";
import { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div className="flex gap-4" style={{ width: "350px" }}>
      {/* Left: Image + meta — the clickable trigger */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open ${project.title} project details`}
        className="flex flex-col gap-2 text-left focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 group"
        style={{ width: "350px" }}
      >
        {/* Image — 350×197px, 16:9 ratio */}
        <div
          className={`bg-gray-200 transition-all duration-300 overflow-hidden ${
            project.featured
              ? "ring-2 ring-blue-500"
              : "group-hover:ring-2 group-hover:ring-blue-500"
          }`}
          style={{ width: "350px", height: "197px" }}
        >
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={350}
              height={197}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>

        {/* Details Row */}
        <div className="flex items-center gap-2 px-0.5">
          {/* Thumbnail Icon */}
          <div className="w-8 h-8 bg-gray-200 shrink-0 overflow-hidden">
            {project.iconUrl ? (
              <Image
                src={project.iconUrl}
                alt={`${project.title} icon`}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          {/* Title and Location */}
          <div className="flex flex-col">
            <h3 className="font-mono font-bold text-xs leading-tight">
              {project.title}
            </h3>
            <p className="font-mono text-xs text-gray-500 leading-tight">
              {project.location}
            </p>
          </div>
        </div>
      </button>

      {/* Right: Description — vertical sideways text */}
      {project.description && (
        <div
          className="flex items-start pt-1 shrink-0"
          style={{ width: "110px" }}
        >
          <p
            className="font-mono text-[10px] text-gray-400 leading-relaxed"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              maxHeight: "197px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {project.description}
          </p>
        </div>
      )}
    </div>
  );
}
