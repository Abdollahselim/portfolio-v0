import { Badge, Button } from "@/components/ui";

interface SectionProjectCardProps {
  description: string;
  href: string;
  platform: string;
  title: string;
}

export function ProjectCard({
  description,
  href,
  platform,
  title,
}: SectionProjectCardProps): React.ReactElement {
  return (
    <article className="rounded-md border border-white/10 bg-[#111111] p-6">
      <div className="mb-5">
        <Badge>{platform}</Badge>
      </div>
      <h3 className="text-2xl font-bold text-[#ededed]">{title}</h3>
      <p className="mt-4 text-gray-400">{description}</p>
      <div className="mt-6">
        <Button href={href} variant="ghost">
          Visit project
        </Button>
      </div>
    </article>
  );
}
