"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui";

interface SkillsGridProps {
  skills: string[];
  title?: string;
}

export function SkillsGrid({
  skills,
  title = "Skills",
}: SkillsGridProps): React.ReactElement {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-[#ededed]">{title}</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={
                shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Badge>{skill}</Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
