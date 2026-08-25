import Image from "next/image";
import { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2" style={{ width: "350px" }}>
      {/* Image — 350×197px, 16:9 ratio */}
      <div
        className={`bg-gray-200 transition-all duration-300 overflow-hidden ${
          project.featured
            ? "ring-2 ring-blue-500"
            : "hover:ring-2 hover:ring-blue-500"
        }`}
        style={{ width: "350px", height: "197px" }}
      >
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            width={350}
            height={197}
            className="w-full h-full object-cover"
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
    </div>
  );
}

