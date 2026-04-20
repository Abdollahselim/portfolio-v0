import { z } from "zod";

export const BlogFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.string().datetime(),
    tags: z.array(z.string().min(1)),
  })
  .strict();
