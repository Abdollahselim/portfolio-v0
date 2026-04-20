import type { MdxContent, MdxFrontmatter } from "./content";

export type BlogFrontmatter = MdxFrontmatter;

export type BlogPost = MdxContent<BlogFrontmatter>;
