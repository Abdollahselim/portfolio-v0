import { z } from "zod";

export const ContactFormSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    subject: z.string().min(2).max(120),
    message: z.string().min(10).max(1000),
    budget: z.string().max(80).optional(),
  })
  .strict();

export type ContactFormData = z.infer<typeof ContactFormSchema>;
