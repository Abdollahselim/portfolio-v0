"use client";

import Link from "next/link";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps): React.ReactElement {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">Error</p>
      <h1 className="mt-3 text-4xl font-bold text-[#ededed]">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-400">
        We encountered an unexpected problem. Please try again.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          className="rounded-md border border-white/10 bg-[#111111] px-5 py-2.5 text-sm font-medium text-[#ededed] transition-colors hover:bg-[#1a1a1a]"
          type="button"
          onClick={reset}
        >
          Try again
        </button>
        <Link
          className="rounded-md border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:text-[#ededed]"
          href="/"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
