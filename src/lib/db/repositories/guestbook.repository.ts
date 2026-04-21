import { getServerDb } from "../client";
import type { GuestbookEntry } from "../types";
import type { Result } from "@/types";

export interface GuestbookInput {
  name: string;
  message: string;
}

export async function getEntries(): Promise<Result<GuestbookEntry[]>> {
  try {
    const db = getServerDb();

    const { data, error } = await db
      .from("guestbook_entries")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("guestbook_entries select error:", error.code);
      return { success: false, error: "Failed to load entries." };
    }

    return { success: true, data: data ?? [] };
  } catch {
    return { success: false, error: "Service unavailable." };
  }
}

export async function addEntry(
  input: GuestbookInput,
): Promise<Result<void>> {
  try {
    const db = getServerDb();

    const { error } = await db
      .from("guestbook_entries")
      .insert({ name: input.name, message: input.message });

    if (error) {
      console.error("guestbook_entries insert error:", error.code);
      return { success: false, error: "Failed to add entry. Please try again." };
    }

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Service unavailable. Please try again." };
  }
}
