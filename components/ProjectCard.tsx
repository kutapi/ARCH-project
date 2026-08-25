import Image from "next/image";
import { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Large Image (Placeholder) */}
      <div 
        className={`w-full aspect-[16/10] bg-gray-200 transition-all duration-300 ${
          project.featured ? "border-4 border-blue-500" : "hover:border-4 hover:border-blue-500 border-4 border-transparent"
        }`}
      >
        {project.imageUrl && (
          <Image 
            src={project.imageUrl} 
            alt={project.title} 
            width={1200} 
            height={675}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Details Row */}
      <div className="flex items-center gap-3 px-1">
        {/* Thumbnail Icon */}
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 shrink-0">
          {project.iconUrl && (
            <Image 
              src={project.iconUrl} 
              alt={`${project.title} icon`} 
              width={64} 
              height={64}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Title and Location */}
        <div className="flex flex-col">
          <h3 className="font-mono font-bold text-sm md:text-base leading-tight">
            {project.title}
          </h3>
          <p className="font-mono font-bold text-xs md:text-sm leading-tight">
            {project.location}
          </p>
        </div>
      </div>
    </div>
  );
}
