import { getAllProjects } from "@/lib/mdx";
import type { Project, Result } from "@/types";

export async function getProjectList(): Promise<Result<Project[]>> {
  return getAllProjects();
}
