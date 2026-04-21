"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

interface CopyEmailButtonProps {
  email: string;
}

export function CopyEmailButton({
  email,
}: CopyEmailButtonProps): React.ReactElement {
  const [status, setStatus] = useState<string | null>(null);

  async function handleCopyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied.");
    } catch (error) {
      console.error("Failed to copy email:", error);
      setStatus("Copy failed. Use the email link instead.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button href={`mailto:${email}`}>Email Abdullah</Button>
      <Button onClick={handleCopyEmail} variant="ghost">
        Copy email
      </Button>
      {status && <p className="text-sm text-gray-400">{status}</p>}
    </div>
  );
}
