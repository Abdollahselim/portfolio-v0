import { Heading, Paragraph, SmallText } from "@/components/ui";
import { getBlogPosts } from "@/features/blog";
import { getProjectList } from "@/features/projects";

export default async function Home(): Promise<React.ReactElement> {
  const postsResult = await getBlogPosts();
  const projectsResult = await getProjectList();

  return (
    <main className="py-10">
      <section>
        <Heading>Portfolio Pro</Heading>
        <Paragraph>Production-grade developer portfolio system.</Paragraph>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Blog</h2>
        {postsResult.success ? (
          <ul>
            {postsResult.data.map((post) => (
              <li key={post.slug}>
                <h3>{post.frontmatter.title}</h3>
                <SmallText>{post.frontmatter.description}</SmallText>
              </li>
            ))}
          </ul>
        ) : (
          <Paragraph>Unable to load blog posts.</Paragraph>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Projects</h2>
        {projectsResult.success ? (
          <ul>
            {projectsResult.data.map((project) => (
              <li key={project.slug}>
                <h3>{project.frontmatter.title}</h3>
                <SmallText>{project.frontmatter.description}</SmallText>
              </li>
            ))}
          </ul>
        ) : (
          <Paragraph>Unable to load projects.</Paragraph>
        )}
      </section>
    </main>
  );
}
