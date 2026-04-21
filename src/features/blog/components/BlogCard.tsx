import Link from "next/link";

import { Badge } from "@/components/ui";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps): React.ReactElement {
  return (
    <article className="rounded-md border border-white/10 bg-[#111111] p-6">
      <div className="mb-5 flex flex-wrap gap-2">
        {post.frontmatter.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <h2 className="text-2xl font-bold">
        <Link href={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
      </h2>
      <p className="mt-4 text-gray-400">{post.frontmatter.description}</p>
      <small className="mt-5 block text-gray-500">{post.frontmatter.date}</small>
    </article>
  );
}
