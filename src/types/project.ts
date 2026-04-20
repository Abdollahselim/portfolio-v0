import type { MdxContent, MdxFrontmatter } from "./content";

export type ProjectFrontmatter = MdxFrontmatter;

export type Project = MdxContent<ProjectFrontmatter>;
