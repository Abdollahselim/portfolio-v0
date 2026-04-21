import { BlogList, getBlogPosts } from "@/features/blog";

export default async function BlogPage(): Promise<React.ReactElement> {
  const postsResult = await getBlogPosts();

  return (
    <main className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">
          Writing
        </p>
        <h1 className="mt-3 text-4xl font-bold">Blog</h1>
        <div className="mt-10">
      {postsResult.success ? (
        <BlogList posts={postsResult.data} />
      ) : (
        <p>Unable to load blog posts.</p>
      )}
        </div>
      </div>
    </main>
  );
}
