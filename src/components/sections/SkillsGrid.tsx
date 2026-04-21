import { Badge } from "@/components/ui";

interface SkillsGridProps {
  skills: string[];
  title?: string;
}

export function SkillsGrid({
  skills,
  title = "Skills",
}: SkillsGridProps): React.ReactElement {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-[#ededed]">{title}</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
