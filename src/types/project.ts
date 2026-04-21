import type { MdxContent, MdxFrontmatter } from "./content";

export interface ProjectFrontmatter extends MdxFrontmatter {
  platform: string;
  url: string;
}

export type Project = MdxContent<ProjectFrontmatter>;
