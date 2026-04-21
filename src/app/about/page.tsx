import { Badge } from "@/components/ui";
import { getOwnerProfile } from "@/features/profile";

export default function AboutPage(): React.ReactElement {
  const ownerResult = getOwnerProfile();

  if (!ownerResult.success) {
    return (
      <main className="px-4 py-20">
        <p>Unable to load profile.</p>
      </main>
    );
  }

  const owner = ownerResult.data;
  const skills = [...owner.platforms, ...owner.skills, ...owner.marketing];

  return (
    <main className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">
          About
        </p>
        <h1 className="mt-3 text-4xl font-bold">{owner.name}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-400">
          {owner.role} based in {owner.location}, focused on building
          high-impact e-commerce stores across Egypt and Saudi Arabia. His work
          connects implementation, marketing awareness, platform operations, and
          conversion-focused customer journeys.
        </p>

        <section className="mt-16">
          <h2 className="text-3xl font-bold">Skills</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold">Experience Timeline</h2>
          <div className="mt-6 grid gap-4">
            <article className="rounded-md border border-white/10 bg-[#111111] p-6">
              <h3 className="text-xl font-bold">4+ years in e-commerce</h3>
              <p className="mt-3 text-gray-400">
                Built and improved storefronts, booking flows, payment
                integrations, and platform operations for real businesses.
              </p>
            </article>
            <article className="rounded-md border border-white/10 bg-[#111111] p-6">
              <h3 className="text-xl font-bold">Egypt & Saudi Arabia focus</h3>
              <p className="mt-3 text-gray-400">
                Delivered commerce experiences shaped around regional platforms,
                customer behavior, and business goals.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
