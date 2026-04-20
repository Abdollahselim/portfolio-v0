import Link from "next/link";

import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps): React.ReactElement {
  return (
    <article>
      <h2>
        <Link href={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
      </h2>
      <p>{post.frontmatter.description}</p>
      <small>{post.frontmatter.date}</small>
    </article>
  );
}
