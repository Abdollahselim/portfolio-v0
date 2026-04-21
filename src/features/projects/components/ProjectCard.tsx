import { Badge, Button } from "@/components/ui";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps): React.ReactElement {
  return (
    <article className="rounded-md border border-white/10 bg-[#111111] p-6">
      <Badge>{project.frontmatter.platform}</Badge>
      <h2 className="mt-5 text-2xl font-bold">{project.frontmatter.title}</h2>
      <p className="mt-4 text-gray-400">{project.frontmatter.description}</p>
      <div className="mt-6">
        <Button href={project.frontmatter.url} variant="ghost">
          Visit project
        </Button>
      </div>
    </article>
  );
}
