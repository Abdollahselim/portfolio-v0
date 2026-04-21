import { BlogPostContent, getBlogPost, getBlogPosts } from "@/features/blog";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const postsResult = await getBlogPosts();

  if (!postsResult.success) {
    return [];
  }

  return postsResult.data.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const postResult = await getBlogPost(slug);

  if (!postResult.success) {
    return (
      <main className="px-4 py-20">
        <h1>Blog post unavailable</h1>
        <p>Unable to load this blog post.</p>
      </main>
    );
  }

  return <BlogPostContent post={postResult.data} />;
}
