import { getAllPosts } from "@/lib/mdx";
import type { BlogPost, Result } from "@/types";

export async function getBlogPosts(): Promise<Result<BlogPost[]>> {
  return getAllPosts();
}
