import type { Project } from "@/types";

import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({
  projects,
}: ProjectListProps): React.ReactElement {
  if (projects.length === 0) {
    return <p>No projects available.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
