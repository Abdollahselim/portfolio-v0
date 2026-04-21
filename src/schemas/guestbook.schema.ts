import { z } from "zod";

export const GuestbookSchema = z.object({
  name: z.string().min(2).max(50),
  message: z.string().min(5).max(300),
});

export type GuestbookFormData = z.infer<typeof GuestbookSchema>;
