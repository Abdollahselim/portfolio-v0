import { getServerDb } from "../client";
import type { ContactFormData } from "@/schemas";
import type { Result } from "@/types";

export async function saveContact(
  data: ContactFormData,
): Promise<Result<void>> {
  try {
    const db = getServerDb();

    const { error } = await db.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      budget: data.budget ?? null,
    });

    if (error) {
      console.error("contact_submissions insert error:", error.code);
      return { success: false, error: "Failed to send message. Please try again." };
    }

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Service unavailable. Please try again." };
  }
}
