"use server";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { GuestbookSchema } from "@/schemas/guestbook.schema";
import {
  addEntry,
  getEntries,
} from "@/lib/db/repositories/guestbook.repository";
import {
  checkLimit,
  recordAction,
} from "@/lib/db/repositories/rate-limit.repository";
import type { GuestbookEntry } from "@/lib/db/types";
import type { Result } from "@/types";

async function getIpHash(): Promise<string> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

export async function getGuestbookEntries(): Promise<Result<GuestbookEntry[]>> {
  return getEntries();
}

export async function addGuestbookEntry(data: unknown): Promise<Result<void>> {
  const validated = GuestbookSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, error: "Invalid entry. Name min 2 chars, message 5–300 chars." };
  }

  const ipHash = await getIpHash();
  const allowed = await checkLimit(ipHash, "guestbook", 2);

  if (!allowed) {
    return {
      success: false,
      error: "Too many entries. Please wait before trying again.",
    };
  }

  const result = await addEntry(validated.data);

  if (!result.success) {
    return result;
  }

  await recordAction(ipHash, "guestbook");
  revalidatePath("/guestbook");

  return { success: true, data: undefined };
}
