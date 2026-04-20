import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import type { BlogPost, Result } from "@/types";

export async function getBlogPosts(): Promise<Result<BlogPost[]>> {
  return getAllPosts();
}

export async function getBlogPost(slug: string): Promise<Result<BlogPost>> {
  return getPostBySlug(slug);
}
