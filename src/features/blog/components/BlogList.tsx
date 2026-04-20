import type { BlogPost } from "@/types";

import { BlogCard } from "./BlogCard";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps): React.ReactElement {
  if (posts.length === 0) {
    return <p>No blog posts available.</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
