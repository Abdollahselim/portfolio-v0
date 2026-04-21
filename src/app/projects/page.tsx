import type { Metadata } from "next";
import { getProjectList, ProjectList } from "@/features/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "E-commerce and web systems built across Egypt and Saudi Arabia using WordPress, Shopify, Salla, Zid, and Next.js.",
};

export default async function ProjectsPage(): Promise<React.ReactElement> {
  const projectsResult = await getProjectList();

  return (
    <main className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">
          Work
        </p>
        <h1 className="mt-3 text-4xl font-bold">Projects</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          E-commerce and web systems built across Egypt and Saudi Arabia.
        </p>
        <div className="mt-10">
      {projectsResult.success ? (
        <ProjectList projects={projectsResult.data} />
      ) : (
        <p>Unable to load projects.</p>
      )}
        </div>
      </div>
    </main>
  );
}
