import { getServerDb } from "../client";

const WINDOW_MS = 60 * 60 * 1000;

export async function checkLimit(
  ipHash: string,
  action: string,
  maxPerHour: number,
): Promise<boolean> {
  try {
    const db = getServerDb();
    const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

    const { count, error } = await db
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("action", action)
      .gte("created_at", windowStart);

    if (error) return true;

    return (count ?? 0) < maxPerHour;
  } catch {
    return true;
  }
}

export async function recordAction(
  ipHash: string,
  action: string,
): Promise<void> {
  try {
    const db = getServerDb();
    await db.from("rate_limits").insert({ ip_hash: ipHash, action });
  } catch {
    // Silent — rate limit recording is best-effort
  }
}
