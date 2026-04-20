"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
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
    <main>
      <h1>Something went wrong.</h1>
      <p>We encountered an unexpected problem. Please try again.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
