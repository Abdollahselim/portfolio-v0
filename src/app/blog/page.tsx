import { BlogList, getBlogPosts } from "@/features/blog";

export default async function BlogPage(): Promise<React.ReactElement> {
  const postsResult = await getBlogPosts();

  return (
    <main className="py-10">
      <h1>Blog</h1>
      {postsResult.success ? (
        <BlogList posts={postsResult.data} />
      ) : (
        <p>Unable to load blog posts.</p>
      )}
    </main>
  );
}
