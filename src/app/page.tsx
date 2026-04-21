import { CopyEmailButton } from "@/components/sections/CopyEmailButton";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { getProjectList } from "@/features/projects";
import { getOwnerProfile } from "@/features/profile";

const marqueeItems = [
  "WordPress",
  "⭐",
  "Shopify",
  "⭐",
  "Salla",
  "⭐",
  "Zid",
  "⭐",
  "Next.js",
  "⭐",
  "Performance",
  "⭐",
  "SEO",
  "⭐",
  "Conversion",
  "⭐",
];

export default async function Home(): Promise<React.ReactElement> {
  const ownerResult = getOwnerProfile();
  const projectsResult = await getProjectList();

  if (!ownerResult.success) {
    return (
      <main className="px-4 py-20">
        <p>Unable to load profile.</p>
      </main>
    );
  }

  const owner = ownerResult.data;
  const skills = [...owner.platforms, ...owner.skills, ...owner.marketing];
  const featuredProjects = projectsResult.success
    ? projectsResult.data.slice(0, 4)
    : [];

  return (
    <main>
      <Hero
        email={owner.email}
        location={owner.location}
        role={owner.role}
        tagline={owner.tagline}
      />

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">
                Showcase
              </p>
              <h2 className="mt-3 text-4xl font-bold">Selected Projects</h2>
            </div>
            <p className="max-w-xl text-gray-400">
              Stores and platforms built for clearer journeys, faster decisions,
              and stronger customer trust.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                description={project.frontmatter.description}
                href={project.frontmatter.url}
                platform={project.frontmatter.platform}
                title={project.frontmatter.title}
              />
            ))}
          </div>
        </div>
      </section>

      <SkillsGrid skills={skills} title="Platforms & Skills" />
      <Marquee items={marqueeItems} />

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl rounded-md border border-white/10 bg-[#111111] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">
            About
          </p>
          <h2 className="mt-3 text-4xl font-bold">Built for commerce impact.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-400">
            Abdullah has spent {owner.yearsOfExperience} years building and
            improving e-commerce experiences across Egypt and Saudi Arabia,
            combining storefront implementation with performance, SEO, payment
            flow, and conversion thinking.
          </p>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold">Ready to build the next store?</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-400">
            Reach out directly at {owner.email}.
          </p>
          <div className="mt-8">
            <CopyEmailButton email={owner.email} />
          </div>
        </div>
      </section>
    </main>
  );
}
