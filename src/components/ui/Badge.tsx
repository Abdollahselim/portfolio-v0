import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps): React.ReactElement {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-[#1f2937] px-3 py-1 text-sm text-gray-200">
      {children}
    </span>
  );
}
