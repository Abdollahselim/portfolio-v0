export interface MdxFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
}

export interface MdxContent<TFrontmatter extends MdxFrontmatter> {
  slug: string;
  frontmatter: TFrontmatter;
  content: string;
}
