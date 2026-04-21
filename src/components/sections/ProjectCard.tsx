"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      className="rounded-md border border-white/10 bg-[#111111] p-6"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
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
    </motion.article>
  );
}
