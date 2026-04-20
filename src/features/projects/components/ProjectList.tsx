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
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
