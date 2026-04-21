"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";

import { ContactFormSchema } from "@/schemas";
import { saveContact } from "@/lib/db/repositories/contact.repository";
import {
  checkLimit,
  recordAction,
} from "@/lib/db/repositories/rate-limit.repository";
import type { Result } from "@/types";

async function getIpHash(): Promise<string> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

export async function submitContact(data: unknown): Promise<Result<void>> {
  const validated = ContactFormSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, error: "Invalid form data. Please review all fields." };
  }

  const ipHash = await getIpHash();
  const allowed = await checkLimit(ipHash, "contact", 3);

  if (!allowed) {
    return {
      success: false,
      error: "Too many submissions. Please wait before trying again.",
    };
  }

  const result = await saveContact(validated.data);

  if (!result.success) {
    return result;
  }

  await recordAction(ipHash, "contact");

  return { success: true, data: undefined };
}
