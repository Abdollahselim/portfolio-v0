import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps): React.ReactElement {
  return (
    <article>
      <h2>{project.frontmatter.title}</h2>
      <p>{project.frontmatter.description}</p>
      <small>{project.frontmatter.date}</small>
    </article>
  );
}
