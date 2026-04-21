import { ownerConfig } from "@/config/portfolio.config";
import type { Result } from "@/types";

export type OwnerProfile = typeof ownerConfig;

export function getOwnerProfile(): Result<OwnerProfile> {
  return {
    success: true,
    data: ownerConfig,
  };
}
