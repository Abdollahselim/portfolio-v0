import { z } from "zod";

export const ContactFormSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    message: z.string().min(10).max(1000),
  })
  .strict();

export type ContactFormData = z.infer<typeof ContactFormSchema>;
