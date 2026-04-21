import { MDXRemote } from "next-mdx-remote/rsc";

import { Badge } from "@/components/ui";
import type { BlogPost } from "@/types";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({
  post,
}: BlogPostContentProps): React.ReactElement {
  return (
    <article className="mx-auto max-w-3xl px-4 py-20">
      <div className="mb-6 flex flex-wrap gap-2">
        {post.frontmatter.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <h1 className="text-5xl font-bold tracking-tight">
        {post.frontmatter.title}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-gray-400">
        {post.frontmatter.description}
      </p>
      <div className="mt-10 space-y-5 text-lg leading-relaxed text-gray-300">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
