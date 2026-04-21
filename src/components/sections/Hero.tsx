import { Badge, Button } from "@/components/ui";

interface HeroProps {
  email: string;
  location: string;
  role: string;
  tagline: string;
}

export function Hero({
  email,
  location,
  role,
  tagline,
}: HeroProps): React.ReactElement {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <div className="mb-6 flex flex-wrap gap-3">
            <Badge>{location}</Badge>
            <Badge>{role}</Badge>
          </div>
          <h1 className="text-6xl font-bold tracking-tight text-[#ededed] lg:text-8xl">
            Abdullah
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-400">
            {tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/projects">View projects</Button>
            <Button href={`mailto:${email}`} variant="ghost">
              Start a project
            </Button>
          </div>
        </div>

        <aside className="rounded-md border border-white/10 bg-[#111111] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
            Profile
          </p>
          <h2 className="mt-4 text-2xl font-bold">Abdullah Mahmoud Selim</h2>
          <p className="mt-2 text-gray-400">{location}</p>
          <p className="mt-6 flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            Available for selected e-commerce builds
          </p>
        </aside>
      </div>
    </section>
  );
}
