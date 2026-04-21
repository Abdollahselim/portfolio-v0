import { z } from "zod";

export const ProjectFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.string().datetime(),
    tags: z.array(z.string().min(1)),
    platform: z.string().min(1),
    url: z.string().url(),
  })
  .strict();
