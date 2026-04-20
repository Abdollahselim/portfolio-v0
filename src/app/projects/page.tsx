import { getProjectList, ProjectList } from "@/features/projects";

export default async function ProjectsPage(): Promise<React.ReactElement> {
  const projectsResult = await getProjectList();

  return (
    <main className="py-10">
      <h1>Projects</h1>
      {projectsResult.success ? (
        <ProjectList projects={projectsResult.data} />
      ) : (
        <p>Unable to load projects.</p>
      )}
    </main>
  );
}
